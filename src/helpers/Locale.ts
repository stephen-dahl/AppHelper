/*
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-chained-backend';
import HttpBackend from 'i18next-http-backend';
*/

export class Locale {

  private static keys:any = {}

  static init = async (backends:string[]) => {
    const l = navigator.language.split("-")[0];
    const langs = (l==="en") ? [l] : ["en", l];
    console.log("LANGUAGE", navigator.language, l, langs);

    let result = {};
    for (let lang of langs) {
      for (let backend of backends) {
        let url = backend.replace("{{lng}}", lang);
        console.log(url);
        const data = await fetch(url).then((response) => response.json());
        result = {...result, ...data};
      }
    }
    this.keys = result;
  }

  static label(key:string) {
    const parts = key.split(".");
    let result = key;
    let obj = this.keys;
    for (let part of parts) {
      if (obj[part]) {
        obj = obj[part];
        result = obj;
      } else {
        return key;
      }
    }
    return result;
  }

  /*
  //'/locales/{{lng}}.json'
  static init = async (backends:string[]) => {

    const backendOptions = backends.map((path) => ({ loadPath: path }));


    console.log("backend options", backendOptions)
    console.log({backend: {
      backends: backends.map(() => HttpBackend),
      backendOptions,
    }})

    await i18n
  	  .use(Backend)
  	  .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        fallbackLng: 'en',
        debug: true,
        interpolation: {
          escapeValue: false, // React already does escaping
        },
        backend: {
          backends: backends.map(() => HttpBackend),
          backendOptions,
        },
        supportedLngs: ['en', 'es'],
      });
  }

  static label(key:string) {
    return i18n.t(key);
  }
  */

}
