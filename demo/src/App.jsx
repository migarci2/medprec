import React, { useState } from "react";
import { BRAND } from "./constants/theme";
import { MOCK_PATIENT } from "./data/mockData";
import { TopBar } from "./components/common/TopBar";
import { RoleSelector } from "./components/common/RoleSelector";
import { PatientDashboard } from "./components/patient/PatientDashboard";
import { ScoreDetail } from "./components/patient/ScoreDetail";
import { DoctorList } from "./components/doctor/DoctorList";
import { DoctorPatient } from "./components/doctor/DoctorPatient";
import { ChatPanel } from "./components/chat/ChatPanel";

/**
 * MedPrec — Demo React Modular
 * - Sin backend, sin login
 * - Roles: Paciente / Médico conmutables
 * - Datos mock + chat IA simulado
 */
export default function MedPrecDemo() {
  const [route, setRoute] = useState("/");
  const [role, setRole] = useState("patient");
  const [patient] = useState(MOCK_PATIENT);
  const [openDetail, setOpenDetail] = useState(null);
  const [chatTopic, setChatTopic] = useState(null);

  const goHome = () => {
    setRoute("/");
    setOpenDetail(null);
    setChatTopic(null);
  };

  const switchRole = () => setRole((r) => (r === "patient" ? "doctor" : "patient"));

  if (route === "/") {
    return (
      <RoleSelector 
        onSelect={(r) => {
          setRole(r);
          setRoute("/app");
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-white" style={{ background: BRAND.bg }}>
      <TopBar role={role} onBack={goHome} onSwitchRole={switchRole} />
      
      <main className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        {/* Banner hero compacto */}
        <div className="rounded-2xl p-5 flex items-center justify-between border bg-white">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: BRAND.primary }}>
              Tu salud, visualizada.
            </h1>
            <p className="text-gray-600">
              Demo interactiva: biomarcadores → Precision Scores → acciones preventivas.
            </p>
          </div>
          <span 
            className="hidden md:inline px-3 py-1.5 rounded-full text-sm bg-white border" 
            style={{ borderColor: BRAND.secondary, color: BRAND.secondary }}
          >
            Sin login
          </span>
        </div>

        {role === "patient" ? (
          <>
            {!openDetail && (
              <PatientDashboard
                patient={patient}
                onOpenScore={(area) => setOpenDetail(area)}
                onOpenChat={(t) => setChatTopic(t)}
              />
            )}
            {openDetail && (
              <ScoreDetail
                area={openDetail}
                patient={patient}
                onBack={() => setOpenDetail(null)}
                onChat={(t) => setChatTopic(t)}
              />
            )}
          </>
        ) : (
          <>
            {!openDetail && (
              <DoctorList patient={patient} onOpen={() => setOpenDetail("Cardio")} />
            )}
            {openDetail && (
              <DoctorPatient patient={patient} onChat={(t) => setChatTopic(t)} />
            )}
          </>
        )}
      </main>

      {chatTopic && (
        <ChatPanel 
          role={role} 
          topic={chatTopic} 
          patient={patient} 
          onClose={() => setChatTopic(null)} 
        />
      )}

      <footer className="text-center text-xs text-gray-500 py-6 bg-white border-t">
        MedPrec no predice enfermedades; facilita comprensión y prevención. Demo con datos simulados.
      </footer>
    </div>
  );
}
