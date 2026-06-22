// --- Generated Module: record.js ---

// --- renderWasteIcons ---
function renderWasteIcons() {
      return `<div class="waste-icon-grid">${Object.entries(wasteVisuals).map(([key, item]) => `
        <div class="waste-type ${key}">
          <div class="emoji">${item.emoji}</div>
          <strong>${item.label}</strong>
          <small>${item.color} | ${item.hint}</small>
        </div>`).join('')}</div>`;
    }

// --- renderRecord ---
function renderRecord() {
      const month = new Date().toISOString().slice(0, 7);
      const defaults = authRecordDefaults();
      document.getElementById('record').innerHTML = `
        <div class="grid record-layout">
          <form class="panel" id="recordForm">
            <h3>ข้อมูลนักเรียนและครัวเรือน</h3>
            <div class="field-grid">
              ${input('StudentName', 'ชื่อ-สกุลนักเรียน', 'text', true, defaults.StudentName)}
              ${input('ClassName', 'ระดับชั้น/ห้อง', 'text', true, defaults.ClassName)}
              ${input('StudentID', 'เลขที่หรือรหัสนักเรียน', 'text', true, defaults.StudentID)}
              ${input('HouseholdName', 'ชื่อครัวเรือน', 'text', true, defaults.HouseholdName)}
              ${input('ReportMonth', 'เดือนที่รายงานผล', 'month', true, month)}
            </div>
            <div class="form-group">
              <h3>ปริมาณขยะ 4 ประเภท</h3>
              <div class="field-grid">
                ${input('GeneralWasteKg', 'ขยะทั่วไป (kg)', 'number')}
                ${input('RecycleWasteKg', 'ขยะรีไซเคิล (kg)', 'number')}
                ${input('OrganicWasteKg', 'ขยะอินทรีย์/เศษอาหาร (kg)', 'number')}
                ${input('HazardousWasteAmount', 'ขยะอันตราย (ชิ้นหรือ kg)', 'number')}
              </div>
            </div>
            <div class="form-group">
              <h3>กิจกรรมจัดการขยะเพิ่มเติม</h3>
              <div class="activity-grid">
                ${activityFields.map(([field, label, unit]) => input(field, `${label} (${unit})`, 'number')).join('')}
              </div>
            </div>
            <div class="form-group">
              <h3>หลักฐานและความยินยอม</h3>
              <div class="field-grid">
                <label>อัปโหลดรูปภาพหลักฐาน<input id="EvidenceFiles" name="EvidenceFiles" type="file" accept="image/*" multiple></label>
                ${input('VideoLink', 'ลิงก์วิดีโอเพิ่มเติม', 'url')}
              </div>
              <div class="privacy-box" style="margin-top:12px">
                <label><span><input type="checkbox" name="Consent" required style="width:auto;min-height:auto"> ข้าพเจ้ายินยอมให้โรงเรียนใช้ข้อมูลและภาพหลักฐานที่ส่งผ่านระบบ Green Passport เพื่อการติดตามผลโครงการด้านสิ่งแวดล้อม การจัดทำรายงาน และการนำเสนอผลงานทางการศึกษา โดยโรงเรียนจะใช้ข้อมูลอย่างเหมาะสมและไม่เปิดเผยข้อมูลส่วนบุคคลต่อสาธารณะโดยไม่จำเป็น</span></label>
              </div>
            </div>
            <div class="btn-row" style="margin-top:16px">
              <button class="btn" type="submit">${icons.edit}ส่งข้อมูล</button>
              <button class="btn ghost" type="reset">ล้างข้อมูล</button>
            </div>
          </form>
          <div class="result-box">
            <h3>ผลคำนวณทันที</h3>
            <div class="number"><span id="liveCo2e">0.00</span></div>
            <p>kgCO₂e จากกิจกรรมที่บันทึก</p>
            <div style="margin-top:12px">${greenBuddy('<span id="liveAdvice">กรอกกิจกรรมเพื่อดูคำแนะนำอัตโนมัติ</span>', true)}</div>
            <div class="panel" style="margin-top:14px">
              <h3>สถานะ Google Sheets</h3>
              <p>${sheetApiConfigured() ? 'เชื่อมต่อ Google Sheets Web App พร้อมบันทึกลงชีต' : 'ยังไม่ได้ตั้งค่า endpoint สำหรับเขียนข้อมูล: เปิดด้วย ?api=WEB_APP_URL หลัง deploy Code.gs'}</p>
            </div>
          </div>
        </div>`;
      const form = document.getElementById('recordForm');
      form.addEventListener('input', updateLiveCarbon);
      form.addEventListener('submit', submitRecord);
      updateLiveCarbon();
    }

