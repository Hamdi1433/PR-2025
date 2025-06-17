-- Insertion de données de démonstration

-- Insertion des utilisateurs de démonstration
INSERT INTO utilisateurs (email, mot_de_passe_hash, nom, prenom, role_id, telephone, preferences, objectifs) VALUES
(
    'admin@premunia.com',
    '$2b$10$example_hash_admin',
    'Admin',
    'Directeur',
    (SELECT id FROM roles WHERE nom = 'admin'),
    '+33 1 23 45 67 89',
    '{"theme": "light", "notifications": true}',
    '{}'
),
(
    'jean@premunia.fr',
    '$2b$10$example_hash_jean',
    'Conseiller',
    'Jean',
    (SELECT id FROM roles WHERE nom = 'conseiller'),
    '+33 1 23 45 67 90',
    '{"theme": "light", "notifications": true}',
    '{"contacts_mensuel": 50, "ca_mensuel": 25000}'
),
(
    'sophie@premunia.fr',
    '$2b$10$example_hash_sophie',
    'Gestionnaire',
    'Sophie',
    (SELECT id FROM roles WHERE nom = 'gestionnaire'),
    '+33 1 23 45 67 91',
    '{"theme": "light", "notifications": true}',
    '{"tickets_resolution": 24, "satisfaction": 4.5}'
),
(
    'pierre@premunia.fr',
    '$2b$10$example_hash_pierre',
    'Commercial',
    'Pierre',
    (SELECT id FROM roles WHERE nom = 'conseiller'),
    '+33 1 23 45 67 92',
    '{"theme": "light", "notifications": true}',
    '{"contacts_mensuel": 60, "ca_mensuel": 30000}'
),
(
    'qualite@premunia.fr',
    '$2b$10$example_hash_qualite',
    'Qualité',
    'Pierre',
    (SELECT id FROM roles WHERE nom = 'qualite'),
    '+33 1 23 45 67 93',
    '{"theme": "light", "notifications": true}',
    '{}'
);

-- Création d'équipes
INSERT INTO equipes (nom, description, gestionnaire_id) VALUES
(
    'Équipe Commerciale',
    'Équipe des conseillers commerciaux',
    (SELECT id FROM utilisateurs WHERE email = 'sophie@premunia.fr')
);

-- Assignation des utilisateurs aux équipes
INSERT INTO utilisateurs_equipes (utilisateur_id, equipe_id) VALUES
(
    (SELECT id FROM utilisateurs WHERE email = 'jean@premunia.fr'),
    (SELECT id FROM equipes WHERE nom = 'Équipe Commerciale')
),
(
    (SELECT id FROM utilisateurs WHERE email = 'pierre@premunia.fr'),
    (SELECT id FROM equipes WHERE nom = 'Équipe Commerciale')
);

-- Insertion de contacts de démonstration
INSERT INTO contacts (nom, prenom, email, telephone, entreprise, statut, score, conseiller_id, source, tags) VALUES
(
    'Dubois',
    'Marie',
    'marie.dubois@email.com',
    '+33 1 23 45 67 89',
    'TechCorp Solutions',
    'prospect',
    85,
    (SELECT id FROM utilisateurs WHERE email = 'jean@premunia.fr'),
    'site_web',
    ARRAY['prospect_chaud', 'immobilier']
),
(
    'Martin',
    'Jean',
    'jean.martin@email.com',
    '+33 1 98 76 54 32',
    'InnovSoft',
    'lead',
    92,
    (SELECT id FROM utilisateurs WHERE email = 'jean@premunia.fr'),
    'referral',
    ARRAY['rdv_programme', 'assurance_vie']
),
(
    'Laurent',
    'Sophie',
    'sophie.laurent@email.com',
    '+33 1 45 67 89 12',
    'DataSys Analytics',
    'prospect',
    67,
    (SELECT id FROM utilisateurs WHERE email = 'pierre@premunia.fr'),
    'campagne_email',
    ARRAY['proposition_envoyee']
);

-- Insertion de propositions
INSERT INTO propositions (numero, titre, description, montant_ht, montant_ttc, statut, probabilite, contact_id, conseiller_id, date_expiration) VALUES
(
    'PROP-2024-001',
    'Assurance Vie Premium',
    'Contrat d''assurance vie avec options de placement diversifiées',
    15000.00,
    15000.00,
    'envoyee',
    80,
    (SELECT id FROM contacts WHERE email = 'marie.dubois@email.com'),
    (SELECT id FROM utilisateurs WHERE email = 'jean@premunia.fr'),
    '2024-02-15'
),
(
    'PROP-2024-002',
    'Assurance Habitation',
    'Couverture complète pour résidence principale',
    1200.00,
    1440.00,
    'acceptee',
    100,
    (SELECT id FROM contacts WHERE email = 'jean.martin@email.com'),
    (SELECT id FROM utilisateurs WHERE email = 'jean@premunia.fr'),
    '2024-02-10'
);

-- Insertion de contrats
INSERT INTO contrats (numero, titre, type_contrat, montant_mensuel, montant_annuel, statut, contact_id, proposition_id, conseiller_id, date_signature, date_effet, date_echeance) VALUES
(
    'CONT-2024-001',
    'Assurance Habitation Jean Martin',
    'assurance_habitation',
    120.00,
    1440.00,
    'actif',
    (SELECT id FROM contacts WHERE email = 'jean.martin@email.com'),
    (SELECT id FROM propositions WHERE numero = 'PROP-2024-002'),
    (SELECT id FROM utilisateurs WHERE email = 'jean@premunia.fr'),
    '2024-01-18',
    '2024-02-01',
    '2025-02-01'
);

-- Insertion de tâches
INSERT INTO taches (titre, description, priorite, statut, assignee_id, contact_id, date_echeance) VALUES
(
    'Appeler Marie Dubois',
    'Suivi de la proposition d''assurance vie envoyée',
    'haute',
    'a_faire',
    (SELECT id FROM utilisateurs WHERE email = 'jean@premunia.fr'),
    (SELECT id FROM contacts WHERE email = 'marie.dubois@email.com'),
    NOW() + INTERVAL '1 day'
),
(
    'Préparer proposition Jean Martin',
    'Établir une nouvelle proposition pour assurance auto',
    'haute',
    'en_cours',
    (SELECT id FROM utilisateurs WHERE email = 'jean@premunia.fr'),
    (SELECT id FROM contacts WHERE email = 'jean.martin@email.com'),
    NOW() + INTERVAL '2 days'
),
(
    'Relancer Sophie Laurent',
    'Relance suite à l''envoi de la proposition',
    'moyenne',
    'a_faire',
    (SELECT id FROM utilisateurs WHERE email = 'pierre@premunia.fr'),
    (SELECT id FROM contacts WHERE email = 'sophie.laurent@email.com'),
    NOW() + INTERVAL '1 week'
);

-- Insertion de tickets
INSERT INTO tickets (numero, sujet, description, type_ticket, priorite, statut, contact_id, contrat_id, assignee_id, canal) VALUES
(
    'TK-2024-001',
    'Problème de remboursement',
    'Je n''ai pas reçu mon remboursement pour les frais médicaux du mois dernier',
    'remboursement',
    'haute',
    'nouveau',
    (SELECT id FROM contacts WHERE email = 'marie.dubois@email.com'),
    NULL,
    (SELECT id FROM utilisateurs WHERE email = 'sophie@premunia.fr'),
    'email'
),
(
    'TK-2024-002',
    'Modification de contrat',
    'Je souhaite modifier les bénéficiaires de mon contrat d''assurance vie',
    'modification_contrat',
    'normale',
    'en_cours',
    (SELECT id FROM contacts WHERE email = 'jean.martin@email.com'),
    (SELECT id FROM contrats WHERE numero = 'CONT-2024-001'),
    (SELECT id FROM utilisateurs WHERE email = 'sophie@premunia.fr'),
    'telephone'
);

-- Insertion d'objectifs
INSERT INTO objectifs (nom, description, type_objectif, valeur_cible, valeur_actuelle, unite, periode_debut, periode_fin, utilisateur_id) VALUES
(
    'Contacts Janvier 2024',
    'Objectif de nouveaux contacts pour janvier',
    'contacts',
    50,
    42,
    'contacts',
    '2024-01-01',
    '2024-01-31',
    (SELECT id FROM utilisateurs WHERE email = 'jean@premunia.fr')
),
(
    'CA Janvier 2024',
    'Objectif de chiffre d''affaires pour janvier',
    'ca',
    25000,
    18500,
    'euros',
    '2024-01-01',
    '2024-01-31',
    (SELECT id FROM utilisateurs WHERE email = 'jean@premunia.fr')
);
