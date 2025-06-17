"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useDatabase } from "@/hooks/use-database"
import { Lock, Mail, Database, Wifi, WifiOff } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { isConnected } = useDatabase()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulation de connexion
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Redirection basée sur l'email
    if (email.includes("admin")) {
      router.push("/admin")
    } else if (email.includes("gestionnaire")) {
      router.push("/gestionnaire")
    } else {
      router.push("/conseiller")
    }
  }

  const handleDemoLogin = (role: "admin" | "conseiller" | "gestionnaire") => {
    setLoading(true)
    setTimeout(() => {
      router.push(`/${role}`)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-violet-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo et titre */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-violet-600 bg-clip-text text-transparent">
            Premunia CRM
          </h1>
          <p className="text-gray-600 mt-2">Connectez-vous à votre espace</p>
        </div>

        {/* Statut de connexion */}
        <div className="flex items-center justify-center space-x-2">
          {isConnected ? (
            <>
              <Wifi className="h-4 w-4 text-green-600" />
              <Badge variant="outline" className="text-green-600 border-green-200">
                <Database className="h-3 w-3 mr-1" />
                Base de données connectée
              </Badge>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-orange-600" />
              <Badge variant="outline" className="text-orange-600 border-orange-200">
                Mode démonstration
              </Badge>
            </>
          )}
        </div>

        {/* Formulaire de connexion */}
        <Card>
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Connexion...
                  </>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Accès démo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Accès Démonstration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full" onClick={() => handleDemoLogin("admin")} disabled={loading}>
              Accès Administrateur
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleDemoLogin("conseiller")}
              disabled={loading}
            >
              Accès Conseiller
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleDemoLogin("gestionnaire")}
              disabled={loading}
            >
              Accès Gestionnaire
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
