-- =============================================================================
-- TRADITION IA — SCHÉMA MYSQL (LOCAL / XAMPP)
-- =============================================================================
-- Compatible : MySQL 5.7+ / MariaDB 10.3+ / XAMPP
-- Base de données : traductionia
-- =============================================================================

-- Sélection de la base de données
USE traductionia;

-- Configuration du charset
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- =============================================================================
-- 1. GROUPES ETHNIQUES
-- =============================================================================
CREATE TABLE IF NOT EXISTS groupes_ethniques (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    nom           VARCHAR(80)  NOT NULL UNIQUE,
    region        VARCHAR(150) NOT NULL,
    resume_culturel TEXT,
    nom_masque    VARCHAR(100) NOT NULL DEFAULT '',
    url_image_masque VARCHAR(255) NOT NULL DEFAULT '',
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 2. LANGUES
-- =============================================================================
CREATE TABLE IF NOT EXISTS langues (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    groupe_ethnique_id INT REFERENCES groupes_ethniques(id),
    code             VARCHAR(10)  NOT NULL UNIQUE,
    nom              VARCHAR(80)  NOT NULL,
    nom_natif        VARCHAR(100) NOT NULL DEFAULT '',
    famille          VARCHAR(100) DEFAULT 'Bantoue',
    estimation_locuteurs VARCHAR(50),
    region           VARCHAR(200),
    systeme_tonal    TEXT,
    regles_grammaticales TEXT,
    url_image_masque VARCHAR(255) NOT NULL DEFAULT '',
    est_actif        TINYINT(1)   DEFAULT 1,
    ordre_affichage  INT          DEFAULT 0,
    date_creation    DATETIME     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 3. DICTIONNAIRE
-- =============================================================================
CREATE TABLE IF NOT EXISTS entrees_dictionnaire (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    langue_id        INT NOT NULL,
    mot_francais     VARCHAR(150) NOT NULL,
    traduction_locale VARCHAR(150) NOT NULL,
    phonetique       VARCHAR(150),
    categorie        VARCHAR(80) DEFAULT 'nom',
    definition       TEXT,
    exemple_francais TEXT,
    exemple_local    TEXT,
    notes_culturelles TEXT,
    est_valide       TINYINT(1) DEFAULT 1,
    date_creation    DATETIME   DEFAULT CURRENT_TIMESTAMP,
    date_mise_a_jour DATETIME   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (langue_id) REFERENCES langues(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index pour la recherche rapide
CREATE INDEX IF NOT EXISTS idx_dict_recherche ON entrees_dictionnaire(mot_francais, langue_id);
CREATE INDEX IF NOT EXISTS idx_dict_traduction ON entrees_dictionnaire(traduction_locale, langue_id);

-- =============================================================================
-- 4. EXPRESSIONS, PHRASES, PROVERBES
-- =============================================================================
CREATE TABLE IF NOT EXISTS expressions_culturelles (
    id                   INT AUTO_INCREMENT PRIMARY KEY,
    langue_id            INT NOT NULL,
    type_expression      ENUM('phrase','proverbe','dialogue','chanson','salutation','expression') NOT NULL DEFAULT 'phrase',
    contenu_francais     TEXT NOT NULL,
    contenu_local        TEXT NOT NULL,
    sens_philosophique   TEXT,
    contexte_utilisation VARCHAR(150),
    langue_origine       VARCHAR(100),
    est_valide           TINYINT(1) DEFAULT 1,
    date_creation        DATETIME   DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (langue_id) REFERENCES langues(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX IF NOT EXISTS idx_expr_type ON expressions_culturelles(type_expression, langue_id);

-- =============================================================================
-- 5. HISTORIQUE DES TRADUCTIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS historique_traductions (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    langue_source    VARCHAR(50)  NOT NULL DEFAULT 'Français',
    langue_cible     VARCHAR(50)  NOT NULL,
    texte_source     TEXT         NOT NULL,
    texte_traduit    TEXT         NOT NULL,
    source_moteur    VARCHAR(50)  DEFAULT 'knowledge',
    est_exact        TINYINT(1)   DEFAULT 1,
    date_creation    DATETIME     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 6. DONNÉES INITIALES — LANGUES GABONAISES
-- =============================================================================

-- Groupes ethniques
INSERT IGNORE INTO groupes_ethniques (nom, region, resume_culturel, nom_masque, url_image_masque) VALUES
('Fang',   'Woleu-Ntem, Estuaire, Ogooué-Ivindo',      'Peuple du Grand Nord gabonais, gardiens du culte du Byeri et de l épopée du Mvet.', 'Ngil / Byeri', 'images/fang.png'),
('Punu',   'Nyanga, Ngounié',                           'Peuple du Sud gabonais, célèbre pour le masque blanc Mukudji symbolisant la beauté et la paix.', 'Mukudji (Okuyi)', 'images/punu.png'),
('Myènè',  'Ogooué-Maritime, Moyen-Ogooué, Estuaire',  'Peuple côtier réputé pour ses rites maritimes et le masque Okukwé de l Ogooué.', 'Okukwé', 'images/myene.png'),
('Nzébi',  'Ogooué-Lolo, Ngounié',                     'Peuple des monts Chaillu, maîtres du travail du fer et des danses traditionnelles.', 'Bwiti Nzebi', 'images/nzebi.png'),
('Téké',   'Haut-Ogooué',                               'Gardiens des plateaux Batéké, créateurs du célèbre masque rond lunaire Téké.', 'Masque Plat Téké', 'images/teke.png'),
('Vili',   'Nyanga',                                    'Peuple maritime du Sud, héritiers du grand royaume de Loango.', 'Nkisi Vili', 'images/vili.png'),
('Obamba', 'Haut-Ogooué',                               'Peuple réputé pour ses figures de reliquaires en cuivre et laiton Mbulu-Ngulu.', 'Mbulu-Ngulu', 'images/obamba.png'),
('Guisir', 'Ngounié',                                   'Peuple forestier voisin des Punu, perpétuant le culte de l Okuyi et les traditions Bwiti.', 'Okuyi Guisir', 'images/guisir.png'),
('Kota',   'Ogooué-Ivindo',                             'Gardiens de la grande forêt équatoriale, célèbres mondialement pour leurs reliquaires en cuivre poli.', 'Reliquaire Kota', 'images/kota.png');

-- Langues gabonaises
INSERT IGNORE INTO langues (code, nom, nom_natif, famille, region, estimation_locuteurs, url_image_masque, ordre_affichage) VALUES
('fan', 'Fang',    'Fang',       'Bantoue du Nord-Ouest', 'Estuaire (Libreville), Woleu-Ntem (Oyem), Ogooué-Ivindo', '~800 000 locuteurs', 'images/fang.png',   1),
('puu', 'Punu',    'Punu',       'Bantoue (B40)',          'Nyanga (Tchibanga), Ngounié (Mouila)',                     '~300 000 locuteurs', 'images/punu.png',   2),
('mye', 'Myènè',   'Myènè',      'Bantoue (B10)',           'Estuaire (Libreville), Port-Gentil, Lambaréné',            '~50 000 locuteurs',  'images/myene.png',  3),
('nzb', 'Nzébi',   'Nzébi',      'Bantoue (B50)',           'Ngounié (Mbigou), Ogooué-Lolo (Koulamoutou)',              '~150 000 locuteurs', 'images/nzebi.png',  4),
('tek', 'Téké',    'Téké',       'Bantoue (B70)',           'Haut-Ogooué (Franceville, Bongoville)',                    '~60 000 locuteurs',  'images/teke.png',   5),
('vif', 'Vili',    'Vili',       'Bantoue (H40)',           'Nyanga (Mayumba), Littoral Sud',                           '~30 000 locuteurs',  'images/vili.png',   6),
('obb', 'Obamba',  'Obamba',     'Bantoue (B60)',           'Haut-Ogooué (Okondja)',                                    '~40 000 locuteurs',  'images/obamba.png', 7),
('gsi', 'Guisir',  'Guisir',     'Bantoue (B40)',           'Ngounié (Fougamou, Mandji)',                               '~40 000 locuteurs',  'images/guisir.png', 8),
('kto', 'Kota',    'Kota',       'Bantoue (B20)',           'Ogooué-Ivindo (Makokou, Booué)',                           '~50 000 locuteurs',  'images/kota.png',   9),
('eng', 'Anglais', 'Anglais',    'Germanique',              'International / Traduction globale',                       'Global',              'images/anglais.png',    10);



