# MedPrec Demo

Demo interactiva de **MedPrec** - Tu salud, visualizada.

## 🚀 Características

- ✅ **Sin backend, sin login**: Demo completamente funcional del lado del cliente
- 👥 **Roles intercambiables**: Paciente y Médico
- 📊 **Precision Scores**: Visualización de marcadores de salud
- 🤖 **Asistente IA simulado**: Respuestas educativas sobre biomarcadores
- 🎨 **Diseño modular**: Componentes reutilizables y bien organizados

## 📁 Estructura del Proyecto

```
demo/
├── src/
│   ├── components/
│   │   ├── common/          # Componentes compartidos
│   │   │   ├── TopBar.jsx
│   │   │   ├── RoleSelector.jsx
│   │   │   ├── CardChoice.jsx
│   │   │   ├── ScoreBar.jsx
│   │   │   └── ActionChip.jsx
│   │   ├── patient/         # Componentes del rol Paciente
│   │   │   ├── PatientDashboard.jsx
│   │   │   └── ScoreDetail.jsx
│   │   ├── doctor/          # Componentes del rol Médico
│   │   │   ├── DoctorList.jsx
│   │   │   └── DoctorPatient.jsx
│   │   └── chat/            # Chat con IA
│   │       └── ChatPanel.jsx
│   ├── utils/               # Utilidades y helpers
│   │   ├── helpers.js       # Funciones CSS y colores
│   │   └── iaResponses.js   # Generador de respuestas IA
│   ├── constants/           # Constantes de la app
│   │   ├── theme.js         # Paleta de colores
│   │   └── scores.js        # Descriptores de scores
│   ├── data/                # Datos mock
│   │   └── mockData.js
│   ├── App.jsx              # Componente principal
│   ├── index.js             # Punto de entrada
│   └── index.css            # Estilos globales
├── public/
│   └── index.html
├── package.json
├── tailwind.config.js
└── README.md
```

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start

# Construir para producción
npm run build
```

## 🎨 Tecnologías

- **React 18** - Framework UI
- **Tailwind CSS** - Estilos utility-first
- **React Icons** - Biblioteca de iconos
- **Create React App** - Configuración y build

## 📝 Componentes Principales

### Common (Componentes Compartidos)
- `TopBar` - Barra superior con navegación y selector de rol
- `RoleSelector` - Pantalla de selección inicial de rol
- `CardChoice` - Tarjeta de selección reutilizable
- `ScoreBar` - Barra de progreso con código de colores
- `ActionChip` - Botón de acción rápida

### Patient (Vista Paciente)
- `PatientDashboard` - Panel principal del paciente
- `ScoreDetail` - Detalle de un Precision Score específico

### Doctor (Vista Médico)
- `DoctorList` - Lista de pacientes
- `DoctorPatient` - Ficha detallada del paciente

### Chat
- `ChatPanel` - Panel de chat con asistente IA

## 🎯 Mejoras Implementadas

✅ **Modularización**: Código separado en módulos lógicos  
✅ **Reutilización**: Componentes comunes compartidos  
✅ **Mantenibilidad**: Estructura clara y fácil de navegar  
✅ **Escalabilidad**: Fácil añadir nuevos componentes o features  
✅ **Separación de concerns**: Datos, lógica y presentación separados  

## ⚠️ Nota

Esta es una demo educativa con datos simulados. No sustituye consejo médico profesional.

---

**MedPrec** - Transformando biomarcadores en decisiones informadas 🏥
