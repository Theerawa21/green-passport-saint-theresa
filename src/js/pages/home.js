    function renderHome() {
      document.getElementById('home').innerHTML = `
        <div class="hero">
          <div>
            <h2>Green Passport</h2>
            <p>Green Passport เชื่อมโยงการเรียนรู้จากโรงเรียนสู่บ้าน ผ่านการจัดการทรัพยากร 3 ด้าน ได้แก่ ขยะ พลังงานไฟฟ้า และน้ำ เพื่อบันทึกการใช้จริง เปลี่ยนพฤติกรรม และติดตามผลการลดการใช้ทรัพยากรอย่างรับผิดชอบ</p>
            <div class="btn-row">
              <button class="btn" onclick="showPage('record')">${icons.edit}เริ่มบันทึกข้อมูล</button>
              <button class="btn secondary" onclick="showPage('impact')">${icons.impact}ดูผลกระทบของเรา</button>
            </div>
            <div class="mode-strip">
              ${userModes.map(([key, title, emoji, text]) => `<button class="mode-card ${key === state.userMode ? 'active' : ''} ${key === 'parent' ? 'parent' : key === 'teacher' ? 'teacher' : key === 'leader' ? 'leader' : ''}" type="button" onclick="setUserMode('${key}')"><h3>${emoji} ${title}</h3><p>${text}</p></button>`).join('')}
            </div>
            <div class="notice">โหมดปัจจุบัน: ${currentUserModeLabel()} | เลือกบทบาทเพื่อดูเมนูแนะนำที่เหมาะกับผู้ใช้งานแต่ละกลุ่ม</div>
          </div>
          <div class="hero-visual">
            <span><img src="./assets/images/school-logo.webp" alt="Green Passport St. Theresa Zero Waste"></span>
            <div class="school-emblem-badge"><img src="./assets/images/inline-image-2.webp" alt="ตราโรงเรียนเซนต์เทเรซา"></div>
          </div>
        </div>
        <div class="quick-menu">
          ${mainNavPages().filter(([id]) => !['home','admin'].includes(id)).map(([id, label, icon]) => `
            <button class="menu-card" onclick="showPage('${id}')">
              ${icons[icon]}<strong>${label}</strong><small>${menuHelp(id)}</small>
            </button>`).join('')}
        </div>`;
    }

    function menuHelp(id) {
      return {
        record: 'กรอกขยะ หลักฐาน และคำนวณ kgCO₂e',
        electricity: 'บันทึก kWh และค่าไฟ เปรียบเทียบรายเดือน',
        water: 'บันทึก m³ และค่าน้ำ เปรียบเทียบรายเดือน',
        guide: 'อ่านวิธีแยกขยะ 3Rs และขยะอันตราย',
        game: 'เล่นด่านความรู้ สะสมดาวและ Badge',
        leaderboard: 'ดูอันดับครัวเรือนลดคาร์บอนสะสม',
        community: 'แชร์ประสบการณ์ลดขยะและให้กำลังใจเพื่อน',
        friends: 'เห็นเพื่อนในระบบแบบปลอดภัย',
        chat: 'พูดคุยเรื่อง Zero Waste ภายใต้กติกาโรงเรียน',
        profile: 'ดู Level, EXP, Badge และความก้าวหน้าของฉัน',
        impact: 'ผลลัพธ์รวมสำหรับนำเสนอกรรมการ',
        dashboard: 'กราฟและตัวเลขภาพรวมโครงการ',
        missions: 'ภารกิจต่อเนื่องแบบรายเดือน',
        reminders: 'Green Buddy ช่วยเตือนงานที่ต้องทำ',
        studentRoles: 'บทบาทนักเรียนเจ้าของนวัตกรรม',
        starterKit: 'ชุดขยายผลสำหรับโรงเรียนอื่น',
        admin: 'ตรวจหลักฐาน ส่งออกข้อมูล และตั้งค่า',
      }[id] || 'เปิดใช้งานเมนูนี้';
    }

    function currentUserModeLabel() {
      const mode = userModes.find(([key]) => key === state.userMode);
      return mode ? `${mode[2]} ${mode[1]}` : 'นักเรียน';
    }

    function setUserMode(mode) {
      state.userMode = mode;
      localStorage.setItem('greenPassportUserMode', mode);
      renderAll();
    }
