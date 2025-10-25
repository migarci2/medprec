import React from "react";
import { FiChevronLeft } from "react-icons/fi";
import { BRAND } from "../../constants/theme";
import { SCORE_DESCRIPTORS } from "../../constants/scores";

export function ScoreDetail({ area, patient, onBack, onChat }) {
  const desc = SCORE_DESCRIPTORS[area];
  const markers = desc?.includes || [];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: BRAND.primary }}>
          {desc?.icon} <span>{area}</span>
        </h3>
        <button 
          onClick={onBack} 
          className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
        >
          <FiChevronLeft /> Volver
        </button>
      </div>
      <p className="text-gray-600 mt-2">{desc?.copy}</p>
      
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        {markers.length === 0 && (
          <div className="text-sm text-gray-500">
            Este área no tiene marcadores específicos en este mock.
          </div>
        )}
        {markers.map((m) => (
          <div key={m} className="p-4 rounded-xl border bg-gray-50">
            <div className="text-sm font-medium text-gray-700">{m}</div>
            <div className="mt-1 flex items-end gap-2">
              <div className="text-2xl font-bold" style={{ color: BRAND.primary }}>
                {patient.markers[m]?.value ?? "—"}
              </div>
              <div className="text-xs text-gray-500">{patient.markers[m]?.unit ?? ""}</div>
            </div>
            <div className="mt-2 h-2 rounded bg-white overflow-hidden">
              <div 
                className="h-2 bg-emerald-200" 
                style={{ width: `${Math.min(100, Math.max(0, (patient.markers[m]?.value ?? 0) / 2))}%` }} 
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <button 
          onClick={() => onChat(area)} 
          className="px-4 py-2 rounded-full text-white" 
          style={{ background: BRAND.primary }}
        >
          Preguntar a la IA
        </button>
        <button 
          onClick={() => onChat("missing")} 
          className="px-4 py-2 rounded-full border" 
          style={{ borderColor: BRAND.secondary, color: BRAND.secondary }}
        >
          ¿Qué falta?
        </button>
      </div>
    </div>
  );
}
