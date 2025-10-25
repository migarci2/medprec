import React, { useState, useMemo } from "react";
import { FiX } from "react-icons/fi";
import { BRAND } from "../../constants/theme";
import { getIAResponse } from "../../utils/iaResponses";
import { cls } from "../../utils/helpers";

export function ChatPanel({ role, topic, patient, onClose }) {
  const [history, setHistory] = useState(() => [
    { from: "ai", text: "Hola, soy MedPrec. ¿Qué te gustaría entender?" },
  ]);

  const send = (t) => {
    setHistory((h) => [...h, { from: "user", text: t }]);
    const reply = getIAResponse({ role, topic: t, patient });
    setTimeout(() => setHistory((h) => [...h, { from: "ai", text: reply }]), 250);
  };

  useMemo(() => {
    if (topic) {
      const reply = getIAResponse({ role, topic, patient });
      setHistory((h) => [...h, { from: "ai", text: reply }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chips = [
    { k: "LDL", label: "¿Qué es el LDL?" },
    { k: "HbA1c", label: "Mi HbA1c" },
    { k: "Cardio", label: "Mejorar Cardio" },
    { k: "missing", label: "¿Qué me falta?" },
  ];

  return (
    <div className="fixed inset-0 bg-black/30 flex items-end md:items-center justify-center z-50">
      <div className="w-full max-w-2xl bg-white rounded-t-2xl md:rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 flex items-center justify-between border-b" style={{ background: BRAND.bg }}>
          <div className="font-semibold" style={{ color: BRAND.primary }}>
            Asistente MedPrec
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            <FiX />
          </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3 bg-white">
          {history.map((m, i) => (
            <div key={i} className={cls("flex", m.from === "ai" ? "justify-start" : "justify-end")}> 
              <div 
                className={cls(
                  "px-3 py-2 rounded-2xl text-sm leading-relaxed max-w-[85%]", 
                  m.from === "ai" ? "bg-emerald-50 text-emerald-900" : "bg-gray-900 text-white"
                )}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {chips.map((c) => (
              <button 
                key={c.k} 
                onClick={() => send(c.k)} 
                className="px-3 py-1.5 rounded-full text-sm" 
                style={{ background: "rgba(21,126,31,0.12)", color: BRAND.primary }}
              >
                {c.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Información educativa. No sustituye consejo médico. Demo con datos simulados.
          </p>
        </div>
      </div>
    </div>
  );
}
