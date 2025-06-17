-- Tables d'authentification et gestion des utilisateurs

-- Table des rôles
CREATE TABLE IF NOT EXISTS roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nom VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '{}',
    date_creation TIMESTAMP DEFAULT NOW()
);

-- Insertion des rôles de base
INSERT INTO roles (nom, description, permissions) VALUES
('admin', 'Administrateur', '{"all": true}'),
('conseiller', 'Conseiller Commercial', '{"contacts": ["read", "write"], "propositions": ["read", "write"], "contrats": ["read", "write"], "taches": ["read", "write"]}'),
('gestionnaire', 'Gestionnaire/Superviseur', '{"contacts": ["read", "write"], "propositions": ["read", "write"], "contrats": ["read", "write"], "taches": ["read", "write"], "equipe": ["read", "write"], "tickets": ["read", "write"]}'),
('qualite', 'Responsable Qualité', '{"tickets": ["read", "write"], "reclamations": ["read", "write"], "contrats": ["read"], "rapports": ["read"]}');

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS utilisateurs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe_hash VARCHAR(255) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    role_id UUID REFERENCES roles(id),
    avatar_url TEXT,
    telephone VARCHAR(20),
    statut VARCHAR(20) DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif', 'suspendu')),
    derniere_connexion TIMESTAMP,
    date_creation TIMESTAMP DEFAULT NOW(),
    date_modification TIMESTAMP DEFAULT NOW(),
    
    -- Paramètres utilisateur
    preferences JSONB DEFAULT '{}',
    objectifs JSONB DEFAULT '{}'
);

-- Table des équipes (pour les gestionnaires)
CREATE TABLE IF NOT EXISTS equipes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    gestionnaire_id UUID REFERENCES utilisateurs(id),
    date_creation TIMESTAMP DEFAULT NOW()
);

-- Table de liaison utilisateurs-équipes
CREATE TABLE IF NOT EXISTS utilisateurs_equipes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    utilisateur_id UUID REFERENCES utilisateurs(id) ON DELETE CASCADE,
    equipe_id UUID REFERENCES equipes(id) ON DELETE CASCADE,
    date_ajout TIMESTAMP DEFAULT NOW(),
    UNIQUE(utilisateur_id, equipe_id)
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_utilisateurs_email ON utilisateurs(email);
CREATE INDEX IF NOT EXISTS idx_utilisateurs_role ON utilisateurs(role_id);
CREATE INDEX IF NOT EXISTS idx_utilisateurs_statut ON utilisateurs(statut);

-- Création des tables d'authentification et utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'conseiller', 'gestionnaire')),
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
