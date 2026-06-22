// --- Generated Module: game.js ---

// --- q ---
function q(prompt, choices, answer) {
      return { prompt, choices, answer };
    }

// --- renderLevelRow ---
function renderLevelRow(score) {
      const current = playerLevelInfo(score).name;
      return `<div class="level-row">${levelCatalog.map((level) => `
        <div class="level-chip ${level.name === current ? 'active' : ''}">
          <div class="emoji">${level.emoji}</div>
          <strong>${level.name}</strong>
          <span>${level.text}</span>
        </div>`).join('')}</div>`;
    }

// --- soundToggleButton ---
function soundToggleButton() {
      return `<button class="game-sound" type="button" onclick="toggleGameSound()">🔊 ${state.game.soundOn ? 'ปิดเสียง' : 'เปิดเสียง'}</button>`;
    }

// --- toggleGameSound ---
function toggleGameSound() {
      state.game.soundOn = !state.game.soundOn;
      playGameSound('button');
      renderGame();
    }

// --- playGameSound ---
function playGameSound(kind = 'button') {
      if (!state.game.soundOn) return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const tones = { button: 420, correct: 720, wrong: 180, badge: 880, stage: 640, finish: 520 };
        osc.frequency.value = tones[kind] || 420;
        osc.type = kind === 'wrong' ? 'sawtooth' : 'sine';
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.055, ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.17);
      } catch (e) {}
    }

// --- renderGame ---
function renderGame() {
      const view = {
        start: renderGameStart,
        profile: renderGameProfile,
        map: renderMissionMap,
        play: renderStagePlay,
        summary: renderStageSummary,
        certificate: renderGameCertificate,
      }[state.game.screen] || renderGameStart;
      document.getElementById('game').innerHTML = view();
    }

// --- renderGameStart ---
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

// --- renderGameProfile ---
function renderGameProfile() {
      const p = state.game.profile;
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

// --- renderMissionMap ---
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
          <button class="btn secondary" onclick="showPage('leaderboard')">ดู Leaderboard</button>
          ${allStagesComplete() ? `<button class="btn yellow" onclick="goGameScreen('certificate')">ออกเกียรติบัตร</button>` : ''}
        </div>`;
    }

// --- renderStagePlay ---
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

// --- renderStageSummary ---
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

// --- renderGameCertificate ---
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

