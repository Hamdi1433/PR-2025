-- Script d'insertion de données de test pour la production
-- Données plus réalistes et complètes

-- Insertion des clients
INSERT INTO clients (nom, prenom, email, telephone, entreprise, adresse, ville, code_postal, statut) VALUES
('Dupont', 'Jean', 'jean.dupont@techcorp.fr', '+33 1 23 45 67 89', 'TechCorp Solutions', '123 Rue de la Technologie', 'Paris', '75001', 'client'),
('Martin', 'Marie', 'marie.martin@innovsoft.com', '+33 4 56 78 90 12', 'InnovSoft', '456 Avenue de l''Innovation', 'Lyon', '69000', 'prospect'),
('Bernard', 'Pierre', 'pierre.bernard@datasys.fr', '+33 4 91 23 45 67', 'DataSys Analytics', '789 Boulevard des Données', 'Marseille', '13000', 'lead'),
('Durand', 'Sophie', 'sophie.durand@cloudtech.io', '+33 5 61 23 45 67', 'CloudTech Services', '321 Rue du Cloud', 'Toulouse', '31000', 'prospect'),
('Moreau', 'Luc', 'luc.moreau@websolutions.net', '+33 4 93 12 34 56', 'WebSolutions Pro', '654 Avenue du Web', 'Nice', '06000', 'client'),
('Leroy', 'Camille', 'camille.leroy@digitech.fr', '+33 2 40 12 34 56', 'DigiTech Innovation', '987 Place Digitale', 'Nantes', '44000', 'lead'),
('Roux', 'Thomas', 'thomas.roux@startup.co', '+33 4 76 12 34 56', 'StartUp Dynamics', '147 Rue de l''Entrepreneuriat', 'Grenoble', '38000', 'prospect'),
('Blanc', 'Emma', 'emma.blanc@consulting.biz', '+33 1 42 12 34 56', 'Blanc Consulting', '258 Avenue du Conseil', 'Paris', '75008', 'client');

-- Insertion des opportunités
INSERT INTO opportunites (titre, description, valeur, probabilite, etape, client_id, date_fermeture_prevue, statut) VALUES
(
    'Refonte système CRM',
    'Migration complète du système CRM existant vers une solution moderne avec intégration API',
    75000.00,
    85,
    'negociation',
    (SELECT id FROM clients WHERE email = 'jean.dupont@techcorp.fr'),
    '2024-03-15',
    'ouvert'
),
(
    'Plateforme E-commerce B2B',
    'Développement d''une plateforme e-commerce sur mesure pour la vente B2B',
    120000.00,
    60,
    'proposition',
    (SELECT id FROM clients WHERE email = 'marie.martin@innovsoft.com'),
    '2024-04-30',
    'ouvert'
),
(
    'Solution BI et Analytics',
    'Mise en place d''une solution de Business Intelligence avec tableaux de bord personnalisés',
    45000.00,
    40,
    'qualification',
    (SELECT id FROM clients WHERE email = 'pierre.bernard@datasys.fr'),
    '2024-05-15',
    'ouvert'
),
(
    'Migration Cloud AWS',
    'Migration de l''infrastructure on-premise vers AWS avec optimisation des coûts',
    95000.00,
    70,
    'negociation',
    (SELECT id FROM clients WHERE email = 'sophie.durand@cloudtech.io'),
    '2024-03-30',
    'ouvert'
),
(
    'Application Mobile iOS/Android',
    'Développement d''une application mobile native pour iOS et Android',
    65000.00,
    90,
    'fermeture',
    (SELECT id FROM clients WHERE email = 'luc.moreau@websolutions.net'),
    '2024-02-28',
    'ouvert'
),
(
    'Audit Sécurité Informatique',
    'Audit complet de sécurité avec recommandations et mise en conformité RGPD',
    25000.00,
    55,
    'proposition',
    (SELECT id FROM clients WHERE email = 'camille.leroy@digitech.fr'),
    '2024-04-15',
    'ouvert'
);

-- Insertion des tâches
INSERT INTO taches (titre, description, priorite, statut, date_echeance, client_id, opportunite_id) VALUES
(
    'Appel de suivi - TechCorp',
    'Appeler Jean Dupont pour faire le point sur l''avancement du projet CRM',
    'haute',
    'a_faire',
    '2024-01-25',
    (SELECT id FROM clients WHERE email = 'jean.dupont@techcorp.fr'),
    (SELECT id FROM opportunites WHERE titre = 'Refonte système CRM')
),
(
    'Envoi proposition commerciale',
    'Finaliser et envoyer la proposition commerciale pour la plateforme e-commerce',
    'haute',
    'en_cours',
    '2024-01-22',
    (SELECT id FROM clients WHERE email = 'marie.martin@innovsoft.com'),
    (SELECT id FROM opportunites WHERE titre = 'Plateforme E-commerce B2B')
),
(
    'Rendez-vous de présentation',
    'Organiser une présentation de nos solutions BI chez DataSys',
    'moyenne',
    'a_faire',
    '2024-01-30',
    (SELECT id FROM clients WHERE email = 'pierre.bernard@datasys.fr'),
    (SELECT id FROM opportunites WHERE titre = 'Solution BI et Analytics')
),
(
    'Analyse technique AWS',
    'Réaliser l''analyse technique pour la migration cloud',
    'haute',
    'en_cours',
    '2024-01-28',
    (SELECT id FROM clients WHERE email = 'sophie.durand@cloudtech.io'),
    (SELECT id FROM clients WHERE email = 'sophie.durand@cloudtech.io')
),
(
    'Signature contrat mobile',
    'Finaliser la signature du contrat pour l''application mobile',
    'haute',
    'a_faire',
    '2024-01-26',
    (SELECT id FROM clients WHERE email = 'luc.moreau@websolutions.net'),
    (SELECT id FROM opportunites WHERE titre = 'Application Mobile iOS/Android')
),
(
    'Relance email - DigiTech',
    'Envoyer un email de relance concernant l''audit sécurité',
    'moyenne',
    'a_faire',
    '2024-01-24',
    (SELECT id FROM clients WHERE email = 'camille.leroy@digitech.fr'),
    NULL
),
(
    'Préparation démonstration',
    'Préparer la démonstration technique pour StartUp Dynamics',
    'basse',
    'a_faire',
    '2024-02-05',
    (SELECT id FROM clients WHERE email = 'thomas.roux@startup.co'),
    NULL
);

-- Insertion d'interactions (historique)
INSERT INTO interactions (type, sujet, contenu, client_id, opportunite_id) VALUES
(
    'appel',
    'Premier contact - Projet CRM',
    'Discussion initiale sur les besoins en CRM. Client très intéressé par notre solution.',
    (SELECT id FROM clients WHERE email = 'jean.dupont@techcorp.fr'),
    (SELECT id FROM opportunites WHERE titre = 'Refonte système CRM')
),
(
    'email',
    'Envoi documentation technique',
    'Envoi de la documentation technique et des cas d''usage pour la plateforme e-commerce.',
    (SELECT id FROM clients WHERE email = 'marie.martin@innovsoft.com'),
    (SELECT id FROM opportunites WHERE titre = 'Plateforme E-commerce B2B')
),
(
    'reunion',
    'Réunion de cadrage - Solution BI',
    'Réunion de 2h pour définir les besoins précis en Business Intelligence.',
    (SELECT id FROM clients WHERE email = 'pierre.bernard@datasys.fr'),
    (SELECT id FROM opportunites WHERE titre = 'Solution BI et Analytics')
),
(
    'appel',
    'Suivi proposition - Migration Cloud',
    'Appel de suivi concernant la proposition de migration AWS. Questions sur les coûts.',
    (SELECT id FROM clients WHERE email = 'sophie.durand@cloudtech.io'),
    (SELECT id FROM opportunites WHERE titre = 'Migration Cloud AWS')
),
(
    'email',
    'Confirmation planning - App Mobile',
    'Confirmation du planning de développement pour l''application mobile.',
    (SELECT id FROM clients WHERE email = 'luc.moreau@websolutions.net'),
    (SELECT id FROM opportunites WHERE titre = 'Application Mobile iOS/Android')
);
