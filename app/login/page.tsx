"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase"; // Certifique-se que este arquivo existe na pasta lib

const Login = () => {
  const [nome, setNome] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regSenha, setRegSenha] = useState("");

  const [logEmail, setLogEmail] = useState("");
  const [logSenha, setLogSenha] = useState("");

  const [logado, setLogado] = useState(false);

  // FUNÇÃO DE REGISTRO (CONECTA NO SUPABASE)
  async function registrar() {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: regEmail,
        password: regSenha,
        options: {
          data: { full_name: nome }
        }
      });

      if (error) throw error;
      alert("Sucesso! Verifique seu e-mail para confirmar o cadastro.");
    } catch (erro: any) {
      alert("Erro no registro: " + erro.message);
    }
  }

  // FUNÇÃO DE LOGIN (CONECTA NO SUPABASE)
  async function fazerLogin() {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: logEmail,
        password: logSenha,
      });

      if (error) throw error;
      setLogado(true);
    } catch (erro: any) {
      alert("Erro no login: " + erro.message);
    }
  }

  function sair() {
    setLogado(false);
  }

  const styles = {
    body: { fontFamily: "Arial, sans-serif", backgroundColor: "#3b3939", display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" },
    container: { background: "black", padding: "30px", borderRadius: "12px", boxShadow: "0 8px 16px rgba(0,0,0,0.5)", width: "350px", textAlign: "center" as const, color: "white" },
    input: { width: "100%", margin: "10px 0", padding: "12px", borderRadius: "6px", border: "1px solid #444", backgroundColor: "#222", color: "white", boxSizing: "border-box" as const },
    button: { width: "100%", margin: "10px 0", padding: "12px", borderRadius: "6px", border: "none", backgroundColor: "#25b461", color: "white", cursor: "pointer", fontWeight: "bold" as const },
  };

  return (
    <div style={styles.body}>
      {!logado ? (
        <div style={styles.container}>
          <h2 style={{ color: "#25b461" }}>Criar Conta</h2>
          <input style={styles.input} placeholder="Seu Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
          <input style={styles.input} type="email" placeholder="E-mail de Registro" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
          <input style={styles.input} type="password" placeholder="Senha de Registro" value={regSenha} onChange={(e) => setRegSenha(e.target.value)} />
          <button style={styles.button} onClick={registrar}>Registrar</button>

          <hr style={{ margin: "20px 0", borderColor: "#444" }} />

          <h2 style={{ color: "#007bff" }}>Entrar</h2>
          <input style={styles.input} type="email" placeholder="Seu E-mail" value={logEmail} onChange={(e) => setLogEmail(e.target.value)} />
          <input style={styles.input} type="password" placeholder="Sua Senha" value={logSenha} onChange={(e) => setLogSenha(e.target.value)} />
          <button style={{ ...styles.button, backgroundColor: "#007bff" }} onClick={fazerLogin}>Entrar</button>
        </div>
      ) : (
        <div style={styles.container}>
          <h1>Bem-vindo!</h1>
          <p>Login efetuado com sucesso no banco do David.</p>
          <button style={styles.button} onClick={sair}>Sair</button>
        </div>
      )}
    </div>
  );
};

export default Login;