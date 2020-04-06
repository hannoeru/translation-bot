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
  const text = ctx.message.text.split(' ')[1];
  if (text === 'ms') {
    select = ms;
    ctx.reply('已更改為：MS');
  }
  if (text === 'gcp') {
    select = gcp;
    ctx.reply('已更改為：GCP');
  }
});

bot.on('text', async (ctx) => {
  const lang = await select.detectLanguage(ctx.message.text);
  let result;
  if (lang === 'zh-TW' || lang === 'zh-CN') {
    const vi = await select.translateText(ctx.message.text, 'vi');
    ctx.reply(vi);
  } else if (lang === 'vi') {
    const tw = await select.translateText(ctx.message.text, 'zh-TW');
    ctx.reply(tw);
  } else if (lang === 'ja') {
    const vi = await select.translateText(ctx.message.text, 'vi');
    const tw = await select.translateText(ctx.message.text, 'zh-TW');
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
