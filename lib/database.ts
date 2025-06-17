import { createClient } from "@supabase/supabase-js"
import type { Contact, DashboardStats } from "./types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

export class DatabaseService {
  private isConnected: boolean

  constructor() {
    this.isConnected = !!supabase
  }

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
      const { data, error } = await supabase!.from("contacts").update(updates).eq("id", id).select().single()

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

  async getDashboardStats(userId?: string): Promise<DashboardStats> {
    if (!this.isConnected) {
      return this.getMockDashboardStats()
    }

    try {
      // Récupérer les statistiques depuis Supabase
      const [contactsResult, proposalsResult, contractsResult, tasksResult] = await Promise.all([
        supabase!.from("contacts").select("*"),
        supabase!.from("propositions").select("*"),
        supabase!.from("contrats").select("*"),
        supabase!.from("taches").select("*"),
      ])

      const contacts = contactsResult.data || []
      const proposals = proposalsResult.data || []
      const contracts = contractsResult.data || []
      const tasks = tasksResult.data || []

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
        proposals: {
          total: proposals.length,
          pending: proposals.filter((p) => p.statut === "envoyee").length,
          accepted: proposals.filter((p) => p.statut === "acceptee").length,
          revenue: proposals.filter((p) => p.statut === "acceptee").reduce((sum, p) => sum + p.montant, 0),
        },
        contracts: {
          total: contracts.length,
          active: contracts.filter((c) => c.statut === "actif").length,
          revenue: contracts.filter((c) => c.statut === "actif").reduce((sum, c) => sum + c.montant_annuel, 0),
        },
        tasks: {
          total: tasks.length,
          pending: tasks.filter((t) => t.statut !== "terminee").length,
          overdue: tasks.filter((t) => {
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
        statut: "lead",
        score: 85,
        source: "Site web",
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
        statut: "prospect",
        score: 92,
        source: "Référence",
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
        statut: "client",
        score: 67,
        source: "LinkedIn",
        assigned_to: "conseiller-2",
        created_at: "2024-01-10T11:20:00Z",
        updated_at: "2024-01-25T13:10:00Z",
      },
    ]

    return assignedTo ? mockContacts.filter((c) => c.assigned_to === assignedTo) : mockContacts
  }

  private createMockContact(contact: Omit<Contact, "id" | "created_at" | "updated_at">): Contact {
    return {
      ...contact,
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
      proposals: {
        total: 34,
        pending: 8,
        accepted: 18,
        revenue: 125000,
      },
      contracts: {
        total: 18,
        active: 16,
        revenue: 245000,
      },
      tasks: {
        total: 42,
        pending: 15,
        overdue: 3,
      },
    }
  }

  isDbConnected(): boolean {
    return this.isConnected
  }
}

export const databaseService = new DatabaseService()
