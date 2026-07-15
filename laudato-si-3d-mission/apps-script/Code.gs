const SPREADSHEET_ID = '1D5h3BT8pMVLTIDNAwNbzHWp4s6JajwNBGoD-1VXVlPs';
const SHEETS = { PLAYERS: 'Players', PROGRESS: 'Progress', ANSWERS: 'MissionAnswers', BADGES: 'Badges', COMMITMENTS: 'Commitments', SETTINGS: 'Settings' };

function doGet(e) {
  try {
    const action = String((e && e.parameter && e.parameter.action) || 'health');
    if (action === 'getDashboard') return json_(getDashboard_());
    return json_({ success: true, service: 'Laudato Si 3D Mission API', timestamp: new Date().toISOString() });
  } catch (error) { return json_({ success: false, message: error.message }); }
}

function doPost(e) {
  try {
    const data = JSON.parse((e.postData && e.postData.contents) || '{}');
    if (data.action === 'registerPlayer') return json_(registerPlayer_(data));
    if (data.action === 'syncProgress') return json_(syncProgress_(data.progress));
    throw new Error('Unknown action');
  } catch (error) { return json_({ success: false, message: error.message }); }
}

function registerPlayer_(data) {
  const player = normalizePlayer_(data);
  const id = playerId_(player);
  const sheet = sheet_(SHEETS.PLAYERS);
  const values = sheet.getDataRange().getValues();
  const found = values.slice(1).findIndex(row => String(row[0]) === id);
  const row = [id, new Date(), player.name, player.classroom, player.number, 'Active'];
  if (found >= 0) sheet.getRange(found + 2, 1, 1, row.length).setValues([row]); else sheet.appendRow(row);
  return { success: true, playerId: id };
}

function syncProgress_(progress) {
  if (!progress || !progress.player) throw new Error('Missing progress');
  const player = normalizePlayer_(progress.player);
  const id = playerId_(player);
  registerPlayer_(player);
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const sheet = sheet_(SHEETS.PROGRESS);
    const values = sheet.getDataRange().getValues();
    const found = values.slice(1).findIndex(row => String(row[0]) === id);
    const completed = Array.isArray(progress.completedIds) ? progress.completedIds : [];
    const answers = progress.answers || {};
    const row = [id, player.name, player.classroom, player.number, Number(progress.score || 0), Number(progress.baseScore || 0), Number(progress.creativityBonus || 0), Number(progress.responsibilityBonus || 0), completed.length, JSON.stringify(completed), JSON.stringify(progress.medals || []), answers[6] && answers[6].promise || '', progress.updatedAt || new Date().toISOString(), JSON.stringify(answers)];
    if (found >= 0) sheet.getRange(found + 2, 1, 1, row.length).setValues([row]); else sheet.appendRow(row);
    return { success: true, playerId: id, score: Number(progress.score || 0) };
  } finally { lock.releaseLock(); }
}

function getDashboard_() {
  const sheet = sheet_(SHEETS.PROGRESS);
  const values = sheet.getDataRange().getValues();
  const records = values.slice(1).filter(row => row[0]).map(row => ({
    key: String(row[0]), player: { name: row[1], classroom: row[2], number: row[3] }, score: Number(row[4] || 0), baseScore: Number(row[5] || 0), creativityBonus: Number(row[6] || 0), responsibilityBonus: Number(row[7] || 0), completedIds: parseJson_(row[9], []), medals: parseJson_(row[10], []), answers: parseJson_(row[13], {}), updatedAt: row[12]
  }));
  records.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  return { success: true, records: records };
}

function normalizePlayer_(data) { return { name: clean_(data.name), classroom: clean_(data.classroom), number: clean_(data.number) }; }
function playerId_(p) { return ['ST', p.classroom.replace(/\s/g, ''), String(p.number).padStart(2, '0'), Utilities.base64EncodeWebSafe(p.name).slice(0, 8)].join('-'); }
function clean_(v) { return String(v || '').trim().slice(0, 500); }
function parseJson_(v, fallback) { try { return JSON.parse(String(v || '')); } catch (e) { return fallback; } }
function sheet_(name) { const s = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(name); if (!s) throw new Error('Missing sheet: ' + name); return s; }
function json_(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }
