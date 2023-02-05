import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import commonEn from './en/common.json';
import aboutEn from './en/about.json';

const resources = {
  en: {
    common: commonEn,
    about: aboutEn
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react escapes
    }
  });

export default i18n;
