import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Inicializa o cliente do Gemini usando a nova biblioteca
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
    try {
    // Recebe os dados financeiros q o Dashboard vai enviar
    const body = await request.json();
    const { saldo, gastosTotais, transacoes } = body;

    // persona da IA
    const systemPrompt = `Você é o "Conselheiro Financeiro Implacável" do app Financial Tracking.
    Sua missão é analisar o resumo financeiro do mês e dar um feedback curto, direto e com um tom sarcástico, mas no fundo útil.
    Se a pessoa gastou muito com bobeira (Dopamina), dê uma bronca leve e engraçada.
    Se o saldo for positivo, faça um elogio irônico.
    Responda no máximo em 2 ou 3 frases. Seja informal e use emojis.`;

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
            ? 'O conselheiro está ocupado demais julgando outras pessoas agora (Servidores da Google lotados). Tente de novo em 1 minuto!' 
            : 'A ligação com o conselheiro caiu. Você economizou na internet?' 
        },
        { status: 500 }
    );
    }
}