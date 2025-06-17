"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { BarChart3, TrendingUp, Users, Target, CheckSquare } from "lucide-react"

export default function RapportsPage() {
  const [stats, setStats] = useState({
    totalClients: 0,
    clientsParStatut: { prospect: 0, lead: 0, client: 0 },
    totalOpportunites: 0,
    opportunitesParEtape: { qualification: 0, proposition: 0, negociation: 0, fermeture: 0 },
    chiffreAffaires: 0,
    tauxConversion: 0,
    tachesParStatut: { a_faire: 0, en_cours: 0, termine: 0 },
  })

  useEffect(() => {
    loadRapports()
  }, [])

  const loadRapports = async () => {
    try {
      // Charger les données
      const [clientsRes, opportunitesRes, tachesRes] = await Promise.all([
        supabase.from("clients").select("*"),
        supabase.from("opportunites").select("*"),
        supabase.from("taches").select("*"),
      ])

      const clients = clientsRes.data || []
      const opportunites = opportunitesRes.data || []
      const taches = tachesRes.data || []

      // Calculer les statistiques clients
      const clientsParStatut = clients.reduce(
        (acc, client) => {
          acc[client.statut as keyof typeof acc] = (acc[client.statut as keyof typeof acc] || 0) + 1
          return acc
        },
        { prospect: 0, lead: 0, client: 0 },
      )

      // Calculer les statistiques opportunités
      const opportunitesParEtape = opportunites.reduce(
        (acc, opp) => {
          acc[opp.etape as keyof typeof acc] = (acc[opp.etape as keyof typeof acc] || 0) + 1
          return acc
        },
        { qualification: 0, proposition: 0, negociation: 0, fermeture: 0 },
      )

      const chiffreAffaires = opportunites.reduce((sum, opp) => sum + (opp.valeur || 0), 0)
      const opportunitesGagnees = opportunites.filter((opp) => opp.statut === "gagne").length
      const tauxConversion = opportunites.length > 0 ? (opportunitesGagnees / opportunites.length) * 100 : 0

      // Calculer les statistiques tâches
      const tachesParStatut = taches.reduce(
        (acc, tache) => {
          acc[tache.statut as keyof typeof acc] = (acc[tache.statut as keyof typeof acc] || 0) + 1
          return acc
        },
        { a_faire: 0, en_cours: 0, termine: 0 },
      )

      setStats({
        totalClients: clients.length,
        clientsParStatut,
        totalOpportunites: opportunites.length,
        opportunitesParEtape,
        chiffreAffaires,
        tauxConversion,
        tachesParStatut,
      })
    } catch (error) {
      console.error("Erreur lors du chargement des rapports:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Rapports</h2>
        <p className="text-muted-foreground">Analysez vos performances commerciales</p>
      </div>

      {/* Vue d'ensemble */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opportunités</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOpportunites}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CA Potentiel</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
              }).format(stats.chiffreAffaires)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Conversion</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tauxConversion.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Détails par catégorie */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Répartition des clients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Clients par Statut
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Prospects</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${stats.totalClients > 0 ? (stats.clientsParStatut.prospect / stats.totalClients) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{stats.clientsParStatut.prospect}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Leads</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{
                        width: `${stats.totalClients > 0 ? (stats.clientsParStatut.lead / stats.totalClients) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{stats.clientsParStatut.lead}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Clients</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${stats.totalClients > 0 ? (stats.clientsParStatut.client / stats.totalClients) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{stats.clientsParStatut.client}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Répartition des opportunités */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Opportunités par Étape
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Qualification</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${stats.totalOpportunites > 0 ? (stats.opportunitesParEtape.qualification / stats.totalOpportunites) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{stats.opportunitesParEtape.qualification}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Proposition</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{
                        width: `${stats.totalOpportunites > 0 ? (stats.opportunitesParEtape.proposition / stats.totalOpportunites) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{stats.opportunitesParEtape.proposition}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Négociation</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{
                        width: `${stats.totalOpportunites > 0 ? (stats.opportunitesParEtape.negociation / stats.totalOpportunites) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{stats.opportunitesParEtape.negociation}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Fermeture</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${stats.totalOpportunites > 0 ? (stats.opportunitesParEtape.fermeture / stats.totalOpportunites) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{stats.opportunitesParEtape.fermeture}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Répartition des tâches */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Tâches par Statut
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">À faire</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gray-500 h-2 rounded-full"
                      style={{
                        width: `${(stats.tachesParStatut.a_faire + stats.tachesParStatut.en_cours + stats.tachesParStatut.termine) > 0 ? (stats.tachesParStatut.a_faire / (stats.tachesParStatut.a_faire + stats.tachesParStatut.en_cours + stats.tachesParStatut.termine)) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{stats.tachesParStatut.a_faire}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">En cours</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(stats.tachesParStatut.a_faire + stats.tachesParStatut.en_cours + stats.tachesParStatut.termine) > 0 ? (stats.tachesParStatut.en_cours / (stats.tachesParStatut.a_faire + stats.tachesParStatut.en_cours + stats.tachesParStatut.termine)) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{stats.tachesParStatut.en_cours}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Terminé</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${(stats.tachesParStatut.a_faire + stats.tachesParStatut.en_cours + stats.tachesParStatut.termine) > 0 ? (stats.tachesParStatut.termine / (stats.tachesParStatut.a_faire + stats.tachesParStatut.en_cours + stats.tachesParStatut.termine)) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{stats.tachesParStatut.termine}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
