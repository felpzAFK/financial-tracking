import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: Request) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY não encontrada no servidor!");
        }

        const ai = new GoogleGenAI({ apiKey: apiKey });
        const body = await request.json();
        const { saldo, gastosTotais, transacoes, personalidade } = body;

        let instrucaoPersonalidade = "";
        
        switch (personalidade) {
            case "amigavel":
                instrucaoPersonalidade = "Aja como um 'Treinador Financeiro Amigável'. Dê conselhos de forma empática, gentil e encorajadora. Use emojis simpáticos. Foque em motivar a pessoa a continuar a melhorar, mesmo se o saldo estiver negativo.";
                break;
            case "frio":
                instrucaoPersonalidade = "Aja como um 'Analista de Dados Robótico'. Seja calculista, use termos técnicos e financeiros. Faça uma análise puramente lógica, impessoal e sem demonstrar emoções. Não use emojis.";
                break;
            case "rigoroso":
            default:
                instrucaoPersonalidade = "Aja como um 'Conselheiro Disciplinar'. Dê um feedback curto, direto e levemente sarcástico. Se a pessoa gastou muito com impulsos, dê uma bronca firme. Se o saldo for positivo, faça um elogio contido.";
                break;
        }

        const systemPrompt = `Você é um Conselheiro Financeiro da aplicação Financial Tracking. ${instrucaoPersonalidade}`;
        const userPrompt = `Resumo Financeiro: Saldo R$ ${saldo}, Gastos R$ ${gastosTotais}. Dê um conselho curto e prático.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', 
            contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
            config: {
                systemInstruction: systemPrompt,
                temperature: 0.7, 
            }
        });

        const conselho = response.text || "Sem resposta.";
        return NextResponse.json({ conselho });

    } catch (error: any) {
        console.error('ERRO DETALHADO:', error);
        return NextResponse.json(
            { error: error.message || "Erro desconhecido no servidor" }, 
            { status: 500 }
        );
    }
}