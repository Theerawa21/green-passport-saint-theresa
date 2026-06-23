    function renderLeaderboard() {
      const topCarbon = [...state.data.householdSummary].sort((a, b) => b.TotalCO2e - a.TotalCO2e);
      
      document.getElementById('leaderboard').innerHTML = `
        <div class="panel" style="max-width: 800px; margin: 0 auto;">
          <h3 style="margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">🌍 Leaderboard คาร์บอนสะสม</h3>
          <p style="color: var(--text-muted); margin-bottom: 16px;">อันดับการลดการปล่อยก๊าซเรือนกระจก (คาร์บอนไดออกไซด์เทียบเท่า) สะสมของแต่ละครัวเรือน</p>
          <div style="margin-top: 16px;">
            ${topCarbon.length ? rankCards(topCarbon, 'carbon') : '<p style="text-align: center; color: var(--text-muted); padding: 20px 0;">ยังไม่มีข้อมูลคาร์บอนสะสม</p>'}
          </div>
        </div>`;
    }

    function rankCards(rows, type) {
      const medal = ['🏆', '🥈', '🥉'];
      return rows.map((r, i) => `
        <div class="card" style="margin-bottom: 10px;">
          <div class="btn-row" style="justify-content: space-between; align-items: center;">
            <strong>${medal[i] || '⭐'} อันดับ ${i + 1}: ${r.HouseholdName}</strong>
            <span class="badge earned">${format(r.TotalCO2e)} kgCO₂e 🌍</span>
          </div>
          <p style="margin-top: 4px; font-size: 14px; color: var(--text-muted);">${r.ClassName || ''} ส่งข้อมูล ${r.TotalSubmissions} ครั้ง 🍃</p>
        </div>`).join('');
    }
