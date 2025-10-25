import React from "react";
import { FiUser, FiShield } from "react-icons/fi";
import { BRAND } from "../../constants/theme";
import { CardChoice } from "./CardChoice";

export function RoleSelector({ onSelect }) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: BRAND.bg }}>
      <div className="max-w-5xl w-full px-4">
        <div className="grid md:grid-cols-2 gap-6">
          <CardChoice
            title="Soy Paciente"
            desc="Explora tus Precision Scores y resuelve dudas con IA."
            onClick={() => onSelect('patient')}
            icon={<FiUser />}
          />
          <CardChoice
            title="Soy Médico"
            desc="Prioriza pacientes, entiende alertas y exporta resúmenes."
            onClick={() => onSelect('doctor')}
            icon={<FiShield />}
          />
        </div>
        <div className="text-center mt-10">
          <h1 className="text-4xl font-bold" style={{ color: BRAND.primary }}>
            Tu salud, visualizada.
          </h1>
          <p className="mt-3 text-gray-600">
            Demo pública con datos simulados. Sin login. Sin guardado.
          </p>
        </div>
      </div>
    </div>
  );
}
