"use client";
import Link from "next/link";
import Image from "next/image";

export default function CadastroSucesso() {
  return (
    <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center font-sans px-4 text-center">
      <div className="bg-white p-10 rounded-[10px] shadow-2xl w-full max-w-[450px] border border-[#eee]">
        
        {/* ÍCONE DE SUCESSO OU PORQUINHO */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <Image 
              src="/porcocaze1.PNG" 
              alt="Sucesso" 
              width={80} 
              height={80} 
              className="object-contain"
            />
          </div>
        </div>

        <h1 className="text-[2rem] font-bold text-[#2c3e50] mb-4">Bem-vindo!</h1>
        <p className="text-gray-600 mb-8">
          Você acessou o sistema com sucesso. Sua conta no Financial Tracking está pronta!
        </p>

        <Link 
          href="/" 
          className="block w-full bg-[#25b461] hover:bg-[#1e914d] text-white py-3 rounded-[5px] font-bold text-lg shadow-md transition-all active:scale-[0.98]"
        >
          Ir para a Página Inicial
        </Link>
      </div>
    </div>
  );
}