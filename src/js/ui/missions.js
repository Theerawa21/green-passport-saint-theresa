// --- Generated Module: missions.js ---

// --- renderMonthlyMissions ---
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

