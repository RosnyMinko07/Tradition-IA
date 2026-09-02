-- =============================================================================
-- TRADITION IA — SCRIPT DDL COMPLET DE BASE DE DONNÉES (POSTGRESQL / SUPABASE)
-- =============================================================================
-- Permet de créer l'intégralité des tables, relations, index et données initiales.
-- Compatible PostgreSQL 13+, Supabase, Google Cloud SQL, Neon, Render.
-- =============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 2. GROUPES ETHNIQUES & LANGUES GABONAISES
-- =============================================================================
CREATE TABLE IF NOT EXISTS ethnic_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(80) NOT NULL UNIQUE,
    region VARCHAR(150) NOT NULL,
    cultural_summary TEXT,
    mask_name VARCHAR(100) NOT NULL,
    mask_image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS languages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ethnic_group_id UUID REFERENCES ethnic_groups(id) ON DELETE SET NULL,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(80) NOT NULL,
    native_name VARCHAR(100) NOT NULL,
    family VARCHAR(100) DEFAULT 'Bantoue',
    speakers_estimate VARCHAR(50),
    region VARCHAR(200),
    tonal_system TEXT,
    grammar_rules TEXT,
    mask_image_url VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 3. UTILISATEURS & AUTHENTIFICATION
-- =============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    avatar_url VARCHAR(500),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'contributor', 'linguist', 'admin')),
    preferred_lang_id UUID REFERENCES languages(id) ON DELETE SET NULL,
    theme_preference VARCHAR(10) DEFAULT 'dark' CHECK (theme_preference IN ('dark', 'light')),
    is_verified BOOLEAN DEFAULT FALSE,
    api_key VARCHAR(64) UNIQUE,
    daily_quota INT DEFAULT 50,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token TEXT NOT NULL,
    user_agent VARCHAR(255),
    ip_address VARCHAR(45),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 4. DICTIONNAIRE & PRONONCIATIONS AUDIO
-- =============================================================================
CREATE TABLE IF NOT EXISTS dictionary_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    language_id UUID NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
    french_word VARCHAR(150) NOT NULL,
    local_translation VARCHAR(150) NOT NULL,
    phonetic VARCHAR(150),
    category VARCHAR(50) DEFAULT 'nom',
    definition TEXT,
    example_fr TEXT,
    example_local TEXT,
    cultural_notes TEXT,
    is_validated BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audio_pronunciations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dictionary_entry_id UUID NOT NULL REFERENCES dictionary_entries(id) ON DELETE CASCADE,
    audio_url VARCHAR(500) NOT NULL,
    speaker_gender VARCHAR(10) CHECK (speaker_gender IN ('M', 'F', 'Other')),
    accent_province VARCHAR(80),
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 5. EXPRESSIONS, PROVERBES ET CONTES
-- =============================================================================
CREATE TABLE IF NOT EXISTS cultural_expressions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    language_id UUID NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL CHECK (type IN ('proverbe', 'conte', 'expression', 'salutation', 'dialogue')),
    content_local TEXT NOT NULL,
    content_french TEXT NOT NULL,
    literal_meaning TEXT,
    philosophical_meaning TEXT,
    context_of_use TEXT,
    audio_url VARCHAR(500),
    is_validated BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 6. HISTORIQUE DES TRADUCTIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS translations_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    source_lang_id UUID NOT NULL REFERENCES languages(id),
    target_lang_id UUID NOT NULL REFERENCES languages(id),
    source_text TEXT NOT NULL,
    translated_text TEXT NOT NULL,
    engine VARCHAR(50) DEFAULT 'tradition_ia_v2',
    confidence_score DECIMAL(4, 2) DEFAULT 0.95,
    latency_ms INT,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 7. ASSISTANT IA & CONVERSATIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) DEFAULT 'Nouvelle discussion',
    context_language_id UUID REFERENCES languages(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    sender_role VARCHAR(20) NOT NULL CHECK (sender_role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    cultural_references JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 8. VALIDATION IA & CONTRIBUTIONS COMMUNAUTAIRES
-- =============================================================================
CREATE TABLE IF NOT EXISTS ai_validations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    language_id UUID NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
    source_french TEXT NOT NULL,
    suggested_translation TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewer_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

-- =============================================================================
-- 9. FAVORIS UTILISATEURS
-- =============================================================================
CREATE TABLE IF NOT EXISTS user_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_type VARCHAR(30) NOT NULL CHECK (item_type IN ('translation', 'dictionary_word', 'expression')),
    item_id UUID NOT NULL,
    custom_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 10. ANALYTICS & PARAMÈTRES SYSTÈME
-- =============================================================================
CREATE TABLE IF NOT EXISTS analytics_events (
    id BIGSERIAL PRIMARY KEY,
    event_name VARCHAR(50) NOT NULL,
    language_code VARCHAR(10),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    duration_ms INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS system_settings (
    setting_key VARCHAR(80) PRIMARY KEY,
    setting_value TEXT NOT NULL,
    description VARCHAR(255),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 11. INDEX D'OPTIMISATION DES PERFORMANCES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_languages_code ON languages(code);
CREATE INDEX IF NOT EXISTS idx_dictionary_search ON dictionary_entries(french_word, language_id);
CREATE INDEX IF NOT EXISTS idx_translations_user ON translations_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conv ON ai_messages(conversation_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_validations_status ON ai_validations(status, created_at DESC);

-- =============================================================================
-- 12. SEEDING INITIAL : INSERTION DES LANGUES GABONAISES ET MASQUES
-- =============================================================================
INSERT INTO languages (code, name, native_name, family, region, speakers_estimate, mask_image_url, display_order)
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
    ('eng', 'Anglais', 'English', 'Germanique', 'International / Traduction globale', 'Global', 'images/anglais.png', 10)
ON CONFLICT (code) DO NOTHING;
