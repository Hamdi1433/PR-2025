"use client"

import { useState, useEffect } from "react"
import { databaseService } from "@/lib/database"
import type { Contact, DashboardStats } from "@/lib/types"

export function useContacts(assignedTo?: string) {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadContacts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await databaseService.getContacts(assignedTo)
      setContacts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des contacts")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContacts()
  }, [assignedTo])

  const createContact = async (contact: Omit<Contact, "id" | "created_at" | "updated_at">) => {
    try {
      const newContact = await databaseService.createContact(contact)
      setContacts((prev) => [newContact, ...prev])
      return newContact
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création du contact")
      throw err
    }
  }

  const updateContact = async (id: string, updates: Partial<Contact>) => {
    try {
      const updatedContact = await databaseService.updateContact(id, updates)
      setContacts((prev) => prev.map((c) => (c.id === id ? updatedContact : c)))
      return updatedContact
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la mise à jour du contact")
      throw err
    }
  }

  const deleteContact = async (id: string) => {
    try {
      await databaseService.deleteContact(id)
      setContacts((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression du contact")
      throw err
    }
  }

  return {
    contacts,
    loading,
    error,
    refresh: loadContacts,
    createContact,
    updateContact,
    deleteContact,
  }
}

export function useDashboardStats(userId?: string) {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await databaseService.getDashboardStats(userId)

      // Assurons-nous que toutes les propriétés existent
      const safeData: DashboardStats = {
        contacts: {
          total: data.contacts?.total || 0,
          prospects: data.contacts?.prospects || 0,
          leads: data.contacts?.leads || 0,
          clients: data.contacts?.clients || 0,
          newThisMonth: data.contacts?.newThisMonth || 0,
        },
        contrats: {
          total: data.contrats?.total || 0,
          actifs: data.contrats?.actifs || 0,
          revenue_mensuel: data.contrats?.revenue_mensuel || 0,
          revenue_annuel: data.contrats?.revenue_annuel || 0,
          commission_mensuelle: data.contrats?.commission_mensuelle || 0,
          commission_annuelle: data.contrats?.commission_annuelle || 0,
        },
        propositions: {
          total: data.propositions?.total || 0,
          en_attente: data.propositions?.en_attente || 0,
          acceptees: data.propositions?.acceptees || 0,
          revenue: data.propositions?.revenue || 0,
        },
        taches: {
          total: data.taches?.total || 0,
          en_attente: data.taches?.en_attente || 0,
          en_retard: data.taches?.en_retard || 0,
        },
      }

      setStats(safeData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des statistiques")

      // En cas d'erreur, définir des statistiques par défaut
      setStats({
        contacts: { total: 0, prospects: 0, leads: 0, clients: 0, newThisMonth: 0 },
        contrats: {
          total: 0,
          actifs: 0,
          revenue_mensuel: 0,
          revenue_annuel: 0,
          commission_mensuelle: 0,
          commission_annuelle: 0,
        },
        propositions: { total: 0, en_attente: 0, acceptees: 0, revenue: 0 },
        taches: { total: 0, en_attente: 0, en_retard: 0 },
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [userId])

  return {
    stats,
    loading,
    error,
    refresh: loadStats,
  }
}

export function useDatabase() {
  return {
    isConnected: databaseService.isDbConnected(),
    service: databaseService,
  }
}
