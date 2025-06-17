"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { supabase, type Opportunite } from "@/lib/supabase"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { OpportuniteForm } from "@/components/opportunite-form"

export default function OpportunitesPage() {
  const [opportunites, setOpportunites] = useState<Opportunite[]>([])
  const [filteredOpportunites, setFilteredOpportunites] = useState<Opportunite[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingOpportunite, setEditingOpportunite] = useState<Opportunite | null>(null)

  useEffect(() => {
    loadOpportunites()
  }, [])

  useEffect(() => {
    const filtered = opportunites.filter(
      (opp) =>
        opp.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (opp.clients?.nom && opp.clients.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (opp.clients?.prenom && opp.clients.prenom.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredOpportunites(filtered)
  }, [opportunites, searchTerm])

  const loadOpportunites = async () => {
    try {
      const { data, error } = await supabase
        .from("opportunites")
        .select(`
          *,
          clients (
            id,
            nom,
            prenom,
            entreprise
          )
        `)
        .order("date_creation", { ascending: false })

      if (error) throw error
      setOpportunites(data || [])
    } catch (error) {
      console.error("Erreur lors du chargement des opportunités:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette opportunité ?")) {
      try {
        const { error } = await supabase.from("opportunites").delete().eq("id", id)

        if (error) throw error
        loadOpportunites()
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
      }
    }
  }

  const getEtapeColor = (etape: string) => {
    switch (etape) {
      case "qualification":
        return "bg-blue-100 text-blue-800"
      case "proposition":
        return "bg-yellow-100 text-yellow-800"
      case "negociation":
        return "bg-orange-100 text-orange-800"
      case "fermeture":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Opportunités</h2>
          <p className="text-muted-foreground">Gérez vos opportunités commerciales</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Opportunité
        </Button>
      </div>

      {/* Barre de recherche */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Rechercher une opportunité..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Liste des opportunités */}
      <div className="grid gap-4">
        {filteredOpportunites.map((opportunite) => (
          <Card key={opportunite.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{opportunite.titre}</h3>
                    <div className="text-lg font-bold text-green-600">
                      {opportunite.valeur
                        ? new Intl.NumberFormat("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                          }).format(opportunite.valeur)
                        : "N/A"}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mb-3">
                    <p className="text-sm text-muted-foreground">
                      Client: {opportunite.clients?.prenom} {opportunite.clients?.nom}
                      {opportunite.clients?.entreprise && ` - ${opportunite.clients.entreprise}`}
                    </p>
                    <Badge className={getEtapeColor(opportunite.etape)}>{opportunite.etape}</Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Probabilité</span>
                      <span>{opportunite.probabilite}%</span>
                    </div>
                    <Progress value={opportunite.probabilite} className="h-2" />
                  </div>

                  {opportunite.date_fermeture_prevue && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Fermeture prévue: {new Date(opportunite.date_fermeture_prevue).toLocaleDateString("fr-FR")}
                    </p>
                  )}
                </div>

                <div className="flex space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingOpportunite(opportunite)
                      setShowForm(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(opportunite.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Formulaire opportunité */}
      {showForm && (
        <OpportuniteForm
          opportunite={editingOpportunite}
          onClose={() => {
            setShowForm(false)
            setEditingOpportunite(null)
          }}
          onSave={() => {
            loadOpportunites()
            setShowForm(false)
            setEditingOpportunite(null)
          }}
        />
      )}
    </div>
  )
}
