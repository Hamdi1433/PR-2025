-- Tables pour l'automatisation marketing

-- Table des campagnes
CREATE TABLE IF NOT EXISTS campagnes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nom VARCHAR(200) NOT NULL,
    description TEXT,
    type_campagne VARCHAR(50) NOT NULL CHECK (type_campagne IN ('email', 'sms', 'mixte')),
    
    -- Statut
    statut VARCHAR(30) DEFAULT 'brouillon' CHECK (statut IN ('brouillon', 'active', 'pausee', 'terminee')),
    
    -- Configuration
    declencheur JSONB NOT NULL,
    conditions JSONB DEFAULT '{}',
    actions JSONB NOT NULL,
    
    -- Créateur
    createur_id UUID REFERENCES utilisateurs(id),
    
    -- Dates
    date_creation TIMESTAMP DEFAULT NOW(),
    date_activation TIMESTAMP,
    date_fin TIMESTAMP,
    
    -- Statistiques
    nb_contacts_cibles INTEGER DEFAULT 0,
    nb_emails_envoyes INTEGER DEFAULT 0,
    nb_ouvertures INTEGER DEFAULT 0,
    nb_clics INTEGER DEFAULT 0,
    nb_conversions INTEGER DEFAULT 0
);

-- Table des modèles d'emails
CREATE TABLE IF NOT EXISTS modeles_emails (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nom VARCHAR(200) NOT NULL,
    sujet VARCHAR(200) NOT NULL,
    contenu_html TEXT NOT NULL,
    contenu_texte TEXT,
    
    -- Métadonnées
    type_modele VARCHAR(50),
    variables JSONB DEFAULT '[]',
    
    -- Créateur
    createur_id UUID REFERENCES utilisateurs(id),
    
    date_creation TIMESTAMP DEFAULT NOW(),
    date_modification TIMESTAMP DEFAULT NOW()
);

-- Table des workflows
CREATE TABLE IF NOT EXISTS workflows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nom VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Configuration
    declencheur JSONB NOT NULL,
    etapes JSONB NOT NULL,
    conditions_sortie JSONB DEFAULT '{}',
    
    -- Statut
    statut VARCHAR(30) DEFAULT 'inactif' CHECK (statut IN ('inactif', 'actif', 'pause')),
    
    -- Créateur
    createur_id UUID REFERENCES utilisateurs(id),
    
    -- Dates
    date_creation TIMESTAMP DEFAULT NOW(),
    date_activation TIMESTAMP,
    
    -- Statistiques
    nb_contacts_actifs INTEGER DEFAULT 0,
    nb_contacts_termines INTEGER DEFAULT 0
);

-- Table des instances de workflow (contacts dans les workflows)
CREATE TABLE IF NOT EXISTS workflow_instances (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    
    -- État actuel
    etape_actuelle INTEGER DEFAULT 0,
    statut VARCHAR(30) DEFAULT 'actif' CHECK (statut IN ('actif', 'termine', 'sorti', 'erreur')),
    
    -- Dates
    date_entree TIMESTAMP DEFAULT NOW(),
    date_prochaine_action TIMESTAMP,
    date_sortie TIMESTAMP,
    
    -- Historique
    historique JSONB DEFAULT '[]',
    
    UNIQUE(workflow_id, contact_id)
);

-- Table des objectifs
CREATE TABLE IF NOT EXISTS objectifs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nom VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Configuration
    type_objectif VARCHAR(50) NOT NULL CHECK (type_objectif IN ('contacts', 'propositions', 'contrats', 'ca', 'taches')),
    valeur_cible DECIMAL(12,2) NOT NULL,
    valeur_actuelle DECIMAL(12,2) DEFAULT 0,
    unite VARCHAR(20),
    
    -- Période
    periode_debut DATE NOT NULL,
    periode_fin DATE NOT NULL,
    
    -- Assignation
    utilisateur_id UUID REFERENCES utilisateurs(id),
    equipe_id UUID REFERENCES equipes(id),
    
    -- Statut
    statut VARCHAR(30) DEFAULT 'actif' CHECK (statut IN ('actif', 'atteint', 'echoue', 'annule')),
    
    date_creation TIMESTAMP DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_campagnes_statut ON campagnes(statut);
CREATE INDEX IF NOT EXISTS idx_workflows_statut ON workflows(statut);
CREATE INDEX IF NOT EXISTS idx_workflow_instances_contact ON workflow_instances(contact_id);
CREATE INDEX IF NOT EXISTS idx_workflow_instances_workflow ON workflow_instances(workflow_id);
CREATE INDEX IF NOT EXISTS idx_objectifs_utilisateur ON objectifs(utilisateur_id);
CREATE INDEX IF NOT EXISTS idx_objectifs_periode ON objectifs(periode_debut, periode_fin);
