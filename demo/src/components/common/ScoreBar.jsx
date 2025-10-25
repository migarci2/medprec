import React from "react";
import { cls, pctColor, textSem } from "../../utils/helpers";

export function ScoreBar({ label, value }) {
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="w-28 text-sm text-gray-700">{label}</div>
      <div className="flex-1 h-2 rounded bg-gray-100 overflow-hidden">
        <div 
          className={cls("h-2 rounded", pctColor(value))} 
          style={{ width: `${value}%` }} 
        />
      </div>
      <div className={cls("w-10 text-right text-sm font-semibold", textSem(value))}>
        {value ? value : "—"}
      </div>
    </div>
  );
}
