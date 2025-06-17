"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Target, CheckSquare, BarChart3, Settings, TestTube } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Opportunités", href: "/opportunites", icon: Target },
  { name: "Tâches", href: "/taches", icon: CheckSquare },
  { name: "Rapports", href: "/rapports", icon: BarChart3 },
  { name: "Tests", href: "/tests", icon: TestTube },
  { name: "Paramètres", href: "/parametres", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="bg-gradient-to-b from-violet-900 via-rose-800 to-premunia-700 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <div className="text-white flex items-center space-x-2 px-4">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <Target className="h-5 w-5 text-violet-600" />
        </div>
        <span className="text-xl font-extrabold">Premunia CRM</span>
      </div>

      <nav className="space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-2 py-3 px-4 rounded-lg transition duration-200 mx-2",
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

      <div className="px-4 pt-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-2">Version Pro</h3>
          <p className="text-xs text-white/80 mb-3">Accédez à toutes les fonctionnalités avancées</p>
          <button className="w-full bg-white text-violet-600 text-sm font-medium py-2 px-3 rounded-md hover:bg-white/90 transition-colors">
            Découvrir
          </button>
        </div>
      </div>
    </div>
  )
}
