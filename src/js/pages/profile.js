    function renderProfile() {
      const profiles = allProfiles();
      if (!profiles.length) {
        document.getElementById('profile').innerHTML = '<div class="panel"><h3>โปรไฟล์ของฉัน</h3><div class="notice">ยังไม่มีข้อมูลโปรไฟล์ เริ่มจากบันทึกข้อมูลขยะหรือเล่นเกมก่อน</div></div>';
        return;
      }
      if (!profiles.some((profile) => (profile.UserID || profile.DisplayName) === state.profileUserID)) {
        state.profileUserID = profiles[0].UserID || profiles[0].DisplayName;
      }
      const profile = profiles.find((item) => (item.UserID || item.DisplayName) === state.profileUserID) || profiles[0];
      const current = levelInfoByEXP(profile.CurrentEXP);
      const next = nextLevelInfo(profile.CurrentEXP);
      const posts = (state.data.communityPosts || []).filter((post) => (post.UserID === profile.UserID || post.DisplayName === profile.DisplayName) && statusIsPublished(post.ReviewStatus));
      document.getElementById('profile').innerHTML = `
        <div class="panel">
          <label class="profile-picker">เลือกโปรไฟล์<select onchange="openProfile(this.value)">${profiles.map((item) => {
            const id = item.UserID || item.DisplayName;
            return `<option value="${escapeAttr(id)}" ${id === state.profileUserID ? 'selected' : ''}>${escapeHtml(safeDisplayName(item.DisplayName))} · ${escapeHtml(item.LevelName || '')}</option>`;
          }).join('')}</select></label>
        </div>
        <div class="profile-banner" style="margin-top:16px">
          <div class="btn-row" style="justify-content:space-between">
            <div class="btn-row">
              <div class="avatar" style="width:64px;height:64px">${escapeHtml(profile.Avatar || avatarText(profile.DisplayName))}</div>
              <div>
                <h3>${escapeHtml(safeDisplayName(profile.DisplayName))}</h3>
                <p>${escapeHtml(profile.ClassName || '')} · ${current.emoji} ${escapeHtml(current.name)}</p>
              </div>
            </div>
            <span class="badge earned">${Number(profile.CurrentEXP || 0)} EXP</span>
          </div>
          <div class="progress-track" style="margin-top:16px"><div class="progress-fill" style="width:${progressToNextLevel(profile.CurrentEXP)}%"></div></div>
          <p style="margin-top:8px">${current.name === next.name ? 'ถึงระดับสูงสุดแล้ว' : `อีก ${Math.max(0, Number(next.min || 0) - Number(profile.CurrentEXP || 0))} EXP ถึง ${next.emoji} ${next.name}`}</p>
        </div>
        <div class="grid four" style="margin-top:16px">
          ${kpi('EXP', Number(profile.CurrentEXP || 0), '')}
          ${kpi('คะแนนเกม', Number(profile.TotalScore || 0), 'คะแนน')}
          ${kpi('Badge', Number(profile.TotalBadges || 0), 'ชิ้น')}
          ${kpi('โพสต์', Number(profile.TotalPosts || posts.length || 0), 'โพสต์')}
        </div>
        <div class="grid two" style="margin-top:16px">
          <div class="panel">
            <h3>เส้นทาง Level</h3>
            <div class="level-row">${levelCatalog.map((level) => `<div class="level-chip ${level.name === current.name ? 'active' : ''}"><div class="emoji">${level.emoji}</div><strong>${level.name}</strong><span>${level.min}+ EXP</span></div>`).join('')}</div>
          </div>
          <div class="panel">
            <h3>ผลงานของฉัน</h3>
            <p>${escapeHtml(profile.HouseholdStatus || 'กำลังสะสมผลงานลดขยะในครัวเรือน')}</p>
            <div class="grid two">
              ${kpi('ส่งข้อมูล', Number(profile.TotalSubmissions || 0), 'ครั้ง')}
              ${kpi('ลดคาร์บอน', format(profile.TotalCO2e || 0), 'kgCO₂e')}
            </div>
            <div class="tag-row" style="margin-top:12px">${posts.slice(0, 6).map((post) => `<span class="tag">${escapeHtml(post.PostTitle)}</span>`).join('') || '<span class="tag">เริ่มแชร์ประสบการณ์ได้ที่หน้าชุมชน</span>'}</div>
          </div>
        </div>`;
    }
