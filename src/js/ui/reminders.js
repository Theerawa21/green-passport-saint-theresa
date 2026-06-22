// --- Generated Module: reminders.js ---

// --- renderReminders ---
function renderReminders() {
      const missing = state.data.householdSummary.filter((h) => Number(h.TotalSubmissions || 0) < 3);
      const pending = state.data.wasteRecords.filter((r) => (r.ReviewStatus || 'รอตรวจสอบ') === 'รอตรวจสอบ');
      const needFix = state.data.wasteRecords.filter((r) => ['ต้องแก้ไข','หลักฐานไม่ชัดเจน','ข้อมูลไม่ตรงกับหลักฐาน','ข้อมูลกับหลักฐานไม่สอดคล้องกัน'].includes(r.ReviewStatus));
      const message = lineReminderText();
      document.getElementById('reminders').innerHTML = `
        <div class="impact-hero">
          <div>
            <h3>แจ้งเตือน Green Passport</h3>
            <p>รวมรายการที่ควรติดตาม ทั้งครัวเรือนที่ยังส่งข้อมูลไม่ครบ รายการรอตรวจหลักฐาน และรายการที่ต้องแก้ไข เพื่อให้ครูและนักเรียนปิดงานรายเดือนได้ทันเวลา</p>
            <div class="guide-actions">
              <button class="btn" onclick="copyLineReminder()">คัดลอกข้อความ LINE</button>
              <button class="btn secondary" onclick="showPage('admin')">ไปหน้า Admin</button>
            </div>
          </div>
          ${greenBuddy('ฉันจะช่วยเตือนงานสำคัญก่อนถึงรอบสรุปรายเดือนนะ 📣', true)}
        </div>
        <div class="grid three">
          ${kpi('ครัวเรือนส่งไม่ครบ', missing.length, 'ครัวเรือน')}
          ${kpi('รอตรวจหลักฐาน', pending.length, 'รายการ')}
          ${kpi('ต้องแก้ไข', needFix.length, 'รายการ')}
        </div>
        <div class="grid two" style="margin-top:16px">
          <div class="panel">
            <h3>ข้อความแจ้งเตือนสำหรับ LINE</h3>
            <p>${message}</p>
            <button class="btn ghost" onclick="copyLineReminder()">คัดลอกข้อความ</button>
          </div>
          <div class="panel">
            <h3>รายการที่ควรติดตาม</h3>
            ${reminderListHtml(missing, pending, needFix)}
          </div>
        </div>`;
    }

