-- Configuration de la sécurité Row Level Security (RLS)
-- À adapter selon vos besoins d'authentification

-- Activer RLS sur toutes les tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunites ENABLE ROW LEVEL SECURITY;
ALTER TABLE taches ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture à tous les utilisateurs authentifiés
-- (À modifier selon vos besoins de sécurité)
CREATE POLICY "Permettre lecture clients" ON clients
    FOR SELECT USING (true);

CREATE POLICY "Permettre lecture opportunites" ON opportunites
    FOR SELECT USING (true);

CREATE POLICY "Permettre lecture taches" ON taches
    FOR SELECT USING (true);

CREATE POLICY "Permettre lecture interactions" ON interactions
    FOR SELECT USING (true);

-- Politique pour permettre l'insertion à tous les utilisateurs authentifiés
CREATE POLICY "Permettre insertion clients" ON clients
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permettre insertion opportunites" ON opportunites
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permettre insertion taches" ON taches
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permettre insertion interactions" ON interactions
    FOR INSERT WITH CHECK (true);

-- Politique pour permettre la mise à jour à tous les utilisateurs authentifiés
CREATE POLICY "Permettre mise à jour clients" ON clients
    FOR UPDATE USING (true);

CREATE POLICY "Permettre mise à jour opportunites" ON opportunites
    FOR UPDATE USING (true);

CREATE POLICY "Permettre mise à jour taches" ON taches
    FOR UPDATE USING (true);

CREATE POLICY "Permettre mise à jour interactions" ON interactions
    FOR UPDATE USING (true);

-- Politique pour permettre la suppression à tous les utilisateurs authentifiés
CREATE POLICY "Permettre suppression clients" ON clients
    FOR DELETE USING (true);

CREATE POLICY "Permettre suppression opportunites" ON opportunites
    FOR DELETE USING (true);

CREATE POLICY "Permettre suppression taches" ON taches
    FOR DELETE USING (true);

CREATE POLICY "Permettre suppression interactions" ON interactions
    FOR DELETE USING (true);
