"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import { databaseService } from "@/lib/database"
import type { Contact } from "@/lib/types"

interface ContactFormProps {
  contact?: Contact | null
  onClose: () => void
  onSave: () => void
}

export function ContactForm({ contact, onClose, onSave }: ContactFormProps) {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    entreprise: "",
    poste: "",
    adresse: "",
    ville: "",
    code_postal: "",
    pays: "France",
    statut: "prospect" as "prospect" | "lead" | "client" | "inactif",
    origine: "",
    attribution: "",
    cpl: "",
    date_creation: new Date().toISOString().split("T")[0],
    date_signature: "",
    notes: "",
  })

  useEffect(() => {
    if (contact) {
      setFormData({
        nom: contact.nom,
        prenom: contact.prenom,
        email: contact.email,
        telephone: contact.telephone || "",
        entreprise: contact.entreprise || "",
        poste: contact.poste || "",
        adresse: contact.adresse || "",
        ville: contact.ville,
        code_postal: contact.code_postal || "",
        pays: contact.pays,
        statut: contact.statut,
        origine: contact.origine,
        attribution: contact.attribution || "",
        cpl: contact.cpl || "",
        date_creation: contact.date_creation,
        date_signature: contact.date_signature || "",
        notes: contact.notes || "",
      })
    }
  }, [contact])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (contact) {
        await databaseService.updateContact(contact.id, {
          ...formData,
          score: contact.score,
          assigned_to: formData.attribution,
        })
      } else {
        await databaseService.createContact({
          ...formData,
          score: 50,
          assigned_to: formData.attribution,
        })
      }

      onSave()
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="text-white">{contact ? "Modifier le contact" : "Nouveau contact"}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations personnelles */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prenom">Prénom *</Label>
                  <Input
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="nom">Nom *</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input
                    id="telephone"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Entreprise */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Entreprise</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="entreprise">Entreprise</Label>
                  <Input
                    id="entreprise"
                    value={formData.entreprise}
                    onChange={(e) => setFormData({ ...formData, entreprise: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="poste">Poste</Label>
                  <Input
                    id="poste"
                    value={formData.poste}
                    onChange={(e) => setFormData({ ...formData, poste: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Adresse */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Adresse</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="adresse">Adresse</Label>
                  <Textarea
                    id="adresse"
                    value={formData.adresse}
                    onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="ville">Ville *</Label>
                    <Input
                      id="ville"
                      value={formData.ville}
                      onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="code_postal">Code postal</Label>
                    <Input
                      id="code_postal"
                      value={formData.code_postal}
                      onChange={(e) => setFormData({ ...formData, code_postal: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pays">Pays *</Label>
                    <Input
                      id="pays"
                      value={formData.pays}
                      onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Informations CRM */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Informations CRM</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="statut">Statut</Label>
                  <Select
                    value={formData.statut}
                    onValueChange={(value: "prospect" | "lead" | "client" | "inactif") =>
                      setFormData({ ...formData, statut: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prospect">Prospect</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="inactif">Inactif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="origine">Origine</Label>
                  <Select
                    value={formData.origine}
                    onValueChange={(value) => setFormData({ ...formData, origine: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une origine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Site web">Site web</SelectItem>
                      <SelectItem value="Référence">Référence</SelectItem>
                      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                      <SelectItem value="Google Ads">Google Ads</SelectItem>
                      <SelectItem value="Email">Email</SelectItem>
                      <SelectItem value="Téléphone">Téléphone</SelectItem>
                      <SelectItem value="Salon">Salon</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
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
                  <Label htmlFor="cpl">CPL (Coût par Lead)</Label>
                  <Input
                    id="cpl"
                    value={formData.cpl}
                    onChange={(e) => setFormData({ ...formData, cpl: e.target.value })}
                    placeholder="Ex: 50€"
                  />
                </div>
              </div>
            </div>

            {/* Dates */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Dates importantes</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date_creation">Date de création</Label>
                  <Input
                    id="date_creation"
                    type="date"
                    value={formData.date_creation}
                    onChange={(e) => setFormData({ ...formData, date_creation: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="date_signature">Date de signature</Label>
                  <Input
                    id="date_signature"
                    type="date"
                    value={formData.date_signature}
                    onChange={(e) => setFormData({ ...formData, date_signature: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Notes sur le contact..."
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {contact ? "Mettre à jour" : "Créer"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
