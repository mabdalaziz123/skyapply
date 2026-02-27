# مشروع Vite + React

ملف المشروع جاهز للرفع على GitHub.

## المتطلبات
- Node.js (v16+)
- npm أو pnpm أو yarn

## تثبيت
```bash
npm install
# أو
# pnpm install
# yarn install
```

## تشغيل أثناء التطوير
```bash
npm run dev
```

## بناء للإنتاج
```bash
npm run build
npm run preview
```

## تهيئة مستودع Git والدفع إلى GitHub
1. أنشئ مستودعًا جديدًا على GitHub (اسم المستخدم واسم المستودع).
2. نفّذ الأوامر التالية محليًا (غيّر الرابط إلى رابط المستودع الخاص بك):

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

- بدلاً من الخطوة الأخيرة يمكنك استخدام `gh` (GitHub CLI):
```bash
gh repo create <your-username>/<your-repo> --public --source=. --remote=origin --push
```

استبدل `<your-username>` و `<your-repo>` بالقيم المناسبة.

---
ملف `.gitignore` أضيف لتجاهل المجلدات والملفات الشائعة (node_modules، dist، ملفات البيئة، إلخ).