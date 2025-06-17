-- Insertion des données de démonstration
INSERT INTO users (id, email, nom, prenom, role) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin@premunia.fr', 'Admin', 'Premunia', 'admin'),
('550e8400-e29b-41d4-a716-446655440001', 'jean.conseiller@premunia.fr', 'Conseiller', 'Jean', 'conseiller'),
('550e8400-e29b-41d4-a716-446655440002', 'marie.gestionnaire@premunia.fr', 'Gestionnaire', 'Marie', 'gestionnaire')
ON CONFLICT (email) DO NOTHING;

INSERT INTO contacts (id, nom, prenom, email, telephone, entreprise, poste, statut, score, source, assigned_to) VALUES
('660e8400-e29b-41d4-a716-446655440000', 'Dubois', 'Marie', 'marie.dubois@email.com', '0123456789', 'TechCorp', 'Directrice Marketing', 'lead', 85, 'Site web', '550e8400-e29b-41d4-a716-446655440001'),
('660e8400-e29b-41d4-a716-446655440001', 'Martin', 'Jean', 'jean.martin@email.com', '0123456790', 'InnovSoft', 'CEO', 'prospect', 92, 'Référence', '550e8400-e29b-41d4-a716-446655440001'),
('660e8400-e29b-41d4-a716-446655440002', 'Laurent', 'Sophie', 'sophie.laurent@email.com', '0123456791', 'DigitalPro', 'Responsable IT', 'client', 67, 'LinkedIn', '550e8400-e29b-41d4-a716-446655440001'),
('660e8400-e29b-41d4-a716-446655440003', 'Durand', 'Pierre', 'pierre.durand@email.com', '0123456792', 'WebAgency', 'Directeur', 'prospect', 78, 'Salon', '550e8400-e29b-41d4-a716-446655440001'),
('660e8400-e29b-41d4-a716-446655440004', 'Moreau', 'Claire', 'claire.moreau@email.com', '0123456793', 'StartupTech', 'CTO', 'lead', 89, 'Référence', '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (email) DO NOTHING;

INSERT INTO propositions (id, contact_id, titre, description, montant, statut, created_by) VALUES
('770e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', 'Solution CRM Complète', 'Implémentation complète du CRM Premunia', 15000.00, 'envoyee', '550e8400-e29b-41d4-a716-446655440001'),
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Package Marketing Automation', 'Mise en place de l''automation marketing', 8500.00, 'acceptee', '550e8400-e29b-41d4-a716-446655440001'),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'Formation Équipe', 'Formation complète de l''équipe commerciale', 3200.00, 'acceptee', '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (id) DO NOTHING;

INSERT INTO contrats (id, proposition_id, contact_id, numero_contrat, montant_annuel, date_debut, statut) VALUES
('880e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'CTR-2024-001', 8500.00, '2024-01-15', 'actif'),
('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'CTR-2024-002', 3200.00, '2024-01-20', 'actif')
ON CONFLICT (numero_contrat) DO NOTHING;

INSERT INTO taches (id, titre, description, contact_id, assigned_to, priorite, statut, date_echeance) VALUES
('990e8400-e29b-41d4-a716-446655440000', 'Appeler Marie Dubois', 'Suivi de la proposition envoyée', '660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'haute', 'a_faire', NOW() + INTERVAL '1 day'),
('990e8400-e29b-41d4-a716-446655440001', 'Préparer présentation', 'Présentation pour Jean Martin', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'haute', 'en_cours', NOW() + INTERVAL '2 days'),
('990e8400-e29b-41d4-a716-446655440002', 'Formation Sophie Laurent', 'Session de formation CRM', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'moyenne', 'a_faire', NOW() + INTERVAL '1 week')
ON CONFLICT (id) DO NOTHING;
