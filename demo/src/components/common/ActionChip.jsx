import React from "react";

export function ActionChip({ children, onClick, icon }) {
  return (
    <button 
      onClick={onClick} 
      className="w-full text-left px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm flex items-center gap-2"
    >
      <span className="text-gray-700">{icon}</span>
      <span>{children}</span>
    </button>
  );
}
