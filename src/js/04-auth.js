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

    function setAuthMode(mode) {
      state.authMode = mode === 'signup' ? 'signup' : 'login';
      state.authMessage = '';
      state.authMessageType = '';
      renderAuth();
    }

    function setAuthMessage(message, type = '') {
      state.authMessage = message || '';
      state.authMessageType = type;
      renderAuth();
    }

    function showAuthHelp() {
      setAuthMessage('ถ้าลืมรหัสผ่าน ให้ติดต่อครูหรือผู้ดูแลระบบเพื่อรีเซ็ตรหัสผ่านในชีต AppUsers หรือสมัครบัญชีใหม่สำหรับโหมดทดสอบในเครื่อง', '');
    }

    function authLookupKey(value) {
      return String(value || '').trim().toLowerCase();
    }

    function maskStudentId(value) {
      const text = String(value || '').trim();
      if (!text) return '';
      if (text.length <= 4) return text;
      return text.replace(/(.{2}).+(.{2})/, '$1***$2');
    }

    function normalizeAuthUser(user = {}) {
      const firstName = String(user.FirstName || user.firstName || '').trim();
      const lastName = String(user.LastName || user.lastName || '').trim();
      const fullName = `${firstName} ${lastName}`.trim();
      const username = String(user.Username || user.username || '').trim();
      const email = String(user.Email || user.email || '').trim();
      const studentId = String(user.StudentID || user.StudentId || user.studentId || '').trim();
      const displayName = String(user.DisplayName || user.displayName || fullName || username || email || studentId || 'Green User').trim();
      const userId = String(user.UserID || user.userId || studentId || username || email || displayName).trim();
      return {
        UserID: userId,
        Username: username,
        Email: email,
        Role: String(user.Role || user.role || 'student').trim() || 'student',
        DisplayName: displayName,
        FirstName: firstName,
        LastName: lastName,
        ClassName: String(user.ClassName || user.className || '').trim(),
        StudentID: studentId,
        StudentIDMasked: String(user.StudentIDMasked || user.studentIDMasked || maskStudentId(studentId || userId)).trim(),
        HouseholdName: String(user.HouseholdName || user.householdName || '').trim(),
        Avatar: String(user.Avatar || user.avatar || avatarText(displayName)).trim(),
        ConsentStatus: String(user.ConsentStatus || user.consentStatus || '').trim(),
        Status: String(user.Status || user.status || 'active').trim(),
        CreatedAt: user.CreatedAt || user.createdAt || '',
        LastLoginAt: user.LastLoginAt || user.lastLoginAt || '',
      };
    }

    function publicAuthUser(user) {
      const clean = normalizeAuthUser(user || {});
      return clean;
    }

    function currentUserIdentity() {
      const user = normalizeAuthUser(state.currentUser || {});
      return {
        UserID: user.UserID || user.StudentID || user.Username || user.DisplayName,
        DisplayName: user.DisplayName || `${user.FirstName || ''} ${user.LastName || ''}`.trim() || user.Username || 'Green User',
        ClassName: user.ClassName || '',
        StudentID: user.StudentID || user.UserID || '',
        HouseholdName: user.HouseholdName || '',
        Role: user.Role || 'student',
      };
    }

    function userModeFromRole(role) {
      const value = String(role || '').toLowerCase();
      if (['parent','teacher','leader'].includes(value)) return value;
      return 'student';
    }

    function applyCurrentUserToState() {
      if (!state.currentUser) return;
      const user = normalizeAuthUser(state.currentUser);
      state.currentUser = user;
      state.userMode = userModeFromRole(user.Role);
      localStorage.setItem('greenPassportUserMode', state.userMode);
      state.chatIdentity = {
        DisplayName: user.DisplayName,
        ClassName: user.ClassName,
        UserID: user.UserID,
      };
      localStorage.setItem('greenPassportChatIdentity', JSON.stringify(state.chatIdentity));
      state.profileUserID = user.UserID;
      const profile = {
        UserID: user.UserID,
        DisplayName: user.DisplayName,
        FirstName: user.FirstName,
        LastName: user.LastName,
        ClassName: user.ClassName,
        StudentIDMasked: user.StudentIDMasked,
        Avatar: user.Avatar || avatarText(user.DisplayName),
        CurrentLevel: 'Green Starter',
        CurrentEXP: 0,
        TotalScore: 0,
        TotalStars: 0,
        TotalBadges: 0,
        TotalPosts: 0,
        TotalComments: 0,
        TotalSubmissions: 0,
        TotalCO2e: 0,
        HouseholdStatus: user.HouseholdName || '',
        LastActiveAt: nowStamp(),
        ConsentStatus: user.ConsentStatus || 'ยินยอม',
      };
      const profiles = state.data.userProfiles || [];
      const index = profiles.findIndex((item) => String(item.UserID || item.DisplayName) === String(user.UserID));
      if (index >= 0) profiles[index] = Object.assign({}, profile, profiles[index], { LastActiveAt: nowStamp() });
      else profiles.unshift(profile);
      state.data.userProfiles = profiles;
      const nameParts = splitUserName(user);
      state.game.profile.firstName ||= nameParts.firstName;
      state.game.profile.lastName ||= nameParts.lastName;
      state.game.profile.className ||= user.ClassName;
      state.game.profile.studentId ||= user.StudentID || user.UserID;
      state.game.profile.teamName ||= `${user.DisplayName} Green Team`;
    }

    function splitUserName(user) {
      const normalized = normalizeAuthUser(user || {});
      if (normalized.FirstName || normalized.LastName) return { firstName: normalized.FirstName, lastName: normalized.LastName };
      const parts = String(normalized.DisplayName || '').trim().split(/\s+/);
      return { firstName: parts.shift() || normalized.DisplayName || 'Green', lastName: parts.join(' ') || 'User' };
    }

    function authRecordDefaults() {
      const user = currentUserIdentity();
      return {
        StudentName: `${state.currentUser?.FirstName || ''} ${state.currentUser?.LastName || ''}`.trim() || user.DisplayName,
        ClassName: user.ClassName,
        StudentID: user.StudentID,
        HouseholdName: user.HouseholdName || `${user.DisplayName} Home`,
      };
    }

    function localAuthUsers() {
      return readJsonStorage(LOCAL_AUTH_USERS_KEY, []);
    }

    function saveLocalAuthUsers(users) {
      localStorage.setItem(LOCAL_AUTH_USERS_KEY, JSON.stringify(users || []));
    }

    async function hashText(value) {
      const text = String(value || '');
      if (window.crypto?.subtle && window.TextEncoder) {
        const bytes = new TextEncoder().encode(text);
        const digest = await crypto.subtle.digest('SHA-256', bytes);
        return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
      }
      let hash = 0;
      for (let i = 0; i < text.length; i += 1) hash = ((hash << 5) - hash) + text.charCodeAt(i);
      return `fallback-${Math.abs(hash)}`;
    }

    function randomToken(prefix = 'local') {
      return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
    }

    async function localSignupUser(user, password) {
      const users = localAuthUsers();
      const normalized = normalizeAuthUser(user);
      normalized.UserID = normalized.UserID || normalized.StudentID || normalized.Username || normalized.Email;
      const keys = [normalized.Username, normalized.Email, normalized.UserID, normalized.StudentID].map(authLookupKey).filter(Boolean);
      const duplicate = users.some((item) => [item.Username, item.Email, item.UserID, item.StudentID].some((value) => keys.includes(authLookupKey(value))));
      if (duplicate) throw new Error('บัญชีนี้มีอยู่แล้ว กรุณา Login หรือใช้ Username อื่น');
      const salt = randomToken('salt');
      const stored = Object.assign({}, normalized, {
        PasswordSalt: salt,
        PasswordHash: await hashText(`${salt}:${password}:green-passport`),
        CreatedAt: new Date().toISOString(),
        LastLoginAt: new Date().toISOString(),
        Status: 'active',
      });
      users.push(stored);
      saveLocalAuthUsers(users);
      return { ok: true, token: randomToken('local-session'), user: publicAuthUser(stored), local: true };
    }

    async function localLoginUser(login, password) {
      const key = authLookupKey(login);
      const users = localAuthUsers();
      const user = users.find((item) => [item.Username, item.Email, item.UserID, item.StudentID].some((value) => authLookupKey(value) === key));
      if (!user) throw new Error('ไม่พบบัญชีนี้ในเครื่อง');
      const hash = await hashText(`${user.PasswordSalt}:${password}:green-passport`);
      if (hash !== user.PasswordHash) throw new Error('รหัสผ่านไม่ถูกต้อง');
      user.LastLoginAt = new Date().toISOString();
      saveLocalAuthUsers(users);
      return { ok: true, token: randomToken('local-session'), user: publicAuthUser(user), local: true };
    }

    async function completeAuthSession(result, remember = true) {
      const session = {
        token: result.token || randomToken('session'),
        user: normalizeAuthUser(result.user || {}),
      };
      state.authToken = session.token;
      state.currentUser = session.user;
      state.authMessage = '';
      state.authMessageType = '';
      if (remember) persistAuthSession(session);
      else sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
      applyCurrentUserToState();
      document.body.classList.remove('auth-locked');
      renderNav();
      renderAll();
      try {
        await reloadData(true);
        applyCurrentUserToState();
        if (firebaseFs) {
          await fetchUserProfilesFromFirestore();
        }
        if (state.active === 'chat' && firebaseDb) {
          subscribeToFirebaseChat(state.chatRoom || 'CR-MISSION-01');
        }
        saveToLocalStorage();
        await syncPendingWrites();
        renderAll();
      } catch (error) {
        console.warn(error);
      }
    }

    async function submitLogin(event) {
      event.preventDefault();
      const form = event.currentTarget;
      const data = Object.fromEntries(new FormData(form).entries());
      const login = String(data.login || '').trim();
      const password = String(data.password || '');
      if (!login || !password) {
        setAuthMessage('กรุณากรอก Username และ Password', 'bad');
        return;
      }
      state.authBusy = true;
      renderAuth();
      try {
        let result;
        if (firebaseAuth) {
          const email = await firebaseEmailLookup(login);
          const userCredential = await firebaseAuth.signInWithEmailAndPassword(email, password);
          const uid = userCredential.user.uid;
          const profileDoc = await firebaseFs.collection('userProfiles').doc(uid).get();
          if (!profileDoc.exists) {
            throw new Error('ไม่พบข้อมูลโปรไฟล์ผู้ใช้ในระบบ Firestore');
          }
          const profile = profileDoc.data();
          result = {
            ok: true,
            token: userCredential.user.refreshToken || uid,
            user: {
              UserID: uid,
              Username: profile.Username || login,
              Email: email,
              Role: profile.Role || 'student',
              FirstName: profile.FirstName || '',
              LastName: profile.LastName || '',
              DisplayName: profile.DisplayName || '',
              ClassName: profile.ClassName || '',
              StudentID: profile.StudentID || '',
              HouseholdName: profile.HouseholdStatus || '',
              ConsentStatus: profile.ConsentStatus || 'ยินยอม'
            }
          };
        } else {
          result = sheetApiConfigured()
            ? await sheetApi('loginUser', { login, password })
            : await localLoginUser(login, password);
        }
        await completeAuthSession(result, !!data.remember);
      } catch (remoteError) {
        try {
          const localResult = await localLoginUser(login, password);
          await completeAuthSession(localResult, !!data.remember);
        } catch (localError) {
          state.authBusy = false;
          setAuthMessage(`${remoteError.message || remoteError} ${sheetApiConfigured() ? '| Local: ' + (localError.message || localError) : ''}`, 'bad');
        }
      } finally {
        state.authBusy = false;
      }
    }

    async function submitSignup(event) {
      event.preventDefault();
      const form = event.currentTarget;
      const data = Object.fromEntries(new FormData(form).entries());
      const password = String(data.Password || '');
      const confirm = String(data.ConfirmPassword || '');
      if (password.length < 6) {
        setAuthMessage('Password ต้องมีอย่างน้อย 6 ตัวอักษร', 'bad');
        return;
      }
      if (password !== confirm) {
        setAuthMessage('Password และ Confirm Password ไม่ตรงกัน', 'bad');
        return;
      }
      const user = normalizeAuthUser({
        Username: data.Username,
        Email: data.Email,
        Role: data.Role,
        FirstName: data.FirstName,
        LastName: data.LastName,
        DisplayName: data.DisplayName || `${data.FirstName || ''} ${data.LastName || ''}`.trim(),
        ClassName: data.ClassName,
        StudentID: data.StudentID,
        UserID: data.StudentID || data.Username || data.Email,
        HouseholdName: data.HouseholdName,
        ConsentStatus: data.Consent ? 'ยินยอม' : '',
      });
      state.authBusy = true;
      renderAuth();
      try {
        let result;
        if (firebaseAuth) {
          const usernameClean = String(data.Username || '').trim().toLowerCase();
          const usernameDoc = await firebaseFs.collection('usernames').doc(usernameClean).get();
          if (usernameDoc.exists) {
            throw new Error('Username นี้ถูกใช้งานแล้ว กรุณาเลือกชื่ออื่น');
          }
          if (data.StudentID) {
            const studentClean = String(data.StudentID || '').trim().toLowerCase();
            const studentDoc = await firebaseFs.collection('studentIDs').doc(studentClean).get();
            if (studentDoc.exists) {
              throw new Error('รหัสนักเรียนนี้ถูกลงทะเบียนไว้แล้ว');
            }
          }
          const email = deriveEmail(data.Username || data.StudentID, data.Email);
          const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
          const uid = userCredential.user.uid;
          
          const profile = {
            UserID: uid,
            Username: data.Username,
            Email: email,
            Role: data.Role,
            FirstName: data.FirstName,
            LastName: data.LastName,
            DisplayName: user.DisplayName,
            ClassName: data.ClassName,
            StudentID: data.StudentID || '',
            HouseholdStatus: data.HouseholdName || '',
            ConsentStatus: data.Consent ? 'ยินยอม' : '',
            CurrentLevel: 'Green Starter',
            CurrentEXP: 0,
            TotalScore: 0,
            TotalStars: 0,
            TotalBadges: 0,
            TotalPosts: 0,
            TotalComments: 0,
            TotalSubmissions: 0,
            TotalCO2e: 0,
            LastActiveAt: nowStamp()
          };
          
          const batch = firebaseFs.batch();
          batch.set(firebaseFs.collection('userProfiles').doc(uid), profile);
          batch.set(firebaseFs.collection('usernames').doc(usernameClean), { email: email, uid: uid });
          if (data.StudentID) {
            const studentClean = String(data.StudentID || '').trim().toLowerCase();
            batch.set(firebaseFs.collection('studentIDs').doc(studentClean), { email: email, uid: uid });
          }
          await batch.commit();
          
          result = {
            ok: true,
            token: userCredential.user.refreshToken || uid,
            user: {
              UserID: uid,
              Username: data.Username,
              Email: email,
              Role: data.Role,
              FirstName: data.FirstName,
              LastName: data.LastName,
              DisplayName: user.DisplayName,
              ClassName: data.ClassName,
              StudentID: data.StudentID || '',
              HouseholdName: data.HouseholdName || '',
              ConsentStatus: data.Consent ? 'ยินยอม' : ''
            }
          };
        } else {
          result = sheetApiConfigured()
            ? await sheetApi('signupUser', { user, password })
            : await localSignupUser(user, password);
        }
        await completeAuthSession(result, true);
      } catch (remoteError) {
        try {
          const localResult = await localSignupUser(user, password);
          await completeAuthSession(localResult, true);
          alert('สมัครบัญชีในเครื่องสำเร็จ แต่ยังไม่ได้บันทึกไป Google Sheets/Firebase: ' + (remoteError.message || remoteError));
        } catch (localError) {
          state.authBusy = false;
          setAuthMessage(`${remoteError.message || remoteError} | Local: ${localError.message || localError}`, 'bad');
        }
      } finally {
        state.authBusy = false;
      }
    }

    async function logout() {
      const token = state.authToken;
      clearAuthSession();
      state.active = 'home';
      if (firebaseAuth) {
        try { await firebaseAuth.signOut(); } catch (e) {}
      }
      if (currentChatSubscription) {
        currentChatSubscription.off();
        currentChatSubscription = null;
      }
      renderAuth();
      if (sheetApiConfigured() && token && !firebaseAuth) {
        try { await sheetApi('logoutUser', { token }); } catch (e) {}
      }
    }

    function renderAuthUserChip() {
      const chip = document.getElementById('authUserChip');
      if (!chip) return;
      if (!isAuthenticated()) {
        chip.hidden = true;
        chip.innerHTML = '';
        return;
      }
      const user = currentUserIdentity();
      chip.hidden = false;
      chip.innerHTML = `
        <div class="avatar">${escapeHtml(avatarText(user.DisplayName))}</div>
        <div>
          <strong>${escapeHtml(user.DisplayName)}</strong>
          <span>${escapeHtml(user.ClassName || user.Role || 'Green Passport')}</span>
        </div>
        <button type="button" onclick="logout()">Logout</button>`;
    }
