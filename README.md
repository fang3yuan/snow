# Snow — طريقة 2 (GitHub Actions + Gradle)
مشروع Expo يُبنى عبر GitHub Actions محليًا باستخدام Gradle (Debug APK).
الـ workflow يعمل `npx expo prebuild --platform android` داخل CI ثم يبني `app-debug.apk`.

## خطوات محلية (اختياري)
```bash
npm install
npx expo start
```

## البناء عبر GitHub Actions (Debug APK)
- ادفع هذا المشروع إلى GitHub.
- اذهب إلى `.github/workflows/debug-apk.yml` وتأكد أنه موجود.
- عند كل push إلى main أو تشغيل يدوي، سيُنتج ملف **app-debug.apk** تحت تبويب Artifacts.

## المصدر
يعتمد على:
https://raw.githubusercontent.com/midou221/mangareader_extension/main/index.min.json
