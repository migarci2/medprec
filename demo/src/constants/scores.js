import React from "react";
import { FiHeart, FiActivity, FiCpu, FiShield, FiUser, FiUsers } from "react-icons/fi";

/**
 * Descriptores de los Precision Scores
 */
export const SCORE_DESCRIPTORS = {
  Cardio: {
    icon: <FiHeart className="text-[18px]" />,
    includes: [
      "LDL", 
      "HDL", 
      "Colesterol Total",
      "Triglicéridos",
      "ApoB", 
      "Lp(a)",
      "Presión Arterial Sistólica",
      "Presión Arterial Diastólica"
    ],
    copy: "Riesgo cardiovascular estimado a partir de perfil lipídico, presión arterial y marcadores avanzados.",
  },
  Metabo: {
    icon: <FiActivity className="text-[18px]" />,
    includes: [
      "HbA1c",
      "Glucosa en Ayunas",
      "Insulina",
      "HOMA-IR",
      "Ácido Úrico",
      "Vitamina D",
      "AST/GOT",
      "ALT/GPT",
      "Creatinina",
      "Filtrado Glomerular"
    ],
    copy: "Metabolismo glucémico, resistencia a la insulina, función hepática y renal.",
  },
  Neuro: {
    icon: <FiCpu className="text-[18px]" />,
    includes: [
      "Homocisteína",
      "Vitamina B12",
      "Folato",
      "Magnesio Sérico"
    ],
    copy: "Indicadores de salud neurológica, función cognitiva y marcadores neuroprotectores.",
  },
  Immuno: {
    icon: <FiShield className="text-[18px]" />,
    includes: [
      "PCR",
      "PCR-us",
      "Leucocitos",
      "Linfocitos",
      "VSG",
      "Ferritina"
    ],
    copy: "Marcadores inflamatorios, sistema inmunitario y respuesta inflamatoria sistémica.",
  },
  Femi: {
    icon: <FiUser className="text-[18px]" />,
    includes: [
      "Estradiol",
      "Progesterona",
      "FSH",
      "LH",
      "TSH",
      "Prolactina"
    ],
    copy: "Salud hormonal femenina, ciclo reproductivo y función tiroidea.",
  },
  Andro: {
    icon: <FiUsers className="text-[18px]" />,
    includes: [],
    copy: "Salud específica masculina (N/A en este caso).",
  },
};
