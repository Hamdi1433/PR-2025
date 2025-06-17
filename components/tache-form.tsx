"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase, type Tache, type Client } from "@/lib/supabase"
import { X } from "lucide-react"

interface TacheFormProps {
  tache?: Tache | null
  onClose: () => void
  onSave: () => void
}

export function TacheForm({ tache, onClose, onSave }: TacheFormProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    priorite: "moyenne" as "basse" | "moyenne" | "haute",
    statut: "a_faire" as "a_faire" | "en_cours" | "termine",
    date_echeance: "",
    client_id: "",
  })

  useEffect(() => {
    loadClients()
    if (tache) {
      setFormData({
        titre: tache.titre,
        description: tache.description || "",
        priorite: tache.priorite,
        statut: tache.statut,
        date_echeance: tache.date_echeance || "",
        client_id: tache.client_id || "",
      })
    }
  }, [tache])

  const loadClients = async () => {
    try {
      const { data, error } = await supabase.from("clients").select("*").order("nom")

      if (error) throw error
      setClients(data || [])
    } catch (error) {
      console.error("Erreur lors du chargement des clients:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const dataToSave = {
        ...formData,
        client_id: formData.client_id || null,
        date_echeance: formData.date_echeance || null,
      }

      if (tache) {
        // Mise à jour
        const { error } = await supabase.from("taches").update(dataToSave).eq("id", tache.id)

        if (error) throw error
      } else {
        // Création
        const { error } = await supabase.from("taches").insert([dataToSave])

        if (error) throw error
      }

      onSave()
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{tache ? "Modifier la tâche" : "Nouvelle tâche"}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="titre">Titre *</Label>
              <Input
                id="titre"
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="client_id">Client (optionnel)</Label>
              <Select
                value={formData.client_id}
                onValueChange={(value) => setFormData({ ...formData, client_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucun client</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.prenom} {client.nom} {client.entreprise && `- ${client.entreprise}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priorite">Priorité</Label>
                <Select
                  value={formData.priorite}
                  onValueChange={(value: "basse" | "moyenne" | "haute") =>
                    setFormData({ ...formData, priorite: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basse">Basse</SelectItem>
                    <SelectItem value="moyenne">Moyenne</SelectItem>
                    <SelectItem value="haute">Haute</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="statut">Statut</Label>
                <Select
                  value={formData.statut}
                  onValueChange={(value: "a_faire" | "en_cours" | "termine") =>
                    setFormData({ ...formData, statut: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a_faire">À faire</SelectItem>
                    <SelectItem value="en_cours">En cours</SelectItem>
                    <SelectItem value="termine">Terminé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="date_echeance">Date d'échéance</Label>
              <Input
                id="date_echeance"
                type="date"
                value={formData.date_echeance}
                onChange={(e) => setFormData({ ...formData, date_echeance: e.target.value })}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit">{tache ? "Mettre à jour" : "Créer"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
