/*
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-chained-backend';
import HttpBackend from 'i18next-http-backend';
*/

export class Locale {

  private static supportedLanguages = ["de", "en", "es", "fr", "hi", "it", "ko", "no", "pt", "ru", "tl", "zh"];
  private static extraCodes: {[key: string]: string[]} = {no: ["nb", "nn"]}

  private static keys:any = {}

  static init = async (backends:string[]) => {
    let langs = ["en"];
    if (typeof navigator !== "undefined") {
      let l = navigator.language.split("-")[0];
      l = Object.keys(this.extraCodes).find(code => this.extraCodes[code].includes(l)) || l
      const notSupported = this.supportedLanguages.indexOf(l) === -1
      langs = (l==="en" || notSupported) ? ["en"] : ["en", l];
    }

    let result = {};
    for (let lang of langs) {
      for (let backend of backends) {
        let url = backend.replace("{{lng}}", lang);
        console.log(url);
        const data = await fetch(url).then((response) => response.json());
        result = this.deepMerge(result, data);
      }
    }
    this.keys = result;
  }

  private static deepMerge(target:any, source:any) {
    for (const key in source) {
      if (this.isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        this.deepMerge(target[key], source[key]);
      } else Object.assign(target, { [key]: source[key] });
    }
    return target;
  }

  private static isObject(obj:any) {
    return obj && typeof obj === 'object' && !Array.isArray(obj);
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


}
