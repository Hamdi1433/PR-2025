"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Déterminer le rôle basé sur l'URL
  const getUserRole = () => {
    if (pathname.startsWith("/admin")) return "admin"
    if (pathname.startsWith("/gestionnaire")) return "gestionnaire"
    return "conseiller"
  }

  const getUserName = () => {
    const role = getUserRole()
    switch (role) {
      case "admin":
        return "Admin Premunia"
      case "gestionnaire":
        return "Manager Équipe"
      default:
        return "Jean Conseiller"
    }
  }

  const userRole = getUserRole()
  const userName = getUserName()

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole={userRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userName={userName} userRole={userRole} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
