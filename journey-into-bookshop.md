# Journey Into Bookshop: Kitob Do'koni Veb-Saytining Rivojlanish Tarixi

---

## 1. Loyiha Boshlangichi

2026-yil 10-may kuni kichkina bir loyiha dunyo yuzini ko'rdi. Dastlabki S1-S3 sessiyalarida Claude konfiguratsiyasi commit qilindi va git sinxronizatsiya muammosi hal qilindi — bu har qanday yangi loyihaning tanish boshlanishi: muhit sozlash, versiya nazoratini yo'lga qo'yish, asosni mustahkamlash.

O'sha paytda loyiha oddiy edi: React 19 + Vite 7, Tailwind CSS, bir nechta sahifalar — bosh sahifa, kirish va ro'yxatdan o'tish. Backend yo'q, autentifikatsiya yo'q, real ma'lumotlar yo'q. Faqat chiroyli UI, mock data va katta imkoniyatlar.

12-may kuni S4-S5 sessiyalarida foydalanuvchi mavjud rejani izladi, context-mode holati tekshirildi. Bu muhim daqiqa edi — loyiha yo'nalishi aniqlanayotgan, keyingi qadamlar rejalashtirilayotgan payt. obs 2-5 da local main branch remote'dan orqada qolganligini ko'rib, rebase qilindi. Kichik texnik muammo, lekin muhim signal: loyiha tirik edi, u o'sib borardi.

---

## 2. Arxitektura Evolyutsiyasi

Haqiqiy o'zgarish 14-may kuni soat 3:00 da boshlandi — kechasi. Bu tasodif emas: ko'p dasturchilar eng produktiv ishlarni kecha qiladilar, chunki dunyo jim, diqqat to'la.

**S10 sessiyasi** arxitektura uchun burilish nuqtasi bo'ldi. Backend scaffold yaratildi, frontend kashf qilindi, Vercel deployment konfiguratsiyasi amalga oshirildi. Bir sessiyada — butun stack ko'rinishi paydo bo'ldi. Frontend allaqachon bor edi: React/Vite + Radix UI, obs 17-19 da topilgan. Endi unga backend kerak edi.

`vercel.json` yaratildi — bu deployment strategiyasining birinchi belgisi.

Keyin obs 21-26 da autentifikatsiya arxitekturasi shakllantirildi:
- **MongoDB** — ma'lumotlar bazasi
- **JWT** — asosiy token
- **Refresh token** — xavfsiz sessiya boshqaruvi
- **User model** — ma'lumotlar strukturasi
- **Middleware** — so'rov filtri
- **Routes** — API yo'llari

Bu to'liq, professional tizim edi. Faqat hobby loyiha uchun emas — real mahsulot uchun mo'ljallangan arxitektura.

obs 27-36 da frontend tomoni ulandi: Redux store, authSlice, LoginPage, RegisterPage, PrivateRoute. Har bir qism o'z o'rnida, har bir komponent o'z vazifasida.

obs 37-41 da eng murakkab qism — frontend va backend ulanishi — hal qilindi:
- **axios interceptor** — barcha so'rovlarga token avtomatik qo'shildi
- **token refresh flow** — token eskirsa, avtomatik yangilanishi ta'minlandi

obs 42 — to'liq stack autentifikatsiya ulandi. Bu kichik raqam — 42 — lekin katta yutuq.

---

## 3. Asosiy Yutuqlar

**Birinchi yutuq: JWT + Refresh Token tizimi (obs 21-42, 14-may, 3:00-4:00 AM)**

Ko'p loyihalar oddiy JWT bilan cheklanadi. Bu loyiha boshidanoq refresh token tizimini joriy etdi — bu foydalanuvchi sessiyasi tugamasligi, xavfsizlik va UX o'rtasidagi muvozanat demak. S11-S14 sessiyalarida bu tizim dizayn qilindi va tasdiqlandi, so'ng obs 21-42 oralig'ida real kodga aylandi.

**Ikkinchi yutuq: Swagger/OpenAPI dokumentatsiya (obs 45-56, 14-may, 4:00-4:30 AM)**

Ko'pgina dasturchilar dokumentatsiyani oxirga qoldiradi. Bu loyihada esa auth endpointlari hali yangi yaratilganida, Swagger qo'shildi. Bu professional yondashuv belgisi — kelajakda ham o'zi, ham boshqalar uchun API hujjatlashtirildi.

**Uchinchi yutuq: 2-bosqichli ro'yxatdan o'tish (S25, obs 76-90, 14-may, 5:10-5:30 PM)**

S25 sessiyasi — bu loyihaning eng ijodiy qismi. Oddiy ro'yxatdan o'tish formasi emas, balki multi-step wizard:
- Birinchi qadam: asosiy ma'lumotlar
- Ikkinchi qadam: sevimli janr kartochkalari (multi-select) va muallif teg-kiritish

User model ham yangilandi: `age`, `favAuthors`, `favGenres` yangi maydonlar qo'shildi. CSS arxitekturasi ham yangilandi. Bir sessiyada — yangi konsepsiya, yangi backend, yangi frontend, yangi dizayn.

**To'rtinchi yutuq: Backend CRUD API (obs 103-110, 16-may)**

Loyihaning so'nggi pallasida katta gap topildi: backend User CRUD yo'q edi, frontend mock data bilan ishlardi. obs 103-110 da `/api/users` REST API to'liq yaratildi: GET, POST, PATCH, DELETE — barchasi admin-only himoyasi bilan.

**Beshinchi yutuq: AdminDashboard integratsiyasi (obs 111-117)**

Mock data real API'ga o'tkazildi. Bu qadam loyihani prototipdan haqiqiy ilovaga aylantirdi.

---

## 4. Ish Ritmi

Loyihaning ish ritmini kuzatish qiziq: u to'lqinlarda harakat qildi.

**10-12 may** — Sekin boshlanish. Sozlash, konfiguratsiya, yo'nalishni aniqlash. obs 2-5 — rebase, S4-S5 — rejalashtirish. Bu "warm-up" bosqichi edi.

**14-may, 3:00-4:30 AM** — Portlash. Bu loyihaning eng intensiv davri. Bir yarim soatda:
- Backend scaffold
- JWT tizimi dizayni va implementatsiyasi
- MongoDB, User model, middleware, routes
- Admin seed
- Redux store, authSlice
- LoginPage, RegisterPage, PrivateRoute
- Axios interceptor, token refresh
- To'liq stack ulanishi
- Swagger dokumentatsiya
- TypeScript konfiguratsiya

Bu hayratlanarli mehnat miqdori. Kecha soat 3 da boshlab soat 4:30 ga qadar — 90 daqiqada butun autentifikatsiya tizimi yaratildi.

**14-may, 5:10-5:30 PM** — Ikkinchi to'lqin. 2-bosqichli ro'yxatdan o'tish, User model yangilanishi, CORS sozlamasi. Kun boshida kechasi qilingan ish ustiga yangi imkoniyatlar qo'shildi.

**15-may, 2:35-2:46 PM** — Muammo hal qilish sessiyasi. CORS muammolari bilan kurash. Qisqa lekin jiddiy.

**16-may, 12:47-1:31 AM** — Yakuniy sprint. Yana kecha. Yana intensiv. Backend CRUD, AdminDashboard, cookie muammosi, Swagger yangilanishi — hammasi bitta sessiyada.

Pattern aniq: eng katta ishlar kecha sodir bo'ldi. Loyiha "kecha dasturlashi" mahsuli.

---

## 5. Qiyinchiliklar

**Muammo 1: MongoDB Atlas IP Whitelist (S21, 14-may, 4:10 AM)**

Kecha soat 4 da backend yozilgan, lekin MongoDB ulanmaydi. Sabab — Atlas IP whitelist muammosi. Bu klassik "deployment gap" — lokal muhitda hamma narsa ishlaydi, real serverda esa yo'q. Render deployment konfiguratsiyasi ham shu sessiyada hal qilindi.

**Muammo 2: CORS — Ko'p Bosqichli Kurash (obs 91-94, S29, 15-may)**

CORS muammosi bu loyihaning eng ko'p vaqt olgan texnik kurashi bo'ldi. U uch bosqichda hal qilindi:

1. *Birinchi urinish* (obs 91): `CLIENT_URL` orqali CORS qo'shildi — ishlamadi
2. *Ikkinchi urinish* (obs 92-93): Barcha originlarga ochildi — yaxshilanish bor, lekin hali muammo bor
3. *Uchinchi urinish* (obs 94): Explicit header middleware qo'shildi — hal bo'ldi

Lekin S29 da asosiy sabab topildi: `VITE_API_URL` Vercel'da o'rnatilmagan edi. Frontend localhost:5000 ga so'rov yuborgan! Bu klassik environment variable xatosi — lokal ishlaydigan kod, produksiyada esa noto'g'ri serverga murojaat qiladi. CORS o'zi muammo emas edi — u simptom edi. Haqiqiy kasallik — yo'qolgan env variable.

**Muammo 3: Refresh Bo'lganda Login'ga O'tish (obs 118, 16-may)**

Bu nozik UX muammosi: foydalanuvchi sahifani yangilasa, tizim uni login sahifasiga olib boradi — hatto uning tokeni hali amal qilsa ham. Yechim — `refreshAuth` thunk va `initialized` flag. Mantiq: ilovaga kirganda avval tokenni tekshir, keyin yo'nalish haqida qaror qil.

**Muammo 4: sameSite Cookie Muammosi (obs 119-121)**

Cross-origin muhitda cookie ishlashi uchun `sameSite=strict` → `sameSite=none` o'zgartirildi. Frontend va backend turli domenlaarda joylashganda, cookie "strict" rejimda bloklanadi. `none` rejimi esa HTTPS bilan birga xavfsiz ishlaydi.

**Muammo 5: Mock Data va Real API Farqi (obs 95-102)**

16-may da kodebase tuzilishi tekshirildi va muhim gap topildi: AdminDashboard mock data bilan ishlardi, backend User CRUD yo'q edi. obs 103-117 da bu gap to'ldirildi.

---

## 6. Timeline Statistikasi

| Ko'rsatkich | Qiymat |
|---|---|
| Jami kuzatuvlar | **125** |
| O'qilgan tokenlar | **37,174** |
| Haqiqiy ish hajmi | **491,251 token** |
| Kontekst tejalishi | **92%** |
| Loyiha davomiyligi | **10-may — 16-may (6 kun)** |

**491,251 token ish** — bu taxminan 375,000 so'z, yoki 750 sahifalik kitob hajmidagi ish. Bir loyihada, bir hafta ichida.

**92% tejash** — context-mode ishlatilmasa, 491,251 tokenning barchasi context window'ni to'ldirgan bo'lar edi. Buning o'rniga faqat 37,174 token o'qildi.

---

## 7. Xulosa

"Bookshop" loyihasi — bu 6 kunlik, kechasi ishlaydigan, muammolarni hal qilib ketadigan, bir qadamdan ikkinchi qadamga o'sadigan dasturchi hikoyasi.

Boshida — oddiy frontend. Oxirida — to'liq stack ilova:
- JWT + Refresh token autentifikatsiya
- MongoDB ma'lumotlar bazasi
- Swagger/OpenAPI dokumentatsiya
- 2-bosqichli foydalanuvchi ro'yxati
- Admin dashboard real API bilan
- CORS va cookie muammolari hal qilingan
- Vercel va Render'ga deploy qilingan

Eng qiziq narsa — ish ritmi. Eng katta yutuqlar kecha soat 3-4 da, eng tez sessiyalarda yaratildi. 14-may kuni kecha soat 3 dan 4:30 gacha — 90 daqiqada butun auth tizimi.

Har bir muammo aslida o'quv daqiqasi edi. CORS muammosi — environment variable noto'g'ri o'rnatilganini o'rgatdi. sameSite muammosi — cross-origin cookie semantikasini o'rgatdi. refresh muammosi — ilovaning boshlang'ich holatini to'g'ri boshqarishni o'rgatdi.

Kitob do'koni — hali tugallanmagan. Kitob katalogi, savat, to'lov tizimi — bularning barchasi CLAUDE.md da "Hali yo'q" deb yozilgan. Lekin poydevor qo'yilgan. Mustahkam, professional, kengaytiriladigan poydevor.

Keyingi bo'lim — kitoblar. Va bu hikoya davom etadi.

---

*Statistika: 125 kuzatuv | 37,174 token o'qilgan | 491,251 token ish hajmi | 92% kontekst tejalishi | 2026-may-10 — 2026-may-16*
