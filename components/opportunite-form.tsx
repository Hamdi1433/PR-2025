"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase, type Opportunite, type Client } from "@/lib/supabase"
import { X } from "lucide-react"

interface OpportuniteFormProps {
  opportunite?: Opportunite | null
  onClose: () => void
  onSave: () => void
}

export function OpportuniteForm({ opportunite, onClose, onSave }: OpportuniteFormProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    valeur: "",
    probabilite: 50,
    etape: "qualification",
    client_id: "",
    date_fermeture_prevue: "",
    statut: "ouvert" as "ouvert" | "gagne" | "perdu",
  })

  useEffect(() => {
    loadClients()
    if (opportunite) {
      setFormData({
        titre: opportunite.titre,
        description: opportunite.description || "",
        valeur: opportunite.valeur?.toString() || "",
        probabilite: opportunite.probabilite,
        etape: opportunite.etape,
        client_id: opportunite.client_id,
        date_fermeture_prevue: opportunite.date_fermeture_prevue || "",
        statut: opportunite.statut,
      })
    }
  }, [opportunite])

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
        valeur: formData.valeur ? Number.parseFloat(formData.valeur) : null,
        date_fermeture_prevue: formData.date_fermeture_prevue || null,
      }

      if (opportunite) {
        // Mise à jour
        const { error } = await supabase.from("opportunites").update(dataToSave).eq("id", opportunite.id)

        if (error) throw error
      } else {
        // Création
        const { error } = await supabase.from("opportunites").insert([dataToSave])

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
          <CardTitle>{opportunite ? "Modifier l'opportunité" : "Nouvelle opportunité"}</CardTitle>
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
              <Label htmlFor="client_id">Client *</Label>
              <Select
                value={formData.client_id}
                onValueChange={(value) => setFormData({ ...formData, client_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.prenom} {client.nom} {client.entreprise && `- ${client.entreprise}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="valeur">Valeur (€)</Label>
                <Input
                  id="valeur"
                  type="number"
                  step="0.01"
                  value={formData.valeur}
                  onChange={(e) => setFormData({ ...formData, valeur: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="probabilite">Probabilité (%)</Label>
                <Input
                  id="probabilite"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.probabilite}
                  onChange={(e) => setFormData({ ...formData, probabilite: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="etape">Étape</Label>
                <Select value={formData.etape} onValueChange={(value) => setFormData({ ...formData, etape: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="qualification">Qualification</SelectItem>
                    <SelectItem value="proposition">Proposition</SelectItem>
                    <SelectItem value="negociation">Négociation</SelectItem>
                    <SelectItem value="fermeture">Fermeture</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="statut">Statut</Label>
                <Select
                  value={formData.statut}
                  onValueChange={(value: "ouvert" | "gagne" | "perdu") => setFormData({ ...formData, statut: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ouvert">Ouvert</SelectItem>
                    <SelectItem value="gagne">Gagné</SelectItem>
                    <SelectItem value="perdu">Perdu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="date_fermeture_prevue">Date de fermeture prévue</Label>
              <Input
                id="date_fermeture_prevue"
                type="date"
                value={formData.date_fermeture_prevue}
                onChange={(e) => setFormData({ ...formData, date_fermeture_prevue: e.target.value })}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit">{opportunite ? "Mettre à jour" : "Créer"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
