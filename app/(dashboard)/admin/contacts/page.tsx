"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, UserPlus, Search, Mail, Phone, Target, TrendingUp } from "lucide-react"

export default function AdminContactsPage() {
  const [contacts] = useState([
    {
      id: 1,
      nom: "Marie Dubois",
      email: "marie.dubois@email.com",
      telephone: "01 23 45 67 89",
      score: 85,
      statut: "Prospect Chaud",
      conseiller: "Jean Conseiller",
      dernier_contact: "2024-01-20",
      source: "Site Web",
      ca_potentiel: 15000,
    },
    {
      id: 2,
      nom: "Jean Martin",
      email: "jean.martin@email.com",
      telephone: "01 98 76 54 32",
      score: 92,
      statut: "Client",
      conseiller: "Pierre Commercial",
      dernier_contact: "2024-01-18",
      source: "Référence",
      ca_potentiel: 25000,
    },
    {
      id: 3,
      nom: "Sophie Laurent",
      email: "sophie.laurent@email.com",
      telephone: "01 45 67 89 12",
      score: 67,
      statut: "Prospect Froid",
      conseiller: "Jean Conseiller",
      dernier_contact: "2024-01-15",
      source: "Campagne Email",
      ca_potentiel: 8000,
    },
  ])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "Client":
        return "bg-green-100 text-green-800"
      case "Prospect Chaud":
        return "bg-orange-100 text-orange-800"
      case "Prospect Froid":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Contacts</h1>
          <p className="text-gray-600">Vue d'ensemble de tous les contacts CRM</p>
        </div>
        <Button className="bg-yellow-600 hover:bg-yellow-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Nouveau Contact
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">2,847</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% ce mois
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Prospects Chauds</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">234</div>
            <p className="text-xs text-orange-600">Score > 80</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Clients Actifs</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">1,456</div>
            <p className="text-xs text-blue-600">Avec contrats</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">CA Potentiel</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">€2.4M</div>
            <p className="text-xs text-purple-600">Pipeline total</p>
          </CardContent>
        </Card>
      </div>

      {/* Recherche et filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Rechercher un contact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Rechercher par nom, email ou téléphone..." className="pl-8" />
              </div>
            </div>
            <Button variant="outline">Filtrer</Button>
            <Button variant="outline">Exporter</Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des contacts */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Contacts</CardTitle>
          <p className="text-sm text-gray-600">Tous les contacts du CRM</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {contact.nom
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{contact.nom}</h3>
                    <p className="text-gray-600">{contact.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`text-2xl font-bold ${getScoreColor(contact.score)}`}>{contact.score}</span>
                  <Badge className={getStatutColor(contact.statut)}>{contact.statut}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{contact.telephone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{contact.conseiller}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{contact.source}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">€{contact.ca_potentiel.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">Dernier contact: {contact.dernier_contact}</p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-1" />
                    Contacter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-1" />
                    Appeler
                  </Button>
                  <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                    Voir Détails
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
