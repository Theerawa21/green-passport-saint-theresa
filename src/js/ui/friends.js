// --- Generated Module: friends.js ---

// --- friendCardHtml ---
function friendCardHtml(profile) {
      const id = profile.UserID || profile.DisplayName;
      const arg = escapeAttr(jsString(id));
      const search = [profile.DisplayName, profile.ClassName, profile.LevelName, profile.CurrentLevel].join(' ').toLowerCase();
      return `
        <div class="card friend-card" data-search="${escapeAttr(search)}">
          <div class="btn-row">
            <div class="avatar">${escapeHtml(profile.Avatar || avatarText(profile.DisplayName))}</div>
            <div>
              <strong>${escapeHtml(safeDisplayName(profile.DisplayName))}</strong>
              <p>${escapeHtml(profile.ClassName || '')} · ${escapeHtml(profile.CurrentLevel || '')}</p>
            </div>
          </div>
          <div class="progress-track" style="margin:12px 0"><div class="progress-fill" style="width:${progressToNextLevel(profile.CurrentEXP)}%"></div></div>
          <div class="grid two">
            ${kpi('EXP', Number(profile.CurrentEXP || 0), '')}
            ${kpi('Badge', Number(profile.TotalBadges || 0), 'ชิ้น')}
          </div>
          <p>${escapeHtml(profile.HouseholdStatus || 'กำลังพัฒนาพฤติกรรมลดขยะ')}</p>
          <div class="btn-row">
            <button class="btn ghost" onclick="openProfile(${arg})">ดูโปรไฟล์</button>
            <button class="btn secondary" onclick="openGreenChat()">ชวนคุยใน Green Chat</button>
          </div>
        </div>`;
    }

// --- renderFriends ---
function renderFriends() {
      const profiles = allProfiles();
      document.getElementById('friends').innerHTML = `
        <div class="panel">
          <h3>เพื่อน Green Passport</h3>
          <p>แสดงรายชื่อแบบปลอดภัย เห็นเฉพาะชื่อที่ย่อแล้ว ระดับ EXP และผลงานด้านสิ่งแวดล้อม เพื่อชวนกันทำภารกิจต่อโดยไม่เปิดเผยข้อมูลส่วนตัว</p>
          <input class="profile-picker" id="friendSearch" type="search" placeholder="ค้นหาชื่อ ชั้น หรือ Level" oninput="filterFriends()">
        </div>
        <div class="grid three" style="margin-top:16px">
          ${profiles.map(friendCardHtml).join('') || '<div class="notice">ยังไม่มีข้อมูลเพื่อนในระบบ</div>'}
        </div>`;
    }

