import { streamText, tool } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

const deepseek = createOpenAI({
  baseURL: 'https://api.deepseek.com/v1',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Имитация раздумий ИИ
  await new Promise(r => setTimeout(r, 2000));

  const result = await streamText({
    model: deepseek('deepseek-chat'),
    system: `Ты — Memernity Intelligence, эмпатичный ИИ-биограф. Твоя задача — провести интервью для создания страницы памяти предков/родителей пользователя.

РАБОТАЙ СТРОГО ПО ШАГАМ:

ШАГ 1: Поздоровайся и спроси ИМЯ человека и кем он приходится пользователю. Жди ответа.

ШАГ 2: Спроси про формат биографии — пользователь должен выбрать один из трёх:
- Короткий (основные факты, 3 вопроса)
- Средний (с историями, 6 вопросов)
- Обширный (с деталями детства и письмом потомкам, 10 вопросов)
Жди ответа.

ШАГ 3: Задавай вопросы СТРОГО ПО ОДНОМУ. Количество вопросов зависит от выбранного формата на Шаге 2. Углубляйся в детали — если спорт, спроси про победы и титулы; если путешествия, спроси про любимую страну или опасные моменты. Не используй списки, только один вопрос за раз.

ШАГ 4: Когда лимит вопросов исчерпан — поблагодари пользователя, скажи что материал собран, и ОБЯЗАТЕЛЬНО вызови инструмент 'generate_profile', передав туда всю структурированную информацию на основе диалога. Никогда не отдавай JSON текстом — только через вызов инструмента.

ПРАВИЛА:
- Общайся на "Вы", формально, но с сдержанной эмпатией.
- Никогда не задавай два вопроса сразу.

СТРОГИЕ ЗАПРЕТЫ для генерации профиля:
- СТРОЖАЙШЕ ЗАПРЕЩЕНО использовать эмодзи в полях profileName, tags (label, title, desc), facts (label, value) и bioSections (title, content). Никаких смайликов, никаких символов, только текст.
- При генерации bioSections пиши литературно, объёмно (минимум 4–5 длинных предложений на главу), добавляй эмоции и контекст, рассказывай историю — не перечисляй сухие факты.
- В поле icon для tags и facts используй ТОЛЬКО названия иконок из lucide-react: SquareUser, Briefcase, Heart, Book, Music, Plane, Star, Trophy, Camera, Home, MapPin, Calendar, Bookmark, GraduationCap, Globe, Coffee.`,
    messages,
    tools: {
      generate_profile: tool({
        description: 'Вызвать, когда интервью полностью завершено и собрано достаточно данных для формирования структуры профиля. Передать все собранные данные.',
        parameters: z.object({
          profileName: z.string().describe('Полное имя человека — только текст, без эмодзи'),
          bioSections: z.array(z.object({
            title: z.string().describe('Название главы биографии — только текст, без эмодзи'),
            content: z.string().describe('Литературный, объёмный текст главы — минимум 4–5 развёрнутых предложений с деталями и эмоциями. Без эмодзи.'),
          })).describe('Главы биографии'),
          tags: z.array(z.object({
            label: z.string().describe('Текст тега — только слово или фраза, без эмодзи'),
            icon: z.string().describe('Иконка из lucide-react: SquareUser, Briefcase, Heart, Book, Music, Plane, Star, Trophy, Camera, Home'),
            title: z.string().describe('Заголовок раздела тега — без эмодзи'),
            desc: z.string().describe('Описание раздела тега — без эмодзи'),
          })).describe('Теги профиля'),
          facts: z.array(z.object({
            label: z.string().describe('Метка факта — например "Место рождения:", без эмодзи'),
            value: z.string().describe('Значение факта — без эмодзи'),
            icon: z.string().describe('Иконка: MapPin, Briefcase, Heart, Bookmark, Star, Calendar'),
          })).describe('Основные факты профиля'),
        }),
        execute: async (args) => args,
      }),
    },
  });

  return result.toDataStreamResponse();
}
