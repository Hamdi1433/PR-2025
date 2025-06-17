// Types de base pour l'application
export interface User {
  id: string
  email: string
  nom: string
  prenom: string
  role: "admin" | "conseiller" | "gestionnaire"
  avatar?: string
  created_at: string
  updated_at: string
}

export interface Contact {
  id: string
  nom: string
  prenom: string
  email: string
  telephone?: string
  entreprise?: string
  poste?: string
  statut: "prospect" | "lead" | "client" | "inactif"
  score: number
  source: string
  notes?: string
  assigned_to?: string
  created_at: string
  updated_at: string
}

export interface Proposal {
  id: string
  number: string
  title: string
  description?: string
  amount: number
  status: "draft" | "sent" | "pending" | "accepted" | "rejected" | "expired"
  probability: number
  contactId: string
  assignedTo?: string
  createdAt: string
  sentAt?: string
  expiresAt?: string
  signedAt?: string
}

export interface Contract {
  id: string
  number: string
  title: string
  type: string
  monthlyAmount?: number
  annualAmount?: number
  duration?: number
  status: "active" | "suspended" | "terminated" | "expired"
  contactId: string
  proposalId?: string
  assignedTo?: string
  signedAt: string
  startDate: string
  endDate?: string
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description?: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "todo" | "in_progress" | "completed" | "cancelled"
  assignedTo?: string
  createdBy?: string
  contactId?: string
  proposalId?: string
  contractId?: string
  dueDate?: string
  completedAt?: string
  createdAt: string
}

export interface Ticket {
  id: string
  number: string
  subject: string
  description: string
  type: "complaint" | "info_request" | "contract_modification" | "cancellation" | "refund" | "technical"
  priority: "low" | "normal" | "high" | "urgent"
  status: "new" | "in_progress" | "waiting_customer" | "resolved" | "closed"
  contactId: string
  contractId?: string
  assignedTo?: string
  createdAt: string
  firstResponseAt?: string
  resolvedAt?: string
  closedAt?: string
  channel: "email" | "phone" | "chat" | "mail" | "website"
  satisfaction?: number
}

export interface Campaign {
  id: string
  name: string
  description?: string
  type: "email" | "sms" | "mixed"
  status: "draft" | "active" | "paused" | "completed"
  createdBy?: string
  createdAt: string
  startDate?: string
  endDate?: string
  targetCount: number
  sentCount: number
  openCount: number
  clickCount: number
  conversionCount: number
}

export interface Workflow {
  id: string
  name: string
  description?: string
  trigger: Record<string, any>
  steps: Record<string, any>
  exitConditions: Record<string, any>
  status: "inactive" | "active" | "paused"
  createdBy?: string
  createdAt: string
  activatedAt?: string
  activeContacts: number
  completedContacts: number
}

export interface Objective {
  id: string
  name: string
  description?: string
  type: "contacts" | "proposals" | "contracts" | "revenue" | "tasks"
  targetValue: number
  currentValue: number
  unit?: string
  startDate: string
  endDate: string
  userId?: string
  teamId?: string
  status: "active" | "achieved" | "failed" | "cancelled"
  createdAt: string
}

// Types pour les statistiques
export interface DashboardStats {
  contacts: {
    total: number
    prospects: number
    leads: number
    clients: number
    newThisMonth: number
  }
  proposals: {
    total: number
    pending: number
    accepted: number
    revenue: number
  }
  contracts: {
    total: number
    active: number
    revenue: number
  }
  tasks: {
    total: number
    pending: number
    overdue: number
  }
}

export interface Proposition {
  id: string
  contact_id: string
  titre: string
  description: string
  montant: number
  statut: "brouillon" | "envoyee" | "acceptee" | "refusee"
  date_envoi?: string
  date_reponse?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface Contrat {
  id: string
  proposition_id: string
  contact_id: string
  numero_contrat: string
  montant_annuel: number
  date_debut: string
  date_fin?: string
  statut: "actif" | "expire" | "resilie"
  created_at: string
  updated_at: string
}

export interface Tache {
  id: string
  titre: string
  description?: string
  contact_id?: string
  assigned_to: string
  priorite: "basse" | "moyenne" | "haute"
  statut: "a_faire" | "en_cours" | "terminee"
  date_echeance?: string
  created_at: string
  updated_at: string
}
