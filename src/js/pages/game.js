function createInitialGameState() {
      return {
        screen: 'start',
        profile: { firstName: '', lastName: '', className: '', studentId: '', teamName: 'Green Team' },
        currentStage: 0,
        currentItem: 0,
        correctCount: 0,
        soundOn: false,
        feedback: null,
        stageResults: gameStages.map((stage) => ({
          stageId: stage.id,
          name: stage.name,
          score: 0,
          stars: 0,
          completed: false,
          badge: '',
        })),
        latestResult: null,
        saved: false,
      };
    }

    function hydrateGameFromScores() {
      if (typeof currentUserIdentity !== 'function') return;
      const user = currentUserIdentity();
      const userScores = (state.data.gameScores || []).filter((s) => {
        const studentIdMatch = s.StudentID && String(s.StudentID).trim() === String(user.StudentID).trim();
        const fullName = `${state.currentUser?.FirstName || ''} ${state.currentUser?.LastName || ''}`.trim();
        const nameMatch = s.FullName && String(s.FullName).trim().toLowerCase() === fullName.toLowerCase();
        return studentIdMatch || nameMatch;
      });

      if (!userScores.length) return;
      
      // Sort to get the highest total score
      userScores.sort((a, b) => Number(b.TotalScore || 0) - Number(a.TotalScore || 0));
      const savedScore = userScores[0];
      
      // Fill profile if currently empty
      if (!state.game.profile.studentId && !state.game.profile.firstName) {
        state.game.profile = {
          firstName: savedScore.FirstName || state.currentUser?.FirstName || '',
          lastName: savedScore.LastName || state.currentUser?.LastName || '',
          className: savedScore.ClassName || user.ClassName || '',
          studentId: savedScore.StudentID || user.StudentID || '',
          teamName: savedScore.TeamName || state.currentUser?.DisplayName || 'Green Team',
        };
      }
      
      // Populate stage results
      gameStages.forEach((stage, index) => {
        const scoreKey = `Stage${index + 1}Score`;
        const starsKey = `Stage${index + 1}Stars`;
        const score = Number(savedScore[scoreKey] || 0);
        const stars = Number(savedScore[starsKey] || 0);
        
        if (score > 0 && score > state.game.stageResults[index].score) {
          state.game.stageResults[index] = {
            stageId: stage.id,
            name: stage.name,
            score,
            stars,
            completed: true,
            badge: stage.badge || '',
          };
        }
      });
    }

    function renderGame() {
      try {
        hydrateGameFromScores();
      } catch (e) {
        console.warn("Failed to hydrate game from scores:", e);
      }
      const view = {
        start: renderGameStart,
        profile: renderGameProfile,
        map: renderMissionMap,
        play: renderStagePlay,
        summary: renderStageSummary,
        certificate: renderGameCertificate,
        leaderboard: renderGameLeaderboard,
      }[state.game.screen] || renderGameStart;
      document.getElementById('game').innerHTML = view();
    }

    function renderGameStart() {
      return `
        <div class="game-hero">
          <div>
            <h3>🌱 Trash Hero Academy</h3>
            <p>เรียนรู้ แยกขยะ ลดคาร์บอน สู่การเป็นฮีโร่พิทักษ์โลกจากโรงเรียนสู่บ้าน 🏡</p>
            <p class="notice">สวัสดีฮีโร่ตัวน้อย! วันนี้เรามาช่วยโลกด้วยการแยกขยะกันเถอะ 🌱</p>
            <div class="btn-row" style="margin-top:16px">
              <button class="btn" onclick="goGameScreen('profile'); playGameSound('button')">🌱 เริ่มภารกิจ</button>
              <button class="btn ghost" onclick="goGameScreen('map'); playGameSound('button')">🗺️ ดูแผนที่เกม</button>
            </div>
            ${soundToggleButton()}
          </div>
          <div class="hero-badge-art">${greenBuddy('ฉันคือน้องใบไม้ Green Buddy จะช่วยแนะนำทุกด่านให้สนุกและแยกขยะได้ถูกถัง 💚')}</div>
        </div>
        ${renderWasteIcons()}
        ${renderKnowledgeCards()}
        <div class="grid three" style="margin-top:16px">
          <div class="card"><h3>🗺️ 9 ด่านภารกิจ</h3><p>แยกขยะ 3Rs คาร์บอน ภารกิจที่บ้าน และบททดสอบสุดท้าย</p></div>
          <div class="card"><h3>⭐ คะแนน ดาว Badge</h3><p>ผ่านด่านเพื่อสะสมดาวและปลดล็อกตำแหน่งฮีโร่</p></div>
          <div class="card"><h3>🏡 School to Home</h3><p>นำความรู้ไปใช้จริงที่บ้านและบันทึกผลใน Green Passport</p></div>
        </div>`;
    }

    function renderGameProfile() {
      const user = typeof currentUserIdentity === 'function' ? currentUserIdentity() : {};
      const p = {
        firstName: state.game.profile.firstName || state.currentUser?.FirstName || '',
        lastName: state.game.profile.lastName || state.currentUser?.LastName || '',
        className: state.game.profile.className || user.ClassName || '',
        studentId: state.game.profile.studentId || user.StudentID || '',
        teamName: state.game.profile.teamName || state.currentUser?.DisplayName || 'Green Team',
      };
      const total = gameTotals();
      return `
        <form class="panel" id="gameProfileForm" onsubmit="saveGameProfile(event)">
          <h3>🌱 โปรไฟล์ผู้เล่น</h3>
          ${greenBuddy('กรอกชื่อทีมของเธอ แล้วเราไปเปิดแผนที่ภารกิจด้วยกันนะ 💚', true)}
          <div class="field-grid">
            <label>ชื่อ<input name="firstName" required value="${escapeAttr(p.firstName)}"></label>
            <label>นามสกุล<input name="lastName" required value="${escapeAttr(p.lastName)}"></label>
            <label>ระดับชั้น/ห้อง<input name="className" required value="${escapeAttr(p.className)}"></label>
            <label>เลขที่หรือรหัสนักเรียน<input name="studentId" required value="${escapeAttr(p.studentId)}"></label>
            <label>ชื่อทีม/ชื่อเล่นในเกม<input name="teamName" value="${escapeAttr(p.teamName || 'Green Team')}"></label>
          </div>
          <div class="btn-row" style="margin-top:16px">
            <button class="btn" type="submit">เข้าสู่แผนที่ภารกิจ</button>
            <button class="btn ghost" type="button" onclick="goGameScreen('start')">กลับหน้าเริ่มเกม</button>
          </div>
          ${renderLevelRow(total.score)}
        </form>`;
    }

    function renderMissionMap() {
      const g = state.game;
      const total = gameTotals();
      const level = playerLevelInfo(total.score);
      return `
        <div class="grid two game-map-head">
          <div class="panel">
            <h3>🗺️ แผนที่ภารกิจ</h3>
            <p>ผ่านด่านก่อนหน้าเพื่อปลดล็อกด่านถัดไป ด่านที่ผ่านแล้วสามารถเล่นซ้ำเพื่อฝึกได้</p>
            ${greenBuddy('เดินตามเส้นทาง 9 ด่าน เก็บดาว และนำความรู้กลับไปใช้ที่บ้านนะ 🏡', true)}
          </div>
          <div class="panel">
            <h3>🏆 สรุปผู้เล่น</h3>
            <div class="score-strip">
              <div class="card kpi"><span>คะแนนรวม</span><strong>${total.score}</strong></div>
              <div class="card kpi"><span>ดาวรวม</span><strong>${total.stars}</strong></div>
              <div class="card kpi"><span>ระดับ</span><strong style="font-size:20px">${level.emoji} ${level.name}</strong></div>
            </div>
            <div class="level-chip active" style="margin-top:12px">
              <div class="emoji">${level.emoji}</div>
              <strong>${level.name}</strong>
              <span>${level.text}</span>
            </div>
            ${soundToggleButton()}
          </div>
        </div>
        <div class="mission-map" style="margin-top:16px">
          ${gameStages.map((stage, index) => missionCard(stage, index)).join('')}
        </div>
        <div class="btn-row" style="margin-top:16px">
          <button class="btn ghost" onclick="goGameScreen('profile')">แก้ไขโปรไฟล์</button>
          <button class="btn secondary" onclick="goGameScreen('leaderboard'); playGameSound('button')">ดู Leaderboard</button>
          ${allStagesComplete() ? `<button class="btn yellow" onclick="goGameScreen('certificate')">ออกเกียรติบัตร</button>` : ''}
        </div>`;
    }

    function missionCard(stage, index) {
      const result = state.game.stageResults[index];
      const unlocked = index === 0 || state.game.stageResults[index - 1].completed;
      const active = index === state.game.currentStage && !result.completed;
      const status = result.completed ? 'ผ่านแล้ว' : unlocked ? 'พร้อมเล่น' : 'ล็อก';
      const visual = stageVisual(stage);
      return `
        <button class="mission-card ${stage.type} ${result.completed ? 'completed' : ''} ${active ? 'active-stage' : ''}" ${unlocked ? '' : 'disabled'} onclick="startStage(${index})">
          <div class="mission-icon">${result.completed ? '✅' : visual.icon}</div>
          <strong>ด่าน ${stage.id}: ${stage.name}</strong>
          <span>${stage.thaiName}</span>
          <small>${visual.label} | ${status} | ${result.score} คะแนน</small>
          <span class="mission-stars">${starText(result.stars)}</span>
          ${result.badge ? `<span class="badge earned">${result.badge}</span>` : ''}
        </button>`;
    }

    function renderStagePlay() {
      const g = state.game;
      const stage = gameStages[g.currentStage];
      const item = stage.items[g.currentItem];
      const answeredOffset = g.feedback ? 1 : 0;
      const progress = ((g.currentItem + answeredOffset) / stage.items.length) * 100;
      const remaining = Math.max(0, stage.items.length - g.currentItem - answeredOffset);
      const visual = stageVisual(stage);
      return `
        <div class="grid two">
          <div class="panel">
            <h3>${visual.emoji} ด่าน ${stage.id}: ${stage.name}</h3>
            <p>${stage.thaiName} | ${stage.intro}</p>
            <div class="score-meter"><span style="width:${progress}%"></span></div>
            <p style="margin-top:10px">ข้อ ${g.currentItem + 1} / ${stage.items.length}</p>
            <div class="stage-box">
              <h3>${item.prompt}</h3>
              <div class="choices">${item.choices.map((choice, i) => {
                const selected = g.feedback && g.feedback.choiceIndex === i;
                const correctChoice = g.feedback && item.answer === i;
                const className = g.feedback ? (correctChoice ? 'correct-choice' : selected ? 'wrong-choice' : '') : '';
                return `<button class="choice ${className}" onclick="answerStage(${i})">${choice}</button>`;
              }).join('')}</div>
              ${g.feedback ? `<div class="feedback-box ${g.feedback.correct ? 'correct' : 'wrong'}">${g.feedback.text}<br><small>${g.feedback.correct ? 'ปิ๊ง! เก็บดาวความรู้เพิ่มอีกดวง ⭐' : 'คำใบ้: สังเกตสีถังและชนิดขยะก่อนตอบอีกครั้ง'}</small></div>` : ''}
            </div>
          </div>
          <div class="panel">
            <h3>📌 สถานะด่าน</h3>
            <div class="score-strip">
              <div class="card kpi"><span>ตอบถูก</span><strong>${g.correctCount}</strong></div>
              <div class="card kpi"><span>ข้อที่เหลือ</span><strong>${remaining}</strong></div>
              <div class="card kpi"><span>Badge</span><strong style="font-size:20px">${stage.badge}</strong></div>
            </div>
            <div class="waste-type ${stage.type}" style="margin-top:12px">
              <div class="emoji">${visual.emoji}</div>
              <strong>${visual.label}</strong>
              <small>${visual.hint}</small>
            </div>
            <div class="buddy-corner">${greenBuddy(g.feedback ? g.feedback.text : 'เลือกคำตอบที่ตรงกับชนิดขยะ แล้วฉันจะช่วยให้คำใบ้นะ 💚', true)}</div>
            <div class="btn-row" style="margin-top:16px">
              <button class="btn ghost" onclick="goGameScreen('map')">กลับแผนที่</button>
              <button class="btn ghost" onclick="startStage(${g.currentStage})">เล่นด่านนี้ใหม่</button>
            </div>
            ${soundToggleButton()}
          </div>
        </div>`;
    }

    function renderStageSummary() {
      const result = state.game.latestResult;
      const total = gameTotals();
      return `
        <div class="panel stage-result-card">
          <h3>ภารกิจสำเร็จ! ${starText(result.stars)}</h3>
          <p>เธอได้รับดาวและ Badge ใหม่แล้ว 🏆</p>
          <div class="badge-medal">${result.badge.includes('ลองใหม่') ? '💚' : '🏅'}</div>
          <div class="grid four">
            ${kpi('คะแนนด่านนี้', result.score, 'คะแนน')}
            ${kpi('ดาว', starText(result.stars), '')}
            ${kpi('Badge', result.badge, '')}
            ${kpi('คะแนนรวม', total.score, 'คะแนน')}
          </div>
          <div class="notice" style="margin-top:16px">${result.message}</div>
          <div style="margin-top:16px">${greenBuddy(`${result.buddyAdvice} ${result.homeTip}`, true)}</div>
          <div class="btn-row" style="margin-top:16px">
            <button class="btn ghost" onclick="startStage(${result.stageIndex})">เล่นอีกครั้ง</button>
            ${result.stageIndex < gameStages.length - 1 ? `<button class="btn" onclick="startStage(${result.stageIndex + 1})">ไปด่านถัดไป</button>` : ''}
            <button class="btn secondary" onclick="goGameScreen('map')">กลับหน้าแผนที่ภารกิจ</button>
            ${allStagesComplete() ? `<button class="btn yellow" onclick="saveGameScore()">บันทึกคะแนนและออกเกียรติบัตร</button>` : ''}
          </div>
        </div>`;
    }

    function renderGameCertificate() {
      const total = gameTotals();
      const fullName = playerFullName();
      return `
        <div class="grid two">
          <div class="panel">
            <h3>เกียรติบัตร Trash Hero Academy</h3>
            <p>เมื่อผ่านครบ 9 ด่านและบันทึกคะแนนแล้ว สามารถพิมพ์เกียรติบัตรนี้ได้</p>
            <div class="btn-row">
              <button class="btn" onclick="saveGameScore()">บันทึกคะแนน</button>
              <button class="btn yellow" onclick="window.print()">พิมพ์เกียรติบัตร</button>
              <button class="btn ghost" onclick="goGameScreen('map')">กลับแผนที่</button>
            </div>
          </div>
          <div class="game-cert">
            <div>🍃 ⭐ 🌍 ♻️ ⭐ 🍃</div>
            <p>โรงเรียนเซนต์เทเรซา</p>
            <h3>Trash Hero Academy</h3>
            <p>ขอมอบเกียรติบัตรฉบับนี้ให้แก่</p>
            <div class="name">${fullName || 'ชื่อผู้เล่น'}</div>
            <p>เพื่อแสดงว่าได้ผ่านภารกิจ Trash Hero Academy และได้รับตำแหน่ง ${playerLevelInfo(total.score).emoji} ${playerLevel(total.score)}</p>
            <p>คะแนนรวม ${total.score} คะแนน | ดาวรวม ${starText(total.stars)}</p>
            <p>ผ่านภารกิจฮีโร่พิทักษ์โลก และมีความรู้ด้านการแยกขยะ การลดขยะ และการลดคาร์บอน</p>
            <div>${greenBuddy('ครัวเรือนของคุณคือพลังสีเขียวของโลก 💚', true)}</div>
            <p>วันที่ออกเกียรติบัตร ${new Date().toLocaleDateString('th-TH')}</p>
          </div>
        </div>`;
    }

    function renderGameLeaderboard() {
      const uniqueGameScores = {};
      (state.data.gameScores || []).forEach((row) => {
        const key = String(row.StudentID || '').trim() || String(row.FullName || '').trim() || 'unknown';
        if (key === 'unknown') return;
        if (!uniqueGameScores[key] || Number(row.TotalScore || 0) > Number(uniqueGameScores[key].TotalScore || 0)) {
          uniqueGameScores[key] = row;
        }
      });
      const topGame = Object.values(uniqueGameScores).sort((a, b) => b.TotalScore - a.TotalScore);

      const medal = ['🏆', '🥈', '🥉'];
      const listHtml = topGame.map((r, i) => `
        <div class="card" style="margin-bottom: 10px;">
          <div class="btn-row" style="justify-content: space-between; align-items: center;">
            <strong>${medal[i] || '⭐'} อันดับ ${i + 1}: ${r.FullName}</strong>
            <span class="badge earned">${r.TotalScore} คะแนน</span>
          </div>
          <p style="margin-top: 4px; font-size: 14px; color: var(--text-muted);">${r.ClassName || ''} | ดาวรวม: ${starText(r.TotalStars)} | ระดับ: ${r.PlayerLevel || 'นักแยกขยะ'}</p>
        </div>`).join('');

      return `
        <div class="panel" style="max-width: 800px; margin: 0 auto;">
          <h3 style="margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">🎮 Leaderboard คะแนนเกม Trash Hero Academy</h3>
          <p style="color: var(--text-muted); margin-bottom: 16px;">อันดับผู้เล่นที่สะสมคะแนนได้สูงสุดจากการทำภารกิจแยกขยะ 9 ด่าน</p>
          <div style="margin-top: 16px; margin-bottom: 20px;">
            ${listHtml || '<p style="text-align: center; color: var(--text-muted); padding: 20px 0;">ยังไม่มีข้อมูลคะแนนเกม</p>'}
          </div>
          <div class="btn-row" style="margin-top: 20px;">
            <button class="btn" onclick="goGameScreen('map'); playGameSound('button')">🗺️ กลับแผนที่ภารกิจ</button>
          </div>
        </div>`;
    }

    function goGameScreen(screen) {
      state.game.screen = screen;
      renderGame();
    }

    function saveGameProfile(event) {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(event.currentTarget).entries());
      state.game.profile = {
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        className: data.className || '',
        studentId: data.studentId || '',
        teamName: data.teamName || 'Green Team',
      };
      playGameSound('button');
      goGameScreen('map');
    }

    function startStage(index) {
      if (index > 0 && !state.game.stageResults[index - 1].completed) return;
      state.game.currentStage = index;
      state.game.currentItem = 0;
      state.game.correctCount = 0;
      state.game.feedback = null;
      state.game.screen = 'play';
      playGameSound('stage');
      renderGame();
    }

    function answerStage(choiceIndex) {
      const g = state.game;
      const stage = gameStages[g.currentStage];
      const item = stage.items[g.currentItem];
      const correct = choiceIndex === item.answer;
      if (correct) g.correctCount += 1;
      g.feedback = {
        correct,
        choiceIndex,
        text: correct ? correctFeedback[g.currentItem % correctFeedback.length] : wrongFeedback[g.currentItem % wrongFeedback.length],
      };
      playGameSound(correct ? 'correct' : 'wrong');
      renderGame();
      setTimeout(() => advanceStageItem(), 950);
    }

    function advanceStageItem() {
      const g = state.game;
      const stage = gameStages[g.currentStage];
      g.currentItem += 1;
      g.feedback = null;
      if (g.currentItem >= stage.items.length) {
        finishStage();
      } else {
        renderGame();
      }
    }

    function finishStage() {
      const g = state.game;
      const stage = gameStages[g.currentStage];
      const accuracy = g.correctCount / stage.items.length;
      const score = Math.min(100, Math.round(accuracy * 70 + 20 + 10));
      const stars = stageStars(score);
      const badge = stars > 0 ? stage.badge : '';
      if (badge) playGameSound('badge');
      g.stageResults[g.currentStage] = {
        stageId: stage.id,
        name: stage.name,
        score,
        stars,
        completed: stars > 0,
        badge,
      };
      g.latestResult = {
        stageIndex: g.currentStage,
        score,
        stars,
        badge: badge || 'ลองใหม่เพื่อรับ Badge',
        message: stars > 0 ? `ยินดีด้วย! คุณได้รับ Badge ใหม่ 🏆 ${badge}` : 'ยังไม่ผ่านด่านนี้ ลองเล่นอีกครั้งเพื่อสะสมดาว 💚',
        buddyAdvice: stars > 0 ? 'Green Buddy บอกว่า: อย่าลืมนำความรู้เรื่องขยะไปใช้ที่บ้านนะ ♻️' : 'Green Buddy บอกว่า: ฮีโร่ไม่ยอมแพ้ ลองสังเกตคำใบ้อีกครั้งนะ 💚',
        homeTip: stage.id === 7 ? 'ชวนครอบครัวตั้งมุมแยกขยะที่บ้านได้เลย 🏡' : 'เริ่มจากแยกขยะ 5 ถังให้ถูกสี แล้วบันทึกผลใน Green Passport 📸',
      };
      g.screen = 'summary';
      renderGame();
    }

    function resetGame() {
      state.game = createInitialGameState();
      renderGame();
    }

    function stageStars(score) {
      if (score >= 90) return 3;
      if (score >= 70) return 2;
      if (score >= 50) return 1;
      return 0;
    }

    function gameTotals() {
      return state.game.stageResults.reduce((total, result) => {
        total.score += Number(result.score || 0);
        total.stars += Number(result.stars || 0);
        return total;
      }, { score: 0, stars: 0 });
    }

    function allStagesComplete() {
      return state.game.stageResults.every((result) => result.completed);
    }

    function playerLevel(score) {
      return playerLevelInfo(score).name;
    }

    function playerFullName() {
      return `${state.game.profile.firstName || ''} ${state.game.profile.lastName || ''}`.trim();
    }

    function saveGameScore() {
      const total = gameTotals();
      const latest = state.game.stageResults.filter((r) => r.completed).at(-1) || {};
      const badges = state.game.stageResults.map((r) => r.badge).filter(Boolean);
      const score = {
        FirstName: state.game.profile.firstName || 'นักเรียน',
        LastName: state.game.profile.lastName || 'ตัวอย่าง',
        FullName: playerFullName() || 'นักเรียนตัวอย่าง',
        ClassName: state.game.profile.className || 'ป.5/1',
        StudentID: state.game.profile.studentId || 'ST0000',
        TeamName: state.game.profile.teamName || 'Green Team',
        TotalScore: total.score,
        TotalStars: total.stars,
        PlayerLevel: playerLevel(total.score),
        LatestStage: latest.name || '',
        LatestStageScore: Number(latest.score || 0),
        LatestStageStars: Number(latest.stars || 0),
        Badges: badges.join(', '),
        CertificateStatus: allStagesComplete() ? 'พร้อมออกเกียรติบัตร' : 'ยังไม่ผ่านครบ 9 ด่าน',
      };
      state.game.stageResults.forEach((result, index) => {
        score[`Stage${index + 1}Score`] = Number(result.score || 0);
        score[`Stage${index + 1}Stars`] = Number(result.stars || 0);
      });
      sheetApi('appendGameScore', { score }).then((result) => {
        if (result.score) state.data.gameScores.push(normalizeRow(result.score));
        if (result.gameScores) state.data.gameScores = result.gameScores.map(normalizeRow);
        state.game.saved = true;
        saveToLocalStorage();
        playGameSound('finish');
        alert('บันทึกคะแนนเกมลง Google Sheets เรียบร้อย ✅\nยินดีด้วย! คุณได้รับ Badge ใหม่ 🏆');
        goGameScreen(allStagesComplete() ? 'certificate' : 'map');
      }).catch((error) => {
        if (typeof normalizeRow === 'function') {
          state.data.gameScores.push(normalizeRow(score));
        } else {
          state.data.gameScores.push(score);
        }
        queuePendingWrite('appendGameScore', { score });
        state.game.saved = true;
        saveToLocalStorage();
        playGameSound('finish');
        alert('ยังบันทึกคะแนนลง Google Sheets ไม่สำเร็จ ระบบเก็บคำขอไว้เพื่อส่งซ้ำเมื่อ endpoint พร้อม: ' + error.message);
        goGameScreen(allStagesComplete() ? 'certificate' : 'map');
      });
    }
