    function renderLeaderboard() {
      const topCarbon = [...state.data.householdSummary].sort((a, b) => b.TotalCO2e - a.TotalCO2e);
      const topGame = [...state.data.gameScores].sort((a, b) => b.TotalScore - a.TotalScore);
      document.getElementById('leaderboard').innerHTML = `
        <div class="grid two">
          <div class="panel"><h3>Leaderboard คาร์บอน</h3>${rankCards(topCarbon, 'carbon')}</div>
          <div class="panel"><h3>Leaderboard เกม</h3>${rankCards(topGame, 'game')}</div>
        </div>`;
    }

    function rankCards(rows, type) {
      const medal = ['🏆', '🥈', '🥉'];
      return rows.map((r, i) => `<div class="card" style="margin-bottom:10px">
        <div class="btn-row" style="justify-content:space-between">
          <strong>${medal[i] || '⭐'} อันดับ ${i + 1}: ${type === 'carbon' ? r.HouseholdName : r.FullName}</strong>
          <span class="badge earned">${type === 'carbon' ? format(r.TotalCO2e) + ' kgCO₂e 🌍' : r.TotalScore + ' คะแนน'}</span>
        </div>
        <p>${r.ClassName || ''} ${type === 'carbon' ? `ส่ง ${r.TotalSubmissions} ครั้ง 🍃` : `${starText(r.TotalStars)} | ${r.PlayerLevel}`}</p>
      </div>`).join('');
    }
