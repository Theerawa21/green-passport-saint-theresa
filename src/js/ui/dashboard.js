// --- Generated Module: dashboard.js ---

// --- renderDashboard ---
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

