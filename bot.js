const Telegraf = require('telegraf');
require('dotenv').config();
// Imports the Google Cloud client library
const { Translate } = require('@google-cloud/translate').v2;
// Creates a client
const translate = new Translate();

async function translateText(text, target) {
  let [translations] = await translate.translate(text, target);
  translations = Array.isArray(translations) ? translations : [translations];
  return translations[0];
}

/**
 * TODO(developer): Uncomment the following line before running the sample.
 */
// const text = 'The text for which to detect language, e.g. Hello, world!';

// Detects the language. "text" can be a string for detecting the language of
// a single piece of text, or an array of strings for detecting the languages
// of multiple texts.
async function detectLanguage(text) {
  let [detections] = await translate.detect(text);
  detections = Array.isArray(detections) ? detections : [detections];
  return detections[0].language;
}

const bot = new Telegraf(process.env.BOT_TOKEN);

// Bot router

bot.start((ctx) => ctx.reply('Welcome'));

// bot.help((ctx) => ctx.reply('Send me a sticker'));

// bot.use(Telegraf.log());

bot.on('text', async (ctx) => {
  const lang = await detectLanguage(ctx.message.text);
  let result;
  if (lang === 'zh-TW' || lang === 'zh-CN') {
    result = await translateText(ctx.message.text, 'vi');
    ctx.reply(result);
  } else if (lang === 'vi') {
    result = await translateText(ctx.message.text, 'zh-TW');
    ctx.reply(result);
  } else if (lang === 'ja') {
    const tw = await translateText(ctx.message.text, 'vi');
    const vi = await translateText(ctx.message.text, 'zh-TW');
    result = tw + '\n' + vi;
    ctx.reply(result);
  }
});

bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
  ctx.reply('伺服器錯誤！');
});

// bot.hears('hi', (ctx) => ctx.reply('Hey there'));

// // Launch bot

bot.launch();
