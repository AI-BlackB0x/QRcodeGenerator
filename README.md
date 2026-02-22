# 🔳 יוצר קודי QR חינמי — שירדן שיווק דיגיטלי

> **דף נחיתה מקצועי עם כלי יצירת QR פעיל** | עברית RTL | Static HTML/CSS/JS

---

## 🎯 מטרת הפרויקט

דף נחיתה בעברית (RTL) ליצירת קודי QR חינמיים, עבור המותג **שירדן שיווק דיגיטלי**. הדף משלב עיצוב מודרני ומקצועי עם פונקציונליות מלאה של יצירה והורדת קודי QR — כולו בצד הלקוח, ללא שרת.

---

## ✅ פיצ'רים שמומשו

### 🏗️ מבנה הדף (5 סקשנים)
- ✅ **Header** — ניווט sticky עם blur, לוגו, smooth scroll, תפריט מובייל המבורגר
- ✅ **Hero Section** — גרדיאנט navy→purple, מוקאפ 3D עם אנימציה, תגי floating, סטטיסטיקות
- ✅ **Features** — 3 כרטיסים (מהיר, חינמי, התאמה) עם hover, כרטיס מודגש בסגנון Navy
- ✅ **How It Works** — 3 שלבים מחוברים בחיצים עם אנימציית hover ו-scroll reveal
- ✅ **QR Generator** — כלי פעיל מלא עם input, צבעים, גדלים, פלטות, הורדה, העתקה

### ⚙️ פונקציונליות QR
- ✅ יצירת קוד QR מ-URL או טקסט
- ✅ **בחירת צבע הקוד** (dark color)
- ✅ **בחירת צבע הרקע** (light color)
- ✅ **8 פלטות צבע מוכנות** לבחירה מהירה
- ✅ **4 גדלים**: 200/300/400/500px
- ✅ **הורדת PNG** עם שם קובץ `qr-shirden.png`
- ✅ **העתקה ללוח** (Canvas API)
- ✅ Auto-prefix `https://` לכתובות URL
- ✅ Real-time regeneration בשינוי צבעים/גדלים
- ✅ Enter key trigger
- ✅ כפתור ניקוי שדה

### 🎨 עיצוב ו-UX
- ✅ **פלטת צבעים**: Navy `#1a1a4e` / Purple `#6b21a8` / Teal `#14b8a6`
- ✅ **פונט Heebo** (Google Fonts) — תמיכה מלאה בעברית
- ✅ **RTL direction** מלא בכל הדף
- ✅ **Responsive** — Desktop / Tablet / Mobile
- ✅ אנימציות scroll reveal, float, glowPulse
- ✅ Toast notifications לפידבק משתמש
- ✅ Back-to-top button
- ✅ Header scrolled state
- ✅ Wave separator בין Hero לשאר הדף
- ✅ פלטות preset לבחירה חוזית בצבעי QR

---

## 📁 מבנה קבצים

```
index.html                  ← דף ראשי (HTML)
css/
  └── style.css             ← כל העיצוב + RTL + Responsive
js/
  └── main.js               ← לוגיקת JavaScript + QR Generator
images/
  ├── qr-mockup.png         ← תמונת מוקאפ בסקשן Hero
  ├── feature-icons.png     ← תמונת showcase בסקשן Features
  ├── steps-icons.png       ← תמונת showcase בסקשן How It Works
  ├── generator-section.png ← תמונת ויזואל בסקשן Generator
  └── hero-bg.png           ← תמונת Hero Background (reference)
README.md
```

---

## 🔗 כתובות גישה

| עמוד | URL |
|------|-----|
| דף ראשי | `index.html` |
| Hash — Features | `index.html#features` |
| Hash — How It Works | `index.html#how-it-works` |
| Hash — Generator | `index.html#generator` |

---

## 🛠️ Stack טכני

| שכבה | טכנולוגיה |
|------|-----------|
| HTML | HTML5 סמנטי, RTL |
| CSS | CSS3 Variables, Flexbox, Grid, Animations |
| JavaScript | Vanilla JS (ES6+), Async/Await |
| QR Library | [qrcodejs](https://github.com/davidshimjs/qrcodejs) via jsDelivr CDN |
| Fonts | Google Fonts — Heebo |
| Icons | Font Awesome 6 via jsDelivr CDN |

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|-----------|--------|
| `> 1024px` | Desktop — 2 columns, side-by-side |
| `768px–1024px` | Tablet — Generator card full width |
| `< 768px` | Mobile — Single column, hamburger menu |
| `< 480px` | Small Mobile — Reduced padding |

---

## 🎨 פלטת צבעים

```css
--navy-primary:     #1a1a4e
--purple-secondary: #6b21a8
--teal-accent:      #14b8a6
--gradient-hero:    linear-gradient(135deg, #1a1a4e → #6b21a8)
--gradient-button:  linear-gradient(90deg, #6b21a8 → #14b8a6)
```

---

## ❌ לא מומש (לא נדרש)

- כפתור "צור קשר" — לפי דרישה, הוסר בכוונה
- Backend/API — כל העיבוד client-side בלבד
- Storage — הנתונים לא נשמרים בשרת

---

## 🚀 שלבים הבאים מומלצים

1. **הוספת Custom Logo** — החלפת ה-SVG בלוגו האמיתי של שירדן
2. **QR עם לוגו מובנה** — הטמעת לוגו המותג במרכז קוד ה-QR
3. **היסטוריית QR** — שמירת קודים שנוצרו ב-localStorage
4. **שיתוף ישיר** — כפתור Web Share API לשיתוף מיידי
5. **סוגי QR נוספים** — WiFi, vCard, Email, SMS
6. **Analytics** — Google Analytics לדף הנחיתה
7. **SEO** — מטאדאטה מלאה ו-Open Graph tags

---

## 🌐 קרדיטים

- **עיצוב ופיתוח**: Claude AI עבור Asafi
- **מותג**: [שירדן שיווק דיגיטלי](https://shirdendigital.co.il)
- **ספריית QR**: [qrcodejs by davidshimjs](https://github.com/davidshimjs/qrcodejs)
- **פונט**: [Heebo — Google Fonts](https://fonts.google.com/specimen/Heebo)
