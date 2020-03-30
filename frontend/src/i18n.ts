import i18n, { Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';
import detector from 'i18next-browser-languagedetector';

// const template: { [key in BaseKeys]: string } = {
//     formID: '',
//     'device not supported': '',
//     'using iPhone': '',
//     'another browser': '',
//     thanks: '',
//     'tap to upload': '',
//     'start upload': '',
//     play: '',
//     stop: '',
//     restart: '',
//     'want to listen': '',
//     'want new recording': '',
//     'start recording': '',
//     'stop recording': '',
//     uploading: '',
//     'failed to upload': '',
//     'try again': '',
//   };

const english = {
  formID: 'B66hFI',
  'device not supported': 'Device not supported :(',
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
};

type BaseKeys = keyof typeof english;

const spanish: { [key in BaseKeys]: string } = {
  formID: 'HEsImC',
  'device not supported': 'Dispositivos no compatibles :(',
  'using iPhone': 'Parece que estás usando un iPhone - Intenta cambiar a Safari',
  'another browser': 'Inténtalo con otro navegador (Chrome o Firefox)',
  thanks: '¡Gracias!',
  'tap to upload': 'Tu grabación ya está completa. Haz click aquí para subir tu tos',
  'start upload': 'Subir tos',
  play: 'Reproducir',
  stop: 'Parar',
  restart: 'Repetir',
  'want to listen': '¿Quieres escuchar tu grabación?',
  'want new recording': '¿Quieres repetir la grabación?',
  'start recording': 'Comienza a registrar tu tos',
  'stop recording': 'Parar de grabar',
  uploading: 'Subiendo tos...',
  'failed to upload': 'Error al cargar el archivo :(',
  'try again': 'Falló, por favor trata otra vez',
};

const italian: { [key in BaseKeys]: string } = {
  formID: 'ClzG2Z',
  'device not supported': 'Dispositivo non supportato :(',
  'using iPhone': 'Sembra che tu stia usando un iPhone - per favore prova ad utilizzare Safari',
  'another browser': 'Per favore prova con un altro browser (Chrome o Firefox)',
  thanks: 'Grazie!',
  'tap to upload': 'La tua registrazione è ora completata, clicca per caricare la tua tosse.',
  'start upload': 'Carica',
  play: 'Ascolta',
  stop: 'Blocca',
  restart: 'Registrare',
  'want to listen': 'Vuoi ascoltare la tua registrazione?',
  'want new recording': 'La vuoi registrare di nuovo?',
  'start recording': 'Inizia a registrare la tua tosse',
  'stop recording': 'Blocca la registrazione',
  uploading: 'Caricamento della registrazione',
  'failed to upload': 'Errore nel caricamento del file :(',
  'try again': 'Errore, per favore prova di nuovo',
};

const resources: Resource = {
  en: {
    translation: english,
  },
  es: {
    translation: spanish,
  },
  it: {
    translation: italian,
  },
};

const languages = ['en', 'es', 'it'];

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    resources,
    whitelist: languages,
    fallbackLng: languages,
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
