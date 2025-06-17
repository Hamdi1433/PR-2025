-- Script de création des tables pour le CRM en production
-- À exécuter dans l'éditeur SQL de Supabase

-- Activer l'extension UUID si elle n'est pas déjà activée
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des clients
CREATE TABLE IF NOT EXISTS clients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telephone VARCHAR(20),
    entreprise VARCHAR(100),
    adresse TEXT,
    ville VARCHAR(100),
    code_postal VARCHAR(10),
    pays VARCHAR(100) DEFAULT 'France',
    statut VARCHAR(20) DEFAULT 'prospect' CHECK (statut IN ('prospect', 'lead', 'client')),
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Index pour améliorer les performances
    CONSTRAINT clients_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Index sur les colonnes fréquemment utilisées
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_statut ON clients(statut);
CREATE INDEX IF NOT EXISTS idx_clients_entreprise ON clients(entreprise);
CREATE INDEX IF NOT EXISTS idx_clients_date_creation ON clients(date_creation);

-- Table des opportunités
CREATE TABLE IF NOT EXISTS opportunites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    description TEXT,
    valeur DECIMAL(12,2) CHECK (valeur >= 0),
    probabilite INTEGER DEFAULT 50 CHECK (probabilite >= 0 AND probabilite <= 100),
    etape VARCHAR(50) DEFAULT 'qualification' CHECK (etape IN ('qualification', 'proposition', 'negociation', 'fermeture')),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date_fermeture_prevue DATE,
    date_fermeture_reelle DATE,
    statut VARCHAR(20) DEFAULT 'ouvert' CHECK (statut IN ('ouvert', 'gagne', 'perdu')),
    
    -- Contraintes
    CONSTRAINT opportunites_dates_check CHECK (
        date_fermeture_prevue IS NULL OR 
        date_fermeture_reelle IS NULL OR 
        date_fermeture_reelle >= date_fermeture_prevue
    )
);

-- Index pour les opportunités
CREATE INDEX IF NOT EXISTS idx_opportunites_client_id ON opportunites(client_id);
CREATE INDEX IF NOT EXISTS idx_opportunites_statut ON opportunites(statut);
CREATE INDEX IF NOT EXISTS idx_opportunites_etape ON opportunites(etape);
CREATE INDEX IF NOT EXISTS idx_opportunites_date_creation ON opportunites(date_creation);
CREATE INDEX IF NOT EXISTS idx_opportunites_valeur ON opportunites(valeur);

-- Table des tâches
CREATE TABLE IF NOT EXISTS taches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    description TEXT,
    priorite VARCHAR(20) DEFAULT 'moyenne' CHECK (priorite IN ('basse', 'moyenne', 'haute')),
    statut VARCHAR(20) DEFAULT 'a_faire' CHECK (statut IN ('a_faire', 'en_cours', 'termine')),
    date_echeance DATE,
    date_completion TIMESTAMP WITH TIME ZONE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    opportunite_id UUID REFERENCES opportunites(id) ON DELETE CASCADE,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Contraintes
    CONSTRAINT taches_completion_check CHECK (
        (statut = 'termine' AND date_completion IS NOT NULL) OR
        (statut != 'termine' AND date_completion IS NULL)
    )
);

-- Index pour les tâches
CREATE INDEX IF NOT EXISTS idx_taches_client_id ON taches(client_id);
CREATE INDEX IF NOT EXISTS idx_taches_opportunite_id ON taches(opportunite_id);
CREATE INDEX IF NOT EXISTS idx_taches_statut ON taches(statut);
CREATE INDEX IF NOT EXISTS idx_taches_priorite ON taches(priorite);
CREATE INDEX IF NOT EXISTS idx_taches_date_echeance ON taches(date_echeance);

-- Table des interactions (historique des communications)
CREATE TABLE IF NOT EXISTS interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN ('appel', 'email', 'reunion', 'note', 'sms')),
    sujet VARCHAR(200),
    contenu TEXT,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    opportunite_id UUID REFERENCES opportunites(id) ON DELETE CASCADE,
    date_interaction TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les interactions
CREATE INDEX IF NOT EXISTS idx_interactions_client_id ON interactions(client_id);
CREATE INDEX IF NOT EXISTS idx_interactions_opportunite_id ON interactions(opportunite_id);
CREATE INDEX IF NOT EXISTS idx_interactions_type ON interactions(type);
CREATE INDEX IF NOT EXISTS idx_interactions_date ON interactions(date_interaction);

-- Fonction pour mettre à jour automatiquement date_modification
CREATE OR REPLACE FUNCTION update_date_modification()
RETURNS TRIGGER AS $$
BEGIN
    NEW.date_modification = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour date_modification sur les clients
CREATE TRIGGER trigger_update_clients_date_modification
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION update_date_modification();

-- Fonction pour marquer automatiquement la date de completion des tâches
CREATE OR REPLACE FUNCTION update_tache_completion()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.statut = 'termine' AND OLD.statut != 'termine' THEN
        NEW.date_completion = NOW();
    ELSIF NEW.statut != 'termine' THEN
        NEW.date_completion = NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour les tâches
CREATE TRIGGER trigger_update_tache_completion
    BEFORE UPDATE ON taches
    FOR EACH ROW
    EXECUTE FUNCTION update_tache_completion();
