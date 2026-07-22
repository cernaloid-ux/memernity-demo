export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { profileId, photoUrl } = body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return Response.json({ success: false, error: 'Telegram credentials missing' }, { status: 500 });
    }

    const text = `🚨 Новая заявка на реставрацию!\nПрофиль: ${profileId}\nСсылка на локальное фото: ${photoUrl}`;

    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Telegram API Error:', errorText);
      return Response.json({ success: false, error: 'Failed to send message' }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error sending telegram message:', error);
    return Response.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
