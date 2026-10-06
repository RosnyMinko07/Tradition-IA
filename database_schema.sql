-- =============================================================================
-- TRADITION IA — SCRIPT DDL COMPLET DE BASE DE DONNÉES (POSTGRESQL / SUPABASE)
-- =============================================================================
-- Schéma 100% francisé : Noms des tables et champs traduits en français
-- Compatible : PostgreSQL 13+, Supabase, Neon, Render, Google Cloud SQL
-- =============================================================================

-- 1. EXTENSIONS REQUISES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 2. GROUPES ETHNIQUES & LANGUES GABONAISES
-- =============================================================================

-- Table : groupes_ethniques
CREATE TABLE IF NOT EXISTS groupes_ethniques (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(80) NOT NULL UNIQUE,
    region VARCHAR(150) NOT NULL,
    resume_culturel TEXT,
    nom_masque VARCHAR(100) NOT NULL,
    url_image_masque VARCHAR(255) NOT NULL,
    date_creation TIMESTAMPTZ DEFAULT NOW()
);

-- Table : langues
CREATE TABLE IF NOT EXISTS langues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    groupe_ethnique_id UUID REFERENCES groupes_ethniques(id) ON DELETE SET NULL,
    code VARCHAR(10) NOT NULL UNIQUE,
    nom VARCHAR(80) NOT NULL,
    nom_natif VARCHAR(100) NOT NULL,
    famille VARCHAR(100) DEFAULT 'Bantoue',
    estimation_locuteurs VARCHAR(50),
    region VARCHAR(200),
    systeme_tonal TEXT,
    regles_grammaticales TEXT,
    url_image_masque VARCHAR(255) NOT NULL,
    est_actif BOOLEAN DEFAULT TRUE,
    ordre_affichage INT DEFAULT 0,
    date_creation TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 3. UTILISATEURS & AUTHENTIFICATION
-- =============================================================================

-- Table : utilisateurs
CREATE TABLE IF NOT EXISTS utilisateurs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    courriel VARCHAR(255) NOT NULL UNIQUE,
    mot_de_passe_hache VARCHAR(255) NOT NULL,
    nom_complet VARCHAR(120) NOT NULL,
    url_avatar VARCHAR(500),
    role VARCHAR(20) DEFAULT 'utilisateur' CHECK (role IN ('utilisateur', 'contributeur', 'linguiste', 'administrateur')),
    langue_preferee_id UUID REFERENCES langues(id) ON DELETE SET NULL,
    preference_theme VARCHAR(10) DEFAULT 'sombre' CHECK (preference_theme IN ('sombre', 'clair')),
    est_verifie BOOLEAN DEFAULT FALSE,
    cle_api VARCHAR(64) UNIQUE,
    quota_journalier INT DEFAULT 50,
    date_creation TIMESTAMPTZ DEFAULT NOW(),
    date_mise_a_jour TIMESTAMPTZ DEFAULT NOW(),
    derniere_connexion TIMESTAMPTZ
);

-- Table : sessions_utilisateurs
CREATE TABLE IF NOT EXISTS sessions_utilisateurs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    utilisateur_id UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
    jeton_rafraichissement TEXT NOT NULL,
    agent_utilisateur VARCHAR(255),
    adresse_ip VARCHAR(45),
    date_expiration TIMESTAMPTZ NOT NULL,
    date_creation TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 4. DICTIONNAIRE & PRONONCIATIONS AUDIO
-- =============================================================================

-- Table : entrees_dictionnaire
CREATE TABLE IF NOT EXISTS entrees_dictionnaire (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    langue_id UUID NOT NULL REFERENCES langues(id) ON DELETE CASCADE,
    mot_francais VARCHAR(150) NOT NULL,
    traduction_locale VARCHAR(150) NOT NULL,
    phonetique VARCHAR(150),
    categorie VARCHAR(50) DEFAULT 'nom',
    definition TEXT,
    exemple_francais TEXT,
    exemple_local TEXT,
    notes_culturelles TEXT,
    est_valide BOOLEAN DEFAULT TRUE,
    cree_par UUID REFERENCES utilisateurs(id) ON DELETE SET NULL,
    date_creation TIMESTAMPTZ DEFAULT NOW(),
    date_mise_a_jour TIMESTAMPTZ DEFAULT NOW()
);

-- Table : prononciations_audio
CREATE TABLE IF NOT EXISTS prononciations_audio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entree_dictionnaire_id UUID NOT NULL REFERENCES entrees_dictionnaire(id) ON DELETE CASCADE,
    url_audio VARCHAR(500) NOT NULL,
    genre_locuteur VARCHAR(10) CHECK (genre_locuteur IN ('Homme', 'Femme', 'Autre')),
    province_accent VARCHAR(80),
    est_verifie BOOLEAN DEFAULT TRUE,
    date_creation TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 5. EXPRESSIONS, PROVERBES ET CONTES
-- =============================================================================

-- Table : expressions_culturelles
CREATE TABLE IF NOT EXISTS expressions_culturelles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    langue_id UUID NOT NULL REFERENCES langues(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL CHECK (type IN ('proverbe', 'conte', 'expression', 'salutation', 'dialogue')),
    contenu_local TEXT NOT NULL,
    contenu_francais TEXT NOT NULL,
    sens_litteral TEXT,
    sens_philosophique TEXT,
    contexte_utilisation TEXT,
    url_audio VARCHAR(500),
    est_valide BOOLEAN DEFAULT TRUE,
    cree_par UUID REFERENCES utilisateurs(id) ON DELETE SET NULL,
    date_creation TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 6. HISTORIQUE DES TRADUCTIONS
-- =============================================================================

-- Table : historique_traductions
CREATE TABLE IF NOT EXISTS historique_traductions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    utilisateur_id UUID REFERENCES utilisateurs(id) ON DELETE CASCADE,
    langue_source_id UUID NOT NULL REFERENCES langues(id),
    langue_cible_id UUID NOT NULL REFERENCES langues(id),
    texte_source TEXT NOT NULL,
    texte_traduit TEXT NOT NULL,
    moteur_ia VARCHAR(50) DEFAULT 'tradition_ia_v2',
    score_confiance DECIMAL(4, 2) DEFAULT 0.95,
    latence_ms INT,
    est_favori BOOLEAN DEFAULT FALSE,
    date_creation TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 7. ASSISTANT IA & CONVERSATIONS
-- =============================================================================

-- Table : conversations_ia
CREATE TABLE IF NOT EXISTS conversations_ia (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    utilisateur_id UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
    titre VARCHAR(150) DEFAULT 'Nouvelle discussion',
    langue_contexte_id UUID REFERENCES langues(id) ON DELETE SET NULL,
    date_creation TIMESTAMPTZ DEFAULT NOW(),
    date_mise_a_jour TIMESTAMPTZ DEFAULT NOW()
);

-- Table : messages_ia
CREATE TABLE IF NOT EXISTS messages_ia (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations_ia(id) ON DELETE CASCADE,
    role_expediteur VARCHAR(20) NOT NULL CHECK (role_expediteur IN ('utilisateur', 'assistant', 'systeme')),
    contenu TEXT NOT NULL,
    references_culturelles JSONB DEFAULT '{}'::jsonb,
    date_creation TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 8. VALIDATION IA & CONTRIBUTIONS COMMUNAUTAIRES
-- =============================================================================

-- Table : validations_ia
CREATE TABLE IF NOT EXISTS validations_ia (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    utilisateur_id UUID REFERENCES utilisateurs(id) ON DELETE SET NULL,
    langue_id UUID NOT NULL REFERENCES langues(id) ON DELETE CASCADE,
    francais_source TEXT NOT NULL,
    traduction_suggeree TEXT NOT NULL,
    statut VARCHAR(20) DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'approuve', 'rejete')),
    relecteur_id UUID REFERENCES utilisateurs(id) ON DELETE SET NULL,
    notes_relecteur TEXT,
    date_creation TIMESTAMPTZ DEFAULT NOW(),
    date_relecture TIMESTAMPTZ
);

-- =============================================================================
-- 9. FAVORIS UTILISATEURS
-- =============================================================================

-- Table : favoris_utilisateurs
CREATE TABLE IF NOT EXISTS favoris_utilisateurs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    utilisateur_id UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
    type_element VARCHAR(30) NOT NULL CHECK (type_element IN ('traduction', 'mot_dictionnaire', 'expression')),
    element_id UUID NOT NULL,
    notes_personnalisees TEXT,
    date_creation TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 10. STATISTIQUES & PARAMÈTRES SYSTÈME
-- =============================================================================

-- Table : evenements_analytiques
CREATE TABLE IF NOT EXISTS evenements_analytiques (
    id BIGSERIAL PRIMARY KEY,
    nom_evenement VARCHAR(50) NOT NULL,
    code_langue VARCHAR(10),
    utilisateur_id UUID REFERENCES utilisateurs(id) ON DELETE SET NULL,
    duree_ms INT DEFAULT 0,
    date_creation TIMESTAMPTZ DEFAULT NOW()
);

-- Table : parametres_systeme
CREATE TABLE IF NOT EXISTS parametres_systeme (
    cle_parametre VARCHAR(80) PRIMARY KEY,
    valeur_parametre TEXT NOT NULL,
    description VARCHAR(255),
    date_mise_a_jour TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 11. INDEX D'OPTIMISATION DES PERFORMANCES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_utilisateurs_courriel ON utilisateurs(courriel);
CREATE INDEX IF NOT EXISTS idx_utilisateurs_role ON utilisateurs(role);
CREATE INDEX IF NOT EXISTS idx_langues_code ON langues(code);
CREATE INDEX IF NOT EXISTS idx_dictionnaire_recherche ON entrees_dictionnaire(mot_francais, langue_id);
CREATE INDEX IF NOT EXISTS idx_traductions_utilisateur ON historique_traductions(utilisateur_id, date_creation DESC);
CREATE INDEX IF NOT EXISTS idx_messages_ia_conv ON messages_ia(conversation_id, date_creation ASC);
CREATE INDEX IF NOT EXISTS idx_validations_statut ON validations_ia(statut, date_creation DESC);
CREATE INDEX IF NOT EXISTS idx_favoris_utilisateur ON favoris_utilisateurs(utilisateur_id);

-- =============================================================================
-- 12. DONNÉES INITIALES (SEEDING) : LANGUES GABONAISES ET GROUPES ETHNIQUES
-- =============================================================================

-- Insertion des 9 provinces / groupes ethniques emblématiques
INSERT INTO groupes_ethniques (nom, region, resume_culturel, nom_masque, url_image_masque)
VALUES
    ('Fang', 'Woleu-Ntem, Estuaire, Ogooué-Ivindo', 'Peuple du Grand Nord gabonais, gardiens du culte du Byeri et de l’épopée du Mvet.', 'Ngil / Byeri', 'images/fang.png'),
    ('Punu', 'Nyanga, Ngounié', 'Peuple du Sud gabonais, célèbre pour le masque blanc Mukudji symbolisant la beauté et la paix.', 'Mukudji (Okuyi)', 'images/punu.png'),
    ('Myènè', 'Ogooué-Maritime, Moyen-Ogooué, Estuaire', 'Peuple côtier réputé pour ses rites maritimes et le masque Okukwé de l’Ogooué.', 'Okukwé', 'images/myene.png'),
    ('Nzébi', 'Ogooué-Lolo, Ngounié', 'Peuple des monts Chaillu, maîtres du travail du fer et des danses traditionnelles.', 'Bwiti Nzebi', 'images/nzebi.png'),
    ('Téké', 'Haut-Ogooué', 'Gardiens des plateaux Batéké, créateurs du célèbre masque rond lunaire Téké.', 'Masque Plat Téké', 'images/teke.png'),
    ('Vili', 'Nyanga', 'Peuple maritime du Sud, héritiers du grand royaume de Loango.', 'Nkisi Vili', 'images/vili.png'),
    ('Obamba', 'Haut-Ogooué', 'Peuple réputé pour ses figures de reliquaires en cuivre et laiton Mbulu-Ngulu.', 'Mbulu-Ngulu', 'images/obamba.png'),
    ('Guisir', 'Ngounié', 'Peuple forestier voisin des Punu, perpétuant le culte de l’Okuyi et les traditions Bwiti.', 'Okuyi Guisir', 'images/guisir.png'),
    ('Kota', 'Ogooué-Ivindo', 'Gardiens de la grande forêt équatoriale, célèbres mondialement pour leurs reliquaires en cuivre poli.', 'Reliquaire Kota', 'images/kota.png')
ON CONFLICT (nom) DO NOTHING;

-- Insertion des langues gabonaises
INSERT INTO langues (code, nom, nom_natif, famille, region, estimation_locuteurs, url_image_masque, ordre_affichage)
VALUES
    ('fan', 'Fang', 'Fang-Beti', 'Bantoue du Nord-Ouest', 'Estuaire (Libreville), Woleu-Ntem (Oyem), Ogooué-Ivindo (Makokou)', '~800 000 locuteurs', 'images/fang.png', 1),
    ('puu', 'Punu', 'Yipunu', 'Bantoue (B40)', 'Nyanga (Tchibanga), Ngounié (Mouila)', '~300 000 locuteurs', 'images/punu.png', 2),
    ('mye', 'Myènè', 'Omyènè', 'Bantoue (B10)', 'Estuaire (Libreville), Port-Gentil, Lambaréné', '~50 000 locuteurs', 'images/myene.png', 3),
    ('nzb', 'Nzébi', 'Inzébi', 'Bantoue (B50)', 'Ngounié (Mbigou), Ogooué-Lolo (Koulamoutou)', '~150 000 locuteurs', 'images/nzebi.png', 4),
    ('tek', 'Téké', 'Iteke', 'Bantoue (B70)', 'Haut-Ogooué (Franceville, Bongoville)', '~60 000 locuteurs', 'images/teke.png', 5),
    ('vif', 'Vili', 'Icivili', 'Bantoue (H40)', 'Nyanga (Mayumba), Littoral Sud', '~30 000 locuteurs', 'images/vili.png', 6),
    ('obb', 'Obamba', 'Lembaama', 'Bantoue (B60)', 'Haut-Ogooué (Okondja)', '~40 000 locuteurs', 'images/obamba.png', 7),
    ('gsi', 'Guisir', 'Yigisir', 'Bantoue (B40)', 'Ngounié (Fougamou, Mandji)', '~40 000 locuteurs', 'images/guisir.png', 8),
    ('kto', 'Kota', 'Ikota', 'Bantoue (B20)', 'Ogooué-Ivindo (Makokou, Booué)', '~50 000 locuteurs', 'images/kota.png', 9),
    ('fra', 'Français', 'Français', 'Romane', 'Langue officielle du Gabon / Internationale', '~2 000 000 locuteurs', 'images/gabon_flag.png', 10),
    ('eng', 'Anglais', 'English', 'Germanique', 'Deuxième langue officielle / Internationale', 'Global', 'images/anglais.png', 11)
ON CONFLICT (code) DO NOTHING;

-- Insertion des paramètres système
INSERT INTO parametres_systeme (cle_parametre, valeur_parametre, description)
VALUES
    ('nom_plateforme', 'Tradition IA', 'Nom officiel de l''application'),
    ('version_moteur_ia', 'tradition_ia_v2.5', 'Version du moteur d''inférence linguistique'),
    ('quota_gratuit_journalier', '50', 'Nombre de traductions gratuites par jour pour un membre standard'),
    ('validation_communautaire_activee', 'true', 'Permettre aux locuteurs natifs de proposer des corrections'),
    ('mode_maintenance', 'false', 'Activation ou désactivation du mode maintenance')
ON CONFLICT (cle_parametre) DO NOTHING;
