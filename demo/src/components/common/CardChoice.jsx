import React from "react";
import { BRAND } from "../../constants/theme";

export function CardChoice({ title, desc, onClick, icon }) {
  return (
    <button 
      onClick={onClick} 
      className="bg-white rounded-2xl p-6 text-left shadow-sm hover:shadow-lg transition-all border border-gray-100"
    >
      <div className="flex items-center gap-4">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-xl" 
          style={{ background: "rgba(21,126,31,0.1)", color: BRAND.primary }}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold" style={{ color: BRAND.primary }}>
            {title}
          </h3>
          <p className="text-gray-600 mt-1">{desc}</p>
        </div>
      </div>
    </button>
  );
}
