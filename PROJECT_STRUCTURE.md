# Project Structure

โปรเจกต์นี้ยังเป็นเว็บ static เหมือนเดิม แต่แยก source ออกจากไฟล์ใหญ่แล้วเพื่อให้หาโค้ดของแต่ละหน้าได้ง่ายขึ้น

## Runtime files

- `index.html` โครง HTML หลักของเว็บ
- `assets/css/app.css` CSS หลักของเว็บ
- `assets/js/app.bundle.js` ไฟล์ JS ที่เว็บโหลดจริง สร้างจากไฟล์ใน `src/js`
- `assets/images/` รูปภาพที่เคยฝังเป็น base64

## Source files

- `src/js/01-error-console.js` ระบบจับ error และ custom alert/confirm
- `src/js/02-config-data.js` config, เมนู, icon, static data, stage/game data
- `src/js/03-state-services.js` state, mock data, Google Sheets/Firebase/localStorage helpers
- `src/js/04-auth.js` login, signup, session, user profile helpers
- `src/js/05-router.js` init, navigation, page switching
- `src/js/shared/html-utils.js` helper สำหรับ escape/string/dom id
- `src/js/pages/home.js` หน้าแรก
- `src/js/pages/record.js` หน้าบันทึกข้อมูลขยะ
- `src/js/pages/guide.js` หน้าคู่มือ
- `src/js/pages/game.js` หน้า Trash Hero Academy
- `src/js/pages/leaderboard.js` หน้า Leaderboard
- `src/js/pages/community.js` หน้า Community และ Friends
- `src/js/pages/chat.js` หน้า Green Chat
- `src/js/pages/profile.js` หน้า Profile
- `src/js/pages/impact-dashboard.js` หน้า Impact, Dashboard, Compare, Formula, Missions, Reminders, Student Roles, Starter Kit, Certificate
- `src/js/pages/admin.js` หน้า Admin และ review/export tools
- `src/js/99-runtime.js` reload, summary helpers, และ `init()`

## Build

หลังแก้ไฟล์ใน `src/js` ให้รัน:

```bash
node tools/build-assets.js
```

คำสั่งนี้จะสร้าง `assets/js/app.bundle.js` ใหม่จาก source ทุกไฟล์ตามลำดับที่กำหนดไว้ใน `tools/build-assets.js`
