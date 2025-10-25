import React from "react";
import { FiUsers } from "react-icons/fi";
import { BRAND } from "../../constants/theme";
import { cls, chipSem } from "../../utils/helpers";

export function DoctorList({ patient, onOpen }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: BRAND.primary }}>
        <FiUsers /> <span>Pacientes recientes</span>
      </h3>
      <div className="mt-4 overflow-hidden border rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Última analítica</th>
              <th className="p-3 text-left">Cardio</th>
              <th className="p-3 text-left">Metabo</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-3">{patient.name} ({patient.age})</td>
              <td className="p-3">{patient.lastLab}</td>
              <td className="p-3">
                <span className={cls("px-2 py-1 rounded-full", chipSem(patient.scores.Cardio))}>
                  {patient.scores.Cardio}
                </span>
              </td>
              <td className="p-3">
                <span className={cls("px-2 py-1 rounded-full", chipSem(patient.scores.Metabo))}>
                  {patient.scores.Metabo}
                </span>
              </td>
              <td className="p-3">
                <button 
                  onClick={onOpen} 
                  className="px-3 py-1.5 rounded-full text-white" 
                  style={{ background: BRAND.primary }}
                >
                  Ver ficha
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
