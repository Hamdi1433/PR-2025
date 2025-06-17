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
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des statistiques")
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
