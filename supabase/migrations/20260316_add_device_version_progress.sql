-- A7: Adicionar device_id e version à user_progress para controle CRDT multi-device
-- device_id: identifica o dispositivo que fez o último write (echo protection no Realtime)
-- version: contador monotônico por write (evita sobrescrever progresso mais recente)

ALTER TABLE user_progress
  ADD COLUMN IF NOT EXISTS device_id TEXT,
  ADD COLUMN IF NOT EXISTS version   INTEGER NOT NULL DEFAULT 0;
