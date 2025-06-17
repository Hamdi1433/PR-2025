"use client"

import { StatsCard } from "@/components/dashboard/stats-card"
import { ContactList } from "@/components/contacts/contact-list"
import { useDashboardStats } from "@/hooks/use-database"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { Users, Target, FileText, CheckSquare, Calendar, TrendingUp } from "lucide-react"

export default function ConseillerDashboard() {
  const { stats, loading, error, refresh } = useDashboardStats("conseiller-1")

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
        <span className="ml-2">Chargement de votre tableau de bord...</span>
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mon Tableau de Bord</h1>
        <p className="text-gray-600">Suivez vos performances et objectifs</p>
      </div>

      {/* Statistiques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Mes Contacts"
          value={stats.contacts.total}
          description={`+${stats.contacts.newThisMonth} ce mois`}
          icon={Users}
          trend={{
            value: 8,
            label: "vs mois dernier",
            positive: true,
          }}
          className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50"
        />
        <StatsCard
          title="Prospects Chauds"
          value={stats.contacts.leads}
          description="Score > 80"
          icon={Target}
          className="border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50"
        />
        <StatsCard
          title="Propositions"
          value={stats.proposals.pending}
          description={`${stats.proposals.accepted} acceptées`}
          icon={FileText}
          className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50"
        />
        <StatsCard
          title="CA Réalisé"
          value={`€${(stats.proposals.revenue / 1000).toFixed(0)}K`}
          description="Ce mois"
          icon={TrendingUp}
          trend={{
            value: 12,
            label: "vs objectif",
            positive: true,
          }}
          className="border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50"
        />
      </div>

      {/* Objectifs et performance */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Objectif Mensuel"
          value="84%"
          description="€42K / €50K"
          icon={Target}
          className="border-green-200"
        />
        <StatsCard
          title="Tâches du Jour"
          value={stats.tasks.pending}
          description={`${stats.tasks.overdue} en retard`}
          icon={CheckSquare}
          className="border-yellow-200"
        />
        <StatsCard
          title="RDV Programmés"
          value="7"
          description="Cette semaine"
          icon={Calendar}
          className="border-blue-200"
        />
      </div>

      {/* Mes contacts récents */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Mes Contacts Récents</h2>
        <ContactList assignedTo="conseiller-1" />
      </div>
    </div>
  )
}
