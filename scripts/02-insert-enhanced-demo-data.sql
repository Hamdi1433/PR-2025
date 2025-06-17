-- Insertion de données de démonstration avec tous les champs

-- Contacts avec tous les champs spécifiés
INSERT INTO contacts (nom, prenom, email, telephone, entreprise, poste, adresse, ville, code_postal, pays, statut, origine, attribution, cpl, date_creation, date_signature, notes) VALUES
('Dubois', 'Marie', 'marie.dubois@techcorp.fr', '0123456789', 'TechCorp Solutions', 'Directrice Marketing', '123 Avenue des Champs', 'Paris', '75008', 'France', 'lead', 'Site web', 'conseiller-1', '75', '2024-01-15', '2024-01-25', 'Contact très intéressé par nos solutions'),
('Martin', 'Jean', 'jean.martin@innovsoft.fr', '0123456790', 'InnovSoft', 'CEO', '456 Rue de la Paix', 'Lyon', '69001', 'France', 'client', 'Référence', 'conseiller-1', '50', '2024-01-10', '2024-01-20', 'Client premium avec besoins spécifiques'),
('Laurent', 'Sophie', 'sophie.laurent@digitalpro.fr', '0123456791', 'DigitalPro', 'Responsable IT', '789 Boulevard Saint-Germain', 'Marseille', '13001', 'France', 'prospect', 'LinkedIn', 'conseiller-2', '60', '2024-01-20', NULL, 'Premier contact établi'),
('Moreau', 'Pierre', 'pierre.moreau@startup.fr', '0123456792', 'StartupTech', 'CTO', '321 Rue du Commerce', 'Toulouse', '31000', 'France', 'lead', 'Google Ads', 'conseiller-1', '80', '2024-01-18', NULL, 'Très intéressé par notre offre premium'),
('Bernard', 'Claire', 'claire.bernard@consulting.fr', '0123456793', 'Consulting Plus', 'Directrice', '654 Avenue Montaigne', 'Nice', '06000', 'France', 'client', 'Salon', 'conseiller-2', '45', '2024-01-12', '2024-01-22', 'Cliente fidèle depuis 2 ans');

-- Contrats avec tous les champs financiers
INSERT INTO contrats (numero_contrat, contact_id, compagnie, statut, attribution, pays, date_signature, date_effet, date_fin, cotisation_mensuelle, cotisation_annuelle, commission_mensuelle, commission_annuelle, commission_annuelle_premiere_annee, annee_recurrente, annee_recue, charge, depenses) VALUES
('CONT-2024-001', (SELECT id FROM contacts WHERE email = 'marie.dubois@techcorp.fr'), 'Assurance Premium', 'actif', 'conseiller-1', 'France', '2024-01-25', '2024-02-01', '2025-01-31', 250.00, 3000.00, 75.00, 900.00, 1000.00, 900.00, 900.00, 50.00, 25.00),
('CONT-2024-002', (SELECT id FROM contacts WHERE email = 'jean.martin@innovsoft.fr'), 'Mutuelle Entreprise', 'actif', 'conseiller-1', 'France', '2024-01-20', '2024-02-01', '2025-01-31', 180.00, 2160.00, 54.00, 648.00, 720.00, 648.00, 648.00, 40.00, 20.00),
('CONT-2024-003', (SELECT id FROM contacts WHERE email = 'claire.bernard@consulting.fr'), 'Protection Pro', 'actif', 'conseiller-2', 'France', '2024-01-22', '2024-02-01', '2025-01-31', 320.00, 3840.00, 96.00, 1152.00, 1280.00, 1152.00, 1152.00, 60.00, 30.00);

-- Propositions
INSERT INTO propositions (contact_id, titre, description, montant, statut, date_envoi, created_by) VALUES
((SELECT id FROM contacts WHERE email = 'sophie.laurent@digitalpro.fr'), 'Assurance Santé Entreprise', 'Couverture complète pour équipe de 15 personnes', 2800.00, 'envoyee', '2024-01-21', 'conseiller-2'),
((SELECT id FROM contacts WHERE email = 'pierre.moreau@startup.fr'), 'Pack Startup Premium', 'Solution adaptée aux jeunes entreprises', 1500.00, 'envoyee', '2024-01-19', 'conseiller-1');

-- Tâches
INSERT INTO taches (titre, description, contact_id, assigned_to, priorite, statut, date_echeance) VALUES
('Appel de suivi - TechCorp', 'Faire le point sur la proposition envoyée', (SELECT id FROM contacts WHERE email = 'marie.dubois@techcorp.fr'), 'conseiller-1', 'haute', 'a_faire', '2024-02-01'),
('Rendez-vous commercial - DigitalPro', 'Présentation détaillée de nos solutions', (SELECT id FROM contacts WHERE email = 'sophie.laurent@digitalpro.fr'), 'conseiller-2', 'moyenne', 'en_cours', '2024-01-30'),
('Renouvellement contrat - Consulting Plus', 'Préparer le renouvellement annuel', (SELECT id FROM contacts WHERE email = 'claire.bernard@consulting.fr'), 'conseiller-2', 'moyenne', 'a_faire', '2024-02-15');

-- Tickets de support
INSERT INTO tickets (numero, sujet, description, type, priorite, statut, contact_id, contrat_id, assigned_to, canal) VALUES
('TICK-2024-001', 'Problème de facturation', 'Erreur sur la dernière facture mensuelle', 'reclamation', 'normale', 'nouveau', (SELECT id FROM contacts WHERE email = 'jean.martin@innovsoft.fr'), (SELECT id FROM contrats WHERE numero_contrat = 'CONT-2024-002'), 'support-1', 'email'),
('TICK-2024-002', 'Demande de modification', 'Ajout d''un bénéficiaire au contrat', 'modification_contrat', 'basse', 'en_cours', (SELECT id FROM contacts WHERE email = 'marie.dubois@techcorp.fr'), (SELECT id FROM contrats WHERE numero_contrat = 'CONT-2024-001'), 'support-2', 'telephone');
