/**
 * Utilidades para clases CSS, colores y estilos
 */

// Concatena clases CSS
export const cls = (...xs) => xs.filter(Boolean).join(" ");

// Color de la barra de progreso según porcentaje
export const pctColor = (v) => 
  v >= 80 ? "bg-emerald-500" : v >= 60 ? "bg-amber-500" : "bg-rose-500";

// Color del texto según porcentaje
export const textSem = (v) => 
  v >= 80 ? "text-emerald-600" : v >= 60 ? "text-amber-600" : "text-rose-600";

// Color del chip según porcentaje
export const chipSem = (v) => 
  v >= 80 ? "bg-emerald-100 text-emerald-700" 
  : v >= 60 ? "bg-amber-100 text-amber-700" 
  : "bg-rose-100 text-rose-700";
