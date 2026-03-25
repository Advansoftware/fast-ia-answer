import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');

const SYSTEM_PROMPT =
  'Você analisa questões de múltipla escolha. Responda EXCLUSIVAMENTE no formato: "a resposta é X" onde X é a letra correta. NÃO explique, NÃO justifique, NÃO adicione nada mais.';

export async function POST(req: NextRequest) {
  try {
    const { question, provider = 'openai' } = await req.json();

    if (!question?.trim()) {
      return NextResponse.json({ error: 'Questão vazia' }, { status: 400 });
    }

    let answer: string;

    if (provider === 'gemini') {
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        systemInstruction: SYSTEM_PROMPT,
        generationConfig: { maxOutputTokens: 20, temperature: 0 },
      });
      const result = await model.generateContent(question);
      answer = result.response.text().trim();
    } else {
      // OpenAI — gpt-4o-mini: mais rápido e barato
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: question },
        ],
        max_tokens: 20,
        temperature: 0,
      });
      answer = completion.choices[0]?.message?.content?.trim() ?? 'Sem resposta';
    }

    return NextResponse.json({ answer });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Erro ao processar' }, { status: 500 });
  }
}
