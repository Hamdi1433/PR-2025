import { createClient } from "@supabase/supabase-js"
import type { Contact, Contrat, DashboardStats, ImportResult } from "./types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

export class DatabaseService {
  private isConnected: boolean

  constructor() {
    this.isConnected = !!supabase
  }

  // Contacts
  async getContacts(assignedTo?: string): Promise<Contact[]> {
    if (!this.isConnected) {
      return this.getMockContacts(assignedTo)
    }

    try {
      let query = supabase!.from("contacts").select("*")

      if (assignedTo) {
        query = query.eq("assigned_to", assignedTo)
      }

      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Erreur lors de la récupération des contacts:", error)
      return this.getMockContacts(assignedTo)
    }
  }

  async createContact(contact: Omit<Contact, "id" | "created_at" | "updated_at">): Promise<Contact> {
    if (!this.isConnected) {
      return this.createMockContact(contact)
    }

    try {
      const { data, error } = await supabase!.from("contacts").insert([contact]).select().single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Erreur lors de la création du contact:", error)
      return this.createMockContact(contact)
    }
  }

  async updateContact(id: string, updates: Partial<Contact>): Promise<Contact> {
    if (!this.isConnected) {
      return this.updateMockContact(id, updates)
    }

    try {
      const { data, error } = await supabase!
        .from("contacts")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Erreur lors de la mise à jour du contact:", error)
      return this.updateMockContact(id, updates)
    }
  }

  async deleteContact(id: string): Promise<boolean> {
    if (!this.isConnected) {
      return true
    }

    try {
      const { error } = await supabase!.from("contacts").delete().eq("id", id)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Erreur lors de la suppression du contact:", error)
      return false
    }
  }

  // Contrats
  async getContrats(assignedTo?: string): Promise<Contrat[]> {
    if (!this.isConnected) {
      return this.getMockContrats(assignedTo)
    }

    try {
      let query = supabase!.from("contrats").select("*")

      if (assignedTo) {
        query = query.eq("attribution", assignedTo)
      }

      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Erreur lors de la récupération des contrats:", error)
      return this.getMockContrats(assignedTo)
    }
  }

  async createContrat(contrat: Omit<Contrat, "id" | "created_at" | "updated_at">): Promise<Contrat> {
    if (!this.isConnected) {
      return this.createMockContrat(contrat)
    }

    try {
      const { data, error } = await supabase!.from("contrats").insert([contrat]).select().single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Erreur lors de la création du contrat:", error)
      return this.createMockContrat(contrat)
    }
  }

  // Import de données
  async importContacts(contacts: Omit<Contact, "id" | "created_at" | "updated_at">[]): Promise<ImportResult> {
    if (!this.isConnected) {
      return {
        success: contacts.length,
        errors: [],
        duplicates: 0,
      }
    }

    const result: ImportResult = {
      success: 0,
      errors: [],
      duplicates: 0,
    }

    for (let i = 0; i < contacts.length; i++) {
      try {
        // Vérifier les doublons par email
        const { data: existing } = await supabase!.from("contacts").select("id").eq("email", contacts[i].email).single()

        if (existing) {
          result.duplicates++
          continue
        }

        // Insérer le contact
        const { error } = await supabase!.from("contacts").insert([contacts[i]])

        if (error) {
          result.errors.push({
            row: i + 2,
            error: error.message,
            data: contacts[i],
          })
        } else {
          result.success++
        }
      } catch (error) {
        result.errors.push({
          row: i + 2,
          error: error instanceof Error ? error.message : "Erreur inconnue",
          data: contacts[i],
        })
      }
    }

    return result
  }

  async importContrats(contrats: Omit<Contrat, "id" | "created_at" | "updated_at">[]): Promise<ImportResult> {
    if (!this.isConnected) {
      return {
        success: contrats.length,
        errors: [],
        duplicates: 0,
      }
    }

    const result: ImportResult = {
      success: 0,
      errors: [],
      duplicates: 0,
    }

    for (let i = 0; i < contrats.length; i++) {
      try {
        // Vérifier les doublons par numéro de contrat
        const { data: existing } = await supabase!
          .from("contrats")
          .select("id")
          .eq("numero_contrat", contrats[i].numero_contrat)
          .single()

        if (existing) {
          result.duplicates++
          continue
        }

        // Insérer le contrat
        const { error } = await supabase!.from("contrats").insert([contrats[i]])

        if (error) {
          result.errors.push({
            row: i + 2,
            error: error.message,
            data: contrats[i],
          })
        } else {
          result.success++
        }
      } catch (error) {
        result.errors.push({
          row: i + 2,
          error: error instanceof Error ? error.message : "Erreur inconnue",
          data: contrats[i],
        })
      }
    }

    return result
  }

  async getDashboardStats(userId?: string): Promise<DashboardStats> {
    if (!this.isConnected) {
      return this.getMockDashboardStats()
    }

    try {
      const [contactsResult, contratsResult, propositionsResult, tachesResult] = await Promise.all([
        supabase!.from("contacts").select("*"),
        supabase!.from("contrats").select("*"),
        supabase!.from("propositions").select("*"),
        supabase!.from("taches").select("*"),
      ])

      const contacts = contactsResult.data || []
      const contrats = contratsResult.data || []
      const propositions = propositionsResult.data || []
      const taches = tachesResult.data || []

      return {
        contacts: {
          total: contacts.length,
          prospects: contacts.filter((c) => c.statut === "prospect").length,
          leads: contacts.filter((c) => c.statut === "lead").length,
          clients: contacts.filter((c) => c.statut === "client").length,
          newThisMonth: contacts.filter((c) => {
            const created = new Date(c.created_at)
            const now = new Date()
            return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
          }).length,
        },
        contrats: {
          total: contrats.length,
          actifs: contrats.filter((c) => c.statut === "actif").length,
          revenue_mensuel: contrats
            .filter((c) => c.statut === "actif")
            .reduce((sum, c) => sum + c.cotisation_mensuelle, 0),
          revenue_annuel: contrats
            .filter((c) => c.statut === "actif")
            .reduce((sum, c) => sum + c.cotisation_annuelle, 0),
          commission_mensuelle: contrats
            .filter((c) => c.statut === "actif")
            .reduce((sum, c) => sum + c.commission_mensuelle, 0),
          commission_annuelle: contrats
            .filter((c) => c.statut === "actif")
            .reduce((sum, c) => sum + c.commission_annuelle, 0),
        },
        propositions: {
          total: propositions.length,
          en_attente: propositions.filter((p) => p.statut === "envoyee").length,
          acceptees: propositions.filter((p) => p.statut === "acceptee").length,
          revenue: propositions.filter((p) => p.statut === "acceptee").reduce((sum, p) => sum + p.montant, 0),
        },
        taches: {
          total: taches.length,
          en_attente: taches.filter((t) => t.statut !== "terminee").length,
          en_retard: taches.filter((t) => {
            if (!t.date_echeance || t.statut === "terminee") return false
            return new Date(t.date_echeance) < new Date()
          }).length,
        },
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error)
      return this.getMockDashboardStats()
    }
  }

  // Méthodes mock pour le mode démo
  private getMockContacts(assignedTo?: string): Contact[] {
    const mockContacts: Contact[] = [
      {
        id: "1",
        nom: "Dubois",
        prenom: "Marie",
        email: "marie.dubois@email.com",
        telephone: "0123456789",
        entreprise: "TechCorp",
        poste: "Directrice Marketing",
        ville: "Paris",
        pays: "France",
        statut: "lead",
        score: 85,
        origine: "Site web",
        attribution: "conseiller-1",
        cpl: "50",
        date_creation: "2024-01-15",
        date_signature: "2024-01-20",
        assigned_to: "conseiller-1",
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-20T14:30:00Z",
      },
      {
        id: "2",
        nom: "Martin",
        prenom: "Jean",
        email: "jean.martin@email.com",
        telephone: "0123456790",
        entreprise: "InnovSoft",
        poste: "CEO",
        ville: "Lyon",
        pays: "France",
        statut: "prospect",
        score: 92,
        origine: "Référence",
        attribution: "conseiller-1",
        cpl: "75",
        date_creation: "2024-01-18",
        assigned_to: "conseiller-1",
        created_at: "2024-01-18T09:15:00Z",
        updated_at: "2024-01-22T16:45:00Z",
      },
      {
        id: "3",
        nom: "Laurent",
        prenom: "Sophie",
        email: "sophie.laurent@email.com",
        telephone: "0123456791",
        entreprise: "DigitalPro",
        poste: "Responsable IT",
        ville: "Marseille",
        pays: "France",
        statut: "client",
        score: 67,
        origine: "LinkedIn",
        attribution: "conseiller-2",
        cpl: "30",
        date_creation: "2024-01-10",
        date_signature: "2024-01-25",
        assigned_to: "conseiller-2",
        created_at: "2024-01-10T11:20:00Z",
        updated_at: "2024-01-25T13:10:00Z",
      },
    ]

    return assignedTo ? mockContacts.filter((c) => c.assigned_to === assignedTo) : mockContacts
  }

  private getMockContrats(assignedTo?: string): Contrat[] {
    const mockContrats: Contrat[] = [
      {
        id: "1",
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
        created_at: "2024-01-20T10:00:00Z",
        updated_at: "2024-01-20T10:00:00Z",
      },
      {
        id: "2",
        numero_contrat: "CONT-2024-002",
        contact_id: "3",
        compagnie: "Mutuelle Santé",
        statut: "actif",
        attribution: "conseiller-2",
        pays: "France",
        date_signature: "2024-01-25",
        date_effet: "2024-02-15",
        date_fin: "2025-02-14",
        cotisation_mensuelle: 200,
        cotisation_annuelle: 2400,
        commission_mensuelle: 60,
        commission_annuelle: 720,
        commission_annuelle_premiere_annee: 800,
        annee_recurrente: 720,
        annee_recue: 720,
        charge: 75,
        depenses: 40,
        created_at: "2024-01-25T13:10:00Z",
        updated_at: "2024-01-25T13:10:00Z",
      },
    ]

    return assignedTo ? mockContrats.filter((c) => c.attribution === assignedTo) : mockContrats
  }

  private createMockContact(contact: Omit<Contact, "id" | "created_at" | "updated_at">): Contact {
    return {
      ...contact,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }

  private createMockContrat(contrat: Omit<Contrat, "id" | "created_at" | "updated_at">): Contrat {
    return {
      ...contrat,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }

  private updateMockContact(id: string, updates: Partial<Contact>): Contact {
    const mockContact = this.getMockContacts().find((c) => c.id === id)
    if (!mockContact) {
      throw new Error("Contact non trouvé")
    }
    return {
      ...mockContact,
      ...updates,
      updated_at: new Date().toISOString(),
    }
  }

  private getMockDashboardStats(): DashboardStats {
    return {
      contacts: {
        total: 156,
        prospects: 45,
        leads: 23,
        clients: 88,
        newThisMonth: 12,
      },
      contrats: {
        total: 45,
        actifs: 42,
        revenue_mensuel: 15750,
        revenue_annuel: 189000,
        commission_mensuelle: 4725,
        commission_annuelle: 56700,
      },
      propositions: {
        total: 34,
        en_attente: 8,
        acceptees: 18,
        revenue: 125000,
      },
      taches: {
        total: 42,
        en_attente: 15,
        en_retard: 3,
      },
    }
  }

  isDbConnected(): boolean {
    return this.isConnected
  }
}

export const databaseService = new DatabaseService()
