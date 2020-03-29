import i18n, { Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';
import detector from 'i18next-browser-languagedetector';

// the translations
// (tip move them in a JSON file and import them)
const resources: Resource = {
  en: {
    translation: {
      formID: 'B66hFI',
      'Device not supported': 'Device not supported :(',
      'using iPhone': 'Looks like you are using iPhone - Please try switching to Safari',
      'another browser': 'Please try another browser (Chrome or Firefox)',
      thanks: 'Thanks!',
      'tap to upload': 'Your recording is now complete, tap to upload your cough',
      'start upload': 'Upload Cough',
      play: 'Play',
      stop: 'Stop',
      restart: 'Restart',
      'want to listen': 'Want to listen to your recording?',
      'want new recording': 'Want to make a new recording?',
      'start recording': 'Start recording your cough',
      'stop recording': 'Stop Recording',
      uploading: 'Uploading...',
      'failed to upload': 'Failed to upload file :(',
      'try again': 'Failed, please click to try again',
    },
  },
  es: {
    translation: {
      formID: 'HEsImC',
      'device not supported': 'Dispositivos no compatibles :(',
      'using iPhone': 'Parece que estás usando un iPhone. Intenta cambiar a Safari',
      'another browser': 'Inténtalo con otro navegador (Chrome o Firefox)',
      thanks: 'Gracias!',
      'tap to upload': 'Tu grabación ya está completa. Haz click aquí para subir tu tos',
      'start upload': 'Subir tos',
      play: 'Reproducir',
      stop: 'Parar',
      restart: 'Repetir',
      'want to listen': 'Quieres escuchar tu grabación?',
      'want new recording': 'Quieres repetir la grabación?',
      'start recording': 'Comienza a registrar tu tos',
      'stop recording': 'Parar de grabar',
      uploading: 'Subiendo tos...',
      'failed to upload': 'Error al cargar el archivo :(',
      'try again': 'Falló, por favor trata otra vez',
    },
  },
  it: {
    translation: {
      formID: 'ClzG2Z',
    },
  },
};

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    resources,
    lng: navigator.language,
    fallbackLng: ['en', 'es', 'it'],
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
