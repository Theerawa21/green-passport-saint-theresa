// --- Generated Module: auth.js ---

// --- renderAuth ---
function renderAuth() {
      document.body.classList.add('auth-locked');
      document.body.classList.remove('chat-active');
      const screen = document.getElementById('authScreen');
      if (!screen) return;
      const mode = state.authMode === 'signup' ? 'signup' : 'login';
      const logo = greenPassportLogoSrc();
      const busy = state.authBusy ? 'disabled' : '';
      const message = state.authMessage
        ? `<div class="auth-status ${state.authMessageType === 'bad' ? 'bad' : ''}">${escapeHtml(state.authMessage)}</div>`
        : '';
      screen.innerHTML = `
        <div class="auth-shell">
          <section class="auth-brand-panel">
            <div>
              <div class="auth-logo-wrap">
                <div class="auth-logo">${logo ? `<img src="${escapeAttr(logo)}" alt="Green Passport logo">` : 'GP'}</div>
                <div>
                  <h1>Green Passport</h1>
                  <p>St. Theresa Zero Waste</p>
                </div>
              </div>
            </div>
            <ul class="auth-brand-list">
              <li>บันทึกข้อมูลขยะและคำนวณคาร์บอนในบัญชีเดียว</li>
              <li>เชื่อมต่อชุมชน Green Passport, แชท, เกม และโปรไฟล์ผู้ใช้</li>
              <li>ข้อมูลผู้ใช้ถูกใช้เติมฟอร์มอัตโนมัติ ลดการกรอกซ้ำและลดการใช้ชื่อผิด</li>
            </ul>
          </section>
          <section class="auth-form-panel">
            <div class="auth-tabs" role="tablist" aria-label="Auth tabs">
              <button class="auth-tab ${mode === 'login' ? 'active' : ''}" type="button" onclick="setAuthMode('login')">Login</button>
              <button class="auth-tab ${mode === 'signup' ? 'active' : ''}" type="button" onclick="setAuthMode('signup')">Sign Up</button>
            </div>
            ${message}
            ${mode === 'login' ? loginFormHtml(busy) : signupFormHtml(busy)}
          </section>
        </div>`;
      requestAnimationFrame(() => document.getElementById(mode === 'login' ? 'loginUsername' : 'signupFirstName')?.focus());
    }

// --- loginFormHtml ---
function loginFormHtml(busy) {
      return `
        <form class="auth-form" id="loginForm" onsubmit="submitLogin(event)">
          <div>
            <h2>Login</h2>
            <p>เข้าสู่ระบบเพื่อใช้งาน Green Passport และบันทึกข้อมูลในชื่อของคุณ</p>
          </div>
          <label>Username / Email / Student ID
            <input id="loginUsername" name="login" type="text" autocomplete="username" required placeholder="เช่น student01 หรือ ST001">
          </label>
          <label>Password
            <input id="loginPassword" name="password" type="password" autocomplete="current-password" required minlength="6" placeholder="รหัสผ่าน">
          </label>
          <div class="auth-help">
            <label style="display:flex;align-items:center;gap:8px;margin:0"><input name="remember" type="checkbox" checked style="width:auto;min-height:auto"> Remember me</label>
            <button type="button" onclick="showAuthHelp()">ลืมรหัสผ่าน?</button>
          </div>
          <button class="btn" type="submit" ${busy}>${state.authBusy ? 'กำลังเข้าสู่ระบบ...' : 'Login'}</button>
          <p class="notice">ยังไม่มีบัญชี? กด Sign Up เพื่อสมัครบัญชีใหม่ก่อนใช้งานระบบ</p>
        </form>`;
    }

// --- signupFormHtml ---
function signupFormHtml(busy) {
      return `
        <form class="auth-form" id="signupForm" onsubmit="submitSignup(event)">
          <div>
            <h2>Sign Up</h2>
            <p>สร้างบัญชีสำหรับนักเรียน ผู้ปกครอง หรือครูที่ใช้ระบบ Green Passport</p>
          </div>
          <div class="auth-grid">
            <label>ชื่อ<input id="signupFirstName" name="FirstName" required maxlength="60" autocomplete="given-name"></label>
            <label>นามสกุล<input name="LastName" required maxlength="60" autocomplete="family-name"></label>
            <label>ชื่อที่แสดง<input name="DisplayName" maxlength="50" placeholder="เช่น น้องต้นกล้า"></label>
            <label>บทบาท
              <select name="Role" required>
                <option value="student">นักเรียน</option>
                <option value="parent">ผู้ปกครอง</option>
                <option value="teacher">ครู</option>
                <option value="leader">ผู้บริหาร/ผู้ประสานงาน</option>
              </select>
            </label>
            <label>ชั้น/ห้อง<input name="ClassName" maxlength="30" placeholder="เช่น ม.1/1"></label>
            <label>รหัสนักเรียน / รหัสผู้ใช้<input name="StudentID" maxlength="40" placeholder="เช่น ST001"></label>
            <label class="auth-full">ชื่อครัวเรือน<input name="HouseholdName" maxlength="80" placeholder="เช่น บ้านรักษ์โลก"></label>
            <label>Username<input name="Username" required maxlength="40" autocomplete="username" placeholder="ใช้สำหรับ Login"></label>
            <label>Email<input name="Email" type="email" maxlength="90" autocomplete="email" placeholder="name@example.com"></label>
            <label>Password<input id="signupPassword" name="Password" type="password" required minlength="6" autocomplete="new-password"></label>
            <label>Confirm Password<input name="ConfirmPassword" type="password" required minlength="6" autocomplete="new-password"></label>
            <label class="auth-full"><span><input name="Consent" type="checkbox" required style="width:auto;min-height:auto"> ยินยอมให้ระบบใช้ข้อมูลบัญชีเพื่อบันทึกกิจกรรม โปรไฟล์ ชุมชน แชท และรายงานผลโครงการ</span></label>
          </div>
          <button class="btn" type="submit" ${busy}>${state.authBusy ? 'กำลังสร้างบัญชี...' : 'Sign Up'}</button>
          <p class="notice">บัญชีนี้จะใช้เป็นตัวตนหลักของระบบ และ Admin ยังต้องเข้าใช้งานด้วย PIN แยกต่างหาก</p>
        </form>`;
    }

// --- setAuthMode ---
function setAuthMode(mode) {
      state.authMode = mode === 'signup' ? 'signup' : 'login';
      state.authMessage = '';
      state.authMessageType = '';
      renderAuth();
    }

// --- setAuthMessage ---
function setAuthMessage(message, type = '') {
      state.authMessage = message || '';
      state.authMessageType = type;
      renderAuth();
    }

// --- showAuthHelp ---
function showAuthHelp() {
      setAuthMessage('ถ้าลืมรหัสผ่าน ให้ติดต่อครูหรือผู้ดูแลระบบเพื่อรีเซ็ตรหัสผ่านในชีต AppUsers หรือสมัครบัญชีใหม่สำหรับโหมดทดสอบในเครื่อง', '');
    }

