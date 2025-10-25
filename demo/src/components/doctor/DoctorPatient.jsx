import React from "react";
import { FiHeart, FiAlertTriangle } from "react-icons/fi";
import { BRAND } from "../../constants/theme";
import { cls, pctColor, textSem } from "../../utils/helpers";

export function DoctorPatient({ patient, onChat }) {
  const alerts = [
    { label: "LDL alto", detail: `LDL ${patient.markers.LDL?.value} mg/dL` },
    { label: "HDL bajo", detail: `HDL ${patient.markers.HDL?.value} mg/dL` },
    { label: "PCR elevada", detail: `PCR ${patient.markers.PCR?.value} mg/L` },
  ];

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: BRAND.primary }}>
          <FiHeart /> <span>Resumen — {patient.name}</span>
        </h3>
        <div className="mt-4 space-y-3">
          {Object.entries(patient.scores).map(([k, v]) => (
            <div key={k} className="flex items-center gap-3">
              <div className="w-24 text-sm text-gray-600">{k}</div>
              <div className="flex-1 h-2 rounded bg-gray-100 overflow-hidden">
                <div className={cls("h-2", pctColor(v))} style={{ width: `${v}%` }} />
              </div>
              <div className={cls("w-10 text-right text-sm font-semibold", textSem(v))}>
                {v}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <h4 className="font-medium text-gray-700">Notas sugeridas (mock)</h4>
          <ul className="list-disc ml-5 text-sm text-gray-600 mt-2">
            <li>Solicitar ApoB y Lp(a) para afinar riesgo residual.</li>
            <li>Repetir lípidos y PCR en 8–12 semanas.</li>
            <li>Reforzar hábitos: actividad, dieta rica en fibra, sueño.</li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h4 className="font-medium flex items-center gap-2" style={{ color: BRAND.primary }}>
          <FiAlertTriangle /> <span>Alertas</span>
        </h4>
        <div className="mt-3 space-y-2">
          {alerts.map((a, i) => (
            <div key={i} className="p-3 rounded-xl bg-amber-50 text-amber-800 text-sm">
              {a.label} · <span className="text-amber-700/80">{a.detail}</span>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <button 
            onClick={() => onChat("Cardio")} 
            className="px-3 py-2 rounded-full text-white w-full" 
            style={{ background: BRAND.primary }}
          >
            Ver explicación IA
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Reglas orientativas para demo. No uso clínico real.
        </div>
      </div>
    </div>
  );
}
