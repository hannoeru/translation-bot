const Telegraf = require('telegraf');
require('dotenv').config();
const ms = require('./ms_api');
const gcp = require('./gcp_api');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Bot router

bot.start((ctx) => ctx.reply('Welcome'));

// bot.help((ctx) => ctx.reply('Send me a sticker'));

// bot.use(Telegraf.log());
let select = gcp;

bot.command('use', (ctx) => {
  if (ctx.message.text === 'ms') {
    select = ms;
    ctx.reply('已更改為：MS');
  }
  if (ctx.message.text === 'gcp') {
    select = gcp;
    ctx.reply('已更改為：GCP');
  }
});

bot.on('text', async (ctx) => {
  const lang = await select.detectLanguage(ctx.message.text);
  let result;
  if (lang === 'zh-TW' || lang === 'zh-CN') {
    const en = await select.translateText(ctx.message.text, 'en');
    const vi = await select.translateText(en, 'vi');
    ctx.reply(vi);
  } else if (lang === 'vi') {
    const en = await select.translateText(ctx.message.text, 'en');
    const tw = await select.translateText(en, 'zh-TW');
    ctx.reply(tw);
  } else if (lang === 'ja') {
    const en = await select.translateText(ctx.message.text, 'en');
    const vi = await select.translateText(en, 'vi');
    const tw = await select.translateText(en, 'zh-TW');
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
