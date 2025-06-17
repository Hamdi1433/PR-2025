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

  // Vérifier que toutes les propriétés nécessaires existent
  const contactsStats = stats.contacts || { total: 0, newThisMonth: 0, prospects: 0, leads: 0, clients: 0 }
  const contratsStats = stats.contrats || { total: 0, actifs: 0, revenue_annuel: 0 }
  const propositionsStats = stats.propositions || { total: 0, pending: 0, en_attente: 0 }
  const tachesStats = stats.taches || { pending: 0, en_attente: 0, overdue: 0, en_retard: 0 }

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
          value={contactsStats.total.toLocaleString()}
          description={`+${contactsStats.newThisMonth} ce mois`}
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
          value={propositionsStats.total}
          description={`${propositionsStats.en_attente || propositionsStats.pending} en attente`}
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
          value={contratsStats.actifs}
          description={`${contratsStats.total} au total`}
          icon={Target}
          className="border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50"
        />
        <StatsCard
          title="Chiffre d'Affaires"
          value={`€${((contratsStats.revenue_annuel || 0) / 1000).toFixed(0)}K`}
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
        <StatsCard title="Prospects" value={contactsStats.prospects} icon={Users} className="border-blue-200" />
        <StatsCard title="Leads" value={contactsStats.leads} icon={Target} className="border-purple-200" />
        <StatsCard title="Clients" value={contactsStats.clients} icon={CheckSquare} className="border-green-200" />
        <StatsCard
          title="Tâches en cours"
          value={tachesStats.en_attente || tachesStats.pending}
          description={`${tachesStats.en_retard || tachesStats.overdue} en retard`}
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
