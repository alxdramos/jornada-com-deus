-- Migration: Restringir conteúdo Plus via RLS
-- Data: 2026-04-15
-- Motivo: Validação de plano Plus estava apenas no client-side (bypassável).
-- Fix: RLS agora garante que conteúdo plus=true só retorna para usuários com plan='plus'.

-- Remover policy antiga que não restringia conteúdo Plus
DROP POLICY IF EXISTS "authenticated_read_published" ON content_library;

-- Policy 1: Conteúdo gratuito publicado — qualquer usuário autenticado
CREATE POLICY "authenticated_read_free_content" ON content_library
  FOR SELECT
  USING (
    status = 'published'
    AND plus = false
  );

-- Policy 2: Conteúdo Plus publicado — apenas usuários com plan='plus' ativo
CREATE POLICY "plus_users_read_plus_content" ON content_library
  FOR SELECT
  USING (
    status = 'published'
    AND plus = true
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.plan = 'plus'
    )
  );

-- Nota: admins continuam com acesso total via "admin_full_access" policy existente.
-- Nota: usuários anônimos (não autenticados) não leem nada — sem policy para eles.
