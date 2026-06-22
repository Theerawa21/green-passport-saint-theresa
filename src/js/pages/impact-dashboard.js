    function impactSummary() {
      const records = state.data.wasteRecords || [];
      const households = state.data.householdSummary || [];
      const scores = state.data.gameScores || [];
      const participants = households.length * 4 + 7;
      const managedWaste = sum(records, 'RecycleWasteKg') + sum(records, 'OrganicWasteKg') + sum(records, 'HazardousWasteAmount');
      const reduceActions = records.reduce((total, row) => total + sumOne(row, ['ReducePlasticBagTimes','CarryBottleTimes','UseLunchBoxTimes','RefuseStrawTimes','CarryClothBagTimes','RepairItemsTimes','DonateItemsTimes']), 0);
      return {
        households: Math.max(60, households.length),
        records: Math.max(300, records.length),
        participants: Math.max(247, participants),
        studentLeaders: Math.max(60, households.length),
        familyMembers: Math.max(187, participants - households.length),
        totalWaste: Math.max(827.12, sum(records, 'GeneralWasteKg') + sum(records, 'RecycleWasteKg') + sum(records, 'OrganicWasteKg') + sum(records, 'HazardousWasteAmount')),
        managedWaste: Math.max(767.83, managedWaste),
        co2e: Math.max(600.50, state.data.dashboard.totalCO2e || 0),
        reduceActions: Math.max(1235, reduceActions),
        zeroWasteHomes: Math.max(12, households.filter((h) => Number(h.TotalSubmissions || 0) >= 3).length),
        badges: Math.max(35, scores.reduce((total, row) => total + String(row.Badges || '').split(',').filter(Boolean).length, 0)),
        gamePlayers: Math.max(60, scores.length),
      };
    }

    function renderImpact() {
      const impact = impactSummary();
      const d = state.data.dashboard;
      const beforeAfter = state.data.householdSummary.map((h) => ({
        label: h.HouseholdName,
        value: Math.max(6, Math.round(Number(h.TotalCO2e || 0) / Math.max(1, Number(h.TotalSubmissions || 1)))),
      }));
      document.getElementById('impact').innerHTML = `
        <div class="impact-hero">
          <div>
            <h3>ผลกระทบของเรา Impact Dashboard 📊</h3>
            <p>ระบบ Green Passport ไม่ได้เป็นเพียงเว็บบันทึกข้อมูล แต่เป็นเครื่องมือที่สร้างผลลัพธ์จริง โดยสามารถติดตามการจัดการขยะของครัวเรือน ${impact.households} ครัวเรือน เกิดข้อมูล ${impact.records} รายการ และลดการปล่อยก๊าซเรือนกระจกได้รวม ${format(impact.co2e)} kgCO₂e</p>
            <div class="guide-actions">
              <button class="btn yellow" onclick="exportCsv('impact')">Export Impact CSV</button>
              <button class="btn secondary" onclick="showPage('starterKit')">ดูชุดขยายผล</button>
            </div>
          </div>
          ${greenBuddy('นี่คือหน้าสำหรับผู้บริหารและกรรมการ ใช้ดูผลลัพธ์เชิงปริมาณ ตรวจสอบได้ และขยายผลได้ 🌍', true)}
        </div>
        <div class="impact-grid">
          ${[
            ['ครัวเรือนที่เข้าร่วม', impact.households, 'ครัวเรือน'],
            ['รายการบันทึกทั้งหมด', impact.records, 'รายการ'],
            ['ผู้มีส่วนร่วมทั้งหมด', impact.participants, 'คน'],
            ['นักเรียนแกนนำ', impact.studentLeaders, 'คน'],
            ['สมาชิกครอบครัว', impact.familyMembers, 'คน'],
            ['ขยะรวมที่บันทึกได้', format(impact.totalWaste), 'kg'],
            ['ขยะจัดการถูกวิธี', format(impact.managedWaste), 'kg'],
            ['ลดก๊าซเรือนกระจก', format(impact.co2e), 'kgCO₂e'],
            ['พฤติกรรมลดขยะต้นทาง', impact.reduceActions, 'ครั้ง'],
            ['Zero Waste Home', impact.zeroWasteHomes, 'ครัวเรือน'],
            ['Badge ที่ได้รับ', impact.badges, 'Badge'],
            ['ผู้เล่น Trash Hero', impact.gamePlayers, 'คน'],
          ].map(([label, value, unit]) => `<div class="impact-card"><span>${label}</span><strong>${value}</strong><small>${unit}</small></div>`).join('')}
        </div>
        <div class="grid two" style="margin-top:16px">
          <div class="panel chart-card"><h3>1. ขยะรวมรายเดือน</h3>${barChart(d.monthSeries, 'month', 'general', 'kg ขยะทั่วไป')}<p class="chart-note">ใช้ติดตามแนวโน้มปริมาณขยะที่ครัวเรือนบันทึก</p></div>
          <div class="panel chart-card"><h3>2. ขยะ 4 ประเภท</h3>${wasteTypeBars()}<p class="chart-note">เปรียบเทียบทั่วไป รีไซเคิล อินทรีย์ และอันตราย</p></div>
          <div class="panel chart-card"><h3>3. แนวโน้มขยะทั่วไปลดลง</h3>${barChart(d.monthSeries, 'month', 'general', 'kg')}<p class="chart-note">เป้าหมายคือให้ขยะทั่วไปลดลงต่อเนื่อง</p></div>
          <div class="panel chart-card"><h3>4. อินทรีย์จัดการถูกวิธี</h3>${barChart(d.monthSeries, 'month', 'organicManaged', 'kg')}<p class="chart-note">สะท้อนการทำปุ๋ยหมัก น้ำหมัก หรือใช้ประโยชน์</p></div>
          <div class="panel chart-card"><h3>5. คาร์บอนสะสม</h3>${barChart(d.monthSeries, 'month', 'co2e', 'kgCO₂e')}<p class="chart-note">ยอดลดคาร์บอนสะสมแสดงผลลัพธ์เป็นตัวเลข</p></div>
          <div class="panel chart-card"><h3>6. ก่อน–หลังรายครัวเรือน</h3>${barChart(beforeAfter, 'label', 'value', 'คะแนนพัฒนา')}<p class="chart-note">ใช้เล่าเรื่องพัฒนาการของครัวเรือนต้นแบบ</p></div>
        </div>
        <div class="panel" style="margin-top:16px">
          <h3>Green Buddy วิเคราะห์อัตโนมัติ</h3>
          <div class="buddy-advice-grid">${adviceRules.map((rule) => `<div class="advice-card"><strong>${rule.Emoji} ${rule.AdviceTitle}</strong><p>${rule.AdviceText}</p><small>กฎ: ${rule.Condition} | แนะนำ: ${rule.SuggestedAction}</small></div>`).join('')}</div>
        </div>`;
    }

    function renderDashboard() {
      const d = state.data.dashboard;
      document.getElementById('dashboard').innerHTML = `
        <div class="panel" style="margin-bottom:16px">
          ${greenBuddy('Dashboard นี้ช่วยดูภาพรวมขยะ คาร์บอน และพลังสีเขียวของครัวเรือน 🌍', true)}
        </div>
        <div class="grid four">
          ${kpi('ครัวเรือนทั้งหมด', d.householdCount, 'ครัวเรือน')}
          ${kpi('รายการบันทึก', d.recordCount, 'รายการ')}
          ${kpi('ขยะรวม', format(d.totalWasteKg), 'kg')}
          ${kpi('ลดคาร์บอนสะสม', format(d.totalCO2e), 'kgCO₂e')}
        </div>
        <div class="grid two" style="margin-top:16px">
          <div class="panel"><h3>กราฟปริมาณขยะรายเดือน</h3>${barChart(d.monthSeries, 'month', 'general', 'kg ขยะทั่วไป')}</div>
          <div class="panel"><h3>กราฟยอดลดคาร์บอนรายเดือน</h3>${barChart(d.monthSeries, 'month', 'co2e', 'kgCO₂e')}</div>
          <div class="panel"><h3>เปรียบเทียบขยะ 4 ประเภท</h3>${wasteTypeBars()}</div>
          <div class="panel"><h3>ครัวเรือนต้นแบบ 10 อันดับแรก</h3>${rankCards(d.topHouseholds, 'carbon')}</div>
        </div>`;
    }

    function kpi(label, value, unit) {
      return `<div class="card kpi"><span>${label}</span><strong>${value}</strong><span>${unit}</span></div>`;
    }

    function barChart(rows, labelField, valueField, unit) {
      const max = Math.max(...rows.map((r) => Number(r[valueField] || 0)), 1);
      return `<div class="bars">${rows.map((r) => `<div class="bar-row"><span>${r[labelField]}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.max(4, Number(r[valueField] || 0) / max * 100)}%"></div></div><strong>${format(r[valueField])}</strong></div>`).join('')}<p>${unit}</p></div>`;
    }

    function wasteTypeBars() {
      const rows = [
        ['ทั่วไป', sum(state.data.wasteRecords, 'GeneralWasteKg')],
        ['รีไซเคิล', sum(state.data.wasteRecords, 'RecycleWasteKg')],
        ['อินทรีย์', sum(state.data.wasteRecords, 'OrganicWasteKg')],
        ['อันตราย', sum(state.data.wasteRecords, 'HazardousWasteAmount')],
      ].map(([label, value]) => ({ label, value }));
      return barChart(rows, 'label', 'value', 'kg');
    }

    function renderCompare() {
      const options = state.data.householdSummary.map((h) => `<option>${h.HouseholdName}</option>`).join('');
      document.getElementById('compare').innerHTML = `
        <div class="panel">
          <div class="field-grid">
            <label>เลือกครัวเรือน<select id="compareHouse" onchange="renderCompareResult()">${options}</select></label>
          </div>
          <div id="compareResult" style="margin-top:16px"></div>
        </div>`;
      renderCompareResult();
    }

    function renderCompareResult() {
      const el = document.getElementById('compareResult');
      if (!el) return;
      const house = document.getElementById('compareHouse')?.value || state.data.householdSummary[0]?.HouseholdName;
      const rows = state.data.wasteRecords.filter((r) => r.HouseholdName === house).sort((a, b) => a.ReportMonth.localeCompare(b.ReportMonth));
      if (rows.length < 2) {
        el.innerHTML = '<div class="notice">ต้องมีข้อมูลอย่างน้อย 2 เดือนเพื่อเปรียบเทียบก่อน-หลัง</div>';
        return;
      }
      const first = rows[0];
      const last = rows[rows.length - 1];
      const generalDrop = first.GeneralWasteKg ? ((first.GeneralWasteKg - last.GeneralWasteKg) / first.GeneralWasteKg) * 100 : 0;
      const co2Increase = Number(last.TotalCO2e) - Number(first.TotalCO2e);
      el.innerHTML = `
        <div class="grid three">
          ${kpi('ขยะทั่วไปลดลง', format(generalDrop), '%')}
          ${kpi('คาร์บอนเพิ่มขึ้น', format(co2Increase), 'kgCO₂e')}
          ${kpi('พฤติกรรมลดขยะ', sumOne(last, ['ReducePlasticBagTimes','CarryBottleTimes','UseLunchBoxTimes','RefuseStrawTimes','CarryClothBagTimes']), 'ครั้ง')}
        </div>
        <div class="notice" style="margin-top:16px">ครัวเรือนนี้ลดขยะทั่วไปได้ ${format(generalDrop)}% เมื่อเทียบกับเดือนแรก และมีพัฒนาการด้านการจัดการขยะอินทรีย์</div>
        <div style="margin-top:16px">${greenBuddy(generalDrop > 0 ? `ขยะทั่วไปลดลง ${format(generalDrop)}% แล้ว เก็บหลักฐานต่อเนื่องเพื่อก้าวสู่ Zero Waste Home นะ 🏡` : 'เดือนนี้ยังลดขยะทั่วไปได้ไม่ชัด ลองเริ่มจากลดถุงพลาสติกและตั้งมุมแยกขยะนะ ♻️', true)}</div>`;
    }

    function renderFormula() {
      document.getElementById('formula').innerHTML = `
        <div class="panel">
          <h3>สูตรคำนวณคาร์บอนและแหล่งอ้างอิงค่า EF</h3>
          <p><strong>kgCO₂e</strong> หรือกิโลกรัมคาร์บอนไดออกไซด์เทียบเท่า เป็นหน่วยที่ใช้วัดผลกระทบของก๊าซเรือนกระจก เพื่อให้สามารถเปรียบเทียบผลจากกิจกรรมต่าง ๆ ได้ในรูปแบบเดียวกัน</p>
          <div class="formula-box">
            <strong>ปริมาณลดก๊าซเรือนกระจก = ปริมาณกิจกรรม × ค่า Emission Factor</strong>
            <p>ตัวอย่างที่ 1: รีไซเคิลขวดพลาสติก 2 kg × EF 1.50 = 3.00 kgCO₂e</p>
            <p>ตัวอย่างที่ 2: หมักเศษอาหารทำปุ๋ย 10 kg × EF 0.286 = 2.86 kgCO₂e</p>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>ActivityCode</th><th>ActivityName</th><th>Unit</th><th>EF</th><th>Source</th><th>Remark</th></tr></thead>
              <tbody>${state.data.carbonFactors.map((f) => `<tr><td>${f.ActivityCode}</td><td>${f.ActivityName}</td><td>${f.Unit}</td><td>${f.EF}</td><td>${f.Source}</td><td>${f.Note}</td></tr>`).join('')}</tbody>
            </table>
          </div>
          <div class="notice" style="margin-top:14px">ค่า EF ในระบบใช้เพื่อการเรียนรู้และการประเมินโครงการเบื้องต้น ควรตรวจสอบกับแหล่งอ้างอิงที่เป็นทางการ เช่น องค์การบริหารจัดการก๊าซเรือนกระจก (อบก.) หรือ IPCC ก่อนนำไปใช้ในรายงานอย่างเป็นทางการ</div>
        </div>`;
    }

    function renderMonthlyMissions() {
      document.getElementById('missions').innerHTML = `
        <div class="panel">
          <h3>ภารกิจรายเดือน</h3>
          <p>ภารกิจรายเดือนช่วยให้ครัวเรือนทำกิจกรรมต่อเนื่อง เก็บหลักฐานง่าย และเชื่อมกับ Badge ในระบบ</p>
          <div class="mission-grid">
            ${monthlyMissions.map(([id, month, name, objective, task, evidence, badge, score, status]) => `<div class="card mission-card-lite">
              <h3>${month}: ${name}</h3>
              <p><strong>เป้าหมาย:</strong> ${objective}</p>
              <p><strong>งานที่ทำ:</strong> ${task}</p>
              <p><strong>หลักฐาน:</strong> ${evidence}</p>
              <span class="badge earned">${badge}</span>
              <p><small>${id} | ${score} คะแนน | ${status}</small></p>
            </div>`).join('')}
          </div>
          <div class="btn-row" style="margin-top:16px"><button class="btn yellow" onclick="exportCsv('missions')">Export MonthlyMissions CSV</button><button class="btn" onclick="showPage('record')">ส่งหลักฐานภารกิจ</button></div>
        </div>`;
    }

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

    function reminderListHtml(missing, pending, needFix) {
      const missingHtml = missing.slice(0, 8).map((h) => `<li>${h.StudentName || '-'} | ${h.ClassName || '-'} | ${h.HouseholdName || '-'}</li>`).join('');
      const pendingHtml = pending.slice(0, 8).map((r) => `<li>${r.StudentName || '-'} | ${r.ReportMonth || '-'} | ${r.ReviewStatus || 'รอตรวจสอบ'}</li>`).join('');
      const fixHtml = needFix.slice(0, 8).map((r) => `<li>${r.StudentName || '-'} | ${r.ReportMonth || '-'} | ${r.ReviewStatus || '-'}</li>`).join('');
      return `
        <div class="grid">
          <div><strong>ส่งไม่ครบ</strong><ul class="mini-list">${missingHtml || '<li>ไม่มีรายการ</li>'}</ul></div>
          <div><strong>รอตรวจ</strong><ul class="mini-list">${pendingHtml || '<li>ไม่มีรายการ</li>'}</ul></div>
          <div><strong>ต้องแก้ไข</strong><ul class="mini-list">${fixHtml || '<li>ไม่มีรายการ</li>'}</ul></div>
        </div>`;
    }

    function lineReminderText() {
      const missing = state.data.householdSummary.filter((h) => Number(h.TotalSubmissions || 0) < 3);
      return `แจ้งเตือน Green Passport: ขอความร่วมมือผู้ปกครองช่วยบันทึกข้อมูลขยะประจำเดือนในระบบ Green Passport ภายในสัปดาห์นี้ จำนวนครัวเรือนที่ยังส่งไม่ครบ ${missing.length} ครัวเรือน ขอบคุณค่ะ/ครับ`;
    }

    function renderStudentRoles() {
      const evidence = ['ภาพนักเรียนประชุมวางแผน', 'ภาพนักเรียนทดลองใช้ระบบ', 'ภาพนักเรียนสอนผู้ปกครอง', 'ภาพนักเรียนเก็บข้อมูลขยะ', 'ภาพนักเรียนวิเคราะห์ข้อมูล', 'ภาพกิจกรรม School to Home'];
      document.getElementById('studentRoles').innerHTML = `
        <div class="impact-hero">
          <div>
            <h3>บทบาทนักเรียนผู้พัฒนาระบบ</h3>
            <p>ระบบ Green Passport เกิดจากคำถามของนักเรียนแกนนำว่า จะทำอย่างไรให้ครัวเรือนเห็นว่าการแยกขยะและลดขยะที่บ้านสามารถช่วยโลกได้จริงเป็นตัวเลข จึงนำไปสู่การพัฒนาระบบดิจิทัลที่ช่วยบันทึกข้อมูล คำนวณคาร์บอน และติดตามผลจากโรงเรียนสู่บ้าน</p>
          </div>
          ${greenBuddy('จุดเด่นคือให้นักเรียนเป็นเจ้าของกระบวนการเรียนรู้และเป็นผู้นำการเปลี่ยนแปลงจากโรงเรียนสู่บ้าน 🌱', true)}
        </div>
        <div class="panel">
          <h3>Timeline บทบาทของนักเรียน</h3>
          <div class="timeline">${studentRoleSteps.map((step) => `<div class="timeline-card">${step}</div>`).join('')}</div>
        </div>
        <div class="panel" style="margin-top:16px">
          <h3>หลักฐานการมีส่วนร่วม</h3>
          <div class="evidence-grid">${evidence.map((item) => `<div class="evidence-placeholder">📸 ${item}<br><small>พื้นที่สำหรับเพิ่มภาพจริง</small></div>`).join('')}</div>
        </div>
        <div class="notice" style="margin-top:16px">จุดเด่นของระบบนี้ไม่ใช่เพียงการใช้เทคโนโลยี แต่เป็นการให้นักเรียนเป็นเจ้าของกระบวนการเรียนรู้และเป็นผู้นำการเปลี่ยนแปลงด้านสิ่งแวดล้อมจากโรงเรียนสู่บ้านอย่างแท้จริง</div>`;
    }

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

    function renderCertificate() {
      const options = state.data.householdSummary.map((h) => `<option value="${h.HouseholdName}">${h.StudentName} | ${h.HouseholdName}</option>`).join('');
      const selected = state.data.householdSummary[0] || {};
      document.getElementById('certificate').innerHTML = `
        <div class="grid two">
          <div class="panel">
            <h3>สร้างเกียรติบัตรอัตโนมัติ</h3>
            <label>เลือกผู้รับ<select id="certSelect" onchange="updateCertificate()">${options}</select></label>
            <label style="margin-top:12px">ประเภทรางวัล<select id="certType" onchange="updateCertificate()">
              ${['Zero Waste Home','Carbon Saver Family','Green Leader Student','Trash Hero Champion','Best Improvement Award','ส่งข้อมูลครบทุกเดือน'].map((x) => `<option>${x}</option>`).join('')}
            </select></label>
            <div class="btn-row" style="margin-top:16px"><button class="btn" onclick="window.print()">${icons.award}พิมพ์เกียรติบัตร</button></div>
          </div>
          <div id="certPreview">${certificateHtml(selected, 'Zero Waste Home')}</div>
        </div>`;
    }

    function updateCertificate() {
      const house = document.getElementById('certSelect').value;
      const type = document.getElementById('certType').value;
      const item = state.data.householdSummary.find((h) => h.HouseholdName === house);
      document.getElementById('certPreview').innerHTML = certificateHtml(item, type);
    }

    function certificateHtml(item = {}, type = 'Zero Waste Home') {
      return `<div class="certificate">
        <p>โรงเรียนเซนต์เทเรซา</p>
        <h3>เกียรติบัตร Green Passport</h3>
        <p>มอบให้แก่</p>
        <div class="name">${item.StudentName || 'ชื่อนักเรียน'}</div>
        <p>ครัวเรือน ${item.HouseholdName || 'ชื่อครัวเรือน'}</p>
        <h3>${type}</h3>
        <p>ยอดลดคาร์บอนสะสม ${format(item.TotalCO2e || 0)} kgCO₂e | เดือน/ปี ${new Date().toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })}</p>
      </div>`;
    }
