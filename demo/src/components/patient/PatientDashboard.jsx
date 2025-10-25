import React from "react";
import { FiTrendingUp, FiActivity, FiAlertTriangle, FiHeart } from "react-icons/fi";
import { BRAND } from "../../constants/theme";
import { SCORE_DESCRIPTORS } from "../../constants/scores";
import { cls, chipSem } from "../../utils/helpers";
import { ScoreBar } from "../common/ScoreBar";
import { ActionChip } from "../common/ActionChip";

export function PatientDashboard({ patient, onOpenScore, onOpenChat }) {
  const scores = patient.scores;

  // Filter scores based on sex
  const filteredScores = Object.entries(scores).filter(([k]) => {
    if (patient.sex === "F" && k === "Andro") return false;
    if (patient.sex === "M" && k === "Femi") return false;
    return true;
  });

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold" style={{ color: BRAND.primary }}>
              {patient.name} · {patient.age} años
            </h2>
            <p className="text-gray-500 text-sm">Última analítica: {patient.lastLab}</p>
          </div>
          <span className="px-3 py-1.5 rounded-full text-xs bg-emerald-50 text-emerald-700">
            Demo · Datos simulados
          </span>
        </div>
        <div className="space-y-4">
          {filteredScores.map(([k, v]) => (
            <button key={k} onClick={() => onOpenScore(k)} className="w-full text-left">
              <div className="flex items-center gap-3 py-2">
                {/* Avatar con icono */}
                <div 
                  className="w-9 h-9 rounded-full flex items-center justify-center text-base" 
                  style={{ background: "rgba(21,126,31,0.1)", color: BRAND.primary }}
                >
                  {SCORE_DESCRIPTORS[k]?.icon || <FiActivity />}
                </div>
                {/* Barra sin icono duplicado */}
                <ScoreBar label={k} value={v} />
                <span className={cls("text-xs px-2 py-1 rounded-full", chipSem(v))}>
                  {v >= 80 ? "OK" : v >= 60 ? "Atento" : "Revisar"}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold mb-2" style={{ color: BRAND.primary }}>
          Acciones rápidas
        </h3>
        <div className="space-y-2">
          <ActionChip onClick={() => onOpenChat("LDL")} icon={<FiTrendingUp />}>
            ¿Qué significa mi LDL?
          </ActionChip>
          <ActionChip onClick={() => onOpenChat("HbA1c")} icon={<FiActivity />}>
            Entender mi HbA1c
          </ActionChip>
          <ActionChip onClick={() => onOpenChat("missing")} icon={<FiAlertTriangle />}>
            ¿Qué análisis me faltan?
          </ActionChip>
          <ActionChip onClick={() => onOpenChat("Cardio")} icon={<FiHeart />}>
            Mejorar mi score Cardio
          </ActionChip>
        </div>
        <div className="mt-6 text-xs text-gray-500">
          MedPrec no diagnostica; traduce tus datos para ayudarte a decidir mejor.
        </div>
      </div>
    </div>
  );
}
