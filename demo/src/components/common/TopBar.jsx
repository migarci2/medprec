import React from "react";
import { FiChevronLeft } from "react-icons/fi";
import { BRAND } from "../../constants/theme";

export function TopBar({ role, onBack, onSwitchRole }) {
  return (
    <div className="w-full flex items-center justify-between py-4 px-4 md:px-6 border-b" style={{ background: BRAND.bg }}>
      <div className="flex items-center gap-3">
        <button 
          onClick={onBack} 
          className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm flex items-center gap-2"
        >
          <FiChevronLeft /> Volver
        </button>
        <span className="font-semibold text-gray-700">MedPrec — Demo</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 hidden sm:inline">Rol:</span>
        <span 
          className="px-3 py-1.5 rounded-full text-sm" 
          style={{ background: "rgba(21,126,31,0.1)", color: BRAND.primary }}
        >
          {role === 'patient' ? 'Paciente' : 'Médico'}
        </span>
        <button 
          onClick={onSwitchRole} 
          className="px-3 py-1.5 rounded-full text-white text-sm" 
          style={{ background: BRAND.primary }}
        >
          Cambiar rol
        </button>
      </div>
    </div>
  );
}
