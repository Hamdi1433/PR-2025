-- Insertion de données de test

-- Clients de test
INSERT INTO clients (nom, prenom, email, telephone, entreprise, adresse, ville, code_postal, statut) VALUES
('Dupont', 'Jean', 'jean.dupont@email.com', '0123456789', 'TechCorp', '123 Rue de la Tech', 'Paris', '75001', 'client'),
('Martin', 'Marie', 'marie.martin@email.com', '0987654321', 'InnovSoft', '456 Avenue Innovation', 'Lyon', '69000', 'prospect'),
('Bernard', 'Pierre', 'pierre.bernard@email.com', '0147258369', 'DataSys', '789 Boulevard Data', 'Marseille', '13000', 'lead'),
('Durand', 'Sophie', 'sophie.durand@email.com', '0369258147', 'CloudTech', '321 Rue Cloud', 'Toulouse', '31000', 'prospect'),
('Moreau', 'Luc', 'luc.moreau@email.com', '0258147369', 'WebSolutions', '654 Avenue Web', 'Nice', '06000', 'client');

-- Opportunités de test
INSERT INTO opportunites (titre, description, valeur, probabilite, etape, client_id, date_fermeture_prevue) VALUES
('Projet CRM', 'Implémentation d''un système CRM complet', 50000.00, 80, 'negociation', (SELECT id FROM clients WHERE email = 'jean.dupont@email.com'), '2024-03-15'),
('Site Web E-commerce', 'Développement d''une plateforme e-commerce', 25000.00, 60, 'proposition', (SELECT id FROM clients WHERE email = 'marie.martin@email.com'), '2024-02-28'),
('Migration Cloud', 'Migration des services vers le cloud', 75000.00, 40, 'qualification', (SELECT id FROM clients WHERE email = 'pierre.bernard@email.com'), '2024-04-30'),
('Application Mobile', 'Développement d''une app mobile', 35000.00, 70, 'negociation', (SELECT id FROM clients WHERE email = 'sophie.durand@email.com'), '2024-03-20');

-- Tâches de test
INSERT INTO taches (titre, description, priorite, statut, date_echeance, client_id) VALUES
('Appel de suivi', 'Appeler le client pour faire le point', 'haute', 'a_faire', '2024-01-20', (SELECT id FROM clients WHERE email = 'jean.dupont@email.com')),
('Envoi proposition', 'Envoyer la proposition commerciale', 'haute', 'en_cours', '2024-01-18', (SELECT id FROM clients WHERE email = 'marie.martin@email.com')),
('Rendez-vous client', 'Organiser un rendez-vous de présentation', 'moyenne', 'a_faire', '2024-01-25', (SELECT id FROM clients WHERE email = 'pierre.bernard@email.com')),
('Suivi email', 'Envoyer un email de relance', 'basse', 'termine', '2024-01-15', (SELECT id FROM clients WHERE email = 'sophie.durand@email.com'));
