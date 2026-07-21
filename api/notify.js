// Vercel serverless function: /api/notify
// Prinimaet zayavku s sajta i otpravlyaet uvedomlenie v Telegram cherez bota.
//
// Chto nuzhno sdelat pered zapuskom (odin raz):
// 1. V Telegram najdite @BotFather, komanda /newbot, sozdajte bota, skopirujte BOT TOKEN.
// 2. Napishite svoemu novomu botu lyuboe soobshenie (privet), chtoby on "uvidel" vas.
// 3. Uznajte svoj CHAT ID: otkrojte v brauzere
//    https://api.telegram.org/bot<VASH_TOKEN>/getUpdates
//    i najdite v otvete "chat":{"id": ЧИСЛО} - eto vash chat id.
// 4. V nastrojkah proekta na Vercel: Settings -> Environment Variables, dobavte:
//    TELEGRAM_BOT_TOKEN = токен из BotFather
//    TELEGRAM_CHAT_ID   = ваш chat id
//    (nikogda ne vstavlyajte eti znacheniya pryamo v kod ili v chat).
// 5. Pereразверните (redeploy) proekt na Vercel posle dobavleniya peremennykh.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const { username, need } = req.body || {};

    if (!username || !need) {
      return res.status(400).json({ ok: false, error: 'username and need are required' });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return res.status(500).json({ ok: false, error: 'Telegram env vars are not configured yet' });
    }

    const text = [
      'Новая заявка с сайта',
      'Telegram: ' + username,
      'Что нужно: ' + need
    ].join('\n');

    const tgRes = await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    });

    if (!tgRes.ok) {
      const errBody = await tgRes.text();
      console.error('Telegram API error:', errBody);
      return res.status(502).json({ ok: false, error: 'Telegram API error' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
}
