-- Tables métier du CRM

-- Table des contacts (clients/prospects)
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telephone VARCHAR(20),
    entreprise VARCHAR(200),
    poste VARCHAR(100),
    statut VARCHAR(20) NOT NULL DEFAULT 'prospect' CHECK (statut IN ('prospect', 'lead', 'client', 'inactif')),
    score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    source VARCHAR(100),
    notes TEXT,
    assigned_to UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des propositions commerciales
CREATE TABLE IF NOT EXISTS propositions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    titre VARCHAR(200) NOT NULL,
    description TEXT,
    montant DECIMAL(10,2) NOT NULL,
    statut VARCHAR(20) NOT NULL DEFAULT 'brouillon' CHECK (statut IN ('brouillon', 'envoyee', 'acceptee', 'refusee')),
    date_envoi TIMESTAMP WITH TIME ZONE,
    date_reponse TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des contrats
CREATE TABLE IF NOT EXISTS contrats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposition_id UUID NOT NULL REFERENCES propositions(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    numero_contrat VARCHAR(50) UNIQUE NOT NULL,
    montant_annuel DECIMAL(10,2) NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE,
    statut VARCHAR(20) NOT NULL DEFAULT 'actif' CHECK (statut IN ('actif', 'expire', 'resilie')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des tâches
CREATE TABLE IF NOT EXISTS taches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titre VARCHAR(200) NOT NULL,
    description TEXT,
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    assigned_to UUID NOT NULL REFERENCES users(id),
    priorite VARCHAR(10) NOT NULL DEFAULT 'moyenne' CHECK (priorite IN ('basse', 'moyenne', 'haute')),
    statut VARCHAR(20) NOT NULL DEFAULT 'a_faire' CHECK (statut IN ('a_faire', 'en_cours', 'terminee')),
    date_echeance TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des tickets/demandes clients
CREATE TABLE IF NOT EXISTS tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    numero VARCHAR(50) UNIQUE NOT NULL,
    sujet VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    
    -- Classification
    type_ticket VARCHAR(50) NOT NULL CHECK (type_ticket IN ('reclamation', 'demande_info', 'modification_contrat', 'resiliation', 'remboursement', 'technique')),
    priorite VARCHAR(20) DEFAULT 'normale' CHECK (priorite IN ('basse', 'normale', 'haute', 'urgente')),
    statut VARCHAR(30) DEFAULT 'nouveau' CHECK (statut IN ('nouveau', 'en_cours', 'en_attente_client', 'resolu', 'ferme')),
    
    -- Relations
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    contrat_id UUID REFERENCES contrats(id),
    assignee_id UUID REFERENCES utilisateurs(id),
    
    -- Dates
    date_creation TIMESTAMP DEFAULT NOW(),
    date_premiere_reponse TIMESTAMP,
    date_resolution TIMESTAMP,
    date_fermeture TIMESTAMP,
    
    -- Métadonnées
    canal VARCHAR(30) DEFAULT 'email' CHECK (canal IN ('email', 'telephone', 'chat', 'courrier', 'site_web')),
    satisfaction_client INTEGER CHECK (satisfaction_client >= 1 AND satisfaction_client <= 5)
);

-- Table des interactions (historique des communications)
CREATE TABLE IF NOT EXISTS interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type_interaction VARCHAR(50) NOT NULL CHECK (type_interaction IN ('appel', 'email', 'reunion', 'note', 'sms', 'courrier')),
    sujet VARCHAR(200),
    contenu TEXT,
    
    -- Relations
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    utilisateur_id UUID REFERENCES utilisateurs(id),
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    
    -- Métadonnées
    direction VARCHAR(10) CHECK (direction IN ('entrant', 'sortant')),
    duree_minutes INTEGER,
    
    date_interaction TIMESTAMP DEFAULT NOW()
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_assigned_to ON contacts(assigned_to);
CREATE INDEX IF NOT EXISTS idx_contacts_statut ON contacts(statut);
CREATE INDEX IF NOT EXISTS idx_propositions_contact_id ON propositions(contact_id);
CREATE INDEX IF NOT EXISTS idx_propositions_created_by ON propositions(created_by);
CREATE INDEX IF NOT EXISTS idx_contrats_contact_id ON contrats(contact_id);
CREATE INDEX IF NOT EXISTS idx_taches_assigned_to ON taches(assigned_to);
CREATE INDEX IF NOT EXISTS idx_taches_contact_id ON taches(contact_id);
