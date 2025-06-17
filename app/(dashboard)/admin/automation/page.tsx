"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Play, Pause, Settings, Plus, Mail, Users, Target } from "lucide-react"

export default function AdminAutomationPage() {
  const [workflows] = useState([
    {
      id: 1,
      nom: "Relance Prospects Immobilier",
      description: "Séquence automatique de relance pour les prospects immobilier",
      statut: "Actif",
      triggers: 156,
      conversions: 23,
      taux_conversion: 14.7,
      derniere_execution: "Il y a 2h",
    },
    {
      id: 2,
      nom: "Onboarding Nouveaux Clients",
      description: "Processus d'accueil automatique pour les nouveaux clients",
      statut: "Actif",
      triggers: 89,
      conversions: 67,
      taux_conversion: 75.3,
      derniere_execution: "Il y a 1h",
    },
    {
      id: 3,
      nom: "Réactivation Clients Inactifs",
      description: "Campagne de réactivation pour les clients inactifs depuis 6 mois",
      statut: "Pause",
      triggers: 234,
      conversions: 12,
      taux_conversion: 5.1,
      derniere_execution: "Il y a 1 jour",
    },
  ])

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "Actif":
        return "bg-green-100 text-green-800"
      case "Pause":
        return "bg-yellow-100 text-yellow-800"
      case "Arrêté":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketing Automation</h1>
          <p className="text-gray-600">Gérez vos workflows et automatisations</p>
        </div>
        <Button className="bg-yellow-600 hover:bg-yellow-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Workflow
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-violet-700">Workflows Actifs</CardTitle>
            <Zap className="h-4 w-4 text-violet-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-violet-800">8</div>
            <p className="text-xs text-violet-600">En cours d'exécution</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Emails Envoyés</CardTitle>
            <Mail className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">2,456</div>
            <p className="text-xs text-blue-600">Ce mois</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Leads Qualifiés</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">234</div>
            <p className="text-xs text-green-600">+28% vs mois dernier</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Taux Engagement</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">68.5%</div>
            <p className="text-xs text-orange-600">Moyenne globale</p>
          </CardContent>
        </Card>
      </div>

      {/* Liste des workflows */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-violet-600" />
            <span>Workflows Automation</span>
          </CardTitle>
          <p className="text-sm text-gray-600">Gérez vos séquences automatiques</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{workflow.nom}</h3>
                  <p className="text-gray-600">{workflow.description}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={getStatutColor(workflow.statut)}>{workflow.statut}</Badge>
                  <div className="flex space-x-2">
                    {workflow.statut === "Actif" ? (
                      <Button variant="outline" size="sm">
                        <Pause className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{workflow.triggers}</div>
                  <p className="text-sm text-gray-600">Déclenchements</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{workflow.conversions}</div>
                  <p className="text-sm text-gray-600">Conversions</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{workflow.taux_conversion}%</div>
                  <p className="text-sm text-gray-600">Taux Conversion</p>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Dernière exécution</div>
                  <p className="text-sm font-medium">{workflow.derniere_execution}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Voir Détails
                  </Button>
                  <Button variant="outline" size="sm">
                    Dupliquer
                  </Button>
                </div>
                <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                  Configurer
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
