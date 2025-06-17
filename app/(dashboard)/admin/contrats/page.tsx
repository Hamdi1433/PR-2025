"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Upload, Download, FileText, Euro, TrendingUp, Calendar } from "lucide-react"
import { ContratForm } from "@/components/contrats/contrat-form"
import { ImportData } from "@/components/import/import-data"
import { databaseService } from "@/lib/database"
import type { Contrat } from "@/lib/types"

export default function ContratsPage() {
  const [contrats, setContrats] = useState<Contrat[]>([])
  const [filteredContrats, setFilteredContrats] = useState<Contrat[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [editingContrat, setEditingContrat] = useState<Contrat | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadContrats()
  }, [])

  useEffect(() => {
    const filtered = contrats.filter(
      (contrat) =>
        contrat.numero_contrat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contrat.compagnie.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contrat.attribution && contrat.attribution.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredContrats(filtered)
  }, [contrats, searchTerm])

  const loadContrats = async () => {
    try {
      setIsLoading(true)
      const data = await databaseService.getContrats()
      setContrats(data)
    } catch (error) {
      console.error("Erreur lors du chargement des contrats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "actif":
        return "bg-green-100 text-green-800 border-green-200"
      case "suspendu":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "resilie":
        return "bg-red-100 text-red-800 border-red-200"
      case "expire":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  const exportContrats = () => {
    const csvContent = [
      [
        "N° Contrat",
        "Compagnie",
        "Statut",
        "Attribution",
        "Pays",
        "Date signature",
        "Date effet",
        "Date fin",
        "Cotisation mensuelle",
        "Cotisation annuelle",
        "Commission mensuelle",
        "Commission annuelle",
        "Commission 1ère année",
        "Année récurrente",
        "Année reçue",
        "Charge",
        "Dépenses",
      ].join(","),
      ...filteredContrats.map((contrat) =>
        [
          contrat.numero_contrat,
          contrat.compagnie,
          contrat.statut,
          contrat.attribution || "",
          contrat.pays,
          contrat.date_signature,
          contrat.date_effet,
          contrat.date_fin || "",
          contrat.cotisation_mensuelle,
          contrat.cotisation_annuelle,
          contrat.commission_mensuelle,
          contrat.commission_annuelle,
          contrat.commission_annuelle_premiere_annee,
          contrat.annee_recurrente,
          contrat.annee_recue,
          contrat.charge || 0,
          contrat.depenses || 0,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `contrats_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Calculs des statistiques
  const stats = {
    total: contrats.length,
    actifs: contrats.filter((c) => c.statut === "actif").length,
    revenueMensuel: contrats.filter((c) => c.statut === "actif").reduce((sum, c) => sum + c.cotisation_mensuelle, 0),
    revenueAnnuel: contrats.filter((c) => c.statut === "actif").reduce((sum, c) => sum + c.cotisation_annuelle, 0),
    commissionMensuelle: contrats
      .filter((c) => c.statut === "actif")
      .reduce((sum, c) => sum + c.commission_mensuelle, 0),
    commissionAnnuelle: contrats.filter((c) => c.statut === "actif").reduce((sum, c) => sum + c.commission_annuelle, 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Gestion des Contrats
          </h2>
          <p className="text-muted-foreground">Gérez tous vos contrats et suivez les performances financières</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={exportContrats}
            className="border-green-200 text-green-600 hover:bg-green-50"
          >
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowImport(true)}
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <Upload className="mr-2 h-4 w-4" />
            Importer
          </Button>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:opacity-90 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Contrat
          </Button>
        </div>
      </div>

      {/* Statistiques financières */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Contrats Actifs</p>
                <p className="text-2xl font-bold text-green-700">{stats.actifs}</p>
                <p className="text-xs text-muted-foreground">sur {stats.total} total</p>
              </div>
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <FileText className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Revenue Mensuel</p>
                <p className="text-2xl font-bold text-blue-700">{formatCurrency(stats.revenueMensuel)}</p>
                <p className="text-xs text-muted-foreground">cotisations</p>
              </div>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Euro className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Commission Mensuelle</p>
                <p className="text-2xl font-bold text-purple-700">{formatCurrency(stats.commissionMensuelle)}</p>
                <p className="text-xs text-muted-foreground">gains</p>
              </div>
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Revenue Annuel</p>
                <p className="text-2xl font-bold text-orange-700">{formatCurrency(stats.revenueAnnuel)}</p>
                <p className="text-xs text-muted-foreground">projection</p>
              </div>
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <Calendar className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de recherche */}
      <Card className="border-green-200">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Rechercher un contrat par numéro, compagnie ou attribution..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-green-200 focus:border-green-400 focus:ring-green-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Liste des contrats */}
      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-2 text-muted-foreground">Chargement des contrats...</span>
            </div>
          </CardContent>
        </Card>
      ) : filteredContrats.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? "Aucun contrat trouvé pour cette recherche" : "Aucun contrat enregistré"}
              </p>
              {!searchTerm && (
                <div className="mt-4 space-x-2">
                  <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Créer un contrat
                  </Button>
                  <Button variant="outline" onClick={() => setShowImport(true)}>
                    <Upload className="mr-2 h-4 w-4" />
                    Importer des contrats
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredContrats.map((contrat) => (
            <Card key={contrat.id} className="border-green-100 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{contrat.numero_contrat}</h3>
                      <p className="text-sm text-muted-foreground">{contrat.compagnie}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <p className="text-sm text-blue-600">{formatCurrency(contrat.cotisation_mensuelle)}/mois</p>
                        <p className="text-sm text-green-600">
                          Commission: {formatCurrency(contrat.commission_mensuelle)}/mois
                        </p>
                        {contrat.attribution && (
                          <p className="text-sm text-purple-600">Assigné à: {contrat.attribution}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <p className="text-xs text-muted-foreground">Effet: {contrat.date_effet}</p>
                        {contrat.date_fin && <p className="text-xs text-muted-foreground">Fin: {contrat.date_fin}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <Badge className={getStatusColor(contrat.statut)}>{contrat.statut}</Badge>
                      <p className="text-sm font-semibold text-green-600 mt-1">
                        {formatCurrency(contrat.cotisation_annuelle)}/an
                      </p>
                      <p className="text-xs text-muted-foreground">{contrat.pays}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingContrat(contrat)
                          setShowForm(true)
                        }}
                        className="border-green-200 text-green-600 hover:bg-green-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Formulaire contrat */}
      {showForm && (
        <ContratForm
          contrat={editingContrat}
          onClose={() => {
            setShowForm(false)
            setEditingContrat(null)
          }}
          onSave={() => {
            loadContrats()
            setShowForm(false)
            setEditingContrat(null)
          }}
        />
      )}

      {/* Import de données */}
      {showImport && (
        <ImportData
          onClose={() => setShowImport(false)}
          onImportComplete={() => {
            loadContrats()
            setShowImport(false)
          }}
        />
      )}
    </div>
  )
}
