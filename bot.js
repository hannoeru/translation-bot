const Telegraf = require('telegraf');
require('dotenv').config();
// Imports the Google Cloud client library
const { TranslationServiceClient } = require('@google-cloud/translate');
// Creates a client
const translationClient = new TranslationServiceClient();
// Set env
const projectId = 'home-1525861264363';
const location = 'global';

async function translateText(text, target) {
  // Construct request
  const request = {
    parent: `projects/${projectId}/locations/${location}`,
    contents: [text],
    mimeType: 'text/plain',
    targetLanguageCode: target,
    model: `projects/${projectId}/locations/${location}/models/general/nmt`,
  };

  try {
    // Run request
    const [response] = await translationClient.translateText(request);

    return response.translations[0].translatedText;
  } catch (error) {
    console.error(error.details);
  }
}

async function detectLanguage(text) {
  // Construct request
  const request = {
    parent: `projects/${projectId}/locations/${location}`,
    content: text,
  };

  try {
    // Run request
    const [response] = await translationClient.detectLanguage(request);

    return response.languages[0].languageCode;
  } catch (error) {
    console.error(error.details);
  }
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
    const ja = await translateText(ctx.message.text, 'ja');
    const vi = await translateText(ctx.message.text, 'vi');
    result = vi + '\n' + ja;
    ctx.reply(result);
  } else if (lang === 'vi') {
    const ja = await translateText(ctx.message.text, 'ja');
    const tw = await translateText(ctx.message.text, 'zh-TW');
    result = tw + '\n' + ja;
    ctx.reply(result);
  } else if (lang === 'ja') {
    const vi = await translateText(ctx.message.text, 'vi');
    const tw = await translateText(ctx.message.text, 'zh-TW');
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
