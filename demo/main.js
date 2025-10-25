import React, { useMemo, useState } from "react";
import { FiUser, FiShield, FiHeart, FiActivity, FiCpu, FiTrendingUp, FiAlertTriangle, FiX, FiChevronLeft, FiUsers } from "react-icons/fi";

/**
 * MedPrec — Demo React (fix: iconos no duplicados en stats)
 * - Sin backend, sin login
 * - Roles: Paciente / Médico conmutables
 * - Datos mock + chat IA simulado
 * - Estilos Tailwind; colores consistentes con la landing
 * - Cambios: ScoreBar ya NO renderiza icono; el icono solo aparece en el "avatar" de cada fila
 */

// ----- Utilidades -----
const cls = (...xs) => xs.filter(Boolean).join(" ");
const pctColor = (v) => (v >= 80 ? "bg-emerald-500" : v >= 60 ? "bg-amber-500" : "bg-rose-500");
const textSem = (v) => (v >= 80 ? "text-emerald-600" : v >= 60 ? "text-amber-600" : "text-rose-600");
const chipSem = (v) => (v >= 80 ? "bg-emerald-100 text-emerald-700" : v >= 60 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700");

// Paleta de la landing
const BRAND = {
  primary: "#157E1F",
  secondary: "#4CBA63",
  bg: "#FEFFFE",
};

// ----- Datos Mock -----
const MOCK_PATIENT = {
  id: "laura-42",
  name: "Laura",
  age: 42,
  sex: "F",
  lastLab: "2025-09-10",
  markers: {
    LDL: { value: 162, unit: "mg/dL", trend: "up" },
    HDL: { value: 38, unit: "mg/dL", trend: "down" },
    PCR: { value: 4.8, unit: "mg/L", trend: "up" },
    HbA1c: { value: 5.9, unit: "%", trend: "flat" },
    ApoB: null,
    "Lp(a)": null,
  },
  scores: {
    Cardio: 62,
    Metabo: 74,
    Neuro: 86,
    Immuno: 70,
    Femi: 79,
    Andro: 0,
  },
};

const SCORE_DESCRIPTORS = {
  Cardio: {
    icon: <FiHeart className="text-[18px]" />,
    includes: ["LDL", "HDL", "PCR", "ApoB", "Lp(a)"],
    copy: "Riesgo cardiovascular estimado a partir de lípidos e inflamación.",
  },
  Metabo: {
    icon: <FiActivity className="text-[18px]" />,
    includes: ["HbA1c"],
    copy: "Metabolismo glucémico y resistencia a la insulina.",
  },
  Neuro: { icon: <FiCpu className="text-[18px]" />, includes: [], copy: "Indicadores generales de salud neurológica (mock)." },
  Immuno: { icon: <FiShield className="text-[18px]" />, includes: ["PCR"], copy: "Marcadores inflamatorios e inmunitarios." },
  Femi: { icon: <FiUser className="text-[18px]" />, includes: [], copy: "Salud específica femenina (mock)." },
  Andro: { icon: <FiUsers className="text-[18px]" />, includes: [], copy: "Salud específica masculina (N/A en este caso)." },
};

// ----- Respuestas IA Simuladas -----
function getIAResponse({ role, topic, patient }) {
  const disclaimer = "Esto es educativo y no sustituye consejo médico.";

  const templates = {
    LDL: () => (
      `En breve: el LDL transporta colesterol; alto puede favorecer placas en arterias.\n` +
      `Por qué importa: a largo plazo eleva el riesgo cardiovascular, sobre todo con tabaco/HTA.\n` +
      `Qué hacer ahora: más fibra y vegetales, 30 min/día de actividad y repetir lípidos en 8–12 semanas.\n` +
      `Nota: ${disclaimer}`
    ),
    HbA1c: () => (
      `La HbA1c refleja la glucosa media de ~3 meses.\n` +
      `Importa porque si sube (≥5.7%) sugiere riesgo de prediabetes.\n` +
      `Acciones: actividad regular, sueño 7–8 h, revisar alimentación y repetir en 12 semanas.\n` +
      `Nota: ${disclaimer}`
    ),
    Cardio: () => (
      `Score Cardio calculado con LDL, HDL y PCR en este mock.\n` +
      `Siguientes pasos: solicitar ApoB y Lp(a) para afinar riesgo residual y repetir en 8–12 semanas.\n` +
      `Nota: ${disclaimer}`
    ),
    missing: () => (
      `Faltan **ApoB** y **Lp(a)** en este caso.\n` +
      `Por qué: ayudan a estimar riesgo residual cuando LDL está alto o hay antecedentes.\n` +
      `Nota: ${disclaimer}`
    ),
    default: () => (
      `Puedo explicar biomarcadores o Precision Scores y sugerir siguientes pasos generales.\n` +
      `Elige una opción o pregúntame por LDL, HbA1c o Cardio.\n` +
      `Nota: ${disclaimer}`
    ),
  };

  if (templates[topic]) return templates[topic]();
  return templates.default();
}

// ----- Componentes -----
function TopBar({ role, onBack, onSwitchRole }) {
  return (
    <div className="w-full flex items-center justify-between py-4 px-4 md:px-6 border-b" style={{ background: BRAND.bg }}>
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm flex items-center gap-2"><FiChevronLeft /> Volver</button>
        <span className="font-semibold text-gray-700">MedPrec — Demo</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 hidden sm:inline">Rol:</span>
        <span className="px-3 py-1.5 rounded-full text-sm" style={{ background: "rgba(21,126,31,0.1)", color: BRAND.primary }}>{role === 'patient' ? 'Paciente' : 'Médico'}</span>
        <button onClick={onSwitchRole} className="px-3 py-1.5 rounded-full text-white text-sm" style={{ background: BRAND.primary }}>Cambiar rol</button>
      </div>
    </div>
  );
}

function RoleSelector({ onSelect }) {
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
          <h1 className="text-4xl font-bold" style={{ color: BRAND.primary }}>Tu salud, visualizada.</h1>
          <p className="mt-3 text-gray-600">Demo pública con datos simulados. Sin login. Sin guardado.</p>
        </div>
      </div>
    </div>
  );
}

function CardChoice({ title, desc, onClick, icon }) {
  return (
    <button onClick={onClick} className="bg-white rounded-2xl p-6 text-left shadow-sm hover:shadow-lg transition-all border border-gray-100">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl" style={{ background: "rgba(21,126,31,0.1)", color: BRAND.primary }}>{icon}</div>
        <div>
          <h3 className="text-lg font-semibold" style={{ color: BRAND.primary }}>{title}</h3>
          <p className="text-gray-600 mt-1">{desc}</p>
        </div>
      </div>
    </button>
  );
}

// FIX: ScoreBar sin icono
function ScoreBar({ label, value }) {
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="w-28 text-sm text-gray-700">{label}</div>
      <div className="flex-1 h-2 rounded bg-gray-100 overflow-hidden">
        <div className={cls("h-2 rounded", pctColor(value))} style={{ width: `${value}%` }} />
      </div>
      <div className={cls("w-10 text-right text-sm font-semibold", textSem(value))}>{value ? value : "—"}</div>
    </div>
  );
}

function PatientDashboard({ patient, onOpenScore, onOpenChat }) {
  const scores = patient.scores;
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold" style={{ color: BRAND.primary }}>{patient.name} · {patient.age} años</h2>
            <p className="text-gray-500 text-sm">Última analítica: {patient.lastLab}</p>
          </div>
          <span className="px-3 py-1.5 rounded-full text-xs bg-emerald-50 text-emerald-700">Demo · Datos simulados</span>
        </div>
        <div className="space-y-4">
          {Object.entries(scores).map(([k, v]) => (
            <button key={k} onClick={() => onOpenScore(k)} className="w-full text-left">
              <div className="flex items-center gap-3 py-2">
                {/* Avatar con icono (único icono visible en la fila) */}
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-base" style={{ background: "rgba(21,126,31,0.1)", color: BRAND.primary }}>{SCORE_DESCRIPTORS[k]?.icon || <FiActivity />}</div>
                {/* Barra sin icono duplicado */}
                <ScoreBar label={k} value={v} />
                <span className={cls("text-xs px-2 py-1 rounded-full", chipSem(v))}>{v >= 80 ? "OK" : v >= 60 ? "Atento" : "Revisar"}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold mb-2" style={{ color: BRAND.primary }}>Acciones rápidas</h3>
        <div className="space-y-2">
          <ActionChip onClick={() => onOpenChat("LDL")} icon={<FiTrendingUp />}>¿Qué significa mi LDL?</ActionChip>
          <ActionChip onClick={() => onOpenChat("HbA1c")} icon={<FiActivity />}>Entender mi HbA1c</ActionChip>
          <ActionChip onClick={() => onOpenChat("missing")} icon={<FiAlertTriangle />}>¿Qué análisis me faltan?</ActionChip>
          <ActionChip onClick={() => onOpenChat("Cardio")} icon={<FiHeart />}>Mejorar mi score Cardio</ActionChip>
        </div>
        <div className="mt-6 text-xs text-gray-500">MedPrec no diagnostica; traduce tus datos para ayudarte a decidir mejor.</div>
      </div>
    </div>
  );
}

function ActionChip({ children, onClick, icon }) {
  return (
    <button onClick={onClick} className="w-full text-left px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm flex items-center gap-2">
      <span className="text-gray-700">{icon}</span>
      <span>{children}</span>
    </button>
  );
}

function ScoreDetail({ area, patient, onBack, onChat }) {
  const desc = SCORE_DESCRIPTORS[area];
  const markers = desc?.includes || [];
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: BRAND.primary }}>{desc?.icon} <span>{area}</span></h3>
        <button onClick={onBack} className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"><FiChevronLeft /> Volver</button>
      </div>
      <p className="text-gray-600 mt-2">{desc?.copy}</p>
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        {markers.length === 0 && (
          <div className="text-sm text-gray-500">Este área no tiene marcadores específicos en este mock.</div>
        )}
        {markers.map((m) => (
          <div key={m} className="p-4 rounded-xl border bg-gray-50">
            <div className="text-sm font-medium text-gray-700">{m}</div>
            <div className="mt-1 flex items-end gap-2">
              <div className="text-2xl font-bold" style={{ color: BRAND.primary }}>{patient.markers[m]?.value ?? "—"}</div>
              <div className="text-xs text-gray-500">{patient.markers[m]?.unit ?? ""}</div>
            </div>
            <div className="mt-2 h-2 rounded bg-white overflow-hidden">
              <div className="h-2 bg-emerald-200" style={{ width: `${Math.min(100, Math.max(0, (patient.markers[m]?.value ?? 0) / 2))}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={() => onChat(area)} className="px-4 py-2 rounded-full text-white" style={{ background: BRAND.primary }}>Preguntar a la IA</button>
        <button onClick={() => onChat("missing")} className="px-4 py-2 rounded-full border" style={{ borderColor: BRAND.secondary, color: BRAND.secondary }}>¿Qué falta?</button>
      </div>
    </div>
  );
}

function ChatPanel({ role, topic, patient, onClose }) {
  const [history, setHistory] = useState(() => [
    { from: "ai", text: "Hola, soy MedPrec. ¿Qué te gustaría entender?" },
  ]);

  const send = (t) => {
    setHistory((h) => [...h, { from: "user", text: t }]);
    const reply = getIAResponse({ role, topic: t, patient });
    setTimeout(() => setHistory((h) => [...h, { from: "ai", text: reply }] ), 250);
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
          <div className="font-semibold" style={{ color: BRAND.primary }}>Asistente MedPrec</div>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900"><FiX /></button>
        </div>
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3 bg-white">
          {history.map((m, i) => (
            <div key={i} className={cls("flex", m.from === "ai" ? "justify-start" : "justify-end")}> 
              <div className={cls("px-3 py-2 rounded-2xl text-sm leading-relaxed max-w-[85%]", m.from === "ai" ? "bg-emerald-50 text-emerald-900" : "bg-gray-900 text-white")}>{m.text}</div>
            </div>
          ))}
        </div>
        <div className="p-3 border-t bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {chips.map((c) => (
              <button key={c.k} onClick={() => send(c.k)} className="px-3 py-1.5 rounded-full text-sm" style={{ background: "rgba(21,126,31,0.12)", color: BRAND.primary }}>{c.label}</button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">Información educativa. No sustituye consejo médico. Demo con datos simulados.</p>
        </div>
      </div>
    </div>
  );
}

function DoctorList({ patient, onOpen }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: BRAND.primary }}><FiUsers /> <span>Pacientes recientes</span></h3>
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
              <td className="p-3"><span className={cls("px-2 py-1 rounded-full", chipSem(patient.scores.Cardio))}>{patient.scores.Cardio}</span></td>
              <td className="p-3"><span className={cls("px-2 py-1 rounded-full", chipSem(patient.scores.Metabo))}>{patient.scores.Metabo}</span></td>
              <td className="p-3">
                <button onClick={onOpen} className="px-3 py-1.5 rounded-full text-white" style={{ background: BRAND.primary }}>Ver ficha</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DoctorPatient({ patient, onChat }) {
  const alerts = [
    { label: "LDL alto", detail: `LDL ${patient.markers.LDL?.value} mg/dL` },
    { label: "HDL bajo", detail: `HDL ${patient.markers.HDL?.value} mg/dL` },
    { label: "PCR elevada", detail: `PCR ${patient.markers.PCR?.value} mg/L` },
  ];

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: BRAND.primary }}><FiHeart /> <span>Resumen — {patient.name}</span></h3>
        <div className="mt-4 space-y-3">
          {Object.entries(patient.scores).map(([k, v]) => (
            <div key={k} className="flex items-center gap-3">
              <div className="w-24 text-sm text-gray-600">{k}</div>
              <div className="flex-1 h-2 rounded bg-gray-100 overflow-hidden">
                <div className={cls("h-2", pctColor(v))} style={{ width: `${v}%` }} />
              </div>
              <div className={cls("w-10 text-right text-sm font-semibold", textSem(v))}>{v}</div>
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
        <h4 className="font-medium flex items-center gap-2" style={{ color: BRAND.primary }}><FiAlertTriangle /> <span>Alertas</span></h4>
        <div className="mt-3 space-y-2">
          {alerts.map((a, i) => (
            <div key={i} className="p-3 rounded-xl bg-amber-50 text-amber-800 text-sm">{a.label} · <span className="text-amber-700/80">{a.detail}</span></div>
          ))}
        </div>
        <div className="mt-4">
          <button onClick={() => onChat("Cardio")} className="px-3 py-2 rounded-full text-white w-full" style={{ background: BRAND.primary }}>Ver explicación IA</button>
        </div>
        <div className="mt-2 text-xs text-gray-500">Reglas orientativas para demo. No uso clínico real.</div>
      </div>
    </div>
  );
}

export default function MedPrecDemo() {
  const [route, setRoute] = useState("/");
  const [role, setRole] = useState("patient");
  const [patient] = useState(MOCK_PATIENT);
  const [openDetail, setOpenDetail] = useState(null); // area
  const [chatTopic, setChatTopic] = useState(null);

  const goHome = () => { setRoute("/"); setOpenDetail(null); setChatTopic(null); };
  const switchRole = () => setRole((r) => (r === "patient" ? "doctor" : "patient"));

  if (route === "/") {
    return <RoleSelector onSelect={(r) => { setRole(r); setRoute("/app"); }} />;
  }

  return (
    <div className="min-h-screen bg-white" style={{ background: BRAND.bg }}>
      <TopBar role={role} onBack={goHome} onSwitchRole={switchRole} />
      <main className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        {/* Banner hero compacto */}
        <div className="rounded-2xl p-5 flex items-center justify-between border bg-white">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: BRAND.primary }}>Tu salud, visualizada.</h1>
            <p className="text-gray-600">Demo interactiva: biomarcadores → Precision Scores → acciones preventivas.</p>
          </div>
          <span className="hidden md:inline px-3 py-1.5 rounded-full text-sm bg-white border" style={{ borderColor: BRAND.secondary, color: BRAND.secondary }}>Sin login</span>
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
        <ChatPanel role={role} topic={chatTopic} patient={patient} onClose={() => setChatTopic(null)} />
      )}

      <footer className="text-center text-xs text-gray-500 py-6 bg-white border-t">MedPrec no predice enfermedades; facilita comprensión y prevención. Demo con datos simulados.</footer>
    </div>
  );
}
