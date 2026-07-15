# เชื่อม Google Apps Script

1. เปิด Google Sheet: https://docs.google.com/spreadsheets/d/1D5h3BT8pMVLTIDNAwNbzHWp4s6JajwNBGoD-1VXVlPs/edit
2. ไปที่ Extensions > Apps Script
3. วางเนื้อหาจาก `apps-script/Code.gs` ลงในไฟล์ Code.gs
4. เปิด Project Settings และเลือก Show "appsscript.json" manifest file จากนั้นวางไฟล์ `apps-script/appsscript.json`
5. กด Deploy > New deployment > Web app
6. Execute as: Me, Who has access: Anyone
7. คัดลอก Web app URL
8. สร้างไฟล์ `.env` จาก `.env.example` และแทน URL จริง
9. รัน `npm run build` แล้วเผยแพร่โฟลเดอร์ `dist`
