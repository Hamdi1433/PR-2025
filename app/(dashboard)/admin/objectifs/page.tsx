"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, Plus } from "lucide-react"

export default function AdminObjectifsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Objectifs</h1>
          <p className="text-gray-600">Définissez et suivez les objectifs des équipes</p>
        </div>
        <Button className="bg-yellow-600 hover:bg-yellow-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouvel Objectif
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Objectifs des Équipes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Fonctionnalité en développement...</p>
        </CardContent>
      </Card>
    </div>
  )
}
