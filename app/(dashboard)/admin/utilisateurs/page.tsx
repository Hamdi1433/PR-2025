"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, UserPlus, Search, Mail, Phone, Settings, Shield, Crown } from "lucide-react"

export default function AdminUtilisateursPage() {
  const [utilisateurs] = useState([
    {
      id: 1,
      nom: "Jean Conseiller",
      email: "jean@premunia.fr",
      role: "conseiller",
      statut: "Actif",
      derniereConnexion: "Il y a 2h",
      performance: 84,
      contacts: 156,
      ca: 18500,
    },
    {
      id: 2,
      nom: "Pierre Commercial",
      email: "pierre@premunia.fr",
      role: "conseiller",
      statut: "Actif",
      derniereConnexion: "Il y a 30min",
      performance: 92,
      contacts: 203,
      ca: 27500,
    },
    {
      id: 3,
      nom: "Sophie Gestionnaire",
      email: "sophie@premunia.fr",
      role: "gestionnaire",
      statut: "Actif",
      derniereConnexion: "Il y a 1h",
      performance: 88,
      tickets: 45,
      satisfaction: 4.8,
    },
    {
      id: 4,
      nom: "Marie Qualité",
      email: "marie@premunia.fr",
      role: "qualite",
      statut: "Actif",
      derniereConnexion: "Il y a 3h",
      performance: 95,
      audits: 12,
      conformite: 98,
    },
  ])

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-4 w-4" />
      case "conseiller":
        return <Users className="h-4 w-4" />
      case "gestionnaire":
        return <Phone className="h-4 w-4" />
      case "qualite":
        return <Shield className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-yellow-100 text-yellow-800"
      case "conseiller":
        return "bg-green-100 text-green-800"
      case "gestionnaire":
        return "bg-purple-100 text-purple-800"
      case "qualite":
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
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="text-gray-600">Gérez les comptes et permissions des utilisateurs</p>
        </div>
        <Button className="bg-yellow-600 hover:bg-yellow-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Nouvel Utilisateur
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Conseillers</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">2</div>
            <p className="text-xs text-green-600">Actifs</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Gestionnaires</CardTitle>
            <Phone className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">1</div>
            <p className="text-xs text-purple-600">Actifs</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Qualité</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">1</div>
            <p className="text-xs text-blue-600">Actifs</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">Total</CardTitle>
            <Crown className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-800">4</div>
            <p className="text-xs text-yellow-600">Utilisateurs</p>
          </CardContent>
        </Card>
      </div>

      {/* Recherche et filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Rechercher un utilisateur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Rechercher par nom ou email..." className="pl-8" />
              </div>
            </div>
            <Button variant="outline">Filtrer</Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Utilisateurs</CardTitle>
          <p className="text-sm text-gray-600">Gérez les comptes et permissions</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {utilisateurs.map((user) => (
            <div key={user.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.nom
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{user.nom}</h3>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={getRoleColor(user.role)}>
                    {getRoleIcon(user.role)}
                    <span className="ml-1 capitalize">{user.role}</span>
                  </Badge>
                  <Badge className="bg-green-100 text-green-800">{user.statut}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{user.performance}%</div>
                  <p className="text-sm text-gray-600">Performance</p>
                </div>
                {user.role === "conseiller" && (
                  <>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{user.contacts}</div>
                      <p className="text-sm text-gray-600">Contacts</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">€{user.ca?.toLocaleString()}</div>
                      <p className="text-sm text-gray-600">CA</p>
                    </div>
                  </>
                )}
                {user.role === "gestionnaire" && (
                  <>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{user.tickets}</div>
                      <p className="text-sm text-gray-600">Tickets</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{user.satisfaction}/5</div>
                      <p className="text-sm text-gray-600">Satisfaction</p>
                    </div>
                  </>
                )}
                {user.role === "qualite" && (
                  <>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{user.audits}</div>
                      <p className="text-sm text-gray-600">Audits</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{user.conformite}%</div>
                      <p className="text-sm text-gray-600">Conformité</p>
                    </div>
                  </>
                )}
                <div className="text-center">
                  <div className="text-sm text-gray-600">Dernière connexion</div>
                  <p className="text-sm font-medium">{user.derniereConnexion}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-1" />
                    Contacter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-1" />
                    Configurer
                  </Button>
                </div>
                <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                  Gérer
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
