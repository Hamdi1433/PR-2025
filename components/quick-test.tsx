"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabaseWrapper, isDemoMode } from "@/lib/supabase"
import { TestTube, CheckCircle, XCircle } from "lucide-react"

interface QuickTestProps {
  table: "contacts" | "users" | "opportunities" | "tasks"
  title: string
}

export function QuickTest({ table, title }: QuickTestProps) {
  const [testResult, setTestResult] = useState<{
    status: "idle" | "running" | "success" | "error"
    message: string
    count?: number
  }>({ status: "idle", message: "" })

  const runQuickTest = async () => {
    if (isDemoMode()) {
      setTestResult({ status: "error", message: "Tests non disponibles en mode démonstration" })
      return
    }

    setTestResult({ status: "running", message: "Test en cours..." })

    try {
      // Test de lecture
      const { data, error } = await supabaseWrapper.from(table).select("id").limit(5)

      if (error) throw error

      // Test d'écriture (insertion puis suppression)
      const testData = getTestData(table)
      const { data: insertData, error: insertError } = await supabaseWrapper
        .from(table)
        .insert([testData])
        .select()
        .single()

      if (insertError) throw insertError

      // Suppression immédiate
      const { error: deleteError } = await supabaseWrapper.from(table).delete().eq("id", insertData.id)

      if (deleteError) throw deleteError

      setTestResult({
        status: "success",
        message: "Lecture et écriture fonctionnelles",
        count: data?.length || 0,
      })
    } catch (error) {
      setTestResult({
        status: "error",
        message: error instanceof Error ? error.message : "Erreur inconnue",
      })
    }
  }

  const getTestData = (table: string) => {
    const timestamp = Date.now()
    switch (table) {
      case "contacts":
        return {
          first_name: "TestQuick",
          last_name: "Test",
          email: `quicktest.${timestamp}@example.com`,
          status: "prospect",
        }
      case "opportunities":
        return {
          title: `Test Quick ${timestamp}`,
          value: 1000,
          probability: 50,
          stage: "qualification",
          contact_id: "00000000-0000-0000-0000-000000000000", // ID fictif, sera rejeté
        }
      case "tasks":
        return {
          title: `Test Quick ${timestamp}`,
          priority: "medium",
          status: "todo",
        }
      case "users":
        return {
          email: `testuser.${timestamp}@example.com`,
          role: "conseiller",
          first_name: "Test",
          last_name: "User",
        }
      default:
        return {}
    }
  }

  const getStatusIcon = () => {
    switch (testResult.status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "running":
        return <TestTube className="h-4 w-4 text-blue-600 animate-pulse" />
      default:
        return <TestTube className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = () => {
    switch (testResult.status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">OK</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800">Erreur</Badge>
      case "running":
        return <Badge className="bg-blue-100 text-blue-800">Test...</Badge>
      default:
        return <Badge variant="outline">Non testé</Badge>
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          Test rapide - {title}
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          size="sm"
          variant="outline"
          onClick={runQuickTest}
          disabled={testResult.status === "running" || isDemoMode()}
          className="w-full"
        >
          <TestTube className="h-4 w-4 mr-2" />
          Tester CRUD
        </Button>

        {testResult.status !== "idle" && (
          <div className="flex items-center gap-2 text-sm">
            {getStatusIcon()}
            <span className={testResult.status === "error" ? "text-red-600" : "text-green-600"}>
              {testResult.message}
            </span>
            {testResult.count !== undefined && (
              <Badge variant="outline" className="ml-auto">
                {testResult.count} enregistrements
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Export par défaut pour compatibilité
export default QuickTest
