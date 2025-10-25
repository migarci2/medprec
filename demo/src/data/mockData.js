/**
 * Datos mock del paciente
 */
export const MOCK_PATIENT = {
  id: "laura-42",
  name: "Laura",
  age: 42,
  sex: "F",
  lastLab: "2025-09-10",
  markers: {
    // Marcadores Cardiovasculares
    LDL: { value: 162, unit: "mg/dL", trend: "up", category: "Cardio" },
    HDL: { value: 38, unit: "mg/dL", trend: "down", category: "Cardio" },
    "Colesterol Total": { value: 245, unit: "mg/dL", trend: "up", category: "Cardio" },
    Triglicéridos: { value: 185, unit: "mg/dL", trend: "up", category: "Cardio" },
    ApoB: { value: 128, unit: "mg/dL", trend: "up", category: "Cardio" },
    "Lp(a)": { value: 45, unit: "nmol/L", trend: "flat", category: "Cardio" },
    "Presión Arterial Sistólica": { value: 138, unit: "mmHg", trend: "up", category: "Cardio" },
    "Presión Arterial Diastólica": { value: 88, unit: "mmHg", trend: "flat", category: "Cardio" },
    
    // Marcadores Metabólicos
    HbA1c: { value: 5.9, unit: "%", trend: "up", category: "Metabo" },
    "Glucosa en Ayunas": { value: 108, unit: "mg/dL", trend: "up", category: "Metabo" },
    Insulina: { value: 18.5, unit: "μU/mL", trend: "up", category: "Metabo" },
    "HOMA-IR": { value: 4.9, unit: "", trend: "up", category: "Metabo" },
    "Ácido Úrico": { value: 6.2, unit: "mg/dL", trend: "flat", category: "Metabo" },
    "Vitamina D": { value: 22, unit: "ng/mL", trend: "down", category: "Metabo" },
    
    // Marcadores Neurológicos
    "Homocisteína": { value: 9.2, unit: "μmol/L", trend: "flat", category: "Neuro" },
    "Vitamina B12": { value: 485, unit: "pg/mL", trend: "flat", category: "Neuro" },
    Folato: { value: 12.8, unit: "ng/mL", trend: "flat", category: "Neuro" },
    "Magnesio Sérico": { value: 2.1, unit: "mg/dL", trend: "flat", category: "Neuro" },
    
    // Marcadores Inmunológicos
    PCR: { value: 4.8, unit: "mg/L", trend: "up", category: "Immuno" },
    "PCR-us": { value: 3.2, unit: "mg/L", trend: "up", category: "Immuno" },
    "Leucocitos": { value: 8200, unit: "/μL", trend: "flat", category: "Immuno" },
    "Linfocitos": { value: 2100, unit: "/μL", trend: "flat", category: "Immuno" },
    "VSG": { value: 18, unit: "mm/h", trend: "up", category: "Immuno" },
    Ferritina: { value: 95, unit: "ng/mL", trend: "flat", category: "Immuno" },
    
    // Marcadores Femeninos
    Estradiol: { value: 125, unit: "pg/mL", trend: "down", category: "Femi" },
    Progesterona: { value: 8.5, unit: "ng/mL", trend: "down", category: "Femi" },
    FSH: { value: 12.8, unit: "mUI/mL", trend: "up", category: "Femi" },
    LH: { value: 9.2, unit: "mUI/mL", trend: "up", category: "Femi" },
    "TSH": { value: 2.8, unit: "μUI/mL", trend: "flat", category: "Femi" },
    Prolactina: { value: 18, unit: "ng/mL", trend: "flat", category: "Femi" },
    
    // Marcadores Hepáticos y Renales
    "AST/GOT": { value: 28, unit: "U/L", trend: "flat", category: "Metabo" },
    "ALT/GPT": { value: 32, unit: "U/L", trend: "flat", category: "Metabo" },
    Creatinina: { value: 0.9, unit: "mg/dL", trend: "flat", category: "Metabo" },
    "Filtrado Glomerular": { value: 92, unit: "mL/min", trend: "flat", category: "Metabo" },
  },
  scores: {
    Cardio: 62,  // Score bajo-medio por LDL alto, HDL bajo, presión arterial elevada
    Metabo: 74,  // Score medio por HbA1c y glucosa en límite alto, resistencia insulina
    Neuro: 86,   // Score bueno, marcadores neurológicos en rango
    Immuno: 70,  // Score medio por PCR elevada (inflamación)
    Femi: 79,    // Score medio-alto, perfil hormonal dentro de rango para edad
    Andro: 0,    // No aplica para paciente femenina
  },
};
