# Green Passport - St. Theresa Zero Waste

เว็บแอปภาษาไทยสำหรับบันทึกข้อมูลขยะในครัวเรือน คำนวณการลดก๊าซเรือนกระจก เล่นเกม Trash Hero Academy ดู Dashboard และตรวจหลักฐานผ่านหน้า Admin

Google Sheets ที่ผูกกับระบบ: https://docs.google.com/spreadsheets/d/1G0rL3YSQexyiMp7vPu8DdOo2tUZk9xIhi1E1poaJqi4/edit

## ไฟล์ในโปรเจกต์

- `index.html` เว็บแอปแบบ standalone เปิดใน browser ได้โดยตรง
- `site.config.js` ตั้งค่า endpoint ของ Google Apps Script Web App สำหรับใช้งานบน GitHub Pages
- `Code.gs` Google Apps Script Web App proxy สำหรับสร้างชีต อ่านข้อมูล และบันทึกข้อมูลกลับ Google Sheets
- `.github/workflows/deploy-pages.yml` GitHub Actions workflow สำหรับ deploy GitHub Pages
- `README.md` คู่มือการติดตั้งและใช้งาน

## ชีตที่ระบบใช้

เมื่อรัน `setupGreenPassport()` ใน `Code.gs` ระบบจะสร้าง header ให้ชีตเหล่านี้

- `WasteRecords` สำหรับข้อมูลบันทึกขยะและผลตรวจหลักฐาน
- `GameScores` สำหรับคะแนนเกม Trash Hero Academy
- `CarbonFactors` สำหรับค่า EF ที่ใช้คำนวณ kgCO2e
- `AdminSettings` สำหรับ Admin PIN, ปีการศึกษา และโฟลเดอร์เก็บหลักฐาน

## วิธี deploy ให้บันทึกลง Google Sheets

1. เปิด Google Sheets: https://docs.google.com/spreadsheets/d/1G0rL3YSQexyiMp7vPu8DdOo2tUZk9xIhi1E1poaJqi4/edit
2. ไปที่ Extensions > Apps Script
3. สร้างไฟล์ `Code.gs` แล้ววางโค้ดจากไฟล์ `Code.gs` ใน repo นี้
4. กด Run ฟังก์ชัน `setupGreenPassport()` หนึ่งครั้ง และอนุญาตสิทธิ์ Google Sheets/Drive
5. ไปที่ Deploy > New deployment > Web app
6. เลือก Execute as: Me
7. เลือก Who has access ตามนโยบายโรงเรียน
8. Copy Web App URL ที่ได้
9. เปิดเว็บด้วย URL รูปแบบนี้: `index.html?api=WEB_APP_URL`

เมื่อเปิดด้วย `?api=...` ระบบจะจำ endpoint ไว้ใน browser และการส่งข้อมูลขยะ คะแนนเกม และผลตรวจ Admin จะบันทึกลง Google Sheets ทั้งหมด

บนเว็บ GitHub Pages สามารถตั้งค่าได้จากหน้า `Admin` เช่นกัน: วาง Web App URL ในแผง `เชื่อม Google Sheets` แล้วกด `บันทึกการเชื่อมต่อ` และ `ทดสอบ`

## วิธี deploy เป็นเว็บด้วย GitHub Pages

มี workflow สำหรับ GitHub Pages อยู่แล้วที่ `.github/workflows/deploy-pages.yml`

1. Commit และ push ไฟล์ทั้งหมดขึ้น GitHub
2. เปิด repo บน GitHub
3. ไปที่ Settings > Pages
4. ในหัวข้อ Build and deployment เลือก Source: `GitHub Actions`
5. ไปที่ Actions แล้วรอ workflow `Deploy to GitHub Pages` ทำงานสำเร็จ
6. GitHub จะแสดง URL เว็บในหน้า Settings > Pages เช่น `https://USERNAME.github.io/green-passport-saint-theresa/`

ถ้าต้องการให้เว็บบันทึกลง Google Sheets โดยไม่ต้องใส่ `?api=...` ทุกครั้ง ให้แก้ `site.config.js`:

```js
window.GREEN_PASSPORT_CONFIG = {
  sheetApiUrl: 'https://script.google.com/macros/s/DEPLOYMENT_ID/exec',
};
```

ถ้ายังไม่อยากใส่ endpoint ลงไฟล์ใน repo ใช้วิธีเปิดเว็บครั้งแรกพร้อม query string แทนได้:

`https://USERNAME.github.io/green-passport-saint-theresa/?api=WEB_APP_URL`

หลังจากนั้น browser จะจำ endpoint ไว้ใน localStorage

หรือเปิดหน้า `Admin` บนเว็บแล้วตั้งค่าในแผง `เชื่อม Google Sheets` ได้โดยไม่ต้องแก้ไฟล์ใน repo

## การอ่านข้อมูล

- ถ้ามี Web App endpoint ระบบจะโหลดข้อมูลผ่าน `Code.gs`
- ถ้าไม่มี endpoint ระบบจะพยายามอ่านข้อมูลสาธารณะผ่าน Google Visualization API
- localStorage ใช้เป็น cache และคิวสำรองเท่านั้น ไม่ใช่แหล่งข้อมูลหลักสำหรับงานจริง

## การตั้งค่าหลัง deploy

- เปลี่ยน `AdminPIN` ในชีต `AdminSettings` จากค่าเริ่มต้น `2468`
- ถ้าต้องการโฟลเดอร์หลักฐานเฉพาะ ให้ใส่ Folder ID ใน `EvidenceRootFolderId`
- ปรับค่า EF ใน `CarbonFactors` ให้ตรงกับแหล่งอ้างอิงของโรงเรียน

## ลิงก์หน้าที่ใช้ทดลอง

- หน้าแรก: `?page=home`
- บันทึกข้อมูล: `?page=record`
- เกม: `?page=game`
- Leaderboard: `?page=leaderboard`
- Impact Dashboard: `?page=impact`
- Admin: `?page=admin`

ใช้ร่วมกับ endpoint ได้ เช่น `index.html?api=WEB_APP_URL&page=record` หรือบน GitHub Pages: `https://USERNAME.github.io/green-passport-saint-theresa/?api=WEB_APP_URL&page=record`
