// --- Generated Module: certificate.js ---

// --- renderCertificate ---
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

