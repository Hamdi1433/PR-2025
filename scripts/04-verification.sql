-- Script de vérification de l'installation
-- Vérifier que toutes les tables ont été créées correctement

-- Vérifier l'existence des tables
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE tablename IN ('clients', 'opportunites', 'taches', 'interactions')
ORDER BY tablename;

-- Vérifier le nombre d'enregistrements dans chaque table
SELECT 
    'clients' as table_name, 
    COUNT(*) as nb_records 
FROM clients
UNION ALL
SELECT 
    'opportunites' as table_name, 
    COUNT(*) as nb_records 
FROM opportunites
UNION ALL
SELECT 
    'taches' as table_name, 
    COUNT(*) as nb_records 
FROM taches
UNION ALL
SELECT 
    'interactions' as table_name, 
    COUNT(*) as nb_records 
FROM interactions;

-- Vérifier les contraintes et index
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    conrelid::regclass as table_name
FROM pg_constraint 
WHERE conrelid IN (
    SELECT oid FROM pg_class 
    WHERE relname IN ('clients', 'opportunites', 'taches', 'interactions')
)
ORDER BY table_name, constraint_type;

-- Test de requête simple pour vérifier les relations
SELECT 
    c.nom,
    c.prenom,
    c.entreprise,
    COUNT(o.id) as nb_opportunites,
    COUNT(t.id) as nb_taches
FROM clients c
LEFT JOIN opportunites o ON c.id = o.client_id
LEFT JOIN taches t ON c.id = t.client_id
GROUP BY c.id, c.nom, c.prenom, c.entreprise
ORDER BY c.nom;
