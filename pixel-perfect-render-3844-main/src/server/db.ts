import { Pool } from "pg";
import { env } from "../env";

let pool: Pool | null = null;
let isPostgresAvailable = false;

// In-memory fallback for local development when PostgreSQL is not yet spun up
const memoryStore = {
  users: new Map<string, { id: number; email: string; is_verified: boolean; created_at: string }>(),
  verification_codes: [] as Array<{ email: string; code: string; expires_at: Date; used: boolean }>,
  user_profiles: [] as Array<{
    user_email: string;
    profile_type: string;
    version: number;
    data: any;
    created_at: string;
  }>,
  daily_records: new Map<string, any>(),
};

export async function getDbPool(): Promise<Pool | null> {
  if (pool) return pool;

  if (!env.DATABASE_URL) {
    console.warn(
      "[Database] No DATABASE_URL specified. Running with in-memory persistence fallback.",
    );
    return null;
  }

  try {
    pool = new Pool({
      connectionString: env.DATABASE_URL,
      ssl: env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
      max: 10,
      idleTimeoutMillis: 30000,
    });

    const client = await pool.connect();
    try {
      await client.query("SELECT 1;");
      isPostgresAvailable = true;
      console.log("[Database] Connected to PostgreSQL successfully.");

      // Ensure tables exist
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            is_verified BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS verification_codes (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            code VARCHAR(10) NOT NULL,
            expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
            used BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS user_profiles (
            id SERIAL PRIMARY KEY,
            user_email VARCHAR(255) NOT NULL,
            profile_type VARCHAR(50) NOT NULL,
            version INTEGER NOT NULL DEFAULT 1,
            data JSONB NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS daily_records (
            id SERIAL PRIMARY KEY,
            user_email VARCHAR(255) NOT NULL,
            date_key VARCHAR(10) NOT NULL,
            tarot JSONB NOT NULL,
            domino JSONB NOT NULL,
            advice JSONB NOT NULL,
            ai_reflection TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT uq_daily_user_date UNIQUE (user_email, date_key)
        );
      `);
    } finally {
      client.release();
    }
  } catch (err) {
    console.warn(
      "[Database] PostgreSQL connection failed, falling back to memory store:",
      (err as Error).message,
    );
    isPostgresAvailable = false;
    pool = null;
  }

  return pool;
}

// Database helper operations
export const db = {
  async saveVerificationCode(email: string, code: string, expiresAt: Date): Promise<void> {
    const p = await getDbPool();
    if (p && isPostgresAvailable) {
      await p.query(
        "INSERT INTO verification_codes (email, code, expires_at) VALUES ($1, $2, $3)",
        [email.toLowerCase(), code, expiresAt],
      );
    } else {
      memoryStore.verification_codes.push({
        email: email.toLowerCase(),
        code,
        expires_at: expiresAt,
        used: false,
      });
    }
  },

  async verifyCode(email: string, code: string): Promise<boolean> {
    const normalizedEmail = email.toLowerCase();
    const p = await getDbPool();
    if (p && isPostgresAvailable) {
      const res = await p.query(
        `SELECT id FROM verification_codes 
         WHERE email = $1 AND code = $2 AND used = FALSE AND expires_at > NOW() 
         ORDER BY id DESC LIMIT 1`,
        [normalizedEmail, code],
      );
      if (res.rows.length === 0) return false;

      const codeId = res.rows[0].id;
      await p.query("UPDATE verification_codes SET used = TRUE WHERE id = $1", [codeId]);
      await p.query(
        `INSERT INTO users (email, is_verified) VALUES ($1, TRUE) 
         ON CONFLICT (email) DO UPDATE SET is_verified = TRUE`,
        [normalizedEmail],
      );
      return true;
    } else {
      const matchIndex = memoryStore.verification_codes.findIndex(
        (c) =>
          c.email === normalizedEmail && c.code === code && !c.used && c.expires_at > new Date(),
      );
      if (matchIndex === -1) return false;

      memoryStore.verification_codes[matchIndex]!.used = true;
      memoryStore.users.set(normalizedEmail, {
        id: memoryStore.users.size + 1,
        email: normalizedEmail,
        is_verified: true,
        created_at: new Date().toISOString(),
      });
      return true;
    }
  },

  async isUserVerified(email: string): Promise<boolean> {
    const normalizedEmail = email.toLowerCase();
    const p = await getDbPool();
    if (p && isPostgresAvailable) {
      const res = await p.query("SELECT is_verified FROM users WHERE email = $1", [
        normalizedEmail,
      ]);
      return res.rows.length > 0 && res.rows[0].is_verified === true;
    } else {
      const u = memoryStore.users.get(normalizedEmail);
      return Boolean(u?.is_verified);
    }
  },

  async saveProfile(email: string, profileType: "innate" | "acquired", data: any): Promise<number> {
    const normalizedEmail = email.toLowerCase();
    const p = await getDbPool();
    if (p && isPostgresAvailable) {
      const countRes = await p.query(
        "SELECT COUNT(*)::int AS count FROM user_profiles WHERE user_email = $1 AND profile_type = $2",
        [normalizedEmail, profileType],
      );
      const nextVersion = (countRes.rows[0]?.count || 0) + 1;
      await p.query(
        "INSERT INTO user_profiles (user_email, profile_type, version, data) VALUES ($1, $2, $3, $4)",
        [normalizedEmail, profileType, nextVersion, JSON.stringify(data)],
      );
      return nextVersion;
    } else {
      const currentList = memoryStore.user_profiles.filter(
        (p) => p.user_email === normalizedEmail && p.profile_type === profileType,
      );
      const nextVersion = currentList.length + 1;
      memoryStore.user_profiles.push({
        user_email: normalizedEmail,
        profile_type: profileType,
        version: nextVersion,
        data,
        created_at: new Date().toISOString(),
      });
      return nextVersion;
    }
  },

  async getProfiles(email: string, profileType: "innate" | "acquired"): Promise<any[]> {
    const normalizedEmail = email.toLowerCase();
    const p = await getDbPool();
    if (p && isPostgresAvailable) {
      const res = await p.query(
        "SELECT version, data, created_at FROM user_profiles WHERE user_email = $1 AND profile_type = $2 ORDER BY version ASC",
        [normalizedEmail, profileType],
      );
      return res.rows.map((r) => ({
        version: r.version,
        data: typeof r.data === "string" ? JSON.parse(r.data) : r.data,
        createdAt: r.created_at,
      }));
    } else {
      return memoryStore.user_profiles
        .filter((p) => p.user_email === normalizedEmail && p.profile_type === profileType)
        .map((p) => ({
          version: p.version,
          data: p.data,
          createdAt: p.created_at,
        }));
    }
  },

  async getDailyRecord(email: string, dateKey: string): Promise<any | null> {
    const normalizedEmail = email.toLowerCase();
    const p = await getDbPool();
    if (p && isPostgresAvailable) {
      const res = await p.query(
        "SELECT tarot, domino, advice, ai_reflection FROM daily_records WHERE user_email = $1 AND date_key = $2",
        [normalizedEmail, dateKey],
      );
      if (res.rows.length === 0) return null;
      const r = res.rows[0];
      return {
        tarot: typeof r.tarot === "string" ? JSON.parse(r.tarot) : r.tarot,
        domino: typeof r.domino === "string" ? JSON.parse(r.domino) : r.domino,
        advice: typeof r.advice === "string" ? JSON.parse(r.advice) : r.advice,
        aiReflection: r.ai_reflection,
      };
    } else {
      const key = `${normalizedEmail}:${dateKey}`;
      return memoryStore.daily_records.get(key) || null;
    }
  },

  async saveDailyRecord(
    email: string,
    dateKey: string,
    tarot: any,
    domino: any,
    advice: any,
    aiReflection?: string,
  ): Promise<void> {
    const normalizedEmail = email.toLowerCase();
    const p = await getDbPool();
    if (p && isPostgresAvailable) {
      await p.query(
        `INSERT INTO daily_records (user_email, date_key, tarot, domino, advice, ai_reflection)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (user_email, date_key) DO UPDATE 
         SET ai_reflection = COALESCE(EXCLUDED.ai_reflection, daily_records.ai_reflection)`,
        [
          normalizedEmail,
          dateKey,
          JSON.stringify(tarot),
          JSON.stringify(domino),
          JSON.stringify(advice),
          aiReflection || null,
        ],
      );
    } else {
      const key = `${normalizedEmail}:${dateKey}`;
      memoryStore.daily_records.set(key, { tarot, domino, advice, aiReflection });
    }
  },

  async getAllUsers(): Promise<
    Array<{
      id: number;
      email: string;
      is_verified: boolean;
      created_at: string;
    }>
  > {
    const p = await getDbPool();
    if (p && isPostgresAvailable) {
      const res = await p.query(
        "SELECT id, email, is_verified, created_at FROM users ORDER BY id DESC;",
      );
      return res.rows.map((row) => ({
        id: row.id,
        email: row.email,
        is_verified: row.is_verified,
        created_at: row.created_at
          ? new Date(row.created_at).toISOString()
          : new Date().toISOString(),
      }));
    } else {
      return Array.from(memoryStore.users.values()).sort((a, b) => b.id - a.id);
    }
  },
};
