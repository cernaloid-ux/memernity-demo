import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

const deepseek = createOpenAI({
  baseURL: 'https://api.deepseek.com/v1',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const result = await generateText({
      model: deepseek('deepseek-chat'),
      system: `Ты — профессиональный редактор. Твоя задача — исправить ВСЕ орфографические, грамматические и пунктуационные ошибки в предоставленных данных. 
      ВЕРНИ СТРОГО ВАЛИДНЫЙ JSON. КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО использовать markdown-разметку (никаких \`\`\`json). Только чистый объект.
      Структура JSON должна в точности совпадать с входящей.`,
      prompt: JSON.stringify(body),
    });

    // Жесткая очистка от возможных markdown-тегов, если ИИ всё же их добавил
    const cleanedText = result.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleanedText);

    return new Response(JSON.stringify(parsed), { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('JSON Parse Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to parse JSON' }), { status: 500 });
  }
}
