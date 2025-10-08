"use client";
// @ts-nocheck

import React from "react";

interface ScriptBoxProps {
  loading: boolean;
  script: string;
}

export default function ScriptBox({ loading, script }: ScriptBoxProps) {
  return (
    <div className="border rounded p-1 bg-gray-50 min-h-[96px]">
      {loading ? (
            <div className="w-full animate-pulse rounded bg-gray-300"> Generating </div>
      ) : (
        <div className="rounded bg-slate-50 p-1 text-gray-800 whitespace-pre-wrap">
            {script || "—"}
          </div>
      )}
    </div>
  );
}
