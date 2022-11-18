import React from "react";

export default function Titlebar() {
  return (
    <div
      data-tauri-drag-region
      className="h-[50px] select-none bg-slate-400 opacity-0 hover:opacity-10 transition-opacity fixed top-0 left-0 right-0"
    ></div>
  );
}
