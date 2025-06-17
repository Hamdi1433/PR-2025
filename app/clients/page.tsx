"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { supabase, isDemoMode, type Client } from "@/lib/supabase"
import { Plus, Search, Edit, Trash2, AlertCircle, Upload, Download, Users, Target, CheckSquare } from "lucide-react"
import { ClientForm } from "@/components/client-form"
import { QuickTest } from "@/components/quick-test"
import { ImportClients } from "@/components/import-clients"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadClients()
  }, [])

  useEffect(() => {
    const filtered = clients.filter(
      (client) =>
        client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.entreprise && client.entreprise.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredClients(filtered)
  }, [clients, searchTerm])

  const loadClients = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const { data, error: supabaseError } = await supabase
        .from("clients")
        .select("*")
        .order("date_creation", { ascending: false })

      if (supabaseError) {
        throw new Error(supabaseError.message)
      }

      setClients(data || [])
    } catch (error) {
      console.error("Erreur lors du chargement des clients:", error)
      setError(error instanceof Error ? error.message : "Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (isDemoMode()) {
      alert("Suppression non disponible en mode démonstration")
      return
    }

    if (confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      try {
        const { error } = await supabase.from("clients").delete().eq("id", id)

        if (error) throw error
        loadClients()
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
        setError(error instanceof Error ? error.message : "Erreur lors de la suppression")
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
        return "bg-premunia-100 text-premunia-800 border-premunia-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const exportClients = () => {
    // Fonction d'export simple en CSV
    const csvContent = [
      ["Nom", "Prénom", "Email", "Téléphone", "Entreprise", "Ville", "Statut"].join(","),
      ...filteredClients.map((client) =>
        [
          client.nom,
          client.prenom,
          client.email,
          client.telephone || "",
          client.entreprise || "",
          client.ville || "",
          client.statut,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `clients_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-premunia-gradient bg-clip-text text-transparent">
            Clients {isDemoMode() && "(Mode Démonstration)"}
          </h2>
          <p className="text-muted-foreground">Gérez vos clients et prospects</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={exportClients}
            className="border-premunia-200 text-premunia-600 hover:bg-premunia-50"
          >
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowImport(true)}
            disabled={isDemoMode()}
            className="border-premunia-200 text-premunia-600 hover:bg-premunia-50"
            title={isDemoMode() ? "Import non disponible en mode démonstration" : ""}
          >
            <Upload className="mr-2 h-4 w-4" />
            Importer
          </Button>
          <Button
            onClick={() => setShowForm(true)}
            disabled={isDemoMode()}
            className="bg-premunia-gradient hover:opacity-90 text-white"
            title={isDemoMode() ? "Création non disponible en mode démonstration" : ""}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Client
          </Button>
        </div>
      </div>

      {/* Test rapide */}
      <div className="grid gap-4 md:grid-cols-4">
        <QuickTest table="clients" title="Clients" />
        <div className="md:col-span-3">
          {/* Message d'information pour le mode démo */}
          {isDemoMode() && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-700">
                Vous consultez des données de démonstration. Les modifications ne seront pas sauvegardées.
              </AlertDescription>
            </Alert>
          )}

          {/* Message d'erreur */}
          {error && !isDemoMode() && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Erreur : {error}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-premunia-200 bg-gradient-to-br from-premunia-50 to-rose-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-premunia-600">Total Clients</p>
                <p className="text-2xl font-bold text-premunia-700">{clients.length}</p>
              </div>
              <div className="w-8 h-8 bg-premunia-gradient rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-premunia-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Prospects</p>
                <p className="text-2xl font-bold text-blue-700">
                  {clients.filter((c) => c.statut === "prospect").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Target className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-rose-200 bg-gradient-to-br from-rose-50 to-violet-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-rose-600">Leads</p>
                <p className="text-2xl font-bold text-rose-700">{clients.filter((c) => c.statut === "lead").length}</p>
              </div>
              <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center">
                <Target className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-premunia-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Clients Actifs</p>
                <p className="text-2xl font-bold text-green-700">
                  {clients.filter((c) => c.statut === "client").length}
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
      <Card className="border-premunia-200">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-premunia-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Rechercher un client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-premunia-200 focus:border-premunia-400 focus:ring-premunia-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Liste des clients */}
      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-premunia-600"></div>
              <span className="ml-2 text-muted-foreground">Chargement des clients...</span>
            </div>
          </CardContent>
        </Card>
      ) : filteredClients.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground py-8">
              {searchTerm ? "Aucun client trouvé pour cette recherche" : "Aucun client enregistré"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredClients.map((client) => (
            <Card key={client.id} className="border-premunia-100 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-premunia-gradient rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {client.prenom[0]}
                        {client.nom[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {client.prenom} {client.nom}
                      </h3>
                      <p className="text-sm text-muted-foreground">{client.email}</p>
                      {client.entreprise && <p className="text-sm text-muted-foreground">{client.entreprise}</p>}
                      {client.telephone && <p className="text-sm text-muted-foreground">{client.telephone}</p>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Badge className={getStatusColor(client.statut)}>{client.statut}</Badge>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingClient(client)
                          setShowForm(true)
                        }}
                        disabled={isDemoMode()}
                        className="border-premunia-200 text-premunia-600 hover:bg-premunia-50"
                        title={isDemoMode() ? "Modification non disponible en mode démonstration" : ""}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(client.id)}
                        disabled={isDemoMode()}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        title={isDemoMode() ? "Suppression non disponible en mode démonstration" : ""}
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

      {/* Formulaire client */}
      {showForm && !isDemoMode() && (
        <ClientForm
          client={editingClient}
          onClose={() => {
            setShowForm(false)
            setEditingClient(null)
          }}
          onSave={() => {
            loadClients()
            setShowForm(false)
            setEditingClient(null)
          }}
        />
      )}

      {/* Import de clients */}
      {showImport && (
        <ImportClients
          onClose={() => setShowImport(false)}
          onImportComplete={() => {
            loadClients()
            setShowImport(false)
          }}
        />
      )}
    </div>
  )
}
