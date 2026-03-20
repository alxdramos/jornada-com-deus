-- ============================================================
-- B16: Content Library — CMS de conteúdo para admin
-- Gerencia: meditação, oração, devocional, estudo bíblico, kids
-- ============================================================

CREATE TABLE IF NOT EXISTS content_library (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  type          TEXT        NOT NULL CHECK (type IN ('meditacao', 'oracao', 'devocional', 'estudo', 'kids')),
  status        TEXT        NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  title         TEXT        NOT NULL,
  short_title   TEXT,
  description   TEXT,
  content       TEXT,
  reference     TEXT,        -- referência bíblica (ex: "João 3:16")
  category      TEXT,        -- categoria dentro do tipo
  plus          BOOLEAN     DEFAULT false,
  audio_url     TEXT,        -- URL pública no Cloudflare R2
  audio_duration INTEGER,   -- duração em segundos
  image_url     TEXT,        -- URL pública no Cloudflare R2
  tags          TEXT[]      DEFAULT '{}',
  sort_order    INTEGER     DEFAULT 0,
  created_by    UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para queries do admin
CREATE INDEX IF NOT EXISTS content_library_type_idx    ON content_library (type);
CREATE INDEX IF NOT EXISTS content_library_status_idx  ON content_library (status);
CREATE INDEX IF NOT EXISTS content_library_type_status ON content_library (type, status);

-- Trigger: atualiza updated_at automaticamente
CREATE OR REPLACE FUNCTION update_content_library_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS content_library_updated_at ON content_library;
CREATE TRIGGER content_library_updated_at
  BEFORE UPDATE ON content_library
  FOR EACH ROW EXECUTE FUNCTION update_content_library_updated_at();

-- RLS: apenas admins podem gerenciar conteúdo
ALTER TABLE content_library ENABLE ROW LEVEL SECURITY;

-- Admins têm acesso total
CREATE POLICY "admin_full_access" ON content_library
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

-- Usuários autenticados leem apenas conteúdo publicado
CREATE POLICY "authenticated_read_published" ON content_library
  FOR SELECT
  USING (status = 'published');
