import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Inicializa o cliente do Gemini usando a nova biblioteca
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
    try {
        // Recebe os dados financeiros que o Dashboard vai enviar
        const body = await request.json();
        const { saldo, gastosTotais, transacoes, personalidade } = body;

        // Define as instruções com base na personalidade escolhida
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

        // Constrói o Prompt do Sistema combinando o papel base com a personalidade
        const systemPrompt = `Você é um Conselheiro Financeiro inteligente da aplicação Financial Tracking.
        ${instrucaoPersonalidade}
        Sua missão é analisar o resumo financeiro atual e dar um feedback útil.
        Responda no máximo em 2 ou 3 frases curtas.`;

        // Constrói a mensagem do utilizador com os dados dinâmicos
        const userPrompt = `
            Aqui está o meu resumo financeiro atual:
            - Saldo Restante: R$ ${saldo}
            - Gastos Totais: R$ ${gastosTotais}
            - Algumas transações recentes: ${JSON.stringify(transacoes.slice(0, 5))}
            
            O que você tem a dizer sobre isso?
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userPrompt,
            config: {
                systemInstruction: systemPrompt,
                temperature: 0.7, 
            }
        });

        const conselho = response.text;

        return NextResponse.json({ conselho });

    } catch (error: any) {
        console.error('Erro ao gerar conselho da IA:', error);

        const isOverloaded = error?.message?.includes('503') || error?.status === 503;
        
        return NextResponse.json(
            { error: isOverloaded 
                ? 'O conselheiro está ocupado demais processando dados no momento. Tente de novo em 1 minuto!' 
                : 'A ligação com o conselheiro caiu. Verifique a sua conexão e tente novamente.' 
            },
            { status: 500 }
        );
    }
}