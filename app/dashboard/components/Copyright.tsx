"use client";

import { useEffect } from "react";

export default function EasterEgg() {
  useEffect(() => {
    const asciiCone = `
            /\\
           /  \\
          /    \\
         /      \\
        /        \\
       /__________\\
      (  felpz.xyz )
       \\__________/
    `;

    const estiloTitulo = "color: #25b461; font-size: 22px; font-weight: black; font-family: monospace; text-shadow: 2px 2px 0px rgba(0,0,0,0.2);";
    const estiloTexto = "color: #a855f7; font-size: 14px; font-weight: bold; font-family: monospace;";
    const estiloSucesso = "color: #3b82f6; font-size: 13px; font-weight: bold; font-family: monospace;";

    console.log("%c[ FT - FINANCIAL TRACKING ]", estiloTitulo);
    console.log(asciiCone);
    console.log("%c⚡ Desenvolvido por: felpz.xyz, darkm0on, e aos outros antigos membros fodas", estiloTexto);
    console.log("%cse vc ta lendo isso, vc é foda :D me contrata ai hehe", estiloSucesso);
  }, []);

  return null; 
}