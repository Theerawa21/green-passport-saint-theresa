// --- Generated Module: admin.js ---

// --- renderAdmin ---
function renderAdmin() {
      const loggedIn = !!state.adminPIN;
      document.getElementById('admin').innerHTML = `
        ${loggedIn ? adminPanelHtml() : `<div style="display:flex; justify-content:center; align-items:center; min-height:300px; width:100%;"><div class="panel" style="width:100%; max-width:480px;"><h3>เข้าสู่ระบบ Admin</h3><label>Admin PIN<input id="pinInput" type="password" autocomplete="current-password"></label><button class="btn" style="margin-top:14px" onclick="adminLogin()">${icons.lock}เข้าสู่ระบบ</button><p class="notice" style="margin-top:12px">เฉพาะคณะครูและผู้ดูแลระบบเท่านั้น หากใช้งานครั้งแรกหรือล้างข้อมูลการเชื่อมต่อ สามารถใส่ PIN เริ่มต้น (2468) เพื่อเข้าไปตั้งค่า Google Sheets ได้</p></div></div>`}
      `;
      if (loggedIn) attachAdminFilters();
    }

// --- renderAdminTable ---
function renderAdminTable() {
      const month = document.getElementById('adminMonth')?.value || '';
      const cls = document.getElementById('adminClass')?.value || '';
      const name = document.getElementById('adminName')?.value || '';
      const status = document.getElementById('adminStatus')?.value || '';
      const rows = state.data.wasteRecords.filter((r) =>
        (!month || r.ReportMonth === month) &&
        (!cls || String(r.ClassName || '').includes(cls)) &&
        (!name || String(r.StudentName || '').includes(name)) &&
        reviewStatusMatches(r.ReviewStatus, status)
      );
      document.getElementById('adminTable').innerHTML = `<div class="table-wrap"><table><thead><tr><th>วันเวลาส่ง</th><th>นักเรียน</th><th>เดือน</th><th>ขยะ 4 ประเภท</th><th>คาร์บอน</th><th>หลักฐาน</th><th>สถานะ/หมายเหตุ</th><th>จัดการ</th></tr></thead><tbody>${rows.map((r) => `
        <tr>
          <td>${r.SubmittedAt || '-'}</td>
          <td>${r.StudentName}<br><small>${r.ClassName} | ${r.StudentID}</small></td>
          <td>${r.ReportMonth}</td>
          <td><small>ทั่วไป ${r.GeneralWasteKg || 0} kg<br>รีไซเคิล ${r.RecycleWasteKg || 0} kg<br>อินทรีย์ ${r.OrganicWasteKg || 0} kg<br>อันตราย ${r.HazardousWasteAmount || 0}</small></td>
          <td>${format(r.TotalCO2e)}</td>
          <td><div class="evidence-placeholder" style="min-height:76px">📸 ตัวอย่างหลักฐาน</div>${r.EvidenceFolderLink ? `<a href="${r.EvidenceFolderLink}" target="_blank" rel="noopener">ดูหลักฐานเพิ่มเติม</a>` : 'ไม่มีลิงก์'}</td>
          <td>${statusLabel(r.ReviewStatus)}<br><small>${r.TeacherComment || ''}</small><br><small>${r.ReviewedBy || ''} ${r.ReviewedAt || ''}</small></td>
          <td>
            <select id="status-${r._rowNumber}">
              ${reviewStatusOptions(r.ReviewStatus).map((s) => `<option ${s === r.ReviewStatus ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
            <textarea id="comment-${r._rowNumber}" placeholder="หมายเหตุครู">${r.TeacherComment || ''}</textarea>
            <div class="btn-row">
              <button class="btn" onclick="updateReview(${r._rowNumber})">บันทึก</button>
              <button class="btn ghost" onclick="quickReview(${r._rowNumber}, 'ผ่านการตรวจสอบ', 'ข้อมูลผ่านการตรวจสอบแล้ว ✅')">ผ่าน</button>
              <button class="btn ghost" onclick="quickReview(${r._rowNumber}, 'ต้องแก้ไข', 'กรุณาแนบภาพที่เห็นน้ำหนักขยะชัดเจนขึ้น 📸')">แก้ไข</button>
              <button class="btn ghost" onclick="quickReview(${r._rowNumber}, 'หลักฐานไม่ชัดเจน', 'หลักฐานไม่ชัดเจน กรุณาถ่ายภาพใหม่ 📸')">ไม่ชัด</button>
              <button class="btn ghost" onclick="quickReview(${r._rowNumber}, 'ข้อมูลไม่ตรงกับหลักฐาน', 'ข้อมูลปริมาณขยะกับหลักฐานยังไม่สอดคล้องกัน กรุณาตรวจสอบอีกครั้ง ⚠️')">ไม่ตรง</button>
            </div>
          </td>
        </tr>`).join('')}</tbody></table></div>`;
    }

// --- adminPanelHtml ---
function adminPanelHtml() {
      return `<div class="grid">
        ${sheetConnectionPanelHtml()}
        <div class="panel">
          <h3>Admin Dashboard</h3>
          <div class="privacy-box" style="margin-bottom:12px">เพื่อความปลอดภัย ไม่ควรแสดงรหัส Admin ในหน้าเว็บจริง ควรตั้งผ่าน Script Properties จำกัดสิทธิ์ครูผู้ดูแล และซ่อนข้อมูลส่วนบุคคลในรายงานสาธารณะ</div>
          <div class="field-grid">
            <label>เดือน<input id="adminMonth" type="month"></label>
            <label>ห้อง<input id="adminClass" type="text" placeholder="เช่น ป.5/1"></label>
            <label>ชื่อนักเรียน<input id="adminName" type="text"></label>
            <label>สถานะ<select id="adminStatus"><option value="">ทั้งหมด</option><option>รอตรวจสอบ</option><option>ผ่านการตรวจสอบ</option><option>ต้องแก้ไข</option><option>หลักฐานไม่ชัดเจน</option><option>ข้อมูลไม่ตรงกับหลักฐาน</option></select></label>
          </div>
          <div class="btn-row" style="margin-top:12px">
            <button class="btn ghost" onclick="renderAdminTable()">กรองข้อมูล</button>
            <button class="btn secondary" onclick="copyLineReminder()">สร้างข้อความ LINE</button>
            <button class="btn yellow" onclick="exportCsv('records')">Export ข้อมูล</button>
            <button class="btn yellow" onclick="exportCsv('summary')">Export สรุป</button>
            <button class="btn yellow" onclick="exportCsv('impact')">Export รายงานประกวด</button>
            <button class="btn yellow" onclick="exportCsv('missions')">Export ภารกิจรายเดือน</button>
          </div>
        </div>
        ${adminToolsPanelHtml()}
        ${adminCommunityPanelHtml()}
        <div class="panel">
          <h3>Export Reports</h3>
          <div class="download-grid">
            ${[
              ['records','รายงานรายเดือน'],
              ['summary','รายงานรายครัวเรือน'],
              ['impact','รายงานภาพรวมโครงการ'],
              ['carbon','รายงานลดก๊าซเรือนกระจก'],
              ['complete','รายชื่อผู้ส่งข้อมูลครบ'],
              ['missing','รายชื่อผู้ยังไม่ส่งข้อมูล'],
              ['reviewed','รายงานหลักฐานที่ผ่านการตรวจสอบ'],
              ['modelHomes','รายงานครัวเรือนต้นแบบ'],
              ['infographic','ข้อมูลสำหรับทำ Infographic'],
              ['contest','ข้อมูลสำหรับส่งประกวดนวัตกรรม'],
              ['missions','ภารกิจรายเดือน'],
              ['communityPosts','โพสต์ชุมชน'],
              ['postComments','ความคิดเห็นชุมชน'],
              ['chatMessages','ข้อความ Green Chat'],
              ['userProfiles','โปรไฟล์และ Level'],
              ['levelRules','เกณฑ์ Level/EXP'],
              ['expLogs','บันทึก EXP'],
            ].map(([type, label]) => `<button class="btn ghost" onclick="exportCsv('${type}')">${label}</button>`).join('')}
          </div>
        </div>
        <div class="panel"><h3>ตรวจสอบหลักฐานโดยครู</h3><div id="adminTable"></div></div>
        <div class="panel"><h3>ผลการเล่นเกม Trash Hero Academy</h3>${adminGameScoresHtml()}</div>
        ${adminErrorConsoleHtml()}
      </div>`;
    }

// --- adminErrorConsoleHtml ---
function adminErrorConsoleHtml() {
      const logs = window.errorLogs || [];
      return `<div class="panel" style="grid-column: 1 / -1;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
          <h3 style="margin:0; display:flex; align-items:center; gap:8px;">
            ${icons.code} คอนโซลแสดง Error ของเว็บ <span id="adminConsoleTitleCount">(${logs.length})</span>
          </h3>
          <div class="btn-row">
            <button class="btn ghost small" onclick="testErrorCapture()">ทดสอบสร้าง Error</button>
            <button class="btn ghost small" onclick="copyErrorLogs()">คัดลอกทั้งหมด</button>
            <button class="btn secondary small" onclick="clearErrorLogs()">เคลียร์ประวัติ</button>
          </div>
        </div>
        <p class="notice" style="margin-bottom:12px;">แสดงข้อผิดพลาดที่เกิดขึ้นบนหน้าเว็บ (เช่น จาก Firebase, Google Sheets, หรือ Script error) ช่วยตรวจความปลอดภัยและสถานะระบบ</p>
        <div id="adminConsoleLogs" style="background:#1e1e1e; color:#d4d4d4; font-family:'Courier New', Courier, monospace; font-size:13px; padding:12px; border-radius:8px; max-height:300px; overflow-y:auto; border:1px solid #333; line-height:1.4;">
          ${logs.length === 0 ? '<div style="color:#888; text-align:center; padding:20px 0;">ไม่มี Error ที่บันทึกไว้</div>' : logs.map((log) => {
            let color = '#ff5f56'; 
            if (log.type === 'Promise Rejection') color = '#ffbd2e'; 
            if (log.type === 'Console Error') color = '#f77f00'; 
            function localEscapeHtml(str) {
              if (!str) return '';
              return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
            }
            return `<div style="margin-bottom:10px; border-bottom:1px solid #2d2d2d; padding-bottom:6px;">
              <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-size:11px;">
                <span style="color:${color}; font-weight:bold;">[${localEscapeHtml(log.type)}]</span>
                <span style="color:#888;">${localEscapeHtml(log.time)}</span>
              </div>
              <div style="word-break:break-all; white-space:pre-wrap; color:#f8f8f2;">${localEscapeHtml(log.message)}</div>
              ${log.details ? `<div style="color:#888; font-size:11px; margin-top:2px; word-break:break-all; white-space:pre-wrap;">รายละเอียด: ${localEscapeHtml(log.details)}</div>` : ''}
            </div>`;
          }).join('')}
        </div>
      </div>`;
    }

// --- sheetConnectionPanelHtml ---
function sheetConnectionPanelHtml() {
      return `<div class="panel">
        <h3>เชื่อม Google Sheets</h3>
        <p class="notice">ฐานข้อมูล: <a href="${SHEET_URL}" target="_blank" rel="noopener">Google Sheet Green Passport</a></p>
        <label>Google Apps Script Web App URL
          <input id="sheetApiInput" type="url" value="${escapeAttr(sheetApiUrl)}" placeholder="https://script.google.com/macros/s/.../exec">
        </label>
        <div class="btn-row" style="margin-top:12px">
          <button class="btn" onclick="saveSheetApiUrl()">บันทึกการเชื่อมต่อ</button>
          <button class="btn ghost" onclick="testSheetConnection()">ทดสอบ</button>
        </div>
        <p class="notice" style="margin-top:12px">${sheetApiConfigured() ? 'สถานะ: ตั้งค่า endpoint แล้ว' : 'สถานะ: ยังไม่ได้ตั้งค่า endpoint สำหรับเขียนข้อมูลลงชีต'}</p>
      </div>`;
    }

// --- testSheetConnection ---
async function testSheetConnection() {
      saveSheetApiUrl();
      if (!sheetApiConfigured()) return;
      try {
        await reloadData(true);
        alert('เชื่อมต่อ Google Sheets สำเร็จ');
      } catch (error) {
        alert('ยังเชื่อมต่อไม่สำเร็จ: ' + error.message);
      }
    }

// --- saveSheetApiUrl ---
function saveSheetApiUrl() {
      const input = document.getElementById('sheetApiInput');
      const value = String(input?.value || '').trim();
      if (!value) {
        localStorage.removeItem(SHEET_API_STORAGE_KEY);
        sheetApiUrl = '';
        alert('ล้างค่า endpoint แล้ว');
        renderAdmin();
        return;
      }
      if (!/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec/.test(value)) {
        alert('URL ต้องเป็น Google Apps Script Web App URL ที่ลงท้ายด้วย /exec');
        return;
      }
      sheetApiUrl = value;
      localStorage.setItem(SHEET_API_STORAGE_KEY, sheetApiUrl);
      alert('บันทึก endpoint แล้ว ระบบจะใช้ URL นี้เพื่ออ่าน/เขียนข้อมูลลง Google Sheets');
      renderAdmin();
    }

// --- adminLogin ---
function adminLogin() {
      const pin = document.getElementById('pinInput').value;
      if (sheetApiConfigured()) {
        sheetApi('adminLogin', { pin }).then((res) => {
          if (res.ok) { state.adminPIN = pin; renderAdmin(); } else alert('Admin PIN ไม่ถูกต้อง');
        }).catch((e) => alert(e.message));
      } else if (btoa(pin) === 'MjQ2OA==') {
        state.adminPIN = pin;
        renderAdmin();
      } else {
        alert('Admin PIN ไม่ถูกต้อง');
      }
    }

// --- clearErrorLogs ---
async function clearErrorLogs() {
      if (await customConfirm('คุณต้องการลบ Error logs ทั้งหมดใช่หรือไม่?')) {
        window.errorLogs = [];
        try {
          localStorage.removeItem('greenPassportErrorLogs');
        } catch(e) {}
        renderAdmin();
      }
    }

// --- copyErrorLogs ---
function copyErrorLogs() {
      const logs = window.errorLogs || [];
      if (logs.length === 0) {
        alert('ไม่มี log ให้คัดลอก');
        return;
      }
      const text = logs.map(log => `[${log.type}] [${log.time}]\nMessage: ${log.message}\nDetails: ${log.details || 'None'}\n---`).join('\n');
      navigator.clipboard.writeText(text).then(() => {
        alert('คัดลอก Error logs ทั้งหมดลง Clipboard แล้ว');
      }).catch(err => {
        alert('ไม่สามารถคัดลอกได้: ' + err);
      });
    }

// --- testErrorCapture ---
function testErrorCapture() {
      console.error('ทดสอบ Console.error: เกิดข้อผิดพลาดจำลองจากการกดปุ่ม');
      setTimeout(() => {
        throw new Error('ทดสอบ Runtime Error: เกิดข้อผิดพลาดจำลองของระบบ');
      }, 50);
      setTimeout(() => {
        Promise.reject(new Error('ทดสอบ Promise Rejection: การทำงานไม่สำเร็จ'));
      }, 100);
    }

