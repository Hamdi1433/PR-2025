"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { useContacts } from "@/hooks/use-database"
import { Search, Plus, Mail, Phone, Building } from "lucide-react"
import type { Contact } from "@/lib/types"

interface ContactListProps {
  assignedTo?: string
  showActions?: boolean
}

export function ContactList({ assignedTo, showActions = true }: ContactListProps) {
  const { contacts, loading, error, refresh } = useContacts(assignedTo)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.entreprise && contact.entreprise.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getStatusColor = (statut: Contact["statut"]) => {
    switch (statut) {
      case "prospect":
        return "bg-blue-100 text-blue-800"
      case "lead":
        return "bg-yellow-100 text-yellow-800"
      case "client":
        return "bg-green-100 text-green-800"
      case "inactif":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
        <span className="ml-2">Chargement des contacts...</span>
      </div>
    )
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refresh} />
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span>Contacts</span>
            <Badge variant="secondary">{filteredContacts.length}</Badge>
          </CardTitle>
          {showActions && (
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Nouveau Contact
            </Button>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredContacts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "Aucun contact trouvé" : "Aucun contact disponible"}
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {contact.prenom[0]}
                    {contact.nom[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {contact.prenom} {contact.nom}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="h-3 w-3" />
                      <span>{contact.email}</span>
                      {contact.telephone && (
                        <>
                          <Phone className="h-3 w-3 ml-2" />
                          <span>{contact.telephone}</span>
                        </>
                      )}
                    </div>
                    {contact.entreprise && (
                      <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                        <Building className="h-3 w-3" />
                        <span>{contact.entreprise}</span>
                        {contact.poste && <span>• {contact.poste}</span>}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getScoreColor(contact.score)}`}>{contact.score}</div>
                    <div className="text-xs text-gray-500">Score</div>
                  </div>
                  <Badge className={getStatusColor(contact.statut)}>{contact.statut}</Badge>
                  {showActions && (
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
