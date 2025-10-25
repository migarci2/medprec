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
    LDL: { value: 162, unit: "mg/dL", trend: "up" },
    HDL: { value: 38, unit: "mg/dL", trend: "down" },
    PCR: { value: 4.8, unit: "mg/L", trend: "up" },
    HbA1c: { value: 5.9, unit: "%", trend: "flat" },
    ApoB: null,
    "Lp(a)": null,
  },
  scores: {
    Cardio: 62,
    Metabo: 74,
    Neuro: 86,
    Immuno: 70,
    Femi: 79,
    Andro: 0,
  },
};
