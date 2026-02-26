/**
 * Strips Eleven Labs audio narration markers from text for visual display.
 *
 * ElevenLabs uses custom [bracketed] markers to control TTS pacing, tone,
 * and breathing patterns. These markers must be removed before showing
 * text to the user. Some content also includes standalone ALL-CAPS section
 * labels (e.g., REVERENTE:, CLAREZA TEOLÓGICA:) used in Bible studies.
 */
export function stripAudioMarkers(text: string): string {
  if (!text) return '';

  return text
    // 1. Remove [bracketed markers] — e.g., [inhales deeply], [long pause], [REVERENTE]
    //    Handles multi-word and padded brackets like [ REVERENTE]
    .replace(/\[[^\]]*\]/g, '')
    // 2. Remove known standalone section labels used in estudos bíblicos
    //    These may appear with or without a trailing colon
    .replace(/\b(REVERENTE|CLAREZA TEOLÓGICA|MODERNA|3 DE IMPACTO|ORAÇÃO E SELO|pause longa)\s*:?\s*/g, '')
    // 3. Collapse multiple spaces/tabs into one
    .replace(/[ \t]{2,}/g, ' ')
    // 4. Collapse more than 2 consecutive newlines
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
