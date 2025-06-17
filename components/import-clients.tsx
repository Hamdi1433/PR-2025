"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { supabase, isDemoMode } from "@/lib/supabase"
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle, X } from "lucide-react"
import * as XLSX from "xlsx"

interface ImportResult {
  success: number
  errors: Array<{ row: number; error: string; data: any }>
  duplicates: number
}

interface ClientData {
  nom: string
  prenom: string
  email: string
  telephone?: string
  entreprise?: string
  adresse?: string
  ville?: string
  code_postal?: string
  pays?: string
  statut: "prospect" | "lead" | "client"
}

export function ImportClients({ onClose, onImportComplete }: { onClose: () => void; onImportComplete: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [preview, setPreview] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setResult(null)

    // Prévisualiser les premières lignes
    try {
      const data = await readFileData(selectedFile)
      setPreview(data.slice(0, 5)) // Afficher les 5 premières lignes
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
            // Traitement CSV
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
            // Traitement Excel
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

  const validateClientData = (
    data: any,
    rowIndex: number,
  ): { isValid: boolean; client?: ClientData; error?: string } => {
    // Mapping des colonnes possibles
    const fieldMappings = {
      nom: ["nom", "lastname", "last_name", "family_name"],
      prenom: ["prenom", "prénom", "firstname", "first_name", "given_name"],
      email: ["email", "e-mail", "mail", "adresse_email"],
      telephone: ["telephone", "téléphone", "phone", "tel", "mobile"],
      entreprise: ["entreprise", "company", "societe", "société"],
      adresse: ["adresse", "address", "rue"],
      ville: ["ville", "city"],
      code_postal: ["code_postal", "postal_code", "zip", "cp"],
      pays: ["pays", "country"],
      statut: ["statut", "status", "type"],
    }

    const client: any = {}

    // Mapper les champs
    Object.entries(fieldMappings).forEach(([field, possibleNames]) => {
      for (const name of possibleNames) {
        const value = data[name] || data[name.toLowerCase()] || data[name.toUpperCase()]
        if (value) {
          client[field] = value.toString().trim()
          break
        }
      }
    })

    // Validation des champs obligatoires
    if (!client.nom) {
      return { isValid: false, error: "Nom manquant" }
    }
    if (!client.prenom) {
      return { isValid: false, error: "Prénom manquant" }
    }
    if (!client.email) {
      return { isValid: false, error: "Email manquant" }
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(client.email)) {
      return { isValid: false, error: "Format d'email invalide" }
    }

    // Normaliser le statut
    if (client.statut) {
      const statut = client.statut.toLowerCase()
      if (["prospect", "lead", "client"].includes(statut)) {
        client.statut = statut
      } else {
        client.statut = "prospect"
      }
    } else {
      client.statut = "prospect"
    }

    // Valeurs par défaut
    client.pays = client.pays || "France"

    return { isValid: true, client: client as ClientData }
  }

  const processImport = async () => {
    if (!file || isDemoMode()) return

    setIsProcessing(true)
    setProgress(0)

    try {
      const data = await readFileData(file)
      const result: ImportResult = {
        success: 0,
        errors: [],
        duplicates: 0,
      }

      for (let i = 0; i < data.length; i++) {
        setProgress((i / data.length) * 100)

        const validation = validateClientData(data[i], i + 2) // +2 car ligne 1 = headers

        if (!validation.isValid) {
          result.errors.push({
            row: i + 2,
            error: validation.error!,
            data: data[i],
          })
          continue
        }

        // Vérifier les doublons
        const { data: existingClient } = await supabase
          .from("clients")
          .select("id")
          .eq("email", validation.client!.email)
          .single()

        if (existingClient) {
          result.duplicates++
          continue
        }

        // Insérer le client
        const { error } = await supabase.from("clients").insert([validation.client!])

        if (error) {
          result.errors.push({
            row: i + 2,
            error: error.message,
            data: data[i],
          })
        } else {
          result.success++
        }
      }

      setResult(result)
      setProgress(100)

      if (result.success > 0) {
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

  const downloadTemplate = () => {
    const template = [
      {
        nom: "Dupont",
        prenom: "Jean",
        email: "jean.dupont@example.com",
        telephone: "+33 1 23 45 67 89",
        entreprise: "Exemple Corp",
        adresse: "123 Rue Example",
        ville: "Paris",
        code_postal: "75001",
        pays: "France",
        statut: "prospect",
      },
    ]

    const ws = XLSX.utils.json_to_sheet(template)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Clients")
    XLSX.writeFile(wb, "template_import_clients.xlsx")
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between bg-premunia-gradient text-white">
          <CardTitle className="text-white">Import de Clients</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {isDemoMode() && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-700">
                L'import n'est pas disponible en mode démonstration.
              </AlertDescription>
            </Alert>
          )}

          {/* Télécharger le modèle */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">1. Télécharger le modèle</h3>
              <p className="text-sm text-muted-foreground">Utilisez ce modèle pour formater vos données correctement</p>
            </div>
            <Button
              variant="outline"
              onClick={downloadTemplate}
              className="border-premunia-400 text-premunia-600 hover:bg-premunia-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Télécharger le modèle
            </Button>
          </div>

          {/* Sélection du fichier */}
          <div>
            <h3 className="text-lg font-semibold mb-2">2. Sélectionner votre fichier</h3>
            <div className="border-2 border-dashed border-premunia-300 rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isDemoMode()}
              />
              <FileSpreadsheet className="h-12 w-12 text-premunia-400 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Glissez votre fichier ici ou cliquez pour sélectionner</p>
              <p className="text-sm text-muted-foreground mb-4">Formats supportés: CSV, XLSX, XLS</p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isDemoMode()}
                className="bg-premunia-gradient hover:opacity-90"
              >
                <Upload className="h-4 w-4 mr-2" />
                Sélectionner un fichier
              </Button>
            </div>
          </div>

          {/* Prévisualisation */}
          {preview.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">3. Prévisualisation</h3>
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-premunia-gradient-soft">
                      <tr>
                        {Object.keys(preview[0]).map((key) => (
                          <th key={key} className="px-4 py-2 text-left font-medium">
                            {key}
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
          {file && !result && (
            <div>
              <h3 className="text-lg font-semibold mb-2">4. Lancer l'import</h3>
              <div className="flex gap-4">
                <Button
                  onClick={processImport}
                  disabled={isProcessing || isDemoMode()}
                  className="bg-premunia-gradient hover:opacity-90"
                >
                  {isProcessing ? "Import en cours..." : "Importer les clients"}
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
                    <p className="text-sm text-green-700">Clients importés</p>
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
        </CardContent>
      </Card>
    </div>
  )
}
