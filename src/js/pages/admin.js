    let adminDeferredRenderHandle = null;
    let adminTableShowAll = false;

    function renderAdmin() {
      const loggedIn = !!state.adminPIN;
      document.getElementById('admin').innerHTML = `
        ${loggedIn ? adminPanelHtml() : `<div style="display:flex; justify-content:center; align-items:center; min-height:300px; width:100%;"><div class="panel" style="width:100%; max-width:480px;"><h3>เข้าสู่ระบบ Admin</h3><label>Admin PIN<input id="pinInput" type="password" autocomplete="current-password"></label><button class="btn" style="margin-top:14px" onclick="adminLogin()">${icons.lock}เข้าสู่ระบบ</button><p class="notice" style="margin-top:12px">เฉพาะคณะครูและผู้ดูแลระบบเท่านั้น หากใช้งานครั้งแรกหรือล้างข้อมูลการเชื่อมต่อ สามารถใส่ PIN เริ่มต้น (2468) เพื่อเข้าไปตั้งค่า Google Sheets ได้</p></div></div>`}
      `;
      if (loggedIn) scheduleAdminDeferredRender();
    }

    function adminLoadingHtml(label) {
      return `<div class="notice">กำลังโหลด${label}...</div>`;
    }

    function scheduleAdminDeferredRender() {
      if (adminDeferredRenderHandle && window.cancelIdleCallback) {
        window.cancelIdleCallback(adminDeferredRenderHandle);
      }
      const run = () => {
        adminDeferredRenderHandle = null;
        renderAdminDeferredSections();
      };
      adminDeferredRenderHandle = window.requestIdleCallback
        ? window.requestIdleCallback(run, { timeout: 500 })
        : setTimeout(run, 0);
    }

    function renderAdminDeferredSections() {
      if (state.active !== 'admin' || !state.adminPIN) return;
      const community = document.getElementById('adminCommunityPanel');
      const gameScores = document.getElementById('adminGameScoresPanel');
      const errorConsole = document.getElementById('adminErrorConsolePanel');
      if (community) community.innerHTML = adminCommunityPanelHtml();
      if (gameScores) gameScores.innerHTML = adminGameScoresHtml();
      if (errorConsole) errorConsole.innerHTML = adminErrorConsoleHtml();
      attachAdminFilters();
    }

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
        <div id="adminCommunityPanel">${adminLoadingHtml('ข้อมูลชุมชน')}</div>
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
        <div class="panel"><h3>ตรวจสอบหลักฐานโดยครู</h3><div id="adminTable">${adminLoadingHtml('ตารางตรวจหลักฐาน')}</div></div>
        <div class="panel"><h3>ผลการเล่นเกม Trash Hero Academy</h3><div id="adminGameScoresPanel">${adminLoadingHtml('คะแนนเกม')}</div></div>
        <div id="adminErrorConsolePanel">${adminLoadingHtml('คอนโซล Error')}</div>
      </div>`;
    }

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

    function testErrorCapture() {
      console.error('ทดสอบ Console.error: เกิดข้อผิดพลาดจำลองจากการกดปุ่ม');
      setTimeout(() => {
        throw new Error('ทดสอบ Runtime Error: เกิดข้อผิดพลาดจำลองของระบบ');
      }, 50);
      setTimeout(() => {
        Promise.reject(new Error('ทดสอบ Promise Rejection: การทำงานไม่สำเร็จ'));
      }, 100);
    }

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

    async function clearErrorLogs() {
      if (await customConfirm('คุณต้องการลบ Error logs ทั้งหมดใช่หรือไม่?')) {
        window.errorLogs = [];
        try {
          localStorage.removeItem('greenPassportErrorLogs');
        } catch(e) {}
        renderAdmin();
      }
    }

    function adminToolsPanelHtml() {
      return `
        <div class="panel">
          <h3>เครื่องมือ Admin</h3>
          <p>รวมหน้าที่ใช้สำหรับครู ผู้ดูแลระบบ และการทำรายงานไว้ในจุดเดียว เพื่อลดจำนวนแท็บหลักของผู้ใช้งานทั่วไป</p>
          <div class="quick-menu">
            ${adminToolPages().map(([id, label, icon]) => `
              <button class="menu-card" onclick="showPage('${id}')">
                ${icons[icon]}<strong>${label}</strong><small>${menuHelp(id)}</small>
              </button>`).join('')}
          </div>
        </div>`;
    }

    function adminCommunityPanelHtml() {
      const posts = state.data.communityPosts || [];
      const comments = state.data.postComments || [];
      const messages = state.data.chatMessages || [];
      const pendingPosts = posts.filter((post) => !statusIsPublished(post.ReviewStatus) && !statusIsHidden(post.ReviewStatus));
      const pendingComments = comments.filter((comment) => !statusIsPublished(comment.ReviewStatus) && !statusIsHidden(comment.ReviewStatus));
      const reportedMessages = messages.filter((message) => String(message.ReportStatus || '').trim() || String(message.ModerationStatus || '').includes('รอครู'));
      return `
        <div class="panel">
          <h3>Admin ชุมชน Green Passport</h3>
          <p>ตรวจโพสต์ ความคิดเห็น และข้อความที่ถูกรายงานจากพื้นที่ชุมชน โดยรวมงานของครูไว้ใน Admin เพื่อไม่ให้เมนูผู้ใช้ทั่วไปเยอะเกินไป</p>
          <div class="grid four" style="margin-top:12px">
            ${kpi('โพสต์ทั้งหมด', posts.length, 'โพสต์')}
            ${kpi('รอตรวจโพสต์', pendingPosts.length, 'โพสต์')}
            ${kpi('รอตรวจความคิดเห็น', pendingComments.length, 'รายการ')}
            ${kpi('แชทรายงาน', reportedMessages.length, 'ข้อความ')}
          </div>
          <div class="table-wrap" style="margin-top:16px">
            <table>
              <thead><tr><th>โพสต์รอตรวจ</th><th>ผู้ส่ง</th><th>เนื้อหา</th><th>สถานะ</th><th>จัดการ</th></tr></thead>
              <tbody>${pendingPosts.slice(0, 12).map((post) => {
                const id = escapeAttr(jsString(post.PostID));
                return `<tr>
                  <td><strong>${escapeHtml(post.PostTitle)}</strong><br><small>${escapeHtml(post.Category || '')}</small></td>
                  <td>${escapeHtml(safeDisplayName(post.DisplayName))}<br><small>${escapeHtml(post.ClassName || '')}</small></td>
                  <td><small>${escapeHtml(String(post.PostContent || '').slice(0, 180))}</small></td>
                  <td>${escapeHtml(post.ReviewStatus || 'รอตรวจสอบ')}</td>
                  <td><div class="btn-row">
                    <button class="btn ghost" onclick="quickReviewPost(${id}, 'เผยแพร่แล้ว', 'โพสต์ผ่านการตรวจสอบและเผยแพร่ได้')">เผยแพร่</button>
                    <button class="btn ghost" onclick="quickReviewPost(${id}, 'ต้องแก้ไข', 'กรุณาปรับเนื้อหาให้ชัดเจนและไม่เปิดเผยข้อมูลส่วนตัว')">ให้แก้ไข</button>
                    <button class="btn ghost" onclick="quickReviewPost(${id}, 'ซ่อน', 'ซ่อนโพสต์เพื่อความปลอดภัยของชุมชน')">ซ่อน</button>
                  </div></td>
                </tr>`;
              }).join('') || '<tr><td colspan="5">ไม่มีโพสต์รอตรวจ</td></tr>'}</tbody>
            </table>
          </div>
          <div class="table-wrap" style="margin-top:16px">
            <table>
              <thead><tr><th>ความคิดเห็นรอตรวจ</th><th>โพสต์</th><th>ผู้ส่ง</th><th>จัดการ</th></tr></thead>
              <tbody>${pendingComments.slice(0, 12).map((comment) => {
                const id = escapeAttr(jsString(comment.CommentID));
                const post = posts.find((item) => item.PostID === comment.PostID) || {};
                return `<tr>
                  <td>${escapeHtml(comment.CommentText)}</td>
                  <td>${escapeHtml(post.PostTitle || comment.PostID)}</td>
                  <td>${escapeHtml(safeDisplayName(comment.DisplayName))}</td>
                  <td><div class="btn-row">
                    <button class="btn ghost" onclick="quickReviewComment(${id}, 'เผยแพร่แล้ว', '')">เผยแพร่</button>
                    <button class="btn ghost" onclick="quickReviewComment(${id}, 'ซ่อน', 'ซ่อนโดยครู')">ซ่อน</button>
                  </div></td>
                </tr>`;
              }).join('') || '<tr><td colspan="4">ไม่มีความคิดเห็นรอตรวจ</td></tr>'}</tbody>
            </table>
          </div>
          <div class="table-wrap" style="margin-top:16px">
            <table>
              <thead><tr><th>ข้อความแชทที่ต้องดูแล</th><th>ห้อง</th><th>ผู้ส่ง</th><th>สถานะ</th><th>จัดการ</th></tr></thead>
              <tbody>${reportedMessages.slice(0, 12).map((message) => {
                const id = escapeAttr(jsString(message.MessageID));
                const room = (state.data.chatRooms || []).find((item) => item.ChatRoomID === message.ChatRoomID) || {};
                return `<tr>
                  <td>${escapeHtml(message.MessageText)}</td>
                  <td>${escapeHtml(room.ChatRoomName || message.ChatRoomID)}</td>
                  <td>${escapeHtml(safeDisplayName(message.DisplayName))}<br><small>${escapeHtml(message.ClassName || '')}</small></td>
                  <td>${escapeHtml(message.ReportStatus || message.ModerationStatus || 'ปกติ')}</td>
                  <td><div class="btn-row">
                    <button class="btn ghost" onclick="quickModerateMessage(${id}, 'ปกติ', '', false)">ปกติ</button>
                    <button class="btn ghost" onclick="quickModerateMessage(${id}, 'ซ่อน', 'ซ่อนโดยครู', false)">ซ่อน</button>
                    <button class="btn ghost" onclick="quickModerateMessage(${id}, 'ปักหมุด', '', true)">ปักหมุด</button>
                  </div></td>
                </tr>`;
              }).join('') || '<tr><td colspan="5">ไม่มีข้อความที่ถูกรายงาน</td></tr>'}</tbody>
            </table>
          </div>
        </div>`;
    }

    function updateLocalById(rows, key, id, updates) {
      const item = (rows || []).find((row) => row[key] === id);
      if (item) Object.assign(item, updates);
      return item;
    }

    function quickReviewPost(postId, status, comment) {
      const updates = {
        ReviewStatus: status,
        TeacherComment: comment,
        ApprovedBy: 'ครูผู้ดูแลโครงการ',
        ApprovedAt: nowStamp(),
      };
      sheetApi('updateCommunityPostReview', { pin: state.adminPIN, postId, status, comment }).then(() => {
        updateLocalById(state.data.communityPosts, 'PostID', postId, updates);
        saveToLocalStorage();
        renderAdmin();
      }).catch((error) => {
        updateLocalById(state.data.communityPosts, 'PostID', postId, updates);
        saveToLocalStorage();
        renderAdmin();
        alert('อัปเดตในเครื่องแล้ว แต่ยังบันทึกลง Google Sheets ไม่สำเร็จ: ' + error.message);
      });
    }

    function quickReviewComment(commentId, status, reportStatus) {
      const updates = { ReviewStatus: status, ReportStatus: reportStatus || '' };
      sheetApi('updatePostCommentReview', { pin: state.adminPIN, commentId, status, reportStatus }).then(() => {
        updateLocalById(state.data.postComments, 'CommentID', commentId, updates);
        saveToLocalStorage();
        renderAdmin();
      }).catch((error) => {
        updateLocalById(state.data.postComments, 'CommentID', commentId, updates);
        saveToLocalStorage();
        renderAdmin();
        alert('อัปเดตในเครื่องแล้ว แต่ยังบันทึกลง Google Sheets ไม่สำเร็จ: ' + error.message);
      });
    }

    function quickModerateMessage(messageId, moderationStatus, reportStatus, isPinned) {
      const updates = { ModerationStatus: moderationStatus, ReportStatus: reportStatus || '', IsPinned: !!isPinned };
      const message = (state.data.chatMessages || []).find((m) => m.MessageID === messageId);
      const roomId = message ? message.ChatRoomID : null;
      if (firebaseDb && roomId) {
        firebaseDb.ref(`chatMessages/${roomId}/${messageId}`).update(updates).then(() => {
          updateLocalById(state.data.chatMessages, 'MessageID', messageId, updates);
          saveToLocalStorage();
          renderAdmin();
        }).catch((error) => {
          alert('อัปเดตใน Firebase ไม่สำเร็จ: ' + error.message);
        });
      } else {
        sheetApi('updateChatMessageModeration', { pin: state.adminPIN, messageId, moderationStatus, reportStatus, isPinned: !!isPinned }).then(() => {
          updateLocalById(state.data.chatMessages, 'MessageID', messageId, updates);
          saveToLocalStorage();
          renderAdmin();
        }).catch((error) => {
          updateLocalById(state.data.chatMessages, 'MessageID', messageId, updates);
          saveToLocalStorage();
          renderAdmin();
          alert('อัปเดตในเครื่องแล้ว แต่ยังบันทึกลง Google Sheets ไม่สำเร็จ: ' + error.message);
        });
      }
    }

    function adminGameScoresHtml() {
      const scores = state.data.gameScores || [];
      const completed = scores.filter((s) => String(s.CertificateStatus || '').includes('พร้อม') || Number(s.Stage9Stars || 0) > 0);
      const avg = scores.length ? Math.round(sum(scores, 'TotalScore') / scores.length) : 0;
      const weakStage = weakestStage(scores);
      return `
        <div class="grid four">
          ${kpi('ผู้เล่นทั้งหมด', scores.length, 'คน')}
          ${kpi('คะแนนเฉลี่ย', avg, 'คะแนน')}
          ${kpi('ผ่านครบ 9 ด่าน', completed.length, 'คน')}
          ${kpi('ยังไม่ครบ', Math.max(0, scores.length - completed.length), 'คน')}
        </div>
        <div class="notice" style="margin:14px 0">ด่านที่ควรทบทวนมากที่สุด: ${weakStage}</div>
        <div class="btn-row" style="margin-bottom:12px">
          <button class="btn yellow" onclick="exportCsv('scores')">Export คะแนนเกม</button>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>ผู้เล่น</th><th>ห้อง</th><th>คะแนนรวม</th><th>ดาว</th><th>ระดับ</th><th>Badge</th><th>เกียรติบัตร</th></tr></thead>
            <tbody>${scores.sort((a, b) => Number(b.TotalScore || 0) - Number(a.TotalScore || 0)).map((s) => `
              <tr>
                <td>${s.FullName || ''}<br><small>${s.TeamName || ''}</small></td>
                <td>${s.ClassName || ''}</td>
                <td>${s.TotalScore || 0}</td>
                <td>${s.TotalStars || 0}</td>
                <td>${s.PlayerLevel || ''}</td>
                <td>${s.Badges || ''}</td>
                <td>${s.CertificateStatus || (Number(s.Stage9Stars || 0) > 0 ? 'พร้อมออกเกียรติบัตร' : 'ยังไม่ผ่านครบ 9 ด่าน')}</td>
              </tr>`).join('')}</tbody>
          </table>
        </div>`;
    }

    function weakestStage(scores) {
      if (!scores.length) return 'ยังไม่มีข้อมูลคะแนน';
      let min = { stage: 1, avg: Infinity };
      for (let i = 1; i <= 9; i += 1) {
        const avg = scores.reduce((total, row) => total + Number(row[`Stage${i}Score`] || 0), 0) / scores.length;
        if (avg < min.avg) min = { stage: i, avg };
      }
      const stage = gameStages[min.stage - 1];
      return `ด่าน ${min.stage}: ${stage ? stage.name : ''}`;
    }

    function attachAdminFilters() {
      ['adminMonth','adminClass','adminName','adminStatus'].forEach((id) => document.getElementById(id)?.addEventListener('input', () => {
        adminTableShowAll = false;
        renderAdminTable();
      }));
      renderAdminTable();
    }

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
      const visibleRows = adminTableShowAll ? rows : rows.slice(0, 50);
      const tableNote = rows.length > visibleRows.length
        ? `<div class="notice" style="margin-bottom:12px">แสดง ${visibleRows.length} จาก ${rows.length} รายการ เพื่อให้หน้า Admin เปิดเร็วขึ้น <button class="btn ghost small" type="button" onclick="showAllAdminRows()">แสดงทั้งหมด</button></div>`
        : `<div class="notice" style="margin-bottom:12px">พบ ${rows.length} รายการ</div>`;
      document.getElementById('adminTable').innerHTML = `${tableNote}<div class="table-wrap"><table><thead><tr><th>วันเวลาส่ง</th><th>นักเรียน</th><th>เดือน</th><th>ขยะ 4 ประเภท</th><th>คาร์บอน</th><th>หลักฐาน</th><th>สถานะ/หมายเหตุ</th><th>จัดการ</th></tr></thead><tbody>${visibleRows.map((r) => `
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

    function showAllAdminRows() {
      adminTableShowAll = true;
      renderAdminTable();
    }

    function reviewStatusOptions(current = '') {
      const options = ['รอตรวจสอบ','ผ่านการตรวจสอบ','ต้องแก้ไข','หลักฐานไม่ชัดเจน','ข้อมูลไม่ตรงกับหลักฐาน'];
      if (current && !options.includes(current)) options.push(current);
      return options;
    }

    function reviewStatusMatches(rowStatus, selectedStatus) {
      if (!selectedStatus) return true;
      if (selectedStatus === 'ข้อมูลไม่ตรงกับหลักฐาน') {
        return ['ข้อมูลไม่ตรงกับหลักฐาน','ข้อมูลกับหลักฐานไม่สอดคล้องกัน'].includes(rowStatus);
      }
      return rowStatus === selectedStatus;
    }

    function isProblemReviewStatus(status) {
      return ['ต้องแก้ไข','หลักฐานไม่ชัดเจน','ข้อมูลไม่ตรงกับหลักฐาน','ข้อมูลกับหลักฐานไม่สอดคล้องกัน'].includes(status);
    }

    function statusLabel(status) {
      const cls = status === 'ผ่านการตรวจสอบ' ? 'ok' : isProblemReviewStatus(status) ? 'bad' : '';
      return `<span class="status ${cls}">${status || 'รอตรวจสอบ'}</span>`;
    }

    function updateReview(row) {
      const status = document.getElementById(`status-${row}`).value;
      const comment = document.getElementById(`comment-${row}`).value;
      sheetApi('updateReview', { pin: state.adminPIN, row, status, comment }).then(() => {
        const item = state.data.wasteRecords.find((r) => r._rowNumber === row);
        if (item) Object.assign(item, {
          ReviewStatus: status,
          TeacherComment: comment,
          ReviewedBy: 'ครูผู้ดูแลโครงการ',
          ReviewedAt: new Date().toLocaleString('th-TH'),
        });
        saveToLocalStorage();
        renderAdminTable();
        alert(comment || (status === 'ผ่านการตรวจสอบ' ? 'ข้อมูลผ่านการตรวจสอบแล้ว ✅' : 'บันทึกผลตรวจแล้ว'));
      }).catch((e) => alert('บันทึกผลตรวจลง Google Sheets ไม่สำเร็จ: ' + e.message));
    }

    function quickReview(row, status, comment) {
      const statusEl = document.getElementById(`status-${row}`);
      const commentEl = document.getElementById(`comment-${row}`);
      if (statusEl) statusEl.value = status;
      if (commentEl) commentEl.value = comment;
      updateReview(row);
    }

    function copyLineReminder() {
      const text = lineReminderText();
      navigator.clipboard?.writeText(text);
      alert(text);
    }

    function exportCsv(type) {
      const reportNames = {
        records: 'รายงานรายเดือน',
        summary: 'รายงานรายครัวเรือน',
        scores: 'คะแนนเกม',
        impact: 'รายงานภาพรวมโครงการ',
        missions: 'ภารกิจรายเดือน',
        advice: 'กฎคำแนะนำ Green Buddy',
        starterKit: 'Starter Kit',
        carbon: 'รายงานลดก๊าซเรือนกระจก',
        complete: 'รายชื่อผู้ส่งข้อมูลครบ',
        missing: 'รายชื่อผู้ยังไม่ส่งข้อมูล',
        reviewed: 'รายงานหลักฐานที่ผ่านการตรวจสอบ',
        modelHomes: 'รายงานครัวเรือนต้นแบบ',
        infographic: 'ข้อมูลสำหรับทำ Infographic',
        contest: 'ข้อมูลสำหรับส่งประกวดนวัตกรรม',
      };
      Object.assign(reportNames, {
        communityPosts: 'โพสต์ชุมชน',
        postComments: 'ความคิดเห็นชุมชน',
        chatMessages: 'ข้อความ Green Chat',
        userProfiles: 'โปรไฟล์และ Level',
        levelRules: 'เกณฑ์ Level/EXP',
        expLogs: 'บันทึก EXP',
      });
      let rows = state.data.wasteRecords;
      if (type === 'summary') rows = state.data.householdSummary;
      if (type === 'scores') rows = state.data.gameScores;
      if (type === 'impact') rows = [impactSummary()];
      if (type === 'missions') rows = monthlyMissions.map(([MissionID, Month, MissionName, Objective, Task, EvidenceRequired, BadgeReward, Score, Status]) => ({ MissionID, Month, MissionName, Objective, Task, EvidenceRequired, BadgeReward, Score, Status }));
      if (type === 'advice') rows = adviceRules;
      if (type === 'starterKit') rows = starterKitItems.map((ItemName, i) => ({ KitID: `SK-${String(i + 1).padStart(2, '0')}`, ItemName, Status: 'เตรียมเพิ่มลิงก์ดาวน์โหลด' }));
      if (type === 'carbon') rows = state.data.wasteRecords.map((r) => ({
        StudentName: r.StudentName,
        ClassName: r.ClassName,
        HouseholdName: r.HouseholdName,
        ReportMonth: r.ReportMonth,
        GeneralWasteKg: r.GeneralWasteKg,
        RecycleWasteKg: r.RecycleWasteKg,
        OrganicWasteKg: r.OrganicWasteKg,
        HazardousWasteAmount: r.HazardousWasteAmount,
        TotalCO2e: r.TotalCO2e,
        ReviewStatus: r.ReviewStatus,
      }));
      if (type === 'complete') rows = state.data.householdSummary.filter((h) => Number(h.TotalSubmissions || 0) >= 3);
      if (type === 'missing') rows = state.data.householdSummary.filter((h) => Number(h.TotalSubmissions || 0) < 3);
      if (type === 'reviewed') rows = state.data.wasteRecords.filter((r) => r.ReviewStatus === 'ผ่านการตรวจสอบ');
      if (type === 'modelHomes') rows = state.data.householdSummary.filter((h) => String(h.ZeroWasteHomeStatus || '').includes('ผ่าน') || Number(h.TotalSubmissions || 0) >= 3);
      if (type === 'infographic') {
        const impact = impactSummary();
        rows = [
          ['ครัวเรือนที่เข้าร่วม', impact.households, 'ครัวเรือน'],
          ['รายการบันทึกทั้งหมด', impact.records, 'รายการ'],
          ['ผู้มีส่วนร่วมทั้งหมด', impact.participants, 'คน'],
          ['ขยะที่จัดการถูกวิธี', impact.managedWaste, 'kg'],
          ['ลดก๊าซเรือนกระจก', impact.co2e, 'kgCO₂e'],
          ['พฤติกรรมลดขยะต้นทาง', impact.reduceActions, 'ครั้ง'],
          ['Zero Waste Home', impact.zeroWasteHomes, 'ครัวเรือน'],
        ].map(([Metric, Value, Unit]) => ({ Metric, Value, Unit }));
      }
      if (type === 'contest') {
        rows = [{ ...impactSummary(), ExportedFor: 'ส่งประกวดนวัตกรรม', StudentRoleEvidence: studentRoleSteps.length, StarterKitItems: starterKitItems.length }];
      }
      if (type === 'communityPosts') rows = state.data.communityPosts || [];
      if (type === 'postComments') rows = state.data.postComments || [];
      if (type === 'chatMessages') rows = state.data.chatMessages || [];
      if (type === 'userProfiles') rows = allProfiles();
      if (type === 'levelRules') rows = state.data.levelRules || defaultLevelRules();
      if (type === 'expLogs') rows = state.data.expLogs || [];
      downloadCsv(rows, `green-passport-${type}.csv`);
      logExport(type, reportNames[type] || type, rows.length);
    }

    function downloadCsv(rows, filename) {
      const headers = Object.keys(rows[0] || {});
      const csv = [headers.join(','), ...rows.map((r) => headers.map((h) => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(','))].join('\n');
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }

    function logExport(reportType, reportName, rowCount) {
      if (!sheetApiConfigured()) return;
      sheetApi('logExportReport', {
        reportType,
        reportName,
        rowCount,
        exportedBy: state.adminPIN ? 'ครูผู้ดูแลโครงการ' : currentUserModeLabel(),
      }).catch(() => {});
    }
