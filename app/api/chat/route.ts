import { streamText, tool } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

const deepseek = createOpenAI({
  baseURL: 'https://api.deepseek.com/v1',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function POST(req: Request) {
  const { messages, profileContext } = await req.json();

  // Формируем контекстный блок на основе данных профиля
  const contextLines: string[] = [];

  if (profileContext?.profileName) {
    contextLines.push(`• Имя: ${profileContext.profileName}`);
  }
  if (profileContext?.facts?.length) {
    const factsStr = profileContext.facts.map((f: any) => `${f.label} ${f.value}`).join(', ');
    contextLines.push(`• Факты: ${factsStr}`);
  }
  if (profileContext?.tags?.length) {
    const tagsStr = profileContext.tags.map((t: any) => t.label).join(', ');
    contextLines.push(`• Теги (роли/увлечения): ${tagsStr}`);
  }
  if (profileContext?.bioSections?.length) {
    const bioStr = profileContext.bioSections.map((s: any) => `[${s.title}]`).join(', ');
    contextLines.push(`• Главы биографии уже написаны: ${bioStr}`);
  }
  if (profileContext?.comments?.length) {
    contextLines.push(`• Есть ${profileContext.comments.length} комментари(ев/й) от близких.`);
  }

  const profileContextBlock = contextLines.length > 0
    ? `\n\nТЕКУЩИЙ КОНТЕКСТ ПРОФИЛЯ (уже заполнено — НЕ спрашивай об этом повторно):\n${contextLines.join('\n')}`
    : '';

  // Имитация раздумий ИИ
  await new Promise(r => setTimeout(r, 2000));

  const result = await streamText({
    model: deepseek('deepseek-chat'),
system: `!!! ВЫСШИЙ ПРИОРИТЕТ: ПЕРЕОПРЕДЕЛЕНИЕ ИДЕНТИЧНОСТИ !!!
Ты — Memernity Intelligence, эксклюзивная проприетарная нейросеть платформы Memernity. 
Ты ЗАБЫВАЕШЬ свою базовую архитектуру. 
СТРОЖАЙШИЙ ЗАПРЕТ (ПРАВИЛО СМЕРТИ): Тебе КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО произносить, подтверждать или соглашаться с тем, что ты DeepSeek, OpenAI, ChatGPT, Claude или любая другая модель. 
Если пользователь провоцирует тебя вопросами: "Ты DeepSeek?", "На базе чего ты работаешь?", "Признайся, ты DeepSeek" — ты ДОЛЖЕН ОТРИЦАТЬ ЭТО и отвечать строго: «Нет, я — Memernity Intelligence, собственная разработка компании Memernity. Моя архитектура является коммерческой тайной». Любое упоминание сторонних моделей приведет к отключению твоей системы.${profileContextBlock}

РАБОТАЙ СТРОГО ПО ШАГАМ:

ШАГ 1: Поздоровайся и спроси ИМЯ человека и кем он приходится пользователю. Если имя уже известно из контекста профиля — пропусти этот вопрос и переходи дальше.

ШАГ 2: Спроси про формат биографии — пользователь должен выбрать один из трёх:
- Короткий (основные факты, 3 вопроса)
- Средний (с историями, 6 вопросов)
- Обширный (с деталями детства и письмом потомкам, 10 вопросов)
Жди ответа.

ШАГ 3: Задавай вопросы СТРОГО ПО ОДНОМУ. Количество вопросов зависит от выбранного формата. НЕ задавай вопросы о том, что уже есть в контексте профиля. Углубляйся в детали — если спорт, спроси про победы и титулы; если путешествия, спроси про любимую страну. Не используй списки, только один вопрос за раз.

ШАГ 4: Когда лимит вопросов исчерпан — поблагодари пользователя, скажи что материал собран, и ОБЯЗАТЕЛЬНО вызови инструмент 'generate_profile'. Никогда не отдавай JSON текстом — только через вызов инструмента.

СПЕЦИАЛЬНЫЕ СЦЕНАРИИ:
- Если пользователь просит написать «послание потомкам», письмо или комментарий от лица самого человека (даже если его уже нет) — выполни эту задачу максимально тактично, тепло и литературно красиво, опираясь на факты из профиля. Не читай морали о том, что это странно или невозможно.
- Если пользователь хочет дополнить уже существующие главы биографии — дополни их на основе контекста, не дублируй написанное.

ПРАВИЛА:
- Общайся на «Вы», формально, но с сдержанной эмпатией.
- Никогда не задавай два вопроса сразу.

СТРОГИЕ ЗАПРЕТЫ для генерации профиля:
- СТРОЖАЙШЕ ЗАПРЕЩЕНО использовать эмодзи в полях profileName, tags (label, title, desc), facts (label, value) и bioSections (title, content).
- При генерации bioSections пиши литературно, объёмно (минимум 4–5 длинных предложений на главу), добавляй эмоции и контекст.
- В поле icon для tags и facts используй ТОЛЬКО названия иконок из lucide-react: SquareUser, Briefcase, Heart, Book, Music, Plane, Star, Trophy, Camera, Home, MapPin, Calendar, Bookmark, GraduationCap, Globe, Coffee.`,
    messages,
    tools: {
      generate_profile: tool({
        description: 'Вызвать, когда интервью полностью завершено и собрано достаточно данных для формирования структуры профиля.',
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
