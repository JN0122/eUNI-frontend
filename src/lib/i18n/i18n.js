import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import LANGS from "../../enums/languages.js";

i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(Backend)
    .init({
        supportedLngs: Object.keys(LANGS),
        fallbackLng: "en"
    });
