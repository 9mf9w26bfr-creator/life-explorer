-- ==============================================================================
-- Life Explorer (个人综合人生探索平台) - PostgreSQL Schema
-- ==============================================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Email Verification Codes (Anti-Bot)
CREATE TABLE IF NOT EXISTS verification_codes (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    code VARCHAR(10) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_verification_email ON verification_codes(email);

-- 3. User Profiles (Innate & Acquired Versions)
CREATE TABLE IF NOT EXISTS user_profiles (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    profile_type VARCHAR(50) NOT NULL, -- 'innate' or 'acquired'
    version INTEGER NOT NULL DEFAULT 1,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_email FOREIGN KEY(user_email) REFERENCES users(email) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_profiles ON user_profiles(user_email, profile_type);

-- 4. Daily Fortune & Advice Records (Locked per day)
CREATE TABLE IF NOT EXISTS daily_records (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    date_key VARCHAR(10) NOT NULL, -- Format: YYYY-MM-DD
    tarot JSONB NOT NULL,
    domino JSONB NOT NULL,
    advice JSONB NOT NULL,
    ai_reflection TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_daily_user_date UNIQUE (user_email, date_key),
    CONSTRAINT fk_daily_user FOREIGN KEY(user_email) REFERENCES users(email) ON DELETE CASCADE
);
