-- Création des tables avec tous les champs demandés

-- Table des contacts avec tous les champs spécifiés
CREATE TABLE IF NOT EXISTS contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telephone VARCHAR(20),
    entreprise VARCHAR(200),
    poste VARCHAR(100),
    adresse TEXT,
    ville VARCHAR(100) NOT NULL,
    code_postal VARCHAR(10),
    pays VARCHAR(100) NOT NULL DEFAULT 'France',
    statut VARCHAR(20) NOT NULL DEFAULT 'prospect' CHECK (statut IN ('prospect', 'lead', 'client', 'inactif')),
    score INTEGER DEFAULT 50,
    origine VARCHAR(100) NOT NULL,
    attribution VARCHAR(100),
    cpl VARCHAR(50), -- Coût par lead
    date_creation DATE NOT NULL DEFAULT CURRENT_DATE,
    date_signature DATE,
    notes TEXT,
    assigned_to VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des contrats avec tous les champs financiers
CREATE TABLE IF NOT EXISTS contrats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    numero_contrat VARCHAR(50) UNIQUE NOT NULL,
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    compagnie VARCHAR(200) NOT NULL,
    statut VARCHAR(20) NOT NULL DEFAULT 'actif' CHECK (statut IN ('actif', 'suspendu', 'resilie', 'expire')),
    attribution VARCHAR(100),
    pays VARCHAR(100) NOT NULL DEFAULT 'France',
    
    -- Dates
    date_signature DATE NOT NULL,
    date_effet DATE NOT NULL,
    date_fin DATE,
    
    -- Montants financiers
    cotisation_mensuelle DECIMAL(10,2) DEFAULT 0,
    cotisation_annuelle DECIMAL(10,2) DEFAULT 0,
    commission_mensuelle DECIMAL(10,2) DEFAULT 0,
    commission_annuelle DECIMAL(10,2) DEFAULT 0,
    commission_annuelle_premiere_annee DECIMAL(10,2) DEFAULT 0,
    annee_recurrente DECIMAL(10,2) DEFAULT 0,
    annee_recue DECIMAL(10,2) DEFAULT 0,
    
    -- Coûts et charges
    charge DECIMAL(10,2) DEFAULT 0,
    depenses DECIMAL(10,2) DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des propositions
CREATE TABLE IF NOT EXISTS propositions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    titre VARCHAR(200) NOT NULL,
    description TEXT,
    montant DECIMAL(10,2) NOT NULL,
    statut VARCHAR(20) NOT NULL DEFAULT 'brouillon' CHECK (statut IN ('brouillon', 'envoyee', 'acceptee', 'refusee')),
    date_envoi DATE,
    date_reponse DATE,
    created_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des tâches
CREATE TABLE IF NOT EXISTS taches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    description TEXT,
    contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    assigned_to VARCHAR(100) NOT NULL,
    priorite VARCHAR(20) NOT NULL DEFAULT 'moyenne' CHECK (priorite IN ('basse', 'moyenne', 'haute')),
    statut VARCHAR(20) NOT NULL DEFAULT 'a_faire' CHECK (statut IN ('a_faire', 'en_cours', 'terminee')),
    date_echeance DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des tickets de support
CREATE TABLE IF NOT EXISTS tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    numero VARCHAR(50) UNIQUE NOT NULL,
    sujet VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('reclamation', 'demande_info', 'modification_contrat', 'resiliation', 'remboursement', 'technique')),
    priorite VARCHAR(20) NOT NULL DEFAULT 'normale' CHECK (priorite IN ('basse', 'normale', 'haute', 'urgente')),
    statut VARCHAR(30) NOT NULL DEFAULT 'nouveau' CHECK (statut IN ('nouveau', 'en_cours', 'en_attente_client', 'resolu', 'ferme')),
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    contrat_id UUID REFERENCES contrats(id) ON DELETE SET NULL,
    assigned_to VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    first_response_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    closed_at TIMESTAMP WITH TIME ZONE,
    canal VARCHAR(20) NOT NULL DEFAULT 'email' CHECK (canal IN ('email', 'telephone', 'chat', 'courrier', 'site_web')),
    satisfaction INTEGER CHECK (satisfaction >= 1 AND satisfaction <= 5)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_statut ON contacts(statut);
CREATE INDEX IF NOT EXISTS idx_contacts_attribution ON contacts(attribution);
CREATE INDEX IF NOT EXISTS idx_contrats_numero ON contrats(numero_contrat);
CREATE INDEX IF NOT EXISTS idx_contrats_statut ON contrats(statut);
CREATE INDEX IF NOT EXISTS idx_contrats_contact_id ON contrats(contact_id);
CREATE INDEX IF NOT EXISTS idx_propositions_contact_id ON propositions(contact_id);
CREATE INDEX IF NOT EXISTS idx_taches_assigned_to ON taches(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tickets_statut ON tickets(statut);

-- Triggers pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contrats_updated_at BEFORE UPDATE ON contrats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_propositions_updated_at BEFORE UPDATE ON propositions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_taches_updated_at BEFORE UPDATE ON taches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
