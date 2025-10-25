/**
 * Generador de respuestas de IA simuladas
 */
export function getIAResponse({ role, topic, patient }) {
  const disclaimer = "Esto es educativo y no sustituye consejo médico.";

  const templates = {
    LDL: () => (
      `En breve: el LDL transporta colesterol; alto puede favorecer placas en arterias.\n` +
      `Por qué importa: a largo plazo eleva el riesgo cardiovascular, sobre todo con tabaco/HTA.\n` +
      `Qué hacer ahora: más fibra y vegetales, 30 min/día de actividad y repetir lípidos en 8–12 semanas.\n` +
      `Nota: ${disclaimer}`
    ),
    HbA1c: () => (
      `La HbA1c refleja la glucosa media de ~3 meses.\n` +
      `Importa porque si sube (≥5.7%) sugiere riesgo de prediabetes.\n` +
      `Acciones: actividad regular, sueño 7–8 h, revisar alimentación y repetir en 12 semanas.\n` +
      `Nota: ${disclaimer}`
    ),
    Cardio: () => (
      `Score Cardio calculado con LDL, HDL y PCR en este mock.\n` +
      `Siguientes pasos: solicitar ApoB y Lp(a) para afinar riesgo residual y repetir en 8–12 semanas.\n` +
      `Nota: ${disclaimer}`
    ),
    missing: () => (
      `Faltan **ApoB** y **Lp(a)** en este caso.\n` +
      `Por qué: ayudan a estimar riesgo residual cuando LDL está alto o hay antecedentes.\n` +
      `Nota: ${disclaimer}`
    ),
    default: () => (
      `Puedo explicar biomarcadores o Precision Scores y sugerir siguientes pasos generales.\n` +
      `Elige una opción o pregúntame por LDL, HbA1c o Cardio.\n` +
      `Nota: ${disclaimer}`
    ),
  };

  if (templates[topic]) return templates[topic]();
  return templates.default();
}
