"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Database } from "lucide-react"
import { hasSupabaseConfig, checkTablesExist } from "@/lib/supabase"

export function EnvWarning() {
  const [showWarning, setShowWarning] = useState(false)
  const [warningType, setWarningType] = useState<"config" | "tables" | null>(null)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    async function checkSetup() {
      if (!hasSupabaseConfig) {
        setWarningType("config")
        setShowWarning(true)
        setIsChecking(false)
        return
      }

      // Vérifier si les tables existent
      const tablesExist = await checkTablesExist()
      if (!tablesExist) {
        setWarningType("tables")
        setShowWarning(true)
      }

      setIsChecking(false)
    }

    checkSetup()
  }, [])

  if (isChecking) {
    return (
      <Alert className="mb-6 border-blue-200 bg-blue-50">
        <Database className="h-4 w-4 text-blue-600 animate-spin" />
        <AlertTitle className="text-blue-800">Vérification de la configuration...</AlertTitle>
        <AlertDescription className="text-blue-700">
          Vérification de la connexion à la base de données en cours...
        </AlertDescription>
      </Alert>
    )
  }

  if (!showWarning) return null

  if (warningType === "config") {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Configuration Supabase manquante</AlertTitle>
        <AlertDescription>
          <p>Les variables d'environnement Supabase ne sont pas configurées.</p>
          <p className="mt-2">Vous utilisez actuellement le mode démonstration.</p>
          <p className="mt-2">Pour utiliser votre base de données Supabase :</p>
          <ul className="list-disc pl-5 mt-1">
            <li>Configurez NEXT_PUBLIC_SUPABASE_URL</li>
            <li>Configurez NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
            <li>Redéployez votre application</li>
          </ul>
        </AlertDescription>
      </Alert>
    )
  }

  if (warningType === "tables") {
    return (
      <Alert className="mb-6 border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertTitle className="text-orange-800">Tables de base de données manquantes</AlertTitle>
        <AlertDescription className="text-orange-700">
          <p>Supabase est configuré mais les tables du CRM n'existent pas encore.</p>
          <p className="mt-2">Vous utilisez actuellement le mode démonstration.</p>
          <p className="mt-2">Pour créer les tables :</p>
          <ol className="list-decimal pl-5 mt-1">
            <li>Allez dans l'éditeur SQL de Supabase</li>
            <li>Exécutez les scripts de création des tables</li>
            <li>Rechargez cette page</li>
          </ol>
        </AlertDescription>
      </Alert>
    )
  }

  return null
}
