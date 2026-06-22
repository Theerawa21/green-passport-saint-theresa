// --- Generated Module: auth.js ---

// --- completeAuthSession ---
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
    if (firebaseFs && firebaseAuth && firebaseAuth.currentUser) {
      await fetchUserProfilesFromFirestore();
    }
    if (state.active === 'chat' && firebaseDb && firebaseAuth && firebaseAuth.currentUser) {
      subscribeToFirebaseChat(state.chatRoom || 'CR-MISSION-01');
    }
    saveToLocalStorage();
    await syncPendingWrites();
    renderAll();
  } catch (error) {
    console.warn(error);
  }
}

// --- isAuthenticated ---
function isAuthenticated() {
  return !!(state.currentUser && state.currentUser.UserID);
}

// --- restoreAuthSession ---
function restoreAuthSession() {
  let session = readJsonStorage(AUTH_SESSION_KEY, null);
  if (!session || !session.user) {
    try {
      const raw = sessionStorage.getItem(AUTH_SESSION_KEY);
      session = raw ? JSON.parse(raw) : null;
    } catch (e) {
      session = null;
    }
  }
  if (!session || !session.user) return false;
  state.authToken = session.token || '';
  state.currentUser = normalizeAuthUser(session.user);
  applyCurrentUserToState();
  return true;
}

// --- persistAuthSession ---
function persistAuthSession(session) {
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({
    token: session.token || '',
    user: normalizeAuthUser(session.user || {}),
    savedAt: new Date().toISOString(),
  }));
}

// --- clearAuthSession ---
function clearAuthSession() {
  localStorage.removeItem(AUTH_SESSION_KEY);
  sessionStorage.removeItem(AUTH_SESSION_KEY);
  state.authToken = '';
  state.currentUser = null;
  state.chatIdentity = {};
  localStorage.removeItem('greenPassportChatIdentity');
}

// --- authLookupKey ---
function authLookupKey(value) {
  return String(value || '').trim().toLowerCase();
}

// --- maskStudentId ---
function maskStudentId(value) {
  const text = String(value || '').trim();
  if (!text) return '';
  if (text.length <= 4) return text;
  return text.replace(/(.{2}).+(.{2})/, '$1***$2');
}

// --- normalizeAuthUser ---
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

// --- publicAuthUser ---
function publicAuthUser(user) {
  const clean = normalizeAuthUser(user || {});
  return clean;
}

// --- currentUserIdentity ---
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

// --- userModeFromRole ---
function userModeFromRole(role) {
  const value = String(role || '').toLowerCase();
  if (['parent', 'teacher', 'leader'].includes(value)) return value;
  return 'student';
}

// --- applyCurrentUserToState ---
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

// --- splitUserName ---
function splitUserName(user) {
  const normalized = normalizeAuthUser(user || {});
  if (normalized.FirstName || normalized.LastName) return { firstName: normalized.FirstName, lastName: normalized.LastName };
  const parts = String(normalized.DisplayName || '').trim().split(/\s+/);
  return { firstName: parts.shift() || normalized.DisplayName || 'Green', lastName: parts.join(' ') || 'User' };
}

// --- authRecordDefaults ---
function authRecordDefaults() {
  const user = currentUserIdentity();
  return {
    StudentName: `${state.currentUser?.FirstName || ''} ${state.currentUser?.LastName || ''}`.trim() || user.DisplayName,
    ClassName: user.ClassName,
    StudentID: user.StudentID,
    HouseholdName: user.HouseholdName || `${user.DisplayName} Home`,
  };
}

// --- localAuthUsers ---
function localAuthUsers() {
  return readJsonStorage(LOCAL_AUTH_USERS_KEY, []);
}

// --- saveLocalAuthUsers ---
function saveLocalAuthUsers(users) {
  localStorage.setItem(LOCAL_AUTH_USERS_KEY, JSON.stringify(users || []));
}

// --- localSignupUser ---
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

// --- localLoginUser ---
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

// --- logout ---
async function logout() {
  const token = state.authToken;
  clearAuthSession();
  state.active = 'home';
  if (firebaseAuth) {
    try { await firebaseAuth.signOut(); } catch (e) { }
  }
  if (currentChatSubscription) {
    currentChatSubscription.off();
    currentChatSubscription = null;
  }
  renderAuth();
  if (sheetApiConfigured() && token && !firebaseAuth) {
    try { await sheetApi('logoutUser', { token }); } catch (e) { }
  }
}

