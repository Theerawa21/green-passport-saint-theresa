# Green Passport - St. Theresa Zero Waste

เว็บแอปภาษาไทยสำหรับบันทึกข้อมูลขยะในครัวเรือน คำนวณการลดก๊าซเรือนกระจก เชื่อมโยงกิจกรรม School to Home และใช้เป็นต้นแบบนวัตกรรมดิจิทัลของโรงเรียนเซนต์เทเรซา

Google Sheets ที่ผูกกับระบบ: https://docs.google.com/spreadsheets/d/1CB501XSK9SOA-OsGdDIYqPjxEoUYitKOFKlbpA4yHJ4/edit?usp=sharing

## สิ่งที่มีในชุดนี้

- `Index.html` เว็บแอปหน้าเดียวสำหรับนักเรียน ผู้ปกครอง ครู และกรรมการ
- `Code.gs` backend สำหรับ Google Apps Script และ Google Sheets
- `green-passport-st-theresa-template.xlsx` เทมเพลต Google Sheets เริ่มต้น
- `assets/green-passport-logo.png` โลโก้ Green Passport
- `assets/st-theresa-school-emblem.png` ตราโรงเรียน
- เกม `Trash Hero Academy` พร้อมมาสคอต Green Buddy ไอคอนขยะ Badge ด่านเกม Animation และเสียง
- หน้า `คู่มือแยกขยะ` พร้อมข้อมูลขยะ 5 ประเภท 3Rs วิธีตั้งมุมแยกขยะที่บ้าน การบันทึกหลักฐาน สูตรคาร์บอน Zero Waste Home และ FAQ

## ส่วนที่เพิ่มเพื่อยกระดับระบบ

- `Impact Dashboard` แสดงผลกระทบรวม เช่น จำนวนครัวเรือน น้ำหนักขยะที่จัดการได้ kgCO2e ที่ลดได้ สัดส่วนรีไซเคิล และกราฟเปรียบเทียบรายเดือน
- `Green Buddy Advice` ให้คำแนะนำแบบ rule-based ตามข้อมูลที่นักเรียนบันทึก เช่น ขยะทั่วไปสูง ขยะอินทรีย์สูง รีไซเคิลต่ำ หรือยังไม่มีหลักฐาน
- `Teacher Evidence Review` ในหน้า Admin สำหรับตรวจหลักฐาน ใส่สถานะ ความเห็น ผู้ตรวจ และเวลาตรวจ
- `สูตรคำนวณและค่า EF` อธิบาย kgCO2e สูตรคำนวณ ตัวอย่าง และตาราง CarbonFactors
- `ภารกิจรายเดือน` สำหรับขยายกิจกรรมเป็นแคมเปญต่อเนื่องในโรงเรียนและที่บ้าน
- `บทบาทนักเรียนผู้พัฒนา` สำหรับใช้ประกอบการนำเสนอว่านักเรียนมีส่วนร่วมตั้งแต่สำรวจ ออกแบบ ทดลอง วิเคราะห์ และขยายผล
- `Starter Kit` รวมรายการสื่อที่ควรใช้เผยแพร่ เช่น โปสเตอร์ Checklist แบบฟอร์มครู และเอกสารสูตร
- ระบบ export รายงานหลายชุด เช่น Impact, Summary, Game Scores, Advice Rules, Starter Kit และ Privacy
- เพิ่มแนวทาง Privacy/Consent เพื่อเน้นการใช้ข้อมูลเพื่อกิจกรรมโรงเรียนและรายงานแบบไม่เปิดเผยข้อมูลส่วนบุคคล

## ชีตที่รองรับใน Google Sheets

`Code.gs` จะสร้างหรือเตรียมชีตเหล่านี้เมื่อรัน `setupGreenPassport()`

- `WasteRecords`
- `CarbonFactors`
- `GameScores`
- `HouseholdSummary`
- `AdminSettings`
- `AdviceRules`
- `ExportReports`
- `StarterKit`
- `StudentDevRoles`
- `PrivacyConsent`

## วิธีติดตั้งบน Google Apps Script

1. เปิด Google Sheets ที่ผูกกับระบบ: https://docs.google.com/spreadsheets/d/1CB501XSK9SOA-OsGdDIYqPjxEoUYitKOFKlbpA4yHJ4/edit?usp=sharing
2. ไปที่ Extensions > Apps Script
3. สร้างไฟล์ `Code.gs` แล้ววางโค้ดจากไฟล์ `Code.gs`
4. สร้างไฟล์ HTML ชื่อ `Index` แล้ววางโค้ดจาก `Index.html`
5. กด Run ฟังก์ชัน `setupGreenPassport()` หนึ่งครั้ง และอนุญาตสิทธิ์
6. ไปที่ Deploy > New deployment > Web app
7. เลือก Execute as: Me และกำหนด Who has access ตามนโยบายโรงเรียน

## ตั้งค่าหลังติดตั้ง

- เปลี่ยน `AdminPIN` ในชีต `AdminSettings` ทันทีหลังติดตั้งจริง
- ถ้าต้องการเก็บหลักฐานไว้ในโฟลเดอร์เฉพาะ ให้ใส่ Folder ID ใน `EvidenceRootFolderId`
- ตรวจสอบค่า EF ใน `CarbonFactors` ให้ตรงกับแหล่งอ้างอิงของโรงเรียน เช่น อบก. หรือ IPCC
- ใช้รายงานสาธารณะเป็นข้อมูลสรุป ไม่ควรเปิดเผยชื่อหรือรหัสนักเรียนเกินจำเป็น

## ลิงก์หน้าที่ควรใช้ทดลอง

- หน้าแรก: `?page=home`
- Impact Dashboard: `?page=impact`
- คู่มือแยกขยะ: `?page=guide`
- สูตรคำนวณ: `?page=formula`
- ภารกิจรายเดือน: `?page=missions`
- บทบาทนักเรียนผู้พัฒนา: `?page=studentRoles`
- Starter Kit: `?page=starterKit`
- Admin: `?page=admin`
