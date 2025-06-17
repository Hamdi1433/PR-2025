"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle } from "lucide-react"
import { useDatabase } from "@/lib/supabase"

export function DatabaseStatus() {
  const { isConnected } = useDatabase()
  const [showAlert, setShowAlert] = useState(true)

  useEffect(() => {
    // Masquer l'alerte après 10 secondes si connecté
    if (isConnected) {
      const timer = setTimeout(() => setShowAlert(false), 10000)
      return () => clearTimeout(timer)
    }
  }, [isConnected])

  if (!showAlert) return null

  return (
    <div className="mb-6">
      {isConnected ? (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Base de données connectée</AlertTitle>
          <AlertDescription className="text-green-700">
            Votre CRM est connecté à Supabase et fonctionne avec des données réelles.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-800">Mode démonstration</AlertTitle>
          <AlertDescription className="text-orange-700">
            Supabase n'est pas configuré. Vous utilisez des données de démonstration.
            <br />
            Pour connecter votre base de données, configurez les variables d'environnement NEXT_PUBLIC_SUPABASE_URL et
            NEXT_PUBLIC_SUPABASE_ANON_KEY.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
