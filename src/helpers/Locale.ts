import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-chained-backend";
import HttpBackend from "i18next-http-backend";

interface TranslationResources {
	[key: string]: {
		translation: Record<string, unknown>;
	};
}

interface ExtraLanguageCodes {
	[key: string]: string[];
}

export class Locale {
	private static readonly supportedLanguages: string[] = [
		"de",
		"en",
		"es",
		"fr",
		"hi",
		"it",
		"ko",
		"no",
		"pt",
		"ru",
		"tl",
		"zh",
	];
	private static readonly extraCodes: ExtraLanguageCodes = { no: ["nb", "nn"] };

	static init = async (backends: string[]): Promise<void> => {
		const resources: TranslationResources = {};
		let langs = ["en"];

		if (typeof navigator !== "undefined") {
			const browserLang = navigator.language.split("-")[0];
			const mappedLang
				= Object.keys(this.extraCodes).find((code) =>
					this.extraCodes[code].includes(browserLang),
				) || browserLang;
			const notSupported = this.supportedLanguages.indexOf(mappedLang) === -1;
			langs = mappedLang === "en" || notSupported ? ["en"] : ["en", mappedLang];
		}

		// Load translations for each language
		for (const lang of langs) {
			resources[lang] = { translation: {} };
			for (const backend of backends) {
				const url = backend.replace("{{lng}}", lang);
				const data = await fetch(url).then((response) => response.json());
				resources[lang].translation = this.deepMerge(
					resources[lang].translation,
					data,
				);
			}
		}

		// Initialize i18n
		await i18n
			.use(Backend)
			.use(LanguageDetector)
			.use(initReactI18next)
			.init({
				resources,
				fallbackLng: "en",
				debug: process.env.NODE_ENV === "development",
				interpolation: {
					escapeValue: false,
				},
				detection: {
					order: ["navigator"],
					caches: ["localStorage"],
				},
			});
	};

	private static deepMerge(
		target: Record<string, unknown>,
		source: Record<string, unknown>,
	): Record<string, unknown> {
		for (const key in source) {
			if (this.isObject(source[key])) {
				if (!target[key]) Object.assign(target, { [key]: {} });
				this.deepMerge(
					target[key] as Record<string, unknown>,
					source[key] as Record<string, unknown>,
				);
			} else Object.assign(target, { [key]: source[key] });
		}
		return target;
	}

	private static isObject(obj: unknown): boolean {
		return obj !== null && typeof obj === "object" && !Array.isArray(obj);
	}

	// New helper method that uses i18n
	static t(key: string, options?: Record<string, unknown>): string {
		return i18n.t(key, options);
	}

	// Keep the old method for backward compatibility
	static label(key: string): string {
		return this.t(key);
	}
}
