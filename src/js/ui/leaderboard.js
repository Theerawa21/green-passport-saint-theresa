// --- Generated Module: leaderboard.js ---

// --- renderLeaderboard ---
function renderLeaderboard() {
      const topCarbon = [...state.data.householdSummary].sort((a, b) => b.TotalCO2e - a.TotalCO2e);
      const topGame = [...state.data.gameScores].sort((a, b) => b.TotalScore - a.TotalScore);
      document.getElementById('leaderboard').innerHTML = `
        <div class="grid two">
          <div class="panel"><h3>Leaderboard คาร์บอน</h3>${rankCards(topCarbon, 'carbon')}</div>
          <div class="panel"><h3>Leaderboard เกม</h3>${rankCards(topGame, 'game')}</div>
        </div>`;
    }

