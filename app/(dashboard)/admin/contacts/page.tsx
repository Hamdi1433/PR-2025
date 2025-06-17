"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Upload, Download, Users, Target, CheckSquare, FileSpreadsheet } from "lucide-react"
import { ContactForm } from "@/components/contacts/contact-form"
import { ImportData } from "@/components/import/import-data"
import { databaseService } from "@/lib/database"
import type { Contact } from "@/lib/types"

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadContacts()
  }, [])

  useEffect(() => {
    const filtered = contacts.filter(
      (contact) =>
        contact.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contact.entreprise && contact.entreprise.toLowerCase().includes(searchTerm.toLowerCase())) ||
        contact.ville.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredContacts(filtered)
  }, [contacts, searchTerm])

  const loadContacts = async () => {
    try {
      setIsLoading(true)
      const data = await databaseService.getContacts()
      setContacts(data)
    } catch (error) {
      console.error("Erreur lors du chargement des contacts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce contact ?")) {
      try {
        await databaseService.deleteContact(id)
        loadContacts()
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
      }
    }
  }

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "client":
        return "bg-green-100 text-green-800 border-green-200"
      case "prospect":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "lead":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "inactif":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const exportContacts = () => {
    const csvContent = [
      [
        "Nom",
        "Prénom",
        "Email",
        "Téléphone",
        "Entreprise",
        "Poste",
        "Ville",
        "Pays",
        "Statut",
        "Origine",
        "Attribution",
        "CPL",
        "Date création",
        "Date signature",
      ].join(","),
      ...filteredContacts.map((contact) =>
        [
          contact.nom,
          contact.prenom,
          contact.email,
          contact.telephone || "",
          contact.entreprise || "",
          contact.poste || "",
          contact.ville,
          contact.pays,
          contact.statut,
          contact.origine,
          contact.attribution || "",
          contact.cpl || "",
          contact.date_creation,
          contact.date_signature || "",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `contacts_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Gestion des Contacts
          </h2>
          <p className="text-muted-foreground">Gérez tous vos contacts, prospects et clients</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportContacts} className="border-blue-200 text-blue-600 hover:bg-blue-50">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowImport(true)}
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <Upload className="mr-2 h-4 w-4" />
            Importer
          </Button>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Contact
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Contacts</p>
                <p className="text-2xl font-bold text-blue-700">{contacts.length}</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Prospects</p>
                <p className="text-2xl font-bold text-purple-700">
                  {contacts.filter((c) => c.statut === "prospect").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <Target className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Leads</p>
                <p className="text-2xl font-bold text-blue-700">{contacts.filter((c) => c.statut === "lead").length}</p>
              </div>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Target className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Clients</p>
                <p className="text-2xl font-bold text-green-700">
                  {contacts.filter((c) => c.statut === "client").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckSquare className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de recherche */}
      <Card className="border-blue-200">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Rechercher un contact par nom, email, entreprise ou ville..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Liste des contacts */}
      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-muted-foreground">Chargement des contacts...</span>
            </div>
          </CardContent>
        </Card>
      ) : filteredContacts.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? "Aucun contact trouvé pour cette recherche" : "Aucun contact enregistré"}
              </p>
              {!searchTerm && (
                <div className="mt-4 space-x-2">
                  <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Créer un contact
                  </Button>
                  <Button variant="outline" onClick={() => setShowImport(true)}>
                    <Upload className="mr-2 h-4 w-4" />
                    Importer des contacts
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredContacts.map((contact) => (
            <Card key={contact.id} className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {contact.prenom[0]}
                        {contact.nom[0]}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {contact.prenom} {contact.nom}
                      </h3>
                      <p className="text-sm text-muted-foreground">{contact.email}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        {contact.entreprise && <p className="text-sm text-muted-foreground">{contact.entreprise}</p>}
                        {contact.ville && (
                          <p className="text-sm text-muted-foreground">
                            {contact.ville}, {contact.pays}
                          </p>
                        )}
                        {contact.origine && <p className="text-sm text-blue-600">Origine: {contact.origine}</p>}
                      </div>
                      {contact.attribution && (
                        <p className="text-sm text-purple-600 mt-1">Assigné à: {contact.attribution}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <Badge className={getStatusColor(contact.statut)}>{contact.statut}</Badge>
                      {contact.date_signature && (
                        <p className="text-xs text-green-600 mt-1">Signé le {contact.date_signature}</p>
                      )}
                      {contact.cpl && <p className="text-xs text-orange-600 mt-1">CPL: {contact.cpl}</p>}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingContact(contact)
                          setShowForm(true)
                        }}
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(contact.id)}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Formulaire contact */}
      {showForm && (
        <ContactForm
          contact={editingContact}
          onClose={() => {
            setShowForm(false)
            setEditingContact(null)
          }}
          onSave={() => {
            loadContacts()
            setShowForm(false)
            setEditingContact(null)
          }}
        />
      )}

      {/* Import de données */}
      {showImport && (
        <ImportData
          onClose={() => setShowImport(false)}
          onImportComplete={() => {
            loadContacts()
            setShowImport(false)
          }}
        />
      )}
    </div>
  )
}
