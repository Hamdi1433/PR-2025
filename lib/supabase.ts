import { createClient } from "@supabase/supabase-js"

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Vérification de la configuration
export const hasSupabaseConfig = !!(supabaseUrl && supabaseAnonKey)

// Client Supabase
export const supabase = hasSupabaseConfig ? createClient(supabaseUrl!, supabaseAnonKey!) : null

// Types TypeScript pour la base de données
export interface Utilisateur {
  id: string
  email: string
  nom: string
  prenom: string
  role_id: string
  avatar_url?: string
  telephone?: string
  statut: "actif" | "inactif" | "suspendu"
  derniere_connexion?: string
  date_creation: string
  date_modification: string
  preferences: Record<string, any>
  objectifs: Record<string, any>
  roles?: Role
}

export interface Role {
  id: string
  nom: string
  description?: string
  permissions: Record<string, any>
  date_creation: string
}

export interface Contact {
  id: string
  nom: string
  prenom: string
  email: string
  telephone?: string
  telephone_mobile?: string
  entreprise?: string
  poste?: string
  adresse?: string
  ville?: string
  code_postal?: string
  pays: string
  statut: "prospect" | "lead" | "client" | "inactif"
  score: number
  source?: string
  conseiller_id?: string
  date_creation: string
  date_modification: string
  date_derniere_interaction?: string
  tags?: string[]
  notes?: string
  consentement_rgpd: boolean
  utilisateurs?: Utilisateur
}

export interface Proposition {
  id: string
  numero: string
  titre: string
  description?: string
  montant_ht?: number
  montant_ttc?: number
  taux_tva: number
  statut: "brouillon" | "envoyee" | "en_attente" | "acceptee" | "refusee" | "expiree"
  probabilite: number
  contact_id: string
  conseiller_id?: string
  date_creation: string
  date_envoi?: string
  date_expiration?: string
  date_signature?: string
  document_url?: string
  conditions_particulieres?: string
  contacts?: Contact
  utilisateurs?: Utilisateur
}

export interface Contrat {
  id: string
  numero: string
  titre: string
  type_contrat: string
  montant_mensuel?: number
  montant_annuel?: number
  duree_mois?: number
  statut: "actif" | "suspendu" | "resilie" | "expire"
  contact_id: string
  proposition_id?: string
  conseiller_id?: string
  date_signature: string
  date_effet: string
  date_echeance?: string
  date_resiliation?: string
  document_signe_url?: string
  conditions_generales?: string
  date_creation: string
  contacts?: Contact
  propositions?: Proposition
  utilisateurs?: Utilisateur
}

export interface Tache {
  id: string
  titre: string
  description?: string
  priorite: "basse" | "moyenne" | "haute" | "urgente"
  statut: "a_faire" | "en_cours" | "terminee" | "annulee"
  assignee_id?: string
  createur_id?: string
  contact_id?: string
  proposition_id?: string
  contrat_id?: string
  date_creation: string
  date_echeance?: string
  date_completion?: string
  rappel_avant_heures: number
  rappel_envoye: boolean
  contacts?: Contact
  assignee?: Utilisateur
  createur?: Utilisateur
}

export interface Ticket {
  id: string
  numero: string
  sujet: string
  description: string
  type_ticket: "reclamation" | "demande_info" | "modification_contrat" | "resiliation" | "remboursement" | "technique"
  priorite: "basse" | "normale" | "haute" | "urgente"
  statut: "nouveau" | "en_cours" | "en_attente_client" | "resolu" | "ferme"
  contact_id: string
  contrat_id?: string
  assignee_id?: string
  date_creation: string
  date_premiere_reponse?: string
  date_resolution?: string
  date_fermeture?: string
  canal: "email" | "telephone" | "chat" | "courrier" | "site_web"
  satisfaction_client?: number
  contacts?: Contact
  contrats?: Contrat
  assignee?: Utilisateur
}

export interface Campagne {
  id: string
  nom: string
  description?: string
  type_campagne: "email" | "sms" | "mixte"
  statut: "brouillon" | "active" | "pausee" | "terminee"
  declencheur: Record<string, any>
  conditions: Record<string, any>
  actions: Record<string, any>
  createur_id?: string
  date_creation: string
  date_activation?: string
  date_fin?: string
  nb_contacts_cibles: number
  nb_emails_envoyes: number
  nb_ouvertures: number
  nb_clics: number
  nb_conversions: number
  createur?: Utilisateur
}

export interface Workflow {
  id: string
  nom: string
  description?: string
  declencheur: Record<string, any>
  etapes: Record<string, any>
  conditions_sortie: Record<string, any>
  statut: "inactif" | "actif" | "pause"
  createur_id?: string
  date_creation: string
  date_activation?: string
  nb_contacts_actifs: number
  nb_contacts_termines: number
  createur?: Utilisateur
}

export interface Objectif {
  id: string
  nom: string
  description?: string
  type_objectif: "contacts" | "propositions" | "contrats" | "ca" | "taches"
  valeur_cible: number
  valeur_actuelle: number
  unite?: string
  periode_debut: string
  periode_fin: string
  utilisateur_id?: string
  equipe_id?: string
  statut: "actif" | "atteint" | "echoue" | "annule"
  date_creation: string
  utilisateurs?: Utilisateur
}

// Fonctions utilitaires pour la base de données
export class DatabaseService {
  // Utilisateurs
  static async getUtilisateurs() {
    if (!supabase) throw new Error("Supabase non configuré")

    const { data, error } = await supabase
      .from("utilisateurs")
      .select(`
        *,
        roles (*)
      `)
      .order("date_creation", { ascending: false })

    if (error) throw error
    return data as Utilisateur[]
  }

  static async getUtilisateurById(id: string) {
    if (!supabase) throw new Error("Supabase non configuré")

    const { data, error } = await supabase
      .from("utilisateurs")
      .select(`
        *,
        roles (*)
      `)
      .eq("id", id)
      .single()

    if (error) throw error
    return data as Utilisateur
  }

  // Contacts
  static async getContacts(conseillerId?: string) {
    if (!supabase) throw new Error("Supabase non configuré")

    let query = supabase.from("contacts").select(`
        *,
        utilisateurs (nom, prenom, email)
      `)

    if (conseillerId) {
      query = query.eq("conseiller_id", conseillerId)
    }

    const { data, error } = await query.order("date_creation", { ascending: false })

    if (error) throw error
    return data as Contact[]
  }

  static async createContact(contact: Partial<Contact>) {
    if (!supabase) throw new Error("Supabase non configuré")

    const { data, error } = await supabase.from("contacts").insert([contact]).select().single()

    if (error) throw error
    return data as Contact
  }

  static async updateContact(id: string, updates: Partial<Contact>) {
    if (!supabase) throw new Error("Supabase non configuré")

    const { data, error } = await supabase
      .from("contacts")
      .update({ ...updates, date_modification: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data as Contact
  }

  static async deleteContact(id: string) {
    if (!supabase) throw new Error("Supabase non configuré")

    const { error } = await supabase.from("contacts").delete().eq("id", id)

    if (error) throw error
  }

  // Propositions
  static async getPropositions(conseillerId?: string) {
    if (!supabase) throw new Error("Supabase non configuré")

    let query = supabase.from("propositions").select(`
        *,
        contacts (nom, prenom, email, entreprise),
        utilisateurs (nom, prenom, email)
      `)

    if (conseillerId) {
      query = query.eq("conseiller_id", conseillerId)
    }

    const { data, error } = await query.order("date_creation", { ascending: false })

    if (error) throw error
    return data as Proposition[]
  }

  // Contrats
  static async getContrats(conseillerId?: string) {
    if (!supabase) throw new Error("Supabase non configuré")

    let query = supabase.from("contrats").select(`
        *,
        contacts (nom, prenom, email, entreprise),
        propositions (titre, numero),
        utilisateurs (nom, prenom, email)
      `)

    if (conseillerId) {
      query = query.eq("conseiller_id", conseillerId)
    }

    const { data, error } = await query.order("date_creation", { ascending: false })

    if (error) throw error
    return data as Contrat[]
  }

  // Tâches
  static async getTaches(assigneeId?: string) {
    if (!supabase) throw new Error("Supabase non configuré")

    let query = supabase.from("taches").select(`
        *,
        contacts (nom, prenom, email),
        assignee:utilisateurs!assignee_id (nom, prenom, email),
        createur:utilisateurs!createur_id (nom, prenom, email)
      `)

    if (assigneeId) {
      query = query.eq("assignee_id", assigneeId)
    }

    const { data, error } = await query.order("date_creation", { ascending: false })

    if (error) throw error
    return data as Tache[]
  }

  // Tickets
  static async getTickets(assigneeId?: string) {
    if (!supabase) throw new Error("Supabase non configuré")

    let query = supabase.from("tickets").select(`
        *,
        contacts (nom, prenom, email, telephone),
        contrats (numero, titre),
        assignee:utilisateurs!assignee_id (nom, prenom, email)
      `)

    if (assigneeId) {
      query = query.eq("assignee_id", assigneeId)
    }

    const { data, error } = await query.order("date_creation", { ascending: false })

    if (error) throw error
    return data as Ticket[]
  }

  // Campagnes
  static async getCampagnes() {
    if (!supabase) throw new Error("Supabase non configuré")

    const { data, error } = await supabase
      .from("campagnes")
      .select(`
        *,
        createur:utilisateurs!createur_id (nom, prenom, email)
      `)
      .order("date_creation", { ascending: false })

    if (error) throw error
    return data as Campagne[]
  }

  // Workflows
  static async getWorkflows() {
    if (!supabase) throw new Error("Supabase non configuré")

    const { data, error } = await supabase
      .from("workflows")
      .select(`
        *,
        createur:utilisateurs!createur_id (nom, prenom, email)
      `)
      .order("date_creation", { ascending: false })

    if (error) throw error
    return data as Workflow[]
  }

  // Objectifs
  static async getObjectifs(utilisateurId?: string) {
    if (!supabase) throw new Error("Supabase non configuré")

    let query = supabase.from("objectifs").select(`
        *,
        utilisateurs (nom, prenom, email)
      `)

    if (utilisateurId) {
      query = query.eq("utilisateur_id", utilisateurId)
    }

    const { data, error } = await query.order("date_creation", { ascending: false })

    if (error) throw error
    return data as Objectif[]
  }

  // Statistiques
  static async getStatistiques(utilisateurId?: string) {
    if (!supabase) throw new Error("Supabase non configuré")

    const queries = []

    // Contacts
    let contactsQuery = supabase.from("contacts").select("id, statut, score")
    if (utilisateurId) contactsQuery = contactsQuery.eq("conseiller_id", utilisateurId)
    queries.push(contactsQuery)

    // Propositions
    let propositionsQuery = supabase.from("propositions").select("id, statut, montant_ttc")
    if (utilisateurId) propositionsQuery = propositionsQuery.eq("conseiller_id", utilisateurId)
    queries.push(propositionsQuery)

    // Contrats
    let contratsQuery = supabase.from("contrats").select("id, statut, montant_annuel")
    if (utilisateurId) contratsQuery = contratsQuery.eq("conseiller_id", utilisateurId)
    queries.push(contratsQuery)

    // Tâches
    let tachesQuery = supabase.from("taches").select("id, statut, priorite")
    if (utilisateurId) tachesQuery = tachesQuery.eq("assignee_id", utilisateurId)
    queries.push(tachesQuery)

    const results = await Promise.all(queries)

    const [contactsRes, propositionsRes, contratsRes, tachesRes] = results

    return {
      contacts: contactsRes.data || [],
      propositions: propositionsRes.data || [],
      contrats: contratsRes.data || [],
      taches: tachesRes.data || [],
    }
  }
}

// État pour savoir si nous sommes en mode démo (sera mis à jour dynamiquement)
let isDemoModeState = !hasSupabaseConfig

// Fonction pour vérifier si les tables existent
export async function checkTablesExist(): Promise<boolean> {
  if (!supabase) return false

  try {
    const { data, error } = await supabase.from("contacts").select("id").limit(1)
    return !error
  } catch (error) {
    console.log("Tables not found, switching to demo mode")
    return false
  }
}

// Fonction pour obtenir le mode actuel
export function isDemoMode(): boolean {
  return isDemoModeState
}

// Fonction pour forcer le mode démo
export function setDemoMode(demo: boolean) {
  isDemoModeState = demo
}

// Wrapper pour les requêtes Supabase avec fallback vers le mode démo
export const supabaseWrapper = {
  from: (table: string) => {
    if (isDemoModeState || !supabase) {
      return createMockTable(table)
    }

    const originalTable = supabase.from(table)

    // Wrapper pour détecter les erreurs de table manquante
    return {
      select: (columns?: string) => {
        const query = originalTable.select(columns)
        return {
          ...query,
          order: (column: string, options?: any) => ({
            ...query.order(column, options),
            limit: async (count: number) => {
              try {
                const result = await query.order(column, options).limit(count)
                if (result.error && result.error.message.includes("does not exist")) {
                  setDemoMode(true)
                  return { data: getDemoData(table, count), error: null }
                }
                return result
              } catch (error) {
                setDemoMode(true)
                return { data: getDemoData(table, count), error: null }
              }
            },
          }),
          limit: async (count: number) => {
            try {
              const result = await query.limit(count)
              if (result.error && result.error.message.includes("does not exist")) {
                setDemoMode(true)
                return { data: getDemoData(table, count), error: null }
              }
              return result
            } catch (error) {
              setDemoMode(true)
              return { data: getDemoData(table, count), error: null }
            }
          },
          eq: (column: string, value: any) => ({
            then: async (callback: any) => {
              try {
                const result = await query.eq(column, value)
                if (result.error && result.error.message.includes("does not exist")) {
                  setDemoMode(true)
                  return callback({
                    data: getDemoData(table).filter((item: any) => item[column] === value),
                    error: null,
                  })
                }
                return callback(result)
              } catch (error) {
                setDemoMode(true)
                return callback({ data: getDemoData(table).filter((item: any) => item[column] === value), error: null })
              }
            },
          }),
          then: async (callback: any) => {
            try {
              const result = await query
              if (result.error && result.error.message.includes("does not exist")) {
                setDemoMode(true)
                return callback({ data: getDemoData(table), error: null })
              }
              return callback(result)
            } catch (error) {
              setDemoMode(true)
              return callback({ data: getDemoData(table), error: null })
            }
          },
        }
      },
      insert: async (data: any) => {
        if (isDemoModeState) {
          return { data: null, error: null }
        }
        try {
          const result = await originalTable.insert(data)
          if (result.error && result.error.message.includes("does not exist")) {
            setDemoMode(true)
            return { data: null, error: null }
          }
          return result
        } catch (error) {
          setDemoMode(true)
          return { data: null, error: null }
        }
      },
      update: (data: any) => ({
        eq: async (column: string, value: any) => {
          if (isDemoModeState) {
            return { data: null, error: null }
          }
          try {
            const result = await originalTable.update(data).eq(column, value)
            if (result.error && result.error.message.includes("does not exist")) {
              setDemoMode(true)
              return { data: null, error: null }
            }
            return result
          } catch (error) {
            setDemoMode(true)
            return { data: null, error: null }
          }
        },
      }),
      delete: () => ({
        eq: async (column: string, value: any) => {
          if (isDemoModeState) {
            return { data: null, error: null }
          }
          try {
            const result = await originalTable.delete().eq(column, value)
            if (result.error && result.error.message.includes("does not exist")) {
              setDemoMode(true)
              return { data: null, error: null }
            }
            return result
          } catch (error) {
            setDemoMode(true)
            return { data: null, error: null }
          }
        },
      }),
    }
  },
}

// Client mock pour le mode démo
function createMockTable(table: string) {
  return {
    select: (columns?: string) => ({
      order: (column: string, options?: any) => ({
        limit: (count: number) =>
          Promise.resolve({
            data: getDemoData(table, count),
            error: null,
          }),
      }),
      limit: (count: number) =>
        Promise.resolve({
          data: getDemoData(table, count),
          error: null,
        }),
      eq: (column: string, value: any) => ({
        then: (callback: any) =>
          callback({
            data: getDemoData(table).filter((item: any) => item[column] === value),
            error: null,
          }),
      }),
      then: (callback: any) =>
        callback({
          data: getDemoData(table),
          error: null,
        }),
    }),
    insert: (data: any) => Promise.resolve({ data: null, error: null }),
    update: (data: any) => ({
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
    }),
    delete: () => ({
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
    }),
  }
}

// Données de démonstration étendues
function getDemoData(table: string, limit?: number) {
  const demoData: Record<string, any[]> = {
    contacts: [
      {
        id: "1",
        nom: "Dupont",
        prenom: "Jean",
        email: "jean.dupont@techcorp.fr",
        telephone: "+33 1 23 45 67 89",
        entreprise: "TechCorp Solutions",
        adresse: "123 Rue de la Technologie",
        ville: "Paris",
        code_postal: "75001",
        pays: "France",
        statut: "client",
        score: 85,
        date_creation: "2024-01-15T10:00:00Z",
        date_modification: "2024-01-15T10:00:00Z",
      },
      {
        id: "2",
        nom: "Martin",
        prenom: "Marie",
        email: "marie.martin@innovsoft.com",
        telephone: "+33 4 56 78 90 12",
        entreprise: "InnovSoft",
        adresse: "456 Avenue de l'Innovation",
        ville: "Lyon",
        code_postal: "69000",
        pays: "France",
        statut: "prospect",
        score: 65,
        date_creation: "2024-01-14T09:00:00Z",
        date_modification: "2024-01-14T09:00:00Z",
      },
      {
        id: "3",
        nom: "Bernard",
        prenom: "Pierre",
        email: "pierre.bernard@datasys.fr",
        telephone: "+33 4 91 23 45 67",
        entreprise: "DataSys Analytics",
        adresse: "789 Boulevard des Données",
        ville: "Marseille",
        code_postal: "13000",
        pays: "France",
        statut: "lead",
        score: 45,
        date_creation: "2024-01-13T14:00:00Z",
        date_modification: "2024-01-13T14:00:00Z",
      },
    ],
    utilisateurs: [
      {
        id: "1",
        email: "admin@premunia.com",
        nom: "Admin",
        prenom: "Super",
        role_id: "1",
        statut: "actif",
        date_creation: "2024-01-01T00:00:00Z",
        date_modification: "2024-01-01T00:00:00Z",
        preferences: {},
        objectifs: {},
        roles: { id: "1", nom: "admin", description: "Administrateur", permissions: {} },
      },
      {
        id: "2",
        email: "conseiller@premunia.com",
        nom: "Conseiller",
        prenom: "Test",
        role_id: "2",
        statut: "actif",
        date_creation: "2024-01-01T00:00:00Z",
        date_modification: "2024-01-01T00:00:00Z",
        preferences: {},
        objectifs: {},
        roles: { id: "2", nom: "conseiller", description: "Conseiller", permissions: {} },
      },
    ],
    propositions: [
      {
        id: "1",
        numero: "PROP-2024-001",
        titre: "Refonte système CRM",
        description: "Migration complète du système CRM existant vers une solution moderne",
        montant_ht: 62500,
        montant_ttc: 75000,
        taux_tva: 20,
        statut: "envoyee",
        probabilite: 85,
        contact_id: "1",
        date_creation: "2024-01-15T10:00:00Z",
        date_expiration: "2024-03-15",
        contacts: {
          id: "1",
          nom: "Dupont",
          prenom: "Jean",
          entreprise: "TechCorp Solutions",
        },
      },
    ],
    contrats: [
      {
        id: "1",
        numero: "CONT-2024-001",
        titre: "Maintenance CRM TechCorp",
        type_contrat: "maintenance",
        montant_mensuel: 2500,
        montant_annuel: 30000,
        duree_mois: 12,
        statut: "actif",
        contact_id: "1",
        date_signature: "2024-01-20",
        date_effet: "2024-02-01",
        date_echeance: "2025-01-31",
        date_creation: "2024-01-20T10:00:00Z",
        contacts: {
          id: "1",
          nom: "Dupont",
          prenom: "Jean",
          entreprise: "TechCorp Solutions",
        },
      },
    ],
    taches: [
      {
        id: "1",
        titre: "Appel de suivi - TechCorp",
        description: "Appeler Jean Dupont pour faire le point sur le projet CRM",
        priorite: "haute",
        statut: "a_faire",
        date_echeance: "2024-01-25",
        contact_id: "1",
        date_creation: "2024-01-15T10:00:00Z",
        rappel_avant_heures: 24,
        rappel_envoye: false,
        contacts: {
          id: "1",
          nom: "Dupont",
          prenom: "Jean",
          entreprise: "TechCorp Solutions",
        },
      },
    ],
    tickets: [
      {
        id: "1",
        numero: "TICK-2024-001",
        sujet: "Problème de connexion CRM",
        description: "Impossible de se connecter au système CRM depuis ce matin",
        type_ticket: "technique",
        priorite: "haute",
        statut: "nouveau",
        contact_id: "1",
        date_creation: "2024-01-22T09:00:00Z",
        canal: "email",
        contacts: {
          id: "1",
          nom: "Dupont",
          prenom: "Jean",
          telephone: "+33 1 23 45 67 89",
        },
      },
    ],
    campagnes: [
      {
        id: "1",
        nom: "Campagne Nouveaux Prospects",
        description: "Campagne d'accueil pour les nouveaux prospects",
        type_campagne: "email",
        statut: "active",
        declencheur: { type: "nouveau_contact" },
        conditions: {},
        actions: {},
        date_creation: "2024-01-10T10:00:00Z",
        nb_contacts_cibles: 150,
        nb_emails_envoyes: 120,
        nb_ouvertures: 85,
        nb_clics: 25,
        nb_conversions: 8,
      },
    ],
    workflows: [
      {
        id: "1",
        nom: "Workflow Qualification Lead",
        description: "Processus automatique de qualification des leads",
        declencheur: { type: "nouveau_lead" },
        etapes: {},
        conditions_sortie: {},
        statut: "actif",
        date_creation: "2024-01-05T10:00:00Z",
        nb_contacts_actifs: 25,
        nb_contacts_termines: 45,
      },
    ],
    objectifs: [
      {
        id: "1",
        nom: "Objectif CA Q1 2024",
        description: "Atteindre 500K€ de CA au Q1 2024",
        type_objectif: "ca",
        valeur_cible: 500000,
        valeur_actuelle: 125000,
        unite: "€",
        periode_debut: "2024-01-01",
        periode_fin: "2024-03-31",
        statut: "actif",
        date_creation: "2024-01-01T10:00:00Z",
      },
    ],
  }

  const data = demoData[table] || []
  return limit ? data.slice(0, limit) : data
}

// Hook pour vérifier la connexion à la base de données
export function useDatabase() {
  return {
    isConnected: hasSupabaseConfig,
    client: supabase,
    service: DatabaseService,
  }
}
