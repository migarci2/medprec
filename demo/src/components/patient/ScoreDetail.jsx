import React from "react";
import { FiChevronLeft, FiTrendingUp, FiTrendingDown, FiMinus } from "react-icons/fi";
import { BRAND } from "../../constants/theme";
import { SCORE_DESCRIPTORS } from "../../constants/scores";

export function ScoreDetail({ area, patient, onBack, onChat }) {
  const desc = SCORE_DESCRIPTORS[area];
  const markers = desc?.includes || [];

  // Función para obtener el icono de tendencia
  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return <FiTrendingUp className="text-red-500" />;
      case "down":
        return <FiTrendingDown className="text-blue-500" />;
      default:
        return <FiMinus className="text-gray-400" />;
    }
  };

  // Función para determinar el color del valor según el marcador
  const getValueColor = (markerName, value) => {
    // Lógica simplificada - se puede expandir con rangos reales
    const marker = patient.markers[markerName];
    if (!marker) return BRAND.primary;
    
    // Marcadores donde valores bajos son malos
    const lowerIsBad = ["HDL", "Vitamina D", "Vitamina B12", "Filtrado Glomerular", "Estradiol", "Progesterona"];
    // Marcadores donde valores altos son malos
    const higherIsBad = ["LDL", "Colesterol Total", "Triglicéridos", "PCR", "HbA1c", "Glucosa en Ayunas", "HOMA-IR", "Presión Arterial Sistólica", "Homocisteína", "FSH"];
    
    if (marker.trend === "up" && higherIsBad.includes(markerName)) return "#dc2626"; // red-600
    if (marker.trend === "down" && lowerIsBad.includes(markerName)) return "#dc2626";
    if (marker.trend === "flat") return BRAND.primary;
    
    return BRAND.primary;
  };

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
        {markers.map((m) => {
          const marker = patient.markers[m];
          return (
            <div key={m} className="p-4 rounded-xl border bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-700">{m}</div>
                {marker && getTrendIcon(marker.trend)}
              </div>
              <div className="mt-1 flex items-end gap-2">
                <div 
                  className="text-2xl font-bold" 
                  style={{ color: marker ? getValueColor(m, marker.value) : BRAND.primary }}
                >
                  {marker?.value ?? "—"}
                </div>
                <div className="text-xs text-gray-500 mb-1">{marker?.unit ?? ""}</div>
              </div>
              {marker && marker.trend !== "flat" && (
                <div className="mt-2 text-xs text-gray-600">
                  {marker.trend === "up" ? "↑ Tendencia al alza" : "↓ Tendencia a la baja"}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex gap-2">
        <button 
          onClick={() => onChat(area)} 
          className="px-4 py-2 rounded-full text-white hover:opacity-90 transition-opacity" 
          style={{ background: BRAND.primary }}
        >
          Preguntar a la IA
        </button>
        <button 
          onClick={() => onChat("missing")} 
          className="px-4 py-2 rounded-full border hover:bg-gray-50 transition-colors" 
          style={{ borderColor: BRAND.secondary, color: BRAND.secondary }}
        >
          ¿Qué falta?
        </button>
      </div>
    </div>
  );
}
