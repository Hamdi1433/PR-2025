"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import { databaseService } from "@/lib/database"
import type { Contrat } from "@/lib/types"

interface ContratFormProps {
  contrat?: Contrat | null
  onClose: () => void
  onSave: () => void
}

export function ContratForm({ contrat, onClose, onSave }: ContratFormProps) {
  const [formData, setFormData] = useState({
    numero_contrat: "",
    contact_id: "",
    compagnie: "",
    statut: "actif" as "actif" | "suspendu" | "resilie" | "expire",
    attribution: "",
    pays: "France",
    date_signature: new Date().toISOString().split("T")[0],
    date_effet: new Date().toISOString().split("T")[0],
    date_fin: "",
    cotisation_mensuelle: 0,
    cotisation_annuelle: 0,
    commission_mensuelle: 0,
    commission_annuelle: 0,
    commission_annuelle_premiere_annee: 0,
    annee_recurrente: 0,
    annee_recue: 0,
    charge: 0,
    depenses: 0,
  })

  useEffect(() => {
    if (contrat) {
      setFormData({
        numero_contrat: contrat.numero_contrat,
        contact_id: contrat.contact_id,
        compagnie: contrat.compagnie,
        statut: contrat.statut,
        attribution: contrat.attribution || "",
        pays: contrat.pays,
        date_signature: contrat.date_signature,
        date_effet: contrat.date_effet,
        date_fin: contrat.date_fin || "",
        cotisation_mensuelle: contrat.cotisation_mensuelle,
        cotisation_annuelle: contrat.cotisation_annuelle,
        commission_mensuelle: contrat.commission_mensuelle,
        commission_annuelle: contrat.commission_annuelle,
        commission_annuelle_premiere_annee: contrat.commission_annuelle_premiere_annee,
        annee_recurrente: contrat.annee_recurrente,
        annee_recue: contrat.annee_recue,
        charge: contrat.charge || 0,
        depenses: contrat.depenses || 0,
      })
    }
  }, [contrat])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (contrat) {
        // Mise à jour du contrat existant
        // Note: Cette fonctionnalité nécessiterait une méthode updateContrat dans le service
        console.log("Mise à jour du contrat:", formData)
      } else {
        await databaseService.createContrat(formData)
      }

      onSave()
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardTitle className="text-white">{contrat ? "Modifier le contrat" : "Nouveau contrat"}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations générales */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Informations générales</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="numero_contrat">N° de contrat *</Label>
                  <Input
                    id="numero_contrat"
                    value={formData.numero_contrat}
                    onChange={(e) => setFormData({ ...formData, numero_contrat: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contact_id">ID Contact *</Label>
                  <Input
                    id="contact_id"
                    value={formData.contact_id}
                    onChange={(e) => setFormData({ ...formData, contact_id: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="compagnie">Compagnie *</Label>
                  <Input
                    id="compagnie"
                    value={formData.compagnie}
                    onChange={(e) => setFormData({ ...formData, compagnie: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Statut et attribution */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Statut et attribution</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="statut">Statut</Label>
                  <Select
                    value={formData.statut}
                    onValueChange={(value: "actif" | "suspendu" | "resilie" | "expire") =>
                      setFormData({ ...formData, statut: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="actif">Actif</SelectItem>
                      <SelectItem value="suspendu">Suspendu</SelectItem>
                      <SelectItem value="resilie">Résilié</SelectItem>
                      <SelectItem value="expire">Expiré</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="attribution">Attribution</Label>
                  <Input
                    id="attribution"
                    value={formData.attribution}
                    onChange={(e) => setFormData({ ...formData, attribution: e.target.value })}
                    placeholder="Conseiller assigné"
                  />
                </div>
                <div>
                  <Label htmlFor="pays">Pays</Label>
                  <Input
                    id="pays"
                    value={formData.pays}
                    onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Dates */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Dates</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="date_signature">Date signature *</Label>
                  <Input
                    id="date_signature"
                    type="date"
                    value={formData.date_signature}
                    onChange={(e) => setFormData({ ...formData, date_signature: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="date_effet">Date d'effet *</Label>
                  <Input
                    id="date_effet"
                    type="date"
                    value={formData.date_effet}
                    onChange={(e) => setFormData({ ...formData, date_effet: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="date_fin">Fin de contrat</Label>
                  <Input
                    id="date_fin"
                    type="date"
                    value={formData.date_fin}
                    onChange={(e) => setFormData({ ...formData, date_fin: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Cotisations */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Cotisations</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cotisation_mensuelle">Cotisation mensuelle (€)</Label>
                  <Input
                    id="cotisation_mensuelle"
                    type="number"
                    step="0.01"
                    value={formData.cotisation_mensuelle}
                    onChange={(e) =>
                      setFormData({ ...formData, cotisation_mensuelle: Number.parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="cotisation_annuelle">Cotisation annuelle (€)</Label>
                  <Input
                    id="cotisation_annuelle"
                    type="number"
                    step="0.01"
                    value={formData.cotisation_annuelle}
                    onChange={(e) =>
                      setFormData({ ...formData, cotisation_annuelle: Number.parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Commissions */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Commissions</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="commission_mensuelle">Commission mensuelle (€)</Label>
                  <Input
                    id="commission_mensuelle"
                    type="number"
                    step="0.01"
                    value={formData.commission_mensuelle}
                    onChange={(e) =>
                      setFormData({ ...formData, commission_mensuelle: Number.parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="commission_annuelle">Commission annuelle (€)</Label>
                  <Input
                    id="commission_annuelle"
                    type="number"
                    step="0.01"
                    value={formData.commission_annuelle}
                    onChange={(e) =>
                      setFormData({ ...formData, commission_annuelle: Number.parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <Label htmlFor="commission_annuelle_premiere_annee">Commission annuelle 1ère année (€)</Label>
                  <Input
                    id="commission_annuelle_premiere_annee"
                    type="number"
                    step="0.01"
                    value={formData.commission_annuelle_premiere_annee}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        commission_annuelle_premiere_annee: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="annee_recurrente">Année récurrente (€)</Label>
                  <Input
                    id="annee_recurrente"
                    type="number"
                    step="0.01"
                    value={formData.annee_recurrente}
                    onChange={(e) =>
                      setFormData({ ...formData, annee_recurrente: Number.parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="annee_recue">Année reçue (€)</Label>
                  <Input
                    id="annee_recue"
                    type="number"
                    step="0.01"
                    value={formData.annee_recue}
                    onChange={(e) => setFormData({ ...formData, annee_recue: Number.parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>

            {/* Charges et dépenses */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Charges et dépenses</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="charge">Charge (€)</Label>
                  <Input
                    id="charge"
                    type="number"
                    step="0.01"
                    value={formData.charge}
                    onChange={(e) => setFormData({ ...formData, charge: Number.parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="depenses">Dépenses (€)</Label>
                  <Input
                    id="depenses"
                    type="number"
                    step="0.01"
                    value={formData.depenses}
                    onChange={(e) => setFormData({ ...formData, depenses: Number.parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                {contrat ? "Mettre à jour" : "Créer"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
