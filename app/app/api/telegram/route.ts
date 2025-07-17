export async function POST(req: Request) {
  const { order } = await req.json();
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  const message = `有一筆新訂單！\n餐點：${order.map((i: any) => i.name + 'x' + i.qty).join(', ')}`;

  console.log('TOKEN:', TELEGRAM_BOT_TOKEN);
  console.log('CHAT_ID:', TELEGRAM_CHAT_ID);
  console.log('MSG:', message);

  const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message
    })
  });

  const data = await res.json();
  console.log('TELEGRAM API RESPONSE:', data);
  return new Response(JSON.stringify(data), { status: 200 });
} 