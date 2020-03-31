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
  uploading: 'Caricamento della registrazione...',
  'failed to upload': 'Errore nel caricamento del file :(',
  'try again': 'Errore, per favore prova di nuovo',
};

const mandarin: { [key in BaseKeys]: string } = {
  formID: 'WOePzB',
  'device not supported': '不支援的装置',
  'using iPhone': '好像您使用的是iPhone-请尝试切换到Safari。',
  'another browser': '请尝试使用其他浏览器（Chrome或Firefox）',
  thanks: '谢谢！',
  'tap to upload': '录制完成。 点击以上传您的咳嗽。',
  'start upload': '上传',
  play: '玩',
  stop: '停止',
  restart: '重新开始',
  'want to listen': '想听你的录音吗？',
  'want new recording': '要录制新唱片吗？',
  'start recording': '开始记录你的咳嗽',
  'stop recording': '停止录音',
  uploading: '上传咳嗽',
  'failed to upload': '上传文件失败 :(',
  'try again': '失败，请单击以重试',
};

const german: { [key in BaseKeys]: string } = {
  formID: 'pkavl4',
  'device not supported': 'Nicht unterstützte Geräte',
  'using iPhone': 'iPhone-Nutzer? Bitte Safari verwenden',
  'another browser': 'Bitte versuchen Sie es noch einmal mit einem anderen Browser (Chrome oder Firefox).',
  thanks: 'Vielen Dank!',
  'tap to upload': 'Ihre Aufnahme ist jetzt fertig. Tippen Sie hier, um Ihre Hustenaufnahme hochzuladen',
  'start upload': 'Hochladen',
  play: 'Abspielen',
  stop: 'Stop',
  restart: 'Aufzeichnen',
  'want to listen': 'Möchten Sie Ihre Aufnahme anhören?',
  'want new recording': 'Möchten Sie eine neue Aufnahme machen?',
  'start recording': 'Fangen Sie an, Ihren Husten aufzuzeichnen',
  'stop recording': 'Aufnahme abschließen',
  uploading: 'Hochladen...',
  'failed to upload': 'Hochladen nicht erfolgreich :(',
  'try again': 'Gescheitert, bitte klicken Sie um es noch einmal zu versuchen',
};

const hebrew: { [key in BaseKeys]: string } = {
  formID: 'HAX7wR',
  'device not supported': 'המכשיר או הדפדפן אינם נתמכים :(',
  'using iPhone': 'נראה שהנך משתמש באייפון, נסה לפתוח את האתר בספארי',
  'another browser': 'אנא נסה דפדפן אחר - Chrome או Firefox',
  thanks: 'תודה!',
  'tap to upload': 'הקלטת השיעול הושלמה, לחץ כאן על מנת להעלות אותה',
  'start upload': 'התחל העלאה',
  play: 'נגן',
  stop: 'עצור',
  restart: 'הקלט מחדש',
  'want to listen': 'רוצה לשמוע את ההקלטה?',
  'want new recording': 'מעוניין להקליט מחדש?',
  'start recording': 'התחל הקלטה',
  'stop recording': 'סיים הקלטה',
  uploading: 'מעלה...',
  'failed to upload': 'העלאת הקובץ נכשלה :(',
  'try again': 'נסה להעלות שנית',
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
  zh: {
    translation: mandarin,
  },
  de: {
    translation: german,
  },
  he: {
    translation: hebrew,
  },
};

const languages = Object.keys(resources);
type Language = keyof typeof resources;

export const langDisplayNames: { [key in Language]: string } = {
  en: '🇬🇧 English',
  es: '🇪🇸 Español',
  it: '🇮🇹 Italiano',
  zh: '🇨🇳 國語',
  de: '🇩🇪 Deutsch',
  he: '🇮🇱 עברית',
};

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
