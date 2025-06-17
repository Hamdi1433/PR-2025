"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Settings, Database, Bell, User } from "lucide-react"

export default function ParametresPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Paramètres</h2>
        <p className="text-muted-foreground">Configurez votre système CRM</p>
      </div>

      <div className="grid gap-6">
        {/* Paramètres généraux */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Paramètres Généraux
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nom_entreprise">Nom de l'entreprise</Label>
                <Input id="nom_entreprise" placeholder="Votre entreprise" />
              </div>
              <div>
                <Label htmlFor="devise">Devise par défaut</Label>
                <Input id="devise" value="EUR" />
              </div>
            </div>
            <div>
              <Label htmlFor="fuseau_horaire">Fuseau horaire</Label>
              <Input id="fuseau_horaire" value="Europe/Paris" />
            </div>
            <Button>Sauvegarder</Button>
          </CardContent>
        </Card>

        {/* Paramètres de notification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Notifications par email</Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir des notifications par email pour les nouvelles opportunités
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Rappels de tâches</Label>
                <p className="text-sm text-muted-foreground">Recevoir des rappels pour les tâches à échéance</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Rapports hebdomadaires</Label>
                <p className="text-sm text-muted-foreground">Recevoir un rapport hebdomadaire de vos performances</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Paramètres utilisateur */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profil Utilisateur
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prenom_user">Prénom</Label>
                <Input id="prenom_user" placeholder="Votre prénom" />
              </div>
              <div>
                <Label htmlFor="nom_user">Nom</Label>
                <Input id="nom_user" placeholder="Votre nom" />
              </div>
            </div>
            <div>
              <Label htmlFor="email_user">Email</Label>
              <Input id="email_user" type="email" placeholder="votre@email.com" />
            </div>
            <Button>Mettre à jour le profil</Button>
          </CardContent>
        </Card>

        {/* Paramètres de base de données */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Base de Données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">Configuration Supabase</h4>
              <p className="text-sm text-blue-700 mt-1">
                Votre CRM est connecté à Supabase. Assurez-vous que vos variables d'environnement sont correctement
                configurées.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Variables d'environnement requises :</Label>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• NEXT_PUBLIC_SUPABASE_URL</li>
                <li>• NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
              </ul>
            </div>
            <Button variant="outline">Tester la connexion</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
