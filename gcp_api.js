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

module.exports = {
  detectLanguage,
  translateText,
};
