"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { supabase, type Tache } from "@/lib/supabase"
import { Plus, Search, Edit, Trash2, CheckCircle } from "lucide-react"
import { TacheForm } from "@/components/tache-form"

export default function TachesPage() {
  const [taches, setTaches] = useState<Tache[]>([])
  const [filteredTaches, setFilteredTaches] = useState<Tache[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingTache, setEditingTache] = useState<Tache | null>(null)

  useEffect(() => {
    loadTaches()
  }, [])

  useEffect(() => {
    const filtered = taches.filter(
      (tache) =>
        tache.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tache.clients?.nom && tache.clients.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tache.clients?.prenom && tache.clients.prenom.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredTaches(filtered)
  }, [taches, searchTerm])

  const loadTaches = async () => {
    try {
      const { data, error } = await supabase
        .from("taches")
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
      setTaches(data || [])
    } catch (error) {
      console.error("Erreur lors du chargement des tâches:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      try {
        const { error } = await supabase.from("taches").delete().eq("id", id)

        if (error) throw error
        loadTaches()
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
      }
    }
  }

  const toggleStatut = async (tache: Tache) => {
    const nouveauStatut = tache.statut === "termine" ? "a_faire" : "termine"

    try {
      const { error } = await supabase.from("taches").update({ statut: nouveauStatut }).eq("id", tache.id)

      if (error) throw error
      loadTaches()
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
    }
  }

  const getPrioriteColor = (priorite: string) => {
    switch (priorite) {
      case "haute":
        return "bg-red-100 text-red-800"
      case "moyenne":
        return "bg-yellow-100 text-yellow-800"
      case "basse":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "termine":
        return "bg-green-100 text-green-800"
      case "en_cours":
        return "bg-blue-100 text-blue-800"
      case "a_faire":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tâches</h2>
          <p className="text-muted-foreground">Gérez vos tâches et suivis</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Tâche
        </Button>
      </div>

      {/* Barre de recherche */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Rechercher une tâche..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Liste des tâches */}
      <div className="grid gap-4">
        {filteredTaches.map((tache) => (
          <Card key={tache.id} className={tache.statut === "termine" ? "opacity-75" : ""}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleStatut(tache)}
                    className={tache.statut === "termine" ? "text-green-600" : "text-gray-400"}
                  >
                    <CheckCircle className="h-5 w-5" />
                  </Button>

                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold ${tache.statut === "termine" ? "line-through" : ""}`}>
                      {tache.titre}
                    </h3>

                    {tache.clients && (
                      <p className="text-sm text-muted-foreground">
                        Client: {tache.clients.prenom} {tache.clients.nom}
                        {tache.clients.entreprise && ` - ${tache.clients.entreprise}`}
                      </p>
                    )}

                    {tache.description && <p className="text-sm text-muted-foreground mt-1">{tache.description}</p>}

                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={getPrioriteColor(tache.priorite)}>{tache.priorite}</Badge>
                      <Badge className={getStatutColor(tache.statut)}>{tache.statut.replace("_", " ")}</Badge>
                      {tache.date_echeance && (
                        <span className="text-xs text-muted-foreground">
                          Échéance: {new Date(tache.date_echeance).toLocaleDateString("fr-FR")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingTache(tache)
                      setShowForm(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(tache.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Formulaire tâche */}
      {showForm && (
        <TacheForm
          tache={editingTache}
          onClose={() => {
            setShowForm(false)
            setEditingTache(null)
          }}
          onSave={() => {
            loadTaches()
            setShowForm(false)
            setEditingTache(null)
          }}
        />
      )}
    </div>
  )
}
