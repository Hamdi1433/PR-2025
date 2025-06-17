"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

export default function AdminRapportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Rapports et Analytics</h1>
        <p className="text-gray-600">Analysez les performances de votre CRM</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Tableau de Bord Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Fonctionnalité en développement...</p>
        </CardContent>
      </Card>
    </div>
  )
}
