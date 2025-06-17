-- Création des tables pour le CRM

-- Table des clients
CREATE TABLE IF NOT EXISTS clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telephone VARCHAR(20),
    entreprise VARCHAR(100),
    adresse TEXT,
    ville VARCHAR(100),
    code_postal VARCHAR(10),
    pays VARCHAR(100) DEFAULT 'France',
    statut VARCHAR(20) DEFAULT 'prospect',
    date_creation TIMESTAMP DEFAULT NOW(),
    date_modification TIMESTAMP DEFAULT NOW()
);

-- Table des opportunités
CREATE TABLE IF NOT EXISTS opportunites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    description TEXT,
    valeur DECIMAL(10,2),
    probabilite INTEGER DEFAULT 50,
    etape VARCHAR(50) DEFAULT 'qualification',
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    date_creation TIMESTAMP DEFAULT NOW(),
    date_fermeture_prevue DATE,
    statut VARCHAR(20) DEFAULT 'ouvert'
);

-- Table des tâches
CREATE TABLE IF NOT EXISTS taches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    description TEXT,
    priorite VARCHAR(20) DEFAULT 'moyenne',
    statut VARCHAR(20) DEFAULT 'a_faire',
    date_echeance DATE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    opportunite_id UUID REFERENCES opportunites(id) ON DELETE CASCADE,
    date_creation TIMESTAMP DEFAULT NOW()
);

-- Table des interactions
CREATE TABLE IF NOT EXISTS interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    sujet VARCHAR(200),
    contenu TEXT,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    date_interaction TIMESTAMP DEFAULT NOW()
);
