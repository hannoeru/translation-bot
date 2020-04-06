const request = require('request');
const rp = require('request-promise');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const endpoint = process.env.MS_API_ENDPOINT;
const key = process.env.MS_API_KEY;

async function detectLanguage(text) {
  const options = {
    method: 'POST',
    baseUrl: endpoint,
    url: 'detect',
    qs: {
      'api-version': '3.0',
    },
    headers: {
      'Ocp-Apim-Subscription-Key': key,
      'Content-type': 'application/json',
      'X-ClientTraceId': uuidv4().toString(),
    },
    body: [
      {
        text: text,
      },
    ],
    json: true,
  };

  const res = await rp(options);
  let lang = res[0].language;
  if (lang === 'zh-Hant' || lang === 'zh-Hans') {
    lang = 'zh-TW';
  }
  return lang;
}

async function translateText(text, target) {
  if (target === 'zh-TW') target = 'zh-Hant';
  let options = {
    method: 'POST',
    baseUrl: endpoint,
    url: 'translate',
    qs: {
      'api-version': '3.0',
      to: [target],
    },
    headers: {
      'Ocp-Apim-Subscription-Key': key,
      'Content-type': 'application/json',
      'X-ClientTraceId': uuidv4().toString(),
    },
    body: [
      {
        text: text,
      },
    ],
    json: true,
  };
  const res = await rp(options);
  return res[0].translations[0].text;
}

module.exports = {
  detectLanguage,
  translateText,
};
