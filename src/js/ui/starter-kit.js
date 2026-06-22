// --- Generated Module: starter-kit.js ---

// --- renderStarterKit ---
function renderStarterKit() {
      document.getElementById('starterKit').innerHTML = `
        <div class="panel">
          <h3>Green Passport Starter Kit</h3>
          <p>ชุดขยายผลสำหรับโรงเรียนอื่นหรือครัวเรือนที่ต้องการนำแนวทาง School to Home ไปใช้ต่อ</p>
          <div class="download-grid">
            ${starterKitItems.map((item) => `<div class="download-card"><h3>📄 ${item}</h3><p>เตรียมเป็นไฟล์ดาวน์โหลดหรือแนบลิงก์ Google Drive ได้ในอนาคต</p><button class="btn ghost" onclick="alert('รายการนี้อยู่ใน StarterKit และสามารถเพิ่มลิงก์ดาวน์โหลดได้')">ดูรายละเอียด</button></div>`).join('')}
          </div>
          <div class="notice" style="margin-top:16px">Green Passport Starter Kit ช่วยให้โรงเรียนหรือชุมชนอื่นสามารถนำแนวทาง School to Home ไปประยุกต์ใช้ได้โดยไม่ต้องเริ่มต้นใหม่ทั้งหมด ทำให้ระบบมีศักยภาพในการขยายผลสู่เครือข่ายโรงเรียนและชุมชนได้อย่างยั่งยืน</div>
        </div>`;
    }

