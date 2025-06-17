"use client"

import { StatsCard } from "@/components/dashboard/stats-card"
import { ContactList } from "@/components/contacts/contact-list"
import { useDashboardStats } from "@/hooks/use-database"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { Users, Target, FileText, CheckSquare, TrendingUp, Crown } from "lucide-react"

export default function AdminDashboard() {
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
        <Crown className="h-8 w-8 text-yellow-500" />
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-violet-600 bg-clip-text text-transparent">
            Dashboard Administrateur
          </h1>
          <p className="text-gray-600">Vue d'ensemble de votre CRM Premunia</p>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Contacts"
          value={stats.contacts.total.toLocaleString()}
          description={`+${stats.contacts.newThisMonth} ce mois`}
          icon={Users}
          trend={{
            value: 12,
            label: "vs mois dernier",
            positive: true,
          }}
          className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50"
        />
        <StatsCard
          title="Propositions"
          value={stats.proposals.total}
          description={`${stats.proposals.pending} en attente`}
          icon={FileText}
          trend={{
            value: 8,
            label: "vs mois dernier",
            positive: true,
          }}
          className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50"
        />
        <StatsCard
          title="Contrats Actifs"
          value={stats.contracts.active}
          description={`${stats.contracts.total} au total`}
          icon={Target}
          className="border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50"
        />
        <StatsCard
          title="Chiffre d'Affaires"
          value={`€${(stats.contracts.revenue / 1000).toFixed(0)}K`}
          description="Revenus annuels"
          icon={TrendingUp}
          trend={{
            value: 15,
            label: "vs année dernière",
            positive: true,
          }}
          className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50"
        />
      </div>

      {/* Statistiques détaillées */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Prospects" value={stats.contacts.prospects} icon={Users} className="border-blue-200" />
        <StatsCard title="Leads" value={stats.contacts.leads} icon={Target} className="border-purple-200" />
        <StatsCard title="Clients" value={stats.contacts.clients} icon={CheckSquare} className="border-green-200" />
        <StatsCard
          title="Tâches en cours"
          value={stats.tasks.pending}
          description={`${stats.tasks.overdue} en retard`}
          icon={CheckSquare}
          className="border-orange-200"
        />
      </div>

      {/* Liste des contacts récents */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Contacts Récents</h2>
        <ContactList showActions={false} />
      </div>
    </div>
  )
}
