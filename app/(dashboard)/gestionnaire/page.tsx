"use client"

import { StatsCard } from "@/components/dashboard/stats-card"
import { ContactList } from "@/components/contacts/contact-list"
import { useDashboardStats } from "@/hooks/use-database"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { Users, Target, FileText, TrendingUp, BarChart3 } from "lucide-react"

export default function GestionnaireDashboard() {
  const { stats, loading, error, refresh } = useDashboardStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
        <span className="ml-2">Chargement du tableau de bord...</span>
      </div>
    )
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refresh} />
  }

  if (!stats) {
    return <ErrorMessage message="Aucune donnée disponible" onRetry={refresh} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <BarChart3 className="h-8 w-8 text-blue-500" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Gestionnaire</h1>
          <p className="text-gray-600">Pilotage et suivi de votre équipe</p>
        </div>
      </div>

      {/* Statistiques de l'équipe */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Équipe Contacts"
          value={stats.contacts.total}
          description="Tous les conseillers"
          icon={Users}
          className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50"
        />
        <StatsCard
          title="Objectifs Équipe"
          value="78%"
          description="Performance globale"
          icon={Target}
          trend={{
            value: 5,
            label: "vs mois dernier",
            positive: true,
          }}
          className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50"
        />
        <StatsCard
          title="Propositions"
          value={stats.proposals.total}
          description={`${stats.proposals.accepted} acceptées`}
          icon={FileText}
          className="border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50"
        />
        <StatsCard
          title="CA Équipe"
          value={`€${(stats.contracts.revenue / 1000).toFixed(0)}K`}
          description="Revenus générés"
          icon={TrendingUp}
          trend={{
            value: 18,
            label: "vs période précédente",
            positive: true,
          }}
          className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50"
        />
      </div>

      {/* Performance par conseiller */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Jean Conseiller"
          value="84%"
          description="Performance individuelle"
          icon={Users}
          className="border-green-200"
        />
        <StatsCard
          title="Marie Commerciale"
          value="92%"
          description="Performance individuelle"
          icon={Users}
          className="border-green-200"
        />
        <StatsCard
          title="Pierre Vendeur"
          value="76%"
          description="Performance individuelle"
          icon={Users}
          className="border-yellow-200"
        />
      </div>

      {/* Contacts de l'équipe */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Contacts de l'Équipe</h2>
        <ContactList />
      </div>
    </div>
  )
}
