"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle, X, MapPin } from "lucide-react"
import * as XLSX from "xlsx"
import { databaseService } from "@/lib/database"
import type { Contact, Contrat, ImportResult, ImportMapping } from "@/lib/types"

interface ImportDataProps {
  onClose: () => void
  onImportComplete: () => void
}

export function ImportData({ onClose, onImportComplete }: ImportDataProps) {
  const [activeTab, setActiveTab] = useState("contacts")
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [preview, setPreview] = useState<any[]>([])
  const [mapping, setMapping] = useState<ImportMapping>({})
  const [showMapping, setShowMapping] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mappings des champs pour les contacts
  const contactFields = {
    nom: "Nom",
    prenom: "Prénom",
    email: "Email",
    telephone: "Téléphone",
    entreprise: "Entreprise",
    poste: "Poste",
    adresse: "Adresse",
    ville: "Ville",
    code_postal: "Code postal",
    pays: "Pays",
    statut: "Statut",
    origine: "Origine",
    attribution: "Attribution",
    cpl: "CPL",
    date_creation: "Date de création",
    date_signature: "Date de signature",
    notes: "Notes",
  }

  // Mappings des champs pour les contrats
  const contratFields = {
    numero_contrat: "N° de contrat",
    contact_id: "ID Contact",
    compagnie: "Compagnie",
    statut: "Statut",
    attribution: "Attribution",
    pays: "Pays",
    date_signature: "Date signature",
    date_effet: "Date d'effet",
    date_fin: "Fin de contrat",
    cotisation_mensuelle: "Cotisation mensuelle",
    cotisation_annuelle: "Cotisation annuelle",
    commission_mensuelle: "Commission mensuelle",
    commission_annuelle: "Commission annuelle",
    commission_annuelle_premiere_annee: "Commission annuelle 1ère année",
    annee_recurrente: "Année récurrente",
    annee_recue: "Année reçue",
    charge: "Charge",
    depenses: "Dépenses",
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setResult(null)
    setShowMapping(false)

    try {
      const data = await readFileData(selectedFile)
      setPreview(data.slice(0, 5))

      if (data.length > 0) {
        // Auto-mapping basé sur les noms de colonnes
        const autoMapping: ImportMapping = {}
        const fileColumns = Object.keys(data[0])
        const targetFields = activeTab === "contacts" ? contactFields : contratFields

        fileColumns.forEach((column) => {
          const normalizedColumn = column.toLowerCase().trim()
          const matchingField = Object.entries(targetFields).find(
            ([key, label]) =>
              normalizedColumn.includes(key.toLowerCase()) ||
              normalizedColumn.includes(label.toLowerCase()) ||
              normalizedColumn === key,
          )

          if (matchingField) {
            autoMapping[column] = matchingField[0]
          }
        })

        setMapping(autoMapping)
        setShowMapping(true)
      }
    } catch (error) {
      console.error("Erreur lors de la lecture du fichier:", error)
    }
  }

  const readFileData = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = e.target?.result
          let jsonData: any[] = []

          if (file.name.endsWith(".csv")) {
            const text = data as string
            const lines = text.split("\n")
            const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

            for (let i = 1; i < lines.length; i++) {
              if (lines[i].trim()) {
                const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))
                const row: any = {}
                headers.forEach((header, index) => {
                  row[header] = values[index] || ""
                })
                jsonData.push(row)
              }
            }
          } else {
            const workbook = XLSX.read(data, { type: "binary" })
            const sheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[sheetName]
            jsonData = XLSX.utils.sheet_to_json(worksheet)
          }

          resolve(jsonData)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = reject

      if (file.name.endsWith(".csv")) {
        reader.readAsText(file)
      } else {
        reader.readAsBinaryString(file)
      }
    })
  }

  const processImport = async () => {
    if (!file) return

    setIsProcessing(true)
    setProgress(0)

    try {
      const data = await readFileData(file)

      if (activeTab === "contacts") {
        const contacts = data
          .map((row, index) => {
            setProgress((index / data.length) * 100)
            return mapRowToContact(row)
          })
          .filter((contact) => contact !== null) as Omit<Contact, "id" | "created_at" | "updated_at">[]

        const importResult = await databaseService.importContacts(contacts)
        setResult(importResult)
      } else {
        const contrats = data
          .map((row, index) => {
            setProgress((index / data.length) * 100)
            return mapRowToContrat(row)
          })
          .filter((contrat) => contrat !== null) as Omit<Contrat, "id" | "created_at" | "updated_at">[]

        const importResult = await databaseService.importContrats(contrats)
        setResult(importResult)
      }

      setProgress(100)
      if (result && result.success > 0) {
        onImportComplete()
      }
    } catch (error) {
      console.error("Erreur lors de l'import:", error)
      setResult({
        success: 0,
        errors: [{ row: 0, error: "Erreur lors du traitement du fichier", data: {} }],
        duplicates: 0,
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const mapRowToContact = (row: any): Omit<Contact, "id" | "created_at" | "updated_at"> | null => {
    try {
      const mappedData: any = {}

      Object.entries(mapping).forEach(([fileColumn, appField]) => {
        if (row[fileColumn] !== undefined) {
          mappedData[appField] = row[fileColumn]
        }
      })

      // Validation des champs obligatoires
      if (!mappedData.nom || !mappedData.prenom || !mappedData.email) {
        return null
      }

      return {
        nom: mappedData.nom || "",
        prenom: mappedData.prenom || "",
        email: mappedData.email || "",
        telephone: mappedData.telephone || "",
        entreprise: mappedData.entreprise || "",
        poste: mappedData.poste || "",
        adresse: mappedData.adresse || "",
        ville: mappedData.ville || "",
        code_postal: mappedData.code_postal || "",
        pays: mappedData.pays || "France",
        statut: mappedData.statut || "prospect",
        score: 50,
        origine: mappedData.origine || "Import",
        attribution: mappedData.attribution || "",
        cpl: mappedData.cpl || "",
        date_creation: mappedData.date_creation || new Date().toISOString().split("T")[0],
        date_signature: mappedData.date_signature || undefined,
        notes: mappedData.notes || "",
        assigned_to: mappedData.attribution || "",
      }
    } catch (error) {
      return null
    }
  }

  const mapRowToContrat = (row: any): Omit<Contrat, "id" | "created_at" | "updated_at"> | null => {
    try {
      const mappedData: any = {}

      Object.entries(mapping).forEach(([fileColumn, appField]) => {
        if (row[fileColumn] !== undefined) {
          mappedData[appField] = row[fileColumn]
        }
      })

      // Validation des champs obligatoires
      if (!mappedData.numero_contrat || !mappedData.contact_id || !mappedData.compagnie) {
        return null
      }

      return {
        numero_contrat: mappedData.numero_contrat || "",
        contact_id: mappedData.contact_id || "",
        compagnie: mappedData.compagnie || "",
        statut: mappedData.statut || "actif",
        attribution: mappedData.attribution || "",
        pays: mappedData.pays || "France",
        date_signature: mappedData.date_signature || new Date().toISOString().split("T")[0],
        date_effet: mappedData.date_effet || new Date().toISOString().split("T")[0],
        date_fin: mappedData.date_fin || undefined,
        cotisation_mensuelle: Number.parseFloat(mappedData.cotisation_mensuelle) || 0,
        cotisation_annuelle: Number.parseFloat(mappedData.cotisation_annuelle) || 0,
        commission_mensuelle: Number.parseFloat(mappedData.commission_mensuelle) || 0,
        commission_annuelle: Number.parseFloat(mappedData.commission_annuelle) || 0,
        commission_annuelle_premiere_annee: Number.parseFloat(mappedData.commission_annuelle_premiere_annee) || 0,
        annee_recurrente: Number.parseFloat(mappedData.annee_recurrente) || 0,
        annee_recue: Number.parseFloat(mappedData.annee_recue) || 0,
        charge: Number.parseFloat(mappedData.charge) || 0,
        depenses: Number.parseFloat(mappedData.depenses) || 0,
      }
    } catch (error) {
      return null
    }
  }

  const downloadTemplate = () => {
    let template: any[] = []

    if (activeTab === "contacts") {
      template = [
        {
          nom: "Dupont",
          prenom: "Jean",
          email: "jean.dupont@example.com",
          telephone: "0123456789",
          entreprise: "Exemple Corp",
          poste: "Directeur",
          adresse: "123 Rue Example",
          ville: "Paris",
          code_postal: "75001",
          pays: "France",
          statut: "prospect",
          origine: "Site web",
          attribution: "conseiller-1",
          cpl: "50",
          date_creation: "2024-01-15",
          date_signature: "",
          notes: "Contact intéressant",
        },
      ]
    } else {
      template = [
        {
          numero_contrat: "CONT-2024-001",
          contact_id: "1",
          compagnie: "Assurance Plus",
          statut: "actif",
          attribution: "conseiller-1",
          pays: "France",
          date_signature: "2024-01-20",
          date_effet: "2024-02-01",
          date_fin: "2025-01-31",
          cotisation_mensuelle: 150,
          cotisation_annuelle: 1800,
          commission_mensuelle: 45,
          commission_annuelle: 540,
          commission_annuelle_premiere_annee: 600,
          annee_recurrente: 540,
          annee_recue: 540,
          charge: 50,
          depenses: 25,
        },
      ]
    }

    const ws = XLSX.utils.json_to_sheet(template)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, activeTab === "contacts" ? "Contacts" : "Contrats")
    XLSX.writeFile(wb, `template_import_${activeTab}.xlsx`)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="text-white">Import de Données</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="contrats">Contrats</TabsTrigger>
            </TabsList>

            <TabsContent value="contacts" className="space-y-6">
              <Alert className="border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  Importez vos contacts avec tous les champs : nom, prénom, email, ville, origine, statut, attribution,
                  etc.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="contrats" className="space-y-6">
              <Alert className="border-green-200 bg-green-50">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  Importez vos contrats avec toutes les informations financières : cotisations, commissions, charges,
                  etc.
                </AlertDescription>
              </Alert>
            </TabsContent>

            {/* Télécharger le modèle */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">1. Télécharger le modèle</h3>
                <p className="text-sm text-muted-foreground">
                  Utilisez ce modèle pour formater vos données {activeTab} correctement
                </p>
              </div>
              <Button
                variant="outline"
                onClick={downloadTemplate}
                className="border-blue-400 text-blue-600 hover:bg-blue-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger le modèle {activeTab}
              </Button>
            </div>

            {/* Sélection du fichier */}
            <div>
              <h3 className="text-lg font-semibold mb-2">2. Sélectionner votre fichier</h3>
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <FileSpreadsheet className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Glissez votre fichier ici ou cliquez pour sélectionner</p>
                <p className="text-sm text-muted-foreground mb-4">Formats supportés: CSV, XLSX, XLS</p>
                <Button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Sélectionner un fichier
                </Button>
              </div>
            </div>

            {/* Mapping des colonnes */}
            {showMapping && preview.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  3. Mapper les colonnes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {Object.keys(preview[0]).map((column) => (
                    <div key={column} className="space-y-2">
                      <Label htmlFor={`mapping-${column}`}>Colonne "{column}" → Champ CRM</Label>
                      <Select
                        value={mapping[column] || ""}
                        onValueChange={(value) => setMapping((prev) => ({ ...prev, [column]: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un champ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ignore">-- Ignorer cette colonne --</SelectItem>
                          {Object.entries(activeTab === "contacts" ? contactFields : contratFields).map(
                            ([key, label]) => (
                              <SelectItem key={key} value={key}>
                                {label}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prévisualisation */}
            {preview.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">4. Prévisualisation</h3>
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                        <tr>
                          {Object.keys(preview[0]).map((key) => (
                            <th key={key} className="px-4 py-2 text-left font-medium">
                              {key}
                              {mapping[key] && (
                                <div className="text-xs text-blue-600 mt-1">
                                  →{" "}
                                  {activeTab === "contacts"
                                    ? contactFields[mapping[key] as keyof typeof contactFields]
                                    : contratFields[mapping[key] as keyof typeof contratFields]}
                                </div>
                              )}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {preview.map((row, index) => (
                          <tr key={index} className="border-t">
                            {Object.values(row).map((value: any, cellIndex) => (
                              <td key={cellIndex} className="px-4 py-2">
                                {value?.toString() || ""}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Aperçu des 5 premières lignes</p>
              </div>
            )}

            {/* Traitement */}
            {file && showMapping && !result && (
              <div>
                <h3 className="text-lg font-semibold mb-2">5. Lancer l'import</h3>
                <div className="flex gap-4">
                  <Button onClick={processImport} disabled={isProcessing} className="bg-blue-600 hover:bg-blue-700">
                    {isProcessing ? "Import en cours..." : `Importer les ${activeTab}`}
                  </Button>
                  {isProcessing && (
                    <div className="flex-1">
                      <Progress value={progress} className="w-full" />
                      <p className="text-sm text-muted-foreground mt-1">{Math.round(progress)}% terminé</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Résultats */}
            {result && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Résultats de l'import</h3>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-4 text-center">
                      <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-green-600">{result.success}</p>
                      <p className="text-sm text-green-700">{activeTab} importés</p>
                    </CardContent>
                  </Card>

                  <Card className="border-orange-200 bg-orange-50">
                    <CardContent className="p-4 text-center">
                      <AlertCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-orange-600">{result.duplicates}</p>
                      <p className="text-sm text-orange-700">Doublons ignorés</p>
                    </CardContent>
                  </Card>

                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-4 text-center">
                      <X className="h-8 w-8 text-red-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-red-600">{result.errors.length}</p>
                      <p className="text-sm text-red-700">Erreurs</p>
                    </CardContent>
                  </Card>
                </div>

                {result.errors.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Erreurs détaillées :</h4>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {result.errors.map((error, index) => (
                        <Alert key={index} variant="destructive">
                          <AlertDescription>
                            <strong>Ligne {error.row}:</strong> {error.error}
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
