import React from "react";
import { FiHeart, FiActivity, FiCpu, FiShield, FiUser, FiUsers } from "react-icons/fi";

/**
 * Descriptores de los Precision Scores
 */
export const SCORE_DESCRIPTORS = {
  Cardio: {
    icon: <FiHeart className="text-[18px]" />,
    includes: ["LDL", "HDL", "PCR", "ApoB", "Lp(a)"],
    copy: "Riesgo cardiovascular estimado a partir de lípidos e inflamación.",
  },
  Metabo: {
    icon: <FiActivity className="text-[18px]" />,
    includes: ["HbA1c"],
    copy: "Metabolismo glucémico y resistencia a la insulina.",
  },
  Neuro: {
    icon: <FiCpu className="text-[18px]" />,
    includes: [],
    copy: "Indicadores generales de salud neurológica (mock).",
  },
  Immuno: {
    icon: <FiShield className="text-[18px]" />,
    includes: ["PCR"],
    copy: "Marcadores inflamatorios e inmunitarios.",
  },
  Femi: {
    icon: <FiUser className="text-[18px]" />,
    includes: [],
    copy: "Salud específica femenina (mock).",
  },
  Andro: {
    icon: <FiUsers className="text-[18px]" />,
    includes: [],
    copy: "Salud específica masculina (N/A en este caso).",
  },
};
