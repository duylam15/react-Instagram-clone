import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n.use(HttpBackend) // Load file JSON từ public
    .use(LanguageDetector) // Tự động phát hiện ngôn ngữ
    .use(initReactI18next)
    .init({
        fallbackLng: "en", // Ngôn ngữ mặc định
        debug: true, // Bật debug (có thể tắt khi chạy production)
        interpolation: { escapeValue: false }, // Không cần escape HTML
        backend: {
            loadPath: "/locales/{{lng}}.json", // Đường dẫn file dịch
        },
    });

export default i18n;
