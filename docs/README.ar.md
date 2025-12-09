<div align="center" dir="rtl">

# Famfolio

**قالب معرض أعمال عصري ومرن مع دعم شامل للعربية واللغات ذات الاتجاه من اليمين إلى اليسار وحركات تفاعلية مُمتعة.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/F2had/famfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/F2had/famfolio/actions/workflows/ci.yml)
[![Lighthouse](https://github.com/F2had/famfolio/actions/workflows/lighthouse.yml/badge.svg)](https://github.com/F2had/famfolio/actions/workflows/lighthouse.yml)
[![GitHub stars](https://img.shields.io/github/stars/F2had/famfolio)](https://github.com/F2had/famfolio/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/F2had/famfolio)](https://github.com/F2had/famfolio/network/members)
[![GitHub issues](https://img.shields.io/github/issues/F2had/famfolio)](https://github.com/F2had/famfolio/issues)
[![GitHub last commit](https://img.shields.io/github/last-commit/F2had/famfolio)](https://github.com/F2had/famfolio/commits/master)

[![Node](https://img.shields.io/badge/Node-20%2B-green.svg)](https://nodejs.org/)
[![Bun](https://img.shields.io/badge/Bun-1.0%2B-f472b6.svg)](https://bun.sh/)
[![Vue](https://img.shields.io/badge/Vue-3.5-42b883.svg)](https://vuejs.org/)

[العرض التوضيحي](https://f2had.github.io/famfolio) · [التوثيق](#الإعدادات) · [English](../README.md)

</div>

---

## المزايا

- **ملف إعدادات موحّد** - التحكم الكامل عبر ملف `config/site.config.yaml`
- **دعم شامل لاتجاه RTL** - دعم اللغة العربية واللغات ذات الاتجاه من اليمين إلى اليسار مع انعكاس تلقائي للتخطيط
- **خطوط مخصصة لكل لغة** - عائلات خطوط مختلفة لكل لغة (مثال: Outfit للإنجليزية، Tajawal للعربية)
- **أنماط داكنة وفاتحة** - متوافقة مع إعدادات النظام مع انتقالات سلسة ومتحركة
- **انتقالات متحركة** - تأثير تبديل النمط بواسطة الشخصية المتحركة، وتقليب الصفحة عند تغيير اللغة
- **شخصية تفاعلية** - شخصية مرحة تتبع مؤشر الفأرة
- **الطباعة الحركية** - حركات متتابعة حرفًا بحرف (LTR) أو كلمةً بكلمة (RTL)
- **خطوط مُستضافة ذاتيًا** - دون اعتمادات خارجية (Fontsource)
- **إمكانية الوصول** - احترام إعداد `prefers-reduced-motion`، والتنقل بلوحة المفاتيح، وتسميات ARIA
- **توليد صور Open Graph** - توليد تلقائي لصور المعاينة الاجتماعية لجميع الأنماط واللغات
- **مزايا أمنية** - إخفاء البريد الإلكتروني، حماية من الرسائل المزعجة بتقنية honeypot، ترويسات CSP، روابط خارجية آمنة

---

## البدء السريع

### المتطلبات الأساسية

- [Node.js](https://nodejs.org/) الإصدار 20 أو أحدث
- [Bun](https://bun.sh/) الإصدار 1.0 أو أحدث (مُوصى به) أو npm/pnpm

### التثبيت

```bash
git clone https://github.com/F2had/famfolio.git  # HTTPS
git clone git@github.com:F2had/famfolio.git      # SSH (يتطلب مفاتيح SSH)

cd famfolio
bun install  # تثبيت الحزم
bun dev      # تشغيل خادم التطوير
```

### إعداد معرض أعمالك

حرّر ملف `config/site.config.yaml`:

```yaml
personal:
  name:
    en: 'Your Name'
    ar: 'اسمك'
  title:
    en: 'Software Engineer'
    ar: 'مهندس برمجيات'
```

### البناء للإنتاج

```bash
bun run build
```

سيكون الناتج في مجلد `dist/`، جاهزًا للاستضافة الثابتة.

---

## الاستخدام كقالب

صُمّم Famfolio ليُستخدم كقالب لمعرض أعمالك الخاص. إليك كيفية إنشاء معرضك والحفاظ عليه مُحدّثًا بأحدث المزايا.

### الخيار الأول: قالب GitHub (مُوصى به)

1. انقر على **"Use this template"** ثم **"Create a new repository"** في GitHub
2. استنسخ المستودع الجديد
3. حرّر ملف `config/site.config.yaml` بمعلوماتك الشخصية
4. ارفع التغييرات وانشر!

### الخيار الثاني: التفريع (Fork)

1. أنشئ **تفريعًا (Fork)** لهذا المستودع على GitHub
2. استنسخ التفريع الخاص بك:
   ```bash
   git clone https://github.com/F2had/famfolio.git portfolio
   cd portfolio
   ```
3. حرّر ملف `config/site.config.yaml` وخصّصه حسب احتياجاتك
4. ارفع التغييرات إلى مستودعك

### مزامنة التحديثات من القالب الأصلي

للحصول على المزايا الجديدة وإصلاحات الأخطاء والتحسينات من القالب الأصلي:

```bash
# أضف المستودع الأصلي كمصدر بعيد (مرة واحدة فقط)
git remote add template https://github.com/F2had/famfolio.git

# اجلب التحديثات وادمجها
git fetch template
git merge template/master --allow-unrelated-histories

# حُلّ أي تعارضات، ثم ارفع التغييرات
git push
```

**نصائح لتحديثات سلسة:**

- احتفظ بتخصيصاتك منظمة (الخطوط في إيداع منفصل، والإعدادات في آخر)
- مناطق التعارض الرئيسية هي ملف `config/site.config.yaml` والخطوط والأنماط المخصصة
- راجع سجل التغييرات للقالب قبل دمج التحديثات الكبرى

### ما ستُخصّصه عادةً

| الملف/المجلد                         | ما يجب تغييره                                  |
| ------------------------------------ | ---------------------------------------------- |
| `config/site.config.yaml`            | جميع معلوماتك الشخصية، المشاريع، الألوان، إلخ. |
| `src/locales/*.json`                 | نصوص الواجهة عند إضافة لغات جديدة              |
| `src/assets/styles/_typography.scss` | عند إضافة خطوط مخصصة                           |
| `public/`                            | صورك، ملف السيرة الذاتية PDF، الأيقونة المفضلة |

---

## الإعدادات

جميع الإعدادات في ملف `config/site.config.yaml`. إليك المرجع الكامل:

### البيانات الوصفية للموقع

```yaml
site:
  title: 'اسمك | مهندس برمجيات' # عنوان تبويب المتصفح
  description: 'وصف معرض الأعمال' # الوصف الوصفي لتحسين محركات البحث (SEO)
  url: 'https://yoursite.dev' # رابط الإنتاج
  defaultLocale: 'en' # اللغة الافتراضية
  supportedLocales:
    - code: 'en'
      name: 'English'
      nativeName: 'English'
      dir: 'ltr'
    - code: 'ar'
      name: 'Arabic'
      nativeName: 'العربية'
      dir: 'rtl' # من اليمين إلى اليسار
```

### المعلومات الشخصية

جميع حقول النصوص تدعم التعريب:

```yaml
personal:
  name:
    en: 'Jane'
    ar: 'جين'
  lastName:
    en: 'Doe'
    ar: 'دو'
  title:
    en: 'Software Engineer'
    ar: 'مهندسة برمجيات'
  tagline:
    en: 'Building things that matter.'
    ar: 'أبني ما يُحدث فرقًا.'
  email: 'hello@example.com'
  location:
    en: 'Mecca, Saudi Arabia'
    ar: 'مكة المكرمة'
  avatar:
    enabled: false # إظهار/إخفاء الصورة الرمزية
    src: '/images/avatar.jpg' # المسار في مجلد public
```

### روابط التواصل الاجتماعي

```yaml
socials:
  - platform: 'github'
    url: 'https://github.com/username'
    icon: 'github' # اسم أيقونة Lucide
  - platform: 'linkedin'
    url: 'https://linkedin.com/in/username'
    icon: 'linkedin'
  - platform: 'twitter'
    url: 'https://twitter.com/username'
    icon: 'twitter'
  - platform: 'email'
    url: 'mailto:hello@example.com'
    icon: 'mail'
  - platform: 'telegram'
    url: 'https://t.me/username' # أو https://t.me/+1234567890 للهاتف
    icon: 'telegram'
  - platform: 'whatsapp'
    url: 'https://wa.me/1234567890' # رقم الهاتف بدون + أو مسافات
    icon: 'whatsapp'
```

### التحكم في الأقسام

تفعيل أو تعطيل أي قسم:

```yaml
sections:
  hero:
    enabled: true
  about:
    enabled: true
  projects:
    enabled: true
  blog:
    enabled: false # معطّل افتراضيًا
  resume:
    enabled: true
    pdfPath: '/resume.pdf' # المسار في مجلد public
  contact:
    enabled: true
    showForm: false # إظهار النموذج أو المعلومات فقط
```

### المشاريع

```yaml
defaults:
  codeForge: 'https://github.com/username' # الرابط الأساسي للمستودعات

projects:
  - id: 'project-1'
    title:
      en: 'Project Name'
      ar: 'اسم المشروع'
    description:
      en: 'Project description here.'
      ar: 'وصف المشروع هنا.'
    image: 'https://example.com/image.jpg'
    tech:
      - 'Vue'
      - 'TypeScript'
    links:
      live: 'https://project.dev'
      repo: 'project-name' # يُلحق بـ defaults.codeForge
    featured: true

  - id: 'project-2'
    # ... نفس البنية
    links:
      code: 'https://gitlab.com/user/repo' # رابط كامل (يتجاوز الافتراضي)
```

### ألوان النمط

```yaml
theme:
  defaultMode: 'system' # "light" أو "dark" أو "system"
  colors:
    light:
      bgPrimary: '#FFFDF9'
      bgSecondary: '#F7F4EE'
      textPrimary: '#2D2926'
      textSecondary: '#6B635A'
      accent: '#C8873D'
      accentHover: '#A66E2C'
      accentSubtle: '#FDF6ED'
      border: '#E8E4DC'
    dark:
      bgPrimary: '#1A1816'
      bgSecondary: '#252220'
      textPrimary: '#F5F2ED'
      textSecondary: '#A69E94'
      accent: '#E9A54D'
      accentHover: '#F0B865'
      accentSubtle: '#2E2519'
      border: '#3A3632'
```

### الطباعة (خطوط لكل لغة)

```yaml
typography:
  fonts:
    en:
      display: 'Outfit' # العناوين
      body: 'Source Sans 3' # النص الأساسي
    ar:
      display: 'Tajawal' # العناوين العربية
      body: 'IBM Plex Sans Arabic' # النص الأساسي العربي
```

### الحركات التفاعلية

```yaml
animations:
  enabled: true # المفتاح الرئيسي
  respectReducedMotion: true # احترام تفضيل المتصفح
  hero:
    toy: true # الشخصية المتحركة
  scrollReveal: true
  hoverEffects: true
  transitions:
    theme:
      enabled: true # تأثير الشخصية + التموّج
    locale:
      enabled: true
      directionChange: 'pageFlip' # "pageFlip" أو "cardFlip"
      sameDirection: 'fade' # "ripple" أو "fade"
```

### الأمان

```yaml
security:
  email:
    obfuscate: true # العرض كـ "hello [at] example [dot] com"
    clickToReveal: true # يتطلب نقرة لإظهار البريد الفعلي
  contact:
    honeypot: true # حقل مخفي لاصطياد الروبوتات
  externalLinks:
    noopener: true # إضافة rel="noopener noreferrer"
    newTab: true # الفتح في تبويب جديد (_blank)
```

**ترويسات جانب الخادم** (نشر Docker):

تُضيف إعدادات nginx و Caddy المُضمّنة الترويسات الأمنية التالية:

- Content-Security-Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

---

## التخصيص

### إضافة لغة جديدة

1. أضف اللغة إلى ملف `config/site.config.yaml`:

```yaml
site:
  supportedLocales:
    - code: 'es'
      name: 'Spanish'
      nativeName: 'Español'
      dir: 'ltr'
```

2. أنشئ ملف الترجمة `src/locales/es.json`:

```json
{
  "nav": {
    "about": "À propos",
    "projects": "Projets"
  }
}
```

3. أضف المحتوى المُترجم في الإعدادات:

```yaml
personal:
  name:
    en: 'Jane'
    es: 'Juan'
```

4. (اختياري) أضف خطوطًا للغة الجديدة في `typography.fonts`.

### إضافة خطوط مخصصة

1. ثبّت من Fontsource:

```bash
bun add @fontsource/your-font
```

2. استورد في `src/assets/styles/_typography.scss`:

```scss
@import '@fontsource/your-font/400.css';
@import '@fontsource/your-font/700.css';
```

3. حدّث ملف `config/site.config.yaml`:

```yaml
typography:
  fonts:
    en:
      display: 'Your Font'
```

### تعطيل الحركات التفاعلية

اضبط المفتاح الرئيسي لتعطيل جميع الحركات:

```yaml
animations:
  enabled: false
```

أو عطّل مزايا محددة:

```yaml
animations:
  enabled: true
  hero:
    toy: false # تعطيل الشخصية المتحركة فقط
  transitions:
    theme:
      enabled: false # تعطيل تأثير انتقال النمط
```

---

## التطوير

### الأوامر المتاحة

```bash
bun dev                      # تشغيل خادم التطوير
bun dev:demo                 # تشغيل خادم التطوير بإعدادات العرض التوضيحي
bun run build                # التحقق من الأنواع والبناء للإنتاج
bun run build:demo           # البناء بإعدادات العرض التوضيحي
bun run preview              # معاينة بناء الإنتاج محليًا
bun run type-check           # تشغيل التحقق من أنواع TypeScript
bun run lint                 # تشغيل جميع أدوات الفحص (oxlint + eslint)
bun run format               # تنسيق الشيفرة بـ Prettier
bun run lighthouse           # تشغيل فحص Lighthouse محليًا
bun run generate:og          # توليد صور OG (اللغة الافتراضية)
bun run generate:og:all      # توليد صور OG لجميع اللغات
bun run ci:test              # اختبار جميع مهام CI محليًا باستخدام act
bun run ci:test:lint         # اختبار مهمة الفحص والبناء فقط
bun run ci:test:security     # اختبار مهمة فحص الأمان فقط
bun run ci:test:lighthouse   # اختبار مهمة Lighthouse فقط
```

### بنية المشروع

```
famfolio/
├── src/
│   ├── assets/styles/      # SCSS (متغيرات، طباعة، حركات)
│   ├── components/
│   │   ├── common/         # مكونات قابلة لإعادة الاستخدام (BaseButton، ProjectCard، إلخ.)
│   │   ├── layout/         # Navigation، Footer، SectionWrapper
│   │   ├── sections/       # Hero، About، Projects، Contact، إلخ.
│   │   └── transitions/    # تأثيرات انتقال النمط واللغة
│   ├── composables/        # دوال Vue التركيبية (useTheme، useLocale، إلخ.)
│   ├── locales/            # ملفات الترجمة (en.json، ar.json)
│   ├── plugins/            # إعداد Vuetify و i18n
│   ├── pages/              # مكونات الصفحات
│   └── types/              # تعريفات أنواع TypeScript
├── public/                 # الأصول الثابتة (صور، resume.pdf)
├── scripts/                # نصوص البناء البرمجية (مولّد صور OG)
├── config/                 # ملفات الإعدادات
│   ├── site.config.yaml    # الإعدادات الرئيسية
│   └── site.config.demo.yaml # إعدادات العرض التوضيحي
```

### الدوال التركيبية الرئيسية (Composables)

| الدالة التركيبية    | الغرض                                    |
| ------------------- | ---------------------------------------- |
| `useTheme`          | حالة النمط الداكن/الفاتح والتبديل بينهما |
| `useLocale`         | إدارة اللغة واتجاه RTL                   |
| `useConfig`         | الوصول إلى قيم config/site.config.yaml   |
| `useSettings`       | رايات المزايا المحسوبة من الإعدادات      |
| `useLocalizedValue` | دالة مساعدة للنصوص المُعرّبة             |

---

## النشر

### GitHub Pages

أسهل طريقة لنشر معرض أعمالك:

1. اذهب إلى **Settings** في مستودعك ثم **Pages**
2. تحت "Build and deployment"، اختر **GitHub Actions**
3. ارفع إلى فرع `master` - سيتم البناء والنشر تلقائيًا

سيكون موقعك متاحًا على `https://YOUR_USERNAME.github.io/REPO_NAME/`

```sh
مثال: https://F2had.github.io/famfolio/
```

> **ملاحظة**: يُعيّن البناء تلقائيًا الرابط الأساسي الصحيح لاستضافة GitHub Pages.

### Cloudflare Pages

1. ارفع الشيفرة إلى GitHub/GitLab

2. في لوحة تحكم Cloudflare، اذهب إلى **Workers & Pages** ثم **Create application** ثم **Pages**

3. اربط مستودعك

4. اضبط إعدادات البناء:
   - **أمر البناء:** `bun run build`
   - **مجلد مخرجات البناء:** `dist`
   - **المجلد الجذر:** `/` (أو مسار مشروعك)

5. أضف متغير البيئة (اختياري):
   - `NODE_VERSION`: `20`

6. انشر!

سيكون موقعك متاحًا على `https://your-project.pages.dev`

### Docker

ثلاثة أنماط متاحة:

| النمط   | الخادم | SSL          | حالة الاستخدام                      |
| ------- | ------ | ------------ | ----------------------------------- |
| `nginx` | Nginx  | لا           | استضافة ثابتة بسيطة                 |
| `ssl`   | Caddy  | نعم (تلقائي) | إنتاج مع HTTPS                      |
| `dev`   | Vite   | لا           | تطوير مع إعادة التحميل الفوري (HMR) |

```bash
# إنتاج مع nginx
docker compose --profile nginx up -d

# إنتاج مع Caddy + SSL تلقائي
DOMAIN=yourdomain.com docker compose --profile ssl up -d

# تطوير مع إعادة التحميل الفوري
docker compose --profile dev up dev

# منفذ مخصص لـ nginx (الافتراضي: 80)
PORT=8080 docker compose --profile nginx up -d
```

#### البناء اليدوي

```bash
docker build -t famfolio .
docker run -p 80:80 famfolio
```

---

## توليد صور Open Graph

يتضمن Famfolio مولّد صور Open Graph آلي يُنشئ صور المعاينة الاجتماعية من قيم ملف `config/site.config.yaml`.

### الصور المُولّدة

يُنشئ النص البرمجي صورًا لجميع تركيبات الأنماط واللغات:

| الملف                  | النمط | اللغة           |
| ---------------------- | ----- | --------------- |
| `og-image.png`         | فاتح  | الافتراضية (en) |
| `og-image-dark.png`    | داكن  | الافتراضية (en) |
| `og-image-ar.png`      | فاتح  | العربية         |
| `og-image-ar-dark.png` | داكن  | العربية         |

### الاستخدام

```bash
# توليد للغة الافتراضية (كلا النمطين)
bun run generate:og

# توليد لجميع اللغات (كلا النمطين)
bun run generate:og:all

# توليد نمط محدد فقط
bun run scripts/generate-og.ts --theme=dark

# توليد لغة محددة فقط
bun run scripts/generate-og.ts --locale=ar

# مجلد إخراج مخصص
bun run scripts/generate-og.ts --output=dist
```

### خيارات سطر الأوامر

| الخيار     | القيم                   | الافتراضي | الوصف                        |
| ---------- | ----------------------- | --------- | ---------------------------- |
| `--theme`  | `light`، `dark`، `both` | `both`    | النمط/الأنماط المراد توليدها |
| `--locale` | رمز اللغة أو `all`      | `en`      | اللغة/اللغات المراد توليدها  |
| `--output` | مسار                    | `public`  | مجلد الإخراج                 |

### المزايا

- **يعتمد على الإعدادات**: يقرأ الاسم، والعنوان، والشعار، والألوان، والخطوط من ملف `config/site.config.yaml`
- **تخطيط متمركز**: المحتوى متمركز بغض النظر عن اللغة
- **واعٍ بالنمط**: يستخدم ألوان نمطك الفاتح/الداكن بدقة
- **خطوط لكل لغة**: يستخدم عائلة الخط الصحيحة لكل لغة
- **محتوى مُعرّب**: يولّد صورًا بنص مُترجم لكل لغة

---

## التقنيات المستخدمة

| الفئة               | التقنية                                                                  |
| ------------------- | ------------------------------------------------------------------------ |
| إطار العمل          | [Vue 3](https://vuejs.org/) (Composition API)                            |
| أداة البناء         | [Vite](https://vite.dev/) (Rolldown)                                     |
| اللغة               | [TypeScript](https://www.typescriptlang.org/)                            |
| إطار واجهة المستخدم | [Vuetify 3](https://vuetifyjs.com/)                                      |
| التنسيق             | SCSS + متغيرات CSS                                                       |
| التدويل             | [Vue I18n](https://vue-i18n.intlify.dev/)                                |
| الحركات             | [@vueuse/motion](https://motion.vueuse.org/)                             |
| الأيقونات           | [Lucide](https://lucide.dev/) + [Simple Icons](https://simpleicons.org/) |
| الخطوط              | [Fontsource](https://fontsource.org/) (مُستضافة ذاتيًا)                  |
| الإعدادات           | YAML                                                                     |
| بيئة التشغيل        | [Bun](https://bun.sh/)                                                   |
| الفحص               | [OXLint](https://oxc.rs/) + [ESLint](https://eslint.org/)                |
| التنسيق             | [Prettier](https://prettier.io/)                                         |

---

## التكامل والنشر المستمر (CI/CD)

### GitHub Actions

يتضمن المشروع سير عمل آلي للمهام التالية:

| سير العمل        | المُشغّل                 | الوصف                                       |
| ---------------- | ------------------------ | ------------------------------------------- |
| **CI**           | Push/PR إلى `master`     | الفحص، الإصلاح التلقائي، البناء، فحص الأمان |
| **Lighthouse**   | Push/PR إلى `master`     | فحص الأداء، إمكانية الوصول، SEO             |
| **GitHub Pages** | Push إلى `master` / يدوي | البناء والنشر إلى GitHub Pages              |
| **Docker Build** | Push إلى `master` / يدوي | بناء ورفع الصورة إلى GHCR                   |

#### اختيار ملف الإعدادات

يدعم سير عمل **GitHub Pages** و **Docker Build** اختيار ملف الإعدادات:

1. اذهب إلى **Actions** ثم اختر سير العمل
2. انقر على **Run workflow**
3. اختر الإعدادات:
   - فارغ (افتراضي) → يستخدم `config/site.config.yaml`
   - `demo` → يستخدم `config/site.config.demo.yaml`

عند الرفع إلى `master`، تستخدم سير العمل الإعدادات الافتراضية. التشغيل اليدوي يتيح لك الاختيار.

#### صورة Docker

يتم بناء الصور ورفعها تلقائيًا إلى GitHub Container Registry مع كل رفع إلى `master`:

```bash
# سحب أحدث صورة
docker pull ghcr.io/f2had/famfolio:latest

# أو إيداع محدد
docker pull ghcr.io/f2had/famfolio:abc1234
```

### اختبار CI محليًا باستخدام act

يمكنك اختبار GitHub Actions محليًا باستخدام [act](https://github.com/nektos/act):

```bash
# لتعليمات التثبيت، انظر: https://nektosact.com/installation/index.html

# تشغيل جميع مهام CI
bun run ci:test

# تشغيل مهمة محددة
bun run ci:test:lint      # الفحص، التحقق من التنسيق والبناء
bun run ci:test:security  # فحص الأمان
```

> **ملاحظة**: على معالجات Apple Silicon (M1/M2/M3)، تستخدم النصوص البرمجية `--container-architecture linux/amd64` للتوافق.

### خطافات ما قبل الإيداع (Pre-commit Hooks)

[Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged) تعمل تلقائيًا على كل إيداع:

- **ملفات JS/TS/Vue**: OXLint ثم ESLint ثم Prettier
- **JSON/MD/YAML/SCSS/CSS**: Prettier

ستفشل الإيداعات إذا وُجدت أخطاء في الفحص (`--max-warnings 1`).

---

## المساهمة

المساهمات مُرحّب بها! انظر [CONTRIBUTING.md](../CONTRIBUTING.md) للإرشادات.

---

## خارطة الطريق

المزايا والتحسينات المُخطط لها للإصدارات المستقبلية:

- [ ] **دعم PWA** - إمكانية العمل بدون اتصال وتطبيق قابل للتثبيت
- [ ] **توليد خريطة الموقع** - إنشاء sitemap.xml تلقائيًا لتحسين محركات البحث
- [ ] **تكامل المدونة** - مدونة بصيغة Markdown مع frontmatter
- [ ] **المزيد من تأثيرات الانتقال** - خيارات إضافية لانتقالات النمط واللغة
- [ ] **قسم التوصيات** - عرض توصيات العملاء والزملاء
- [ ] **تصوير المهارات** - رسوم بيانية تفاعلية للمهارات

هل تريد المساهمة؟ اطلع على [CONTRIBUTING.md](./CONTRIBUTING.md)!

---

## الرخصة

هذا المشروع مُرخّص تحت رخصة MIT - انظر ملف [LICENSE](../LICENSE) للتفاصيل.

---

<div align="center">

**[⬆ العودة إلى الأعلى](#famfolio)**

صُنع بـ Vue 3 + TypeScript

</div>
