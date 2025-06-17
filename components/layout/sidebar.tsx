"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Users,
  Target,
  FileText,
  CheckSquare,
  BarChart3,
  Settings,
  Crown,
  UserCheck,
  Mail,
  Zap,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface SidebarProps {
  userRole: "admin" | "conseiller" | "gestionnaire"
}

export function Sidebar({ userRole }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const adminMenuItems = [
    { href: "/admin", label: "Dashboard", icon: Crown },
    { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
    { href: "/admin/contacts", label: "Contacts", icon: UserCheck },
    { href: "/admin/campagnes", label: "Campagnes", icon: Mail },
    { href: "/admin/automation", label: "Automation", icon: Zap },
    { href: "/admin/objectifs", label: "Objectifs", icon: Target },
    { href: "/admin/rapports", label: "Rapports", icon: BarChart3 },
    { href: "/admin/parametres", label: "Paramètres", icon: Settings },
  ]

  const conseillerMenuItems = [
    { href: "/conseiller", label: "Mon Dashboard", icon: BarChart3 },
    { href: "/conseiller/contacts", label: "Mes Contacts", icon: Users },
    { href: "/conseiller/propositions", label: "Propositions", icon: FileText },
    { href: "/conseiller/taches", label: "Mes Tâches", icon: CheckSquare },
    { href: "/conseiller/calendrier", label: "Calendrier", icon: Calendar },
  ]

  const gestionnaireMenuItems = [
    { href: "/gestionnaire", label: "Dashboard", icon: BarChart3 },
    { href: "/gestionnaire/equipe", label: "Mon Équipe", icon: Users },
    { href: "/gestionnaire/objectifs", label: "Objectifs", icon: Target },
    { href: "/gestionnaire/rapports", label: "Rapports", icon: BarChart3 },
  ]

  const getMenuItems = () => {
    switch (userRole) {
      case "admin":
        return adminMenuItems
      case "conseiller":
        return conseillerMenuItems
      case "gestionnaire":
        return gestionnaireMenuItems
      default:
        return []
    }
  }

  const menuItems = getMenuItems()

  return (
    <div className={cn("bg-white border-r border-gray-200 transition-all duration-300", collapsed ? "w-16" : "w-64")}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-violet-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-gray-900">Premunia CRM</span>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="p-1">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-gradient-to-r from-rose-500 to-violet-600 text-white"
                      : "text-gray-700 hover:bg-gray-100",
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </div>
              </Link>
            )
          })}
        </div>

        {!collapsed && (
          <div className="mt-8 p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Crown className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                {userRole === "admin" ? "Administrateur" : userRole === "conseiller" ? "Conseiller" : "Gestionnaire"}
              </span>
            </div>
            <p className="text-xs text-blue-700">Accès complet aux fonctionnalités</p>
          </div>
        )}
      </nav>
    </div>
  )
}
