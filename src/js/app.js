// --- Generated Module: app.js ---

// --- init ---
async function init() {
  const startPage = new URLSearchParams(location.search).get('page') || location.hash.replace('#page=', '');
  if (startPage && pages.some(([id]) => id === startPage)) state.active = startPage;
  renderNav();
  loadFromLocalStorage();
  restoreAuthSession();
  if (!isAuthenticated()) {
    renderAuth();
    return;
  }
  document.body.classList.remove('auth-locked');
  renderAll();
  try {
    await reloadData(true);
    applyCurrentUserToState();
    await syncPendingWrites();
    renderAll();
  } catch (error) {
    console.warn(error);
    alert('โหลดข้อมูลจาก Google Sheets ไม่สำเร็จ: ' + error.message);
    renderAll();
  }
}

// --- hydrateData ---
function hydrateData(data = {}) {
  state.data = Object.assign(state.data, data);
  state.data.wasteRecords = (data.wasteRecords || []).map(normalizeRow);
  state.data.gameScores = (data.gameScores || []).map(normalizeRow);
  state.data.carbonFactors = (data.carbonFactors?.length ? data.carbonFactors : state.data.carbonFactors).map(normalizeRow);
  state.data.householdSummary = data.householdSummary || summarizeHouseholds(state.data.wasteRecords);
  state.data.dashboard = data.dashboard || buildDashboard(state.data.wasteRecords, state.data.householdSummary);
  state.data.communityPosts = (data.communityPosts || state.data.communityPosts || []).map(normalizeRow);
  state.data.postComments = (data.postComments || state.data.postComments || []).map(normalizeRow);
  state.data.chatMessages = (data.chatMessages || state.data.chatMessages || []).map(normalizeRow);
  state.data.chatRooms = (data.chatRooms?.length ? data.chatRooms : state.data.chatRooms?.length ? state.data.chatRooms : defaultChatRooms()).map(normalizeRow);
  state.data.userProfiles = (data.userProfiles || state.data.userProfiles || []).map(normalizeRow);
  state.data.levelRules = (data.levelRules?.length ? data.levelRules : state.data.levelRules?.length ? state.data.levelRules : defaultLevelRules()).map(normalizeRow);
  state.data.expLogs = (data.expLogs || state.data.expLogs || []).map(normalizeRow);
  state.data.carbonFactors?.forEach((factor) => {
    const field = activityFields.find((a) => a[1] === factor.ActivityName || a[0] === factor.ActivityCode)?.[0];
    if (field) factorMap[field] = Number(factor.EF || factorMap[field] || 0);
  });
}

// --- renderAll ---
function renderAll() {
  if (!isAuthenticated()) {
    renderAuth();
    return;
  }
  const current = pages.find(([id]) => id === state.active);
  document.body.classList.remove('auth-locked');
  document.body.classList.toggle('chat-active', state.active === 'chat');
  document.getElementById('pageTitle').textContent = current ? current[1] : 'Green Passport';
  document.getElementById('globalCarbon').textContent = format(state.data.dashboard.totalCO2e || 0);
  renderAuthUserChip();
  document.querySelectorAll('.section').forEach((s) => s.classList.toggle('active', s.id === state.active));
  document.querySelectorAll('[data-page]').forEach((b) => b.classList.toggle('active', b.dataset.page === state.active));
  const renderers = {
    home: renderHome,
    record: renderRecord,
    guide: renderGuide,
    game: renderGame,
    leaderboard: renderLeaderboard,
    community: renderCommunity,
    friends: renderFriends,
    chat: renderChat,
    profile: renderProfile,
    impact: renderImpact,
    dashboard: renderDashboard,
    compare: renderCompare,
    formula: renderFormula,
    missions: renderMonthlyMissions,
    reminders: renderReminders,
    studentRoles: renderStudentRoles,
    starterKit: renderStarterKit,
    certificate: renderCertificate,
    admin: renderAdmin,
  };
  (renderers[state.active] || renderHome)();
}

// --- reloadData ---
async function reloadData(silent = false) {
  const result = sheetApiConfigured()
    ? await sheetApi('getBootstrapData')
    : await loadBootstrapFromPublicSheets();
  hydrateData(result.data || result);
  saveToLocalStorage();
  renderAll();
  if (!silent) alert('โหลดข้อมูลจาก Google Sheets ล่าสุดแล้ว');
}

// --- refreshLocalDashboard ---
function refreshLocalDashboard() {
  state.data.householdSummary = summarizeHouseholds(state.data.wasteRecords);
  state.data.dashboard = buildDashboard(state.data.wasteRecords, state.data.householdSummary);
}

// --- sum ---
function sum(rows, field) {
  return rows.reduce((total, row) => total + Number(row[field] || 0), 0);
}

// --- sumOne ---
function sumOne(row, fields) {
  return fields.reduce((total, field) => total + Number(row[field] || 0), 0);
}

// --- round ---
function round(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

// --- format ---
function format(value) {
  return Number(value || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// --- maskId ---
function maskId(id) {
  const text = String(id || '');
  return text.length <= 3 ? '***' : text.slice(0, 2) + '***' + text.slice(-2);
}

// --- initTrigger ---
init();

