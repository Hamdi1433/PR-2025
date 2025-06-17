"use client"

import { useState } from "react"
import { Bell, Search, User, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"

export function Header() {
  const [notifications] = useState([
    { id: 1, message: "Nouveau contact ajouté", time: "Il y a 5min", unread: true },
    { id: 2, message: "Proposition acceptée", time: "Il y a 1h", unread: true },
    { id: 3, message: "Rappel: Appel client", time: "Il y a 2h", unread: false },
  ])

  const pathname = usePathname()
  const router = useRouter()

  // Déterminer le contexte utilisateur basé sur l'URL
  const getUserContext = () => {
    if (pathname.startsWith("/admin")) {
      return {
        name: "Directeur Admin",
        email: "admin@premunia.com",
        role: "Administrateur",
        avatar: "DA",
      }
    } else if (pathname.startsWith("/gestionnaire")) {
      return {
        name: "Sophie Gestionnaire",
        email: "sophie@premunia.fr",
        role: "Gestionnaire",
        avatar: "SG",
      }
    } else if (pathname.startsWith("/qualite")) {
      return {
        name: "Pierre Qualité",
        email: "qualite@premunia.fr",
        role: "Responsable Qualité",
        avatar: "PQ",
      }
    } else {
      return {
        name: "Jean Conseiller",
        email: "jean@premunia.fr",
        role: "Conseiller",
        avatar: "JC",
      }
    }
  }

  const user = getUserContext()
  const unreadCount = notifications.filter((n) => n.unread).length

  const handleLogout = () => {
    router.push("/login")
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/premunia-0oCY9HxkuuD5ZrRhgSOHGNlJdVdsbk.png"
              alt="Premunia"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-xl font-bold bg-premunia-gradient bg-clip-text text-transparent">CRM Pro</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Barre de recherche */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder={pathname.startsWith("/conseiller") ? "Rechercher mes contacts..." : "Rechercher..."}
              className="pl-10 w-64 border-premunia-200 focus:border-premunia-400 focus:ring-premunia-400"
            />
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hover:bg-premunia-50">
                <Bell className="h-5 w-5 text-premunia-600" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-3 border-b">
                <h3 className="font-semibold">Notifications</h3>
                <p className="text-sm text-gray-600">{unreadCount} nouvelles notifications</p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="p-3 border-b last:border-b-0">
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? "bg-blue-500" : "bg-gray-300"}`}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{notification.message}</p>
                        <p className="text-xs text-gray-500">{notification.time}</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <div className="p-3 border-t">
                <Button variant="ghost" className="w-full text-sm">
                  Voir toutes les notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Menu utilisateur */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 hover:bg-premunia-50">
                <div className="w-8 h-8 bg-premunia-gradient rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user.avatar}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-3 border-b">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <Badge variant="outline" className="mt-1 text-xs">
                  {user.role}
                </Badge>
              </div>
              <DropdownMenuItem>
                <User className="h-4 w-4 mr-2" />
                Mon Profil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
