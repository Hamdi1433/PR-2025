"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Target,
  CheckSquare,
  BarChart3,
  Settings,
  Crown,
  Headphones,
  FileText,
  Zap,
  Mail,
  Shield,
  Phone,
  AlertTriangle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SidebarProps {
  role: "admin" | "conseiller" | "gestionnaire" | "qualite"
  userName: string
  userEmail: string
}

const navigationByRole = {
  admin: [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Utilisateurs", href: "/admin/utilisateurs", icon: Users },
    { name: "Contacts", href: "/admin/contacts", icon: Target },
    { name: "Automation", href: "/admin/automation", icon: Zap },
    { name: "Campagnes", href: "/admin/campagnes", icon: Mail },
    { name: "Objectifs", href: "/admin/objectifs", icon: CheckSquare },
    { name: "Rapports", href: "/admin/rapports", icon: BarChart3 },
    { name: "Paramètres", href: "/admin/parametres", icon: Settings },
  ],
  conseiller: [
    { name: "Dashboard", href: "/conseiller", icon: LayoutDashboard },
    { name: "Mes Contacts", href: "/conseiller/contacts", icon: Users },
    { name: "Mes Propositions", href: "/conseiller/propositions", icon: FileText },
    { name: "Mes Contrats", href: "/conseiller/contrats", icon: Target },
    { name: "Mes Tâches", href: "/conseiller/taches", icon: CheckSquare },
    { name: "Mon Activité", href: "/conseiller/activite", icon: BarChart3 },
  ],
  gestionnaire: [
    { name: "Dashboard", href: "/gestionnaire", icon: LayoutDashboard },
    { name: "Demandes Clients", href: "/gestionnaire/demandes", icon: Headphones },
    { name: "Support Client", href: "/gestionnaire/support", icon: Phone },
    { name: "Contrats SAV", href: "/gestionnaire/contrats", icon: FileText },
    { name: "Réclamations", href: "/gestionnaire/reclamations", icon: AlertTriangle },
    { name: "Contacts Clients", href: "/gestionnaire/contacts", icon: Users },
    { name: "Appels", href: "/gestionnaire/appels", icon: Phone },
  ],
  qualite: [
    { name: "Dashboard", href: "/qualite", icon: LayoutDashboard },
    { name: "Tickets Qualité", href: "/qualite/tickets", icon: Shield },
    { name: "Audits", href: "/qualite/audits", icon: CheckSquare },
    { name: "Rapports Qualité", href: "/qualite/rapports", icon: BarChart3 },
    { name: "Conformité", href: "/qualite/conformite", icon: Settings },
  ],
}

const roleConfig = {
  admin: {
    title: "Admin Panel",
    subtitle: "Premunia CRM",
    icon: <Crown className="h-6 w-6" />,
    gradient: "from-yellow-500 via-orange-500 to-red-500",
    bgGradient: "from-yellow-900 via-orange-800 to-red-700",
  },
  conseiller: {
    title: "Espace Conseiller",
    subtitle: "Premunia CRM",
    icon: <Users className="h-6 w-6" />,
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    bgGradient: "from-green-900 via-emerald-800 to-teal-700",
  },
  gestionnaire: {
    title: "Espace Gestionnaire",
    subtitle: "Service Client",
    icon: <Headphones className="h-6 w-6" />,
    gradient: "from-purple-500 via-violet-500 to-indigo-500",
    bgGradient: "from-purple-900 via-violet-800 to-indigo-700",
  },
  qualite: {
    title: "Espace Qualité",
    subtitle: "Contrôle Qualité",
    icon: <Shield className="h-6 w-6" />,
    gradient: "from-blue-500 via-cyan-500 to-sky-500",
    bgGradient: "from-blue-900 via-cyan-800 to-sky-700",
  },
}

export function RoleSidebar({ role, userName, userEmail }: SidebarProps) {
  const pathname = usePathname()
  const navigation = navigationByRole[role]
  const config = roleConfig[role]

  return (
    <div
      className={`bg-gradient-to-b ${config.bgGradient} text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out`}
    >
      {/* Header */}
      <div className="text-white flex items-center space-x-3 px-4">
        <div className={`w-10 h-10 bg-gradient-to-r ${config.gradient} rounded-full flex items-center justify-center`}>
          {config.icon}
        </div>
        <div>
          <h1 className="text-lg font-bold">{config.title}</h1>
          <p className="text-sm text-white/80">{config.subtitle}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 py-3 px-4 rounded-lg transition duration-200 mx-2",
                isActive
                  ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                  : "text-white/80 hover:bg-white/10 hover:text-white",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Info */}
      <div className="px-4 pt-6 border-t border-white/20">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold">{userName.charAt(0)}</span>
            </div>
            <div>
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-white/70">{userEmail}</p>
            </div>
          </div>
          {role === "conseiller" && (
            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/70">Performance</span>
                <Badge className="bg-green-500 text-white text-xs">84% d'objectifs atteints</Badge>
              </div>
            </div>
          )}
          {role === "gestionnaire" && (
            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/70">Mode</span>
                <Badge className="bg-purple-500 text-white text-xs">Gestionnaire SAV</Badge>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
