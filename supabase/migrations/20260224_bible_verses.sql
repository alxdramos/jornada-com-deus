-- Migration: Tabela de versículos da Bíblia para busca full-text
-- Fonte dos dados: github.com/thiagobodruk/bible (CC BY-NC)
-- Tradução: Nova Versão Internacional (NVI)

-- Tabela principal
CREATE TABLE IF NOT EXISTS bible_verses (
  id          BIGSERIAL PRIMARY KEY,
  translation VARCHAR(10)  NOT NULL DEFAULT 'nvi',  -- 'nvi', 'acf', etc.
  book_index  SMALLINT     NOT NULL,                -- 0-65 (ordem canônica)
  book_id     VARCHAR(50)  NOT NULL,                -- ex: 'genesis', 'joao'
  book_name   VARCHAR(100) NOT NULL,                -- ex: 'Gênesis', 'João'
  testament   CHAR(2)      NOT NULL,                -- 'AT' ou 'NT'
  chapter     SMALLINT     NOT NULL,
  verse       SMALLINT     NOT NULL,
  text        TEXT         NOT NULL,
  search_vec  TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('portuguese', text)
  ) STORED,
  UNIQUE (translation, book_index, chapter, verse)
);

-- Índice para busca full-text em português
CREATE INDEX IF NOT EXISTS idx_bible_verses_search
  ON bible_verses USING GIN (search_vec);

-- Índices para navegação rápida
CREATE INDEX IF NOT EXISTS idx_bible_verses_book_chapter
  ON bible_verses (translation, book_index, chapter);

CREATE INDEX IF NOT EXISTS idx_bible_verses_testament
  ON bible_verses (translation, testament, book_index);

-- RLS: apenas leitura pública (a Bíblia é pública)
ALTER TABLE bible_verses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bible verses are publicly readable"
  ON bible_verses FOR SELECT
  USING (true);

-- View auxiliar para versículo do dia aleatório
CREATE OR REPLACE VIEW daily_verse AS
  SELECT *
  FROM bible_verses
  WHERE translation = 'nvi'
  ORDER BY RANDOM()
  LIMIT 1;

-- Função de busca full-text retornando resultados formatados
CREATE OR REPLACE FUNCTION search_bible(
  p_query      TEXT,
  p_translation VARCHAR DEFAULT 'nvi',
  p_limit      INT DEFAULT 20,
  p_offset     INT DEFAULT 0
)
RETURNS TABLE (
  book_name  TEXT,
  book_id    TEXT,
  testament  TEXT,
  chapter    INT,
  verse      INT,
  text       TEXT,
  rank       FLOAT4
)
LANGUAGE SQL
STABLE
AS $$
  SELECT
    bv.book_name::TEXT,
    bv.book_id::TEXT,
    bv.testament::TEXT,
    bv.chapter::INT,
    bv.verse::INT,
    bv.text::TEXT,
    ts_rank(bv.search_vec, websearch_to_tsquery('portuguese', p_query)) AS rank
  FROM bible_verses bv
  WHERE
    bv.translation = p_translation
    AND bv.search_vec @@ websearch_to_tsquery('portuguese', p_query)
  ORDER BY rank DESC, bv.book_index, bv.chapter, bv.verse
  LIMIT p_limit
  OFFSET p_offset;
$$;

COMMENT ON TABLE bible_verses IS
  'Versículos da Bíblia. Fonte: github.com/thiagobodruk/bible (CC BY-NC). Tradução NVI de propriedade de seus respectivos detentores.';
