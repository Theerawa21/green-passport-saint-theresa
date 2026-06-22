const SHEET_ID = '1G0rL3YSQexyiMp7vPu8DdOo2tUZk9xIhi1E1poaJqi4';

const ACTIVITY_FIELDS = [
  'PaperKg','PlasticBottleKg','CanKg','AluminumKg','SteelCanKg','ScrapIronKg','GlassBottleKg',
  'CompostFoodKg','BioExtractKg','FeedAnimalsKg','ReducePlasticBagTimes','CarryBottleTimes',
  'UseLunchBoxTimes','RefuseStrawTimes','CarryClothBagTimes','RepairItemsTimes','DonateItemsTimes',
  'DisposeBatteriesAmount','DisposeBulbsAmount','DisposeExpiredMedicineAmount',
];

const WASTE_HEADERS = [
  'RecordID','SubmittedAt','StudentName','ClassName','StudentID','HouseholdName','ReportMonth',
  'GeneralWasteKg','RecycleWasteKg','OrganicWasteKg','HazardousWasteAmount',
  ...ACTIVITY_FIELDS,
  'TotalCO2e','EvidenceFileNames','EvidenceFolderLink','VideoLink','ConsentStatus',
  'ReviewStatus','TeacherComment','ReviewedBy','ReviewedAt',
];

const GAME_HEADERS = [
  'ScoreID','SavedAt','FirstName','LastName','FullName','ClassName','StudentID','TeamName',
  'TotalScore','TotalStars','PlayerLevel','LatestStage','LatestStageScore','LatestStageStars',
  'Badges','CertificateStatus',
  'Stage1Score','Stage1Stars','Stage2Score','Stage2Stars','Stage3Score','Stage3Stars',
  'Stage4Score','Stage4Stars','Stage5Score','Stage5Stars','Stage6Score','Stage6Stars',
  'Stage7Score','Stage7Stars','Stage8Score','Stage8Stars','Stage9Score','Stage9Stars',
];

const CARBON_HEADERS = ['ActivityCode','ActivityName','Unit','EF','Source','Note'];
const SETTINGS_HEADERS = ['SettingKey','SettingValue','Note'];
const IMPACT_HEADERS = ['MetricKey','MetricName','MetricValue','Unit','Note','UpdatedAt'];
const ADVICE_HEADERS = ['RuleID','Condition','AdviceTitle','AdviceText','Emoji','Priority','RelatedWasteType','SuggestedAction','BadgeSuggestion'];
const EVIDENCE_REVIEW_HEADERS = ['ReviewID','RecordID','WasteRecordRow','ReviewedAt','ReviewedBy','ReviewStatus','TeacherComment','EvidenceFolderLink'];
const STUDENT_ROLES_HEADERS = ['StepID','RoleName','Description','EvidenceRequired','Status'];
const MONTHLY_MISSIONS_HEADERS = ['MissionID','Month','MissionName','Objective','Task','EvidenceRequired','BadgeReward','Score','Status'];
const EXPORT_REPORTS_HEADERS = ['ExportID','ExportedAt','ReportType','ReportName','RowCount','ExportedBy','Note'];
const CONSENT_RECORDS_HEADERS = ['ConsentID','RecordID','SubmittedAt','StudentName','ClassName','StudentID','HouseholdName','ConsentStatus','ConsentText'];
const STARTER_KIT_HEADERS = ['KitID','ItemName','Description','FileLink','Status'];
const COMMUNITY_POST_HEADERS = ['PostID','Timestamp','UserID','DisplayName','ClassName','Category','PostTitle','PostContent','MethodUsed','Result','Problem','Solution','AdviceToFriends','ImageLinks','Tags','Likes','CommentCount','ReviewStatus','TeacherComment','ApprovedBy','ApprovedAt'];
const POST_COMMENT_HEADERS = ['CommentID','PostID','Timestamp','UserID','DisplayName','ClassName','CommentText','LikeCount','ReviewStatus','ReportStatus'];
const CHAT_MESSAGE_HEADERS = ['MessageID','ChatRoomID','Timestamp','UserID','DisplayName','ClassName','MessageText','ImageLink','MessageType','IsPinned','ReportStatus','ModerationStatus'];
const CHAT_ROOM_HEADERS = ['ChatRoomID','ChatRoomName','ChatRoomType','ClassName','Description','CreatedBy','CreatedAt','IsActive','TeacherModerator'];
const USER_PROFILE_HEADERS = ['UserID','DisplayName','FirstName','LastName','ClassName','StudentIDMasked','Avatar','CurrentLevel','CurrentEXP','TotalScore','TotalStars','TotalBadges','TotalPosts','TotalComments','TotalSubmissions','TotalCO2e','HouseholdStatus','LastActiveAt','ConsentStatus'];
const LEVEL_RULE_HEADERS = ['LevelID','LevelName','Emoji','MinEXP','MaxEXP','Description','UnlockFeature','RewardBadge','DisplayColor'];
const EXP_LOG_HEADERS = ['LogID','Timestamp','UserID','ActivityType','ActivityDetail','EXPAmount','RelatedID','Note'];
const APP_USER_HEADERS = ['UserID','Username','Email','Role','DisplayName','FirstName','LastName','ClassName','StudentID','StudentIDMasked','HouseholdName','Avatar','PasswordSalt','PasswordHash','ConsentStatus','Status','CreatedAt','LastLoginAt'];
const USER_SESSION_HEADERS = ['Token','UserID','CreatedAt','LastSeenAt','ExpiresAt','Status'];

const DEFAULT_CONSENT_TEXT = 'ข้าพเจ้ายินยอมให้โรงเรียนใช้ข้อมูลและภาพหลักฐานที่ส่งผ่านระบบ Green Passport เพื่อการติดตามผลโครงการด้านสิ่งแวดล้อม การจัดทำรายงาน และการนำเสนอผลงานทางการศึกษา โดยโรงเรียนจะใช้ข้อมูลอย่างเหมาะสมและไม่เปิดเผยข้อมูลส่วนบุคคลต่อสาธารณะโดยไม่จำเป็น';

function setupGreenPassport() {
  ensureSheet_('WasteRecords', WASTE_HEADERS);
  ensureSheet_('GameScores', GAME_HEADERS);
  const carbon = ensureSheet_('CarbonFactors', CARBON_HEADERS);
  if (carbon.getLastRow() < 2) seedCarbonFactors_(carbon);
  const impact = ensureSheet_('ImpactSummary', IMPACT_HEADERS);
  if (impact.getLastRow() < 2) seedImpactSummary_(impact);
  const advice = ensureSheet_('AdviceRules', ADVICE_HEADERS);
  if (advice.getLastRow() < 2) seedAdviceRules_(advice);
  ensureSheet_('EvidenceReview', EVIDENCE_REVIEW_HEADERS);
  const roles = ensureSheet_('StudentRoles', STUDENT_ROLES_HEADERS);
  if (roles.getLastRow() < 2) seedStudentRoles_(roles);
  const missions = ensureSheet_('MonthlyMissions', MONTHLY_MISSIONS_HEADERS);
  if (missions.getLastRow() < 2) seedMonthlyMissions_(missions);
  ensureSheet_('ExportReports', EXPORT_REPORTS_HEADERS);
  ensureSheet_('ConsentRecords', CONSENT_RECORDS_HEADERS);
  const starterKit = ensureSheet_('StarterKit', STARTER_KIT_HEADERS);
  if (starterKit.getLastRow() < 2) seedStarterKit_(starterKit);
  ensureSheet_('CommunityPosts', COMMUNITY_POST_HEADERS);
  ensureSheet_('PostComments', POST_COMMENT_HEADERS);
  ensureSheet_('ChatArchive', ['MessageID','ChatRoomID','Timestamp','UserID','DisplayName','ClassName','MessageText','ImageLink','MessageType','ReplyToMessageID','IsPinned','ReportStatus','ModerationStatus','ArchivedAt']);
  const rooms = ensureSheet_('ChatRooms', CHAT_ROOM_HEADERS);
  if (rooms.getLastRow() < 2) seedChatRooms_(rooms);
  ensureSheet_('UserProfiles', USER_PROFILE_HEADERS);
  const levels = ensureSheet_('LevelRules', LEVEL_RULE_HEADERS);
  if (levels.getLastRow() < 2) seedLevelRules_(levels);
  ensureSheet_('EXPLogs', EXP_LOG_HEADERS);
  const settings = ensureSheet_('AdminSettings', SETTINGS_HEADERS);
  if (settings.getLastRow() < 2) {
    settings.getRange(2, 1, 4, 3).setValues([
      ['AdminPIN', '2468', 'เปลี่ยนทันทีหลัง deploy จริง หรือกำหนดใน Script Properties ชื่อ AdminPIN'],
      ['EvidenceRootFolderId', '', 'เว้นว่างเพื่อให้ระบบสร้างโฟลเดอร์ใน Drive อัตโนมัติ'],
      ['AcademicYear', '2569', 'ปีการศึกษา'],
      ['OpenMonth', Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM'), 'เดือนเริ่มใช้งาน'],
    ]);
  }
}

function doGet() {
  setupGreenPassport();
  return json_({ ok: true, data: getBootstrapData_() });
}

function doPost(e) {
  const frameMode = e.parameter && e.parameter.frame === '1';
  let req = {};
  let result;
  try {
    setupGreenPassport();
    req = JSON.parse((e.parameter && e.parameter.payload) || (e.postData && e.postData.contents) || '{}');
    result = handleRequest_(req);
  } catch (err) {
    result = { ok: false, message: err.message || String(err) };
  }
  return frameMode ? frameJson_(req._token, result) : json_(result);
}

function handleRequest_(req) {
  if (req.action === 'getBootstrapData') return { ok: true, data: getBootstrapData_() };
  if (req.action === 'appendWasteRecord') return appendWasteRecord_(req.record || {});
  if (req.action === 'appendGameScore') return appendGameScore_(req.score || {});
  if (req.action === 'archiveChatMessages') return archiveChatMessages_(req.messages || []);
  if (req.action === 'adminLogin') return verifyPin_(req.pin) ? { ok: true } : { ok: false, message: 'Admin PIN ไม่ถูกต้อง' };
  if (req.action === 'updateReview') return updateReview_(req);
  if (req.action === 'logExportReport') return logExportReport_(req);
  if (req.action === 'appendCommunityPost') return appendCommunityPost_(req.post || {});
  if (req.action === 'appendPostComment') return appendPostComment_(req.comment || {});
  if (req.action === 'updateCommunityPostReview') return updateCommunityPostReview_(req);
  if (req.action === 'updatePostCommentReview') return updatePostCommentReview_(req);
  if (req.action === 'sendCommunityLike') return sendCommunityLike_(req);
  return { ok: false, message: 'Unknown action' };
}

function archiveChatMessages_(messages) {
  if (!messages || !messages.length) return { ok: true, count: 0 };
  const headers = sheetHeadersByName_('ChatArchive') || ['MessageID','ChatRoomID','Timestamp','UserID','DisplayName','ClassName','MessageText','ImageLink','MessageType','ReplyToMessageID','IsPinned','ReportStatus','ModerationStatus','ArchivedAt'];
  ensureSheet_('ChatArchive', headers);
  const now = new Date();
  let count = 0;
  messages.forEach((msg) => {
    const row = Object.assign({}, msg, { ArchivedAt: now });
    appendObject_('ChatArchive', headers, row);
    count++;
  });
  return { ok: true, count };
}

function normalizeAppUser_(input) {
  const user = {};
  APP_USER_HEADERS.forEach((key) => user[key] = input[key] || '');
  user.Username = String(input.Username || input.username || '').trim();
  user.Email = String(input.Email || input.email || '').trim();
  user.Role = String(input.Role || input.role || 'student').trim() || 'student';
  user.FirstName = String(input.FirstName || input.firstName || '').trim();
  user.LastName = String(input.LastName || input.lastName || '').trim();
  user.DisplayName = String(input.DisplayName || input.displayName || `${user.FirstName} ${user.LastName}`.trim() || user.Username || user.Email || 'Green User').trim();
  user.ClassName = String(input.ClassName || input.className || '').trim();
  user.StudentID = String(input.StudentID || input.studentId || '').trim();
  user.UserID = String(input.UserID || input.userId || user.StudentID || user.Username || user.Email || '').trim();
  user.StudentIDMasked = String(input.StudentIDMasked || input.studentIDMasked || maskStudentId_(user.StudentID || user.UserID)).trim();
  user.HouseholdName = String(input.HouseholdName || input.householdName || '').trim();
  user.Avatar = String(input.Avatar || input.avatar || avatarText_(user.DisplayName)).trim();
  user.ConsentStatus = String(input.ConsentStatus || input.consentStatus || '').trim();
  return user;
}

function publicAppUser_(user) {
  const clean = normalizeAppUser_(user || {});
  clean.CreatedAt = user.CreatedAt || '';
  clean.LastLoginAt = user.LastLoginAt || '';
  clean.Status = user.Status || 'active';
  delete clean.PasswordSalt;
  delete clean.PasswordHash;
  return clean;
}

function findUserMatch_(user) {
  const keys = [user.Username, user.Email, user.UserID, user.StudentID].map(authKey_).filter(Boolean);
  if (!keys.length) return null;
  const rows = readSheet_('AppUsers');
  const found = rows.find((row) => [row.Username, row.Email, row.UserID, row.StudentID].some((value) => keys.indexOf(authKey_(value)) >= 0));
  return found ? { user: found, rowNumber: found._rowNumber } : null;
}

function findUserByLogin_(login) {
  const key = authKey_(login);
  if (!key) return null;
  const rows = readSheet_('AppUsers');
  const found = rows.find((row) => [row.Username, row.Email, row.UserID, row.StudentID].some((value) => authKey_(value) === key));
  return found ? { user: found, rowNumber: found._rowNumber } : null;
}

function findUserById_(userId) {
  const key = authKey_(userId);
  if (!key) return null;
  const rows = readSheet_('AppUsers');
  const found = rows.find((row) => authKey_(row.UserID) === key);
  return found ? { user: found, rowNumber: found._rowNumber } : null;
}

function authKey_(value) {
  return String(value || '').trim().toLowerCase();
}



function upsertUserProfileFromAppUser_(user) {
  const now = new Date();
  const base = {
    UserID: user.UserID,
    DisplayName: user.DisplayName,
    FirstName: user.FirstName,
    LastName: user.LastName,
    ClassName: user.ClassName,
    StudentIDMasked: user.StudentIDMasked || maskStudentId_(user.StudentID || user.UserID),
    Avatar: user.Avatar || avatarText_(user.DisplayName),
    LastActiveAt: now,
    ConsentStatus: user.ConsentStatus || 'ยินยอม',
  };
  const existing = setObjectFieldsById_('UserProfiles', 'UserID', user.UserID, base);
  if (!existing) {
    appendObject_('UserProfiles', USER_PROFILE_HEADERS, Object.assign({
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
    }, base));
  }
}

function maskStudentId_(value) {
  const text = String(value || '').trim();
  if (!text) return '';
  if (text.length <= 4) return text;
  return text.replace(/(.{2}).+(.{2})/, '$1***$2');
}

function avatarText_(name) {
  const text = String(name || 'GP').trim();
  const compact = text.replace(/\s+/g, '');
  return compact.slice(0, 2).toUpperCase() || 'GP';
}

function appendWasteRecord_(input) {
  const record = Object.assign({}, input);
  const recordId = 'WR-' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss') + '-' + Math.floor(Math.random() * 10000);
  const evidence = saveEvidenceFiles_(record.EvidenceFiles || [], recordId);
  record.RecordID = recordId;
  record.SubmittedAt = new Date();
  record.TotalCO2e = Number(record.TotalCO2e || 0);
  record.EvidenceFileNames = evidence.names.join(', ');
  record.EvidenceFolderLink = evidence.folderUrl;
  record.ConsentStatus = record.Consent ? 'ยินยอม' : 'ยังไม่ยินยอม';
  record.ReviewStatus = record.ReviewStatus || 'รอตรวจสอบ';
  delete record.EvidenceFiles;
  delete record.Consent;
  const rowNumber = appendObject_('WasteRecords', WASTE_HEADERS, record);
  record._rowNumber = rowNumber;
  appendConsentRecord_(record);
  appendEXPLog_(record.StudentID || record.StudentName || record.HouseholdName, 'บันทึกข้อมูลขยะ', 'บันทึกข้อมูลขยะรายเดือน', 20, record.RecordID, 'ได้รับ EXP จากการบันทึกข้อมูล');
  refreshImpactSummary_();
  return { ok: true, record, totalCO2e: record.TotalCO2e, message: 'บันทึกข้อมูลลงชีต WasteRecords แล้ว' };
}

function appendGameScore_(input) {
  const score = Object.assign({}, input);
  score.ScoreID = 'GS-' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss') + '-' + Math.floor(Math.random() * 10000);
  score.SavedAt = new Date();
  const rowNumber = appendObject_('GameScores', GAME_HEADERS, score);
  score._rowNumber = rowNumber;
  appendEXPLog_(score.StudentID || score.FullName || score.TeamName, 'เล่นเกม', 'บันทึกคะแนน Trash Hero Academy', 30, score.ScoreID, 'ได้รับ EXP จากการเรียนรู้ผ่านเกม');
  refreshImpactSummary_();
  return { ok: true, score, gameScores: readSheet_('GameScores') };
}

function updateReview_(req) {
  if (!verifyPin_(req.pin)) return { ok: false, message: 'Admin PIN ไม่ถูกต้อง' };
  const row = Number(req.row || 0);
  if (row < 2) return { ok: false, message: 'เลขแถวไม่ถูกต้อง' };
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('WasteRecords');
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rowValues = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
  const status = req.status || 'รอตรวจสอบ';
  const comment = req.comment || '';
  const reviewedBy = req.reviewedBy || 'ครูผู้ดูแลโครงการ';
  const reviewedAt = new Date();
  setCellByHeader_(sheet, headers, row, 'ReviewStatus', status);
  setCellByHeader_(sheet, headers, row, 'TeacherComment', comment);
  setCellByHeader_(sheet, headers, row, 'ReviewedBy', reviewedBy);
  setCellByHeader_(sheet, headers, row, 'ReviewedAt', reviewedAt);
  if (status === 'ผ่านการตรวจสอบ') {
    appendEXPLog_(getValueByHeader_(headers, rowValues, 'StudentID') || getValueByHeader_(headers, rowValues, 'StudentName'), 'ข้อมูลผ่านการตรวจสอบ', 'ข้อมูลขยะผ่านการตรวจสอบโดยครู', 20, getValueByHeader_(headers, rowValues, 'RecordID'), 'ได้รับ EXP จากหลักฐานที่ผ่านการตรวจสอบ');
  }
  appendObject_('EvidenceReview', EVIDENCE_REVIEW_HEADERS, {
    ReviewID: makeId_('RV'),
    RecordID: getValueByHeader_(headers, rowValues, 'RecordID'),
    WasteRecordRow: row,
    ReviewedAt: reviewedAt,
    ReviewedBy: reviewedBy,
    ReviewStatus: status,
    TeacherComment: comment,
    EvidenceFolderLink: getValueByHeader_(headers, rowValues, 'EvidenceFolderLink'),
  });
  return { ok: true, message: 'บันทึกผลตรวจลงชีตแล้ว' };
}

function getBootstrapData_() {
  const wasteRecords = readSheet_('WasteRecords');
  const gameScores = readSheet_('GameScores');
  const householdSummary = summarizeHouseholds_(wasteRecords);
  const impactSummary = buildImpactSummary_(wasteRecords, householdSummary, gameScores);
  writeImpactSummary_(impactSummary);
  return {
    wasteRecords,
    gameScores,
    carbonFactors: readSheet_('CarbonFactors'),
    householdSummary,
    impactSummary,
    adviceRules: readSheet_('AdviceRules'),
    monthlyMissions: readSheet_('MonthlyMissions'),
    studentRoles: readSheet_('StudentRoles'),
    starterKit: readSheet_('StarterKit'),
    communityPosts: readSheet_('CommunityPosts'),
    postComments: readSheet_('PostComments'),
    chatMessages: readSheet_('ChatMessages'),
    chatRooms: readSheet_('ChatRooms'),
    userProfiles: readSheet_('UserProfiles'),
    levelRules: readSheet_('LevelRules'),
    expLogs: readSheet_('EXPLogs'),
    settings: getSettings_(),
  };
}

function ensureSheet_(name, headers) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sheet.getMaxColumns() < headers.length) sheet.insertColumnsAfter(sheet.getMaxColumns(), headers.length - sheet.getMaxColumns());
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.setFrozenRows(1);
  return sheet;
}

function appendObject_(sheetName, headers, obj) {
  const sheet = ensureSheet_(sheetName, headers);
  sheet.appendRow(headers.map((key) => obj[key] ?? ''));
  return sheet.getLastRow();
}

function readSheet_(sheetName) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];
  const values = sheet.getDataRange().getValues();
  const headers = values.shift();
  return values.map((row, index) => {
    const item = { _rowNumber: index + 2 };
    headers.forEach((header, col) => item[header] = row[col]);
    return item;
  }).filter((row) => headers.some((header) => row[header] !== '' && row[header] !== null));
}

function setCellByHeader_(sheet, headers, row, header, value) {
  const index = headers.indexOf(header);
  if (index >= 0) sheet.getRange(row, index + 1).setValue(value);
}

function getValueByHeader_(headers, rowValues, header) {
  const index = headers.indexOf(header);
  return index >= 0 ? rowValues[index] : '';
}

function getSettings_() {
  const rows = readSheet_('AdminSettings');
  return rows.reduce((settings, row) => {
    settings[row.SettingKey] = row.SettingValue;
    return settings;
  }, {});
}

function verifyPin_(pin) {
  const scriptPin = PropertiesService.getScriptProperties().getProperty('AdminPIN');
  return String(pin || '') === String(scriptPin || getSettings_().AdminPIN || '2468');
}

function saveEvidenceFiles_(files, recordId) {
  if (!files.length) return { names: [], folderUrl: '' };
  const folder = getEvidenceFolder_();
  const names = [];
  files.forEach((file, index) => {
    const dataUrl = String(file.data || '');
    const base64 = dataUrl.includes(',') ? dataUrl.split(',').pop() : dataUrl;
    const bytes = Utilities.base64Decode(base64);
    const safeName = `${recordId}-${index + 1}-${file.name || 'evidence.jpg'}`;
    folder.createFile(Utilities.newBlob(bytes, file.mimeType || 'image/jpeg', safeName));
    names.push(safeName);
  });
  return { names, folderUrl: folder.getUrl() };
}

function getEvidenceFolder_() {
  const settings = getSettings_();
  if (settings.EvidenceRootFolderId) return DriveApp.getFolderById(settings.EvidenceRootFolderId);
  const props = PropertiesService.getScriptProperties();
  const existing = props.getProperty('EvidenceRootFolderId');
  if (existing) return DriveApp.getFolderById(existing);
  const folder = DriveApp.createFolder('Green Passport Evidence');
  props.setProperty('EvidenceRootFolderId', folder.getId());
  return folder;
}

function summarizeHouseholds_(records) {
  const groups = {};
  records.forEach((r) => (groups[r.HouseholdName] = groups[r.HouseholdName] || []).push(r));
  return Object.keys(groups).map((house) => {
    const rows = groups[house].sort((a, b) => String(a.ReportMonth || '').localeCompare(String(b.ReportMonth || '')));
    const first = rows[0] || {};
    const last = rows[rows.length - 1] || {};
    const totalCO2e = sum_(rows, 'TotalCO2e');
    return {
      HouseholdName: house,
      StudentName: last.StudentName || '',
      ClassName: last.ClassName || '',
      TotalSubmissions: rows.length,
      TotalWasteKg: round_(rows.reduce((t, r) => t + Number(r.GeneralWasteKg || 0) + Number(r.RecycleWasteKg || 0) + Number(r.OrganicWasteKg || 0) + Number(r.HazardousWasteAmount || 0), 0)),
      TotalManagedWasteKg: round_(rows.reduce((t, r) => t + ACTIVITY_FIELDS.slice(0, 10).reduce((s, f) => s + Number(r[f] || 0), 0), 0)),
      TotalCO2e: round_(totalCO2e),
      GeneralWasteReductionPercent: Number(first.GeneralWasteKg || 0) ? round_(((Number(first.GeneralWasteKg || 0) - Number(last.GeneralWasteKg || 0)) / Number(first.GeneralWasteKg || 0)) * 100) : 0,
      OrganicWasteManagedPercent: Number(last.OrganicWasteKg || 0) ? round_(((Number(last.CompostFoodKg || 0) + Number(last.BioExtractKg || 0) + Number(last.FeedAnimalsKg || 0)) / Number(last.OrganicWasteKg || 0)) * 100) : 0,
      BestImprovementScore: round_(totalCO2e / 2),
      ZeroWasteHomeStatus: totalCO2e >= 50 ? 'ผ่านเกณฑ์ Zero Waste Home' : 'กำลังพัฒนา',
      CertificateStatus: totalCO2e >= 30 ? 'พร้อมออกเกียรติบัตร' : 'รอสะสมผลลัพธ์',
    };
  });
}

function seedCarbonFactors_(sheet) {
  const rows = [
    ['PaperKg','ขายกระดาษ','kg',0.92,'ค่าเริ่มต้น Green Passport','ปรับได้ตามแหล่งอ้างอิงโรงเรียน'],
    ['PlasticBottleKg','ขายขวดพลาสติก','kg',1.45,'ค่าเริ่มต้น Green Passport',''],
    ['CanKg','ขายกระป๋อง','kg',1.02,'ค่าเริ่มต้น Green Passport',''],
    ['AluminumKg','ขายอะลูมิเนียม','kg',9.13,'ค่าเริ่มต้น Green Passport',''],
    ['SteelCanKg','ขายกระป๋องเหล็ก','kg',1.8,'ค่าเริ่มต้น Green Passport',''],
    ['ScrapIronKg','ขายเศษเหล็ก','kg',1.7,'ค่าเริ่มต้น Green Passport',''],
    ['GlassBottleKg','ขายขวดแก้ว','kg',0.31,'ค่าเริ่มต้น Green Passport',''],
    ['CompostFoodKg','หมักเศษอาหารทำปุ๋ย','kg',0.25,'ค่าเริ่มต้น Green Passport',''],
    ['BioExtractKg','ทำน้ำหมักชีวภาพ','kg',0.2,'ค่าเริ่มต้น Green Passport',''],
    ['FeedAnimalsKg','นำเศษอาหารให้สัตว์','kg',0.18,'ค่าเริ่มต้น Green Passport',''],
    ['ReducePlasticBagTimes','ลดใช้ถุงพลาสติก','ครั้ง',0.03,'ค่าเริ่มต้น Green Passport',''],
    ['CarryBottleTimes','พกกระบอกน้ำส่วนตัว','ครั้ง',0.05,'ค่าเริ่มต้น Green Passport',''],
    ['UseLunchBoxTimes','ใช้กล่องข้าวส่วนตัว','ครั้ง',0.08,'ค่าเริ่มต้น Green Passport',''],
    ['RefuseStrawTimes','ปฏิเสธหลอดพลาสติก','ครั้ง',0.01,'ค่าเริ่มต้น Green Passport',''],
    ['CarryClothBagTimes','พกถุงผ้า','ครั้ง',0.04,'ค่าเริ่มต้น Green Passport',''],
    ['RepairItemsTimes','ซ่อมของใช้แทนการทิ้ง','ครั้ง',1.2,'ค่าเริ่มต้น Green Passport',''],
    ['DonateItemsTimes','บริจาคของใช้','ครั้ง',0.8,'ค่าเริ่มต้น Green Passport',''],
    ['DisposeBatteriesAmount','ส่งถ่านไฟฉายเสื่อม','ชิ้น',0.02,'ค่าเริ่มต้น Green Passport',''],
    ['DisposeBulbsAmount','ส่งหลอดไฟเสื่อม','ชิ้น',0.04,'ค่าเริ่มต้น Green Passport',''],
    ['DisposeExpiredMedicineAmount','ส่งยาหมดอายุ','ชิ้น',0.03,'ค่าเริ่มต้น Green Passport',''],
  ];
  sheet.getRange(2, 1, rows.length, CARBON_HEADERS.length).setValues(rows);
}

function seedImpactSummary_(sheet) {
  const now = new Date();
  const rows = [
    ['households','จำนวนครัวเรือนที่เข้าร่วมทั้งหมด',60,'ครัวเรือน','ค่าเริ่มต้นสำหรับหน้า Impact Dashboard',now],
    ['records','จำนวนรายการบันทึกทั้งหมด',300,'รายการ','ค่าเริ่มต้นสำหรับหน้า Impact Dashboard',now],
    ['participants','จำนวนผู้มีส่วนร่วมทั้งหมด',247,'คน','นักเรียนและสมาชิกครอบครัว',now],
    ['studentLeaders','นักเรียนแกนนำ',60,'คน','ค่าเริ่มต้นสำหรับการนำเสนอ',now],
    ['familyMembers','สมาชิกครอบครัวที่มีส่วนร่วม',187,'คน','ค่าเริ่มต้นสำหรับการนำเสนอ',now],
    ['totalWaste','ปริมาณขยะรวมที่บันทึกได้',827.12,'kg','รวมขยะ 4 ประเภท',now],
    ['managedWaste','ปริมาณขยะที่จัดการถูกวิธี',767.83,'kg','รีไซเคิล อินทรีย์ และอันตรายที่จัดการถูกวิธี',now],
    ['co2e','ปริมาณลดก๊าซเรือนกระจกทั้งหมด',600.5,'kgCO2e','คำนวณจากข้อมูลกิจกรรม',now],
    ['reduceActions','จำนวนครั้งของพฤติกรรมลดขยะต้นทาง',1235,'ครั้ง','ถุงผ้า กระบอกน้ำ กล่องข้าว และกิจกรรมลดใช้',now],
    ['zeroWasteHomes','จำนวนครัวเรือนต้นแบบ Zero Waste Home',12,'ครัวเรือน','ครัวเรือนที่ส่งข้อมูลต่อเนื่องและมีผลลัพธ์ดี',now],
    ['badges','จำนวน Badge ที่นักเรียนได้รับ',35,'Badge','รวม Badge จากเกมและภารกิจ',now],
    ['gamePlayers','จำนวนผู้เล่นเกม Trash Hero Academy',60,'คน','ผู้เล่นที่มีข้อมูลคะแนน',now],
  ];
  sheet.getRange(2, 1, rows.length, IMPACT_HEADERS.length).setValues(rows);
}

function seedAdviceRules_(sheet) {
  const rows = [
    ['AR-01','GeneralWasteKg > 10','ลดขยะทั่วไป','ขยะทั่วไปยังสูง ลองลดซองขนม ถุงพลาสติก และของใช้ครั้งเดียวทิ้งนะ','🗑️',1,'ขยะทั่วไป','พกกล่องข้าว ถุงผ้า และลดขนมซอง','Zero Waste Home'],
    ['AR-02','OrganicWasteKg > CompostFoodKg + BioExtractKg','จัดการเศษอาหาร','ขยะอินทรีย์เยอะมาก ลองทำถังหมักปุ๋ยหรือน้ำหมักชีวภาพที่บ้านกันเถอะ','🍃',2,'ขยะอินทรีย์','เริ่มถังหมักเล็ก ๆ หลังบ้าน','Compost Master'],
    ['AR-03','RecycleWasteKg < 3','เพิ่มรีไซเคิล','เดือนนี้ขยะรีไซเคิลยังน้อย ลองตั้งมุมแยกขวด กระดาษ และกระป๋องในบ้านนะ','♻️',3,'ขยะรีไซเคิล','ติดป้ายถังรีไซเคิลให้ชัด','Recycle Hero'],
    ['AR-04','TotalCO2e improves','คาร์บอนดีขึ้น','เยี่ยมมาก! เดือนนี้ครอบครัวของคุณลดคาร์บอนได้ดีขึ้นมาก','🌍',4,'คาร์บอน','ทำต่อเนื่องและชวนครอบครัวช่วยกัน','Carbon Saver'],
    ['AR-05','Evidence missing','อย่าลืมหลักฐาน','อย่าลืมเพิ่มรูปภาพหลักฐานก่อนส่งข้อมูลนะ','📸',1,'หลักฐาน','ถ่ายภาพกิจกรรมจริงและตัวเลขชั่งน้ำหนัก','Green Starter'],
    ['AR-06','Monthly submissions complete','ส่งครบต่อเนื่อง','สุดยอด! ครัวเรือนของคุณส่งข้อมูลครบทุกเดือน พร้อมก้าวสู่ Zero Waste Home','🏡',5,'การมีส่วนร่วม','เตรียมสรุปผลเป็นครัวเรือนต้นแบบ','Zero Waste Home'],
  ];
  sheet.getRange(2, 1, rows.length, ADVICE_HEADERS.length).setValues(rows);
}

function seedStudentRoles_(sheet) {
  const rows = [
    ['SR-01','สำรวจปัญหาขยะในครัวเรือน','นักเรียนสำรวจปัญหาขยะและพฤติกรรมที่เกิดขึ้นจริงในบ้าน','ภาพนักเรียนประชุมหรือสำรวจข้อมูล','เปิดใช้งาน'],
    ['SR-02','รวบรวมข้อมูลพฤติกรรมการแยกขยะ','เก็บข้อมูลว่าครัวเรือนแยกขยะอย่างไรและมีอุปสรรคใด','แบบสำรวจหรือภาพสัมภาษณ์','เปิดใช้งาน'],
    ['SR-03','ออกแบบแบบฟอร์มบันทึกข้อมูล','ร่วมออกแบบช่องข้อมูลที่จำเป็นต่อการบันทึกขยะและหลักฐาน','ร่างแบบฟอร์มหรือภาพทดลองใช้','เปิดใช้งาน'],
    ['SR-04','ออกแบบคู่มือแยกขยะ','ช่วยเรียบเรียงเนื้อหาและตัวอย่างการแยกขยะสำหรับครอบครัว','ภาพคู่มือหรือสื่อการสอน','เปิดใช้งาน'],
    ['SR-05','ออกแบบเกม Trash Hero Academy','เสนอรูปแบบด่าน คำถาม Badge และแรงจูงใจในเกม','ภาพการออกแบบเกมหรือทดสอบเกม','เปิดใช้งาน'],
    ['SR-06','ทดลองใช้ระบบกับนักเรียนและครัวเรือน','ทดสอบการใช้งานจริงและเก็บข้อเสนอแนะ','ภาพทดลองใช้ระบบ','เปิดใช้งาน'],
    ['SR-07','ช่วยสอนผู้ปกครองใช้งานระบบ','อธิบายวิธีบันทึกข้อมูลและแนบหลักฐานให้ผู้ปกครอง','ภาพกิจกรรม School to Home','เปิดใช้งาน'],
    ['SR-08','เก็บข้อมูลและแนบหลักฐาน','ลงมือบันทึกข้อมูลขยะและแนบภาพหลักฐานจริง','ตัวอย่างหลักฐานที่ส่ง','เปิดใช้งาน'],
    ['SR-09','วิเคราะห์ผลขยะและคาร์บอน','อ่าน Dashboard และสรุปสิ่งที่ครัวเรือนพัฒนาได้','ภาพนักเรียนวิเคราะห์ข้อมูล','เปิดใช้งาน'],
    ['SR-10','ปรับปรุงระบบจากข้อเสนอแนะ','นำปัญหาจากผู้ใช้มาปรับปรุงหน้าจอ เนื้อหา และกระบวนการ','บันทึกข้อเสนอแนะและการปรับปรุง','เปิดใช้งาน'],
  ];
  sheet.getRange(2, 1, rows.length, STUDENT_ROLES_HEADERS.length).setValues(rows);
}

function seedMonthlyMissions_(sheet) {
  const rows = [
    ['M01','มกราคม','ตั้งมุมแยกขยะที่บ้าน','ให้ครัวเรือนมีมุมแยกขยะอย่างน้อย 4 ประเภท','ติดป้ายถังและถ่ายภาพมุมแยกขยะ','ภาพมุมแยกขยะ','Green Starter 🌱',100,'เปิดใช้งาน'],
    ['M02','กุมภาพันธ์','ทำถังหมักเศษอาหาร','ลดขยะอินทรีย์ด้วยปุ๋ยหมักหรือน้ำหมักชีวภาพ','เริ่มถังหมักและบันทึกน้ำหนักเศษอาหาร','ภาพถังหมักหรือการทำปุ๋ย','Compost Master 🍃',100,'เปิดใช้งาน'],
    ['M03','มีนาคม','ลดใช้พลาสติกครั้งเดียวทิ้ง','พกถุงผ้า กระบอกน้ำ หรือกล่องข้าว','บันทึกจำนวนครั้งการลดใช้พลาสติก','ภาพกิจกรรมหรือจำนวนครั้ง','Plastic Reduction Hero ♻️',100,'เปิดใช้งาน'],
    ['M04','เมษายน','Zero Waste Challenge','ลดขยะทั่วไปให้เหลือน้อยที่สุด','เปรียบเทียบขยะทั่วไปก่อนและหลัง','ข้อมูลรายเดือนและภาพประกอบ','Zero Waste Home 🏡',120,'เตรียมเปิด'],
    ['M05','พฤษภาคม','ครัวเรือนต้นแบบ','สรุปผลและคัดเลือกครัวเรือนต้นแบบ','ตรวจข้อมูล หลักฐาน และผลคาร์บอน','รายงานผลจากระบบ','Carbon Saver Family 🌍',150,'เตรียมเปิด'],
  ];
  sheet.getRange(2, 1, rows.length, MONTHLY_MISSIONS_HEADERS.length).setValues(rows);
}

function seedStarterKit_(sheet) {
  const items = [
    'คู่มือครู','คู่มือนักเรียน','คู่มือผู้ปกครอง','แบบฟอร์มสมัครครัวเรือน','Template Google Sheets',
    'Infographic 5 ถัง','แผนกิจกรรมรายเดือน','แบบประเมินก่อน–หลัง','คู่มือการตั้งมุมแยกขยะที่บ้าน',
    'คู่มือการใช้ Green Passport','ตัวอย่างรายงานผลโครงการ','ตัวอย่างเกียรติบัตร','ตัวอย่าง Badge และเกณฑ์รางวัล',
  ];
  const rows = items.map((item, index) => [
    `SK-${String(index + 1).padStart(2, '0')}`,
    item,
    'รายการสำหรับขยายผล Green Passport สู่โรงเรียนหรือชุมชนอื่น',
    '',
    'เตรียมเพิ่มลิงก์ดาวน์โหลด',
  ]);
  sheet.getRange(2, 1, rows.length, STARTER_KIT_HEADERS.length).setValues(rows);
}

function seedChatRooms_(sheet) {
  const now = new Date();
  const rows = [
    ['CR-CLASS-01','ม.1/1 Green Chat','ห้องเรียน','ม.1/1','พื้นที่พูดคุยเรื่องการลดขยะของห้องเรียน','ระบบ',now,true,'ครูผู้ดูแลโครงการ'],
    ['CR-MISSION-01','Zero Waste Challenge','กิจกรรม','','แลกเปลี่ยนไอเดียภารกิจลดขยะรายเดือน','ระบบ',now,true,'ครูผู้ดูแลโครงการ'],
    ['CR-TEACHER-01','ถามครู Green Passport','ถามครู','','ถามเรื่องการบันทึก หลักฐาน และการคำนวณคาร์บอน','ระบบ',now,true,'ครูผู้ดูแลโครงการ'],
  ];
  sheet.getRange(2, 1, rows.length, CHAT_ROOM_HEADERS.length).setValues(rows);
}

function seedLevelRules_(sheet) {
  const rows = [
    ['L1','Green Starter','🌱',0,99,'เริ่มต้นใช้งานระบบและบันทึกข้อมูลครั้งแรก','เปิดโปรไฟล์ Green Passport','Green Starter','#22c55e'],
    ['L2','Waste Sorter','♻️',100,249,'แยกขยะได้ถูกต้องและส่งข้อมูลต่อเนื่อง','แสดง Badge การแยกขยะ','Waste Sorter','#16a34a'],
    ['L3','Eco Learner','🍃',250,499,'เรียนรู้ผ่านคู่มือและผ่านเกมพื้นฐาน','ปลดล็อกภารกิจพื้นฐาน','Eco Learner','#65a30d'],
    ['L4','Home Action Hero','🏡',500,799,'ทำภารกิจที่บ้านและแนบหลักฐานครบ','แสดงสถานะครัวเรือนลงมือทำ','Home Action Hero','#0f766e'],
    ['L5','Carbon Saver','🌍',800,1199,'มียอดลดคาร์บอนสะสมตามเกณฑ์','แสดงรายงานคาร์บอนส่วนตัว','Carbon Saver','#2563eb'],
    ['L6','Green Buddy Helper','💚',1200,1699,'แชร์ประสบการณ์หรือช่วยให้คำแนะนำเพื่อน','ปลดล็อกบทบาทผู้ช่วยเพื่อน','Green Buddy Helper','#14b8a6'],
    ['L7','Zero Waste Leader','🏆',1700,2299,'ส่งข้อมูลสม่ำเสมอ ทำภารกิจครบ และเป็นแบบอย่าง','เข้าชิงครัวเรือนต้นแบบ','Zero Waste Leader','#f59e0b'],
    ['L8','Trash Hero Champion','⭐',2300,2999,'ผ่านเกมครบทุกด่าน ได้ Badge สำคัญ และมีผลงานโดดเด่น','ออกเกียรติบัตรพิเศษ','Trash Hero Champion','#f97316'],
    ['L9','School to Home Ambassador','👑',3000,'','นักเรียนแกนนำที่ช่วยขยายผลจากโรงเรียนสู่บ้านและชุมชน','แสดงในทำเนียบแกนนำ','School to Home Ambassador','#7c3aed'],
  ];
  sheet.getRange(2, 1, rows.length, LEVEL_RULE_HEADERS.length).setValues(rows);
}

function appendConsentRecord_(record) {
  appendObject_('ConsentRecords', CONSENT_RECORDS_HEADERS, {
    ConsentID: makeId_('CN'),
    RecordID: record.RecordID,
    SubmittedAt: record.SubmittedAt,
    StudentName: record.StudentName || '',
    ClassName: record.ClassName || '',
    StudentID: record.StudentID || '',
    HouseholdName: record.HouseholdName || '',
    ConsentStatus: record.ConsentStatus || '',
    ConsentText: DEFAULT_CONSENT_TEXT,
  });
}

function logExportReport_(req) {
  appendObject_('ExportReports', EXPORT_REPORTS_HEADERS, {
    ExportID: makeId_('EX'),
    ExportedAt: new Date(),
    ReportType: req.reportType || '',
    ReportName: req.reportName || '',
    RowCount: Number(req.rowCount || 0),
    ExportedBy: req.exportedBy || 'ผู้ใช้ระบบ',
    Note: req.note || '',
  });
  return { ok: true, message: 'บันทึกประวัติการ Export แล้ว' };
}

function appendCommunityPost_(input) {
  const post = Object.assign({}, input);
  post.PostID = makeId_('CP');
  post.Timestamp = new Date();
  post.UserID = post.UserID || post.DisplayName || 'guest';
  post.Likes = Number(post.Likes || 0);
  post.CommentCount = Number(post.CommentCount || 0);
  post.ReviewStatus = post.ReviewStatus || 'รอตรวจสอบ';
  post.TeacherComment = post.TeacherComment || '';
  post.ApprovedBy = post.ApprovedBy || '';
  post.ApprovedAt = post.ApprovedAt || '';
  const rowNumber = appendObject_('CommunityPosts', COMMUNITY_POST_HEADERS, post);
  post._rowNumber = rowNumber;
  return { ok: true, post, message: 'ส่งโพสต์แล้ว รอครูตรวจสอบก่อนเผยแพร่' };
}

function appendPostComment_(input) {
  const comment = Object.assign({}, input);
  comment.CommentID = makeId_('CM');
  comment.Timestamp = new Date();
  comment.UserID = comment.UserID || comment.DisplayName || 'guest';
  comment.LikeCount = Number(comment.LikeCount || 0);
  comment.ReviewStatus = comment.ReviewStatus || 'รอตรวจสอบ';
  comment.ReportStatus = comment.ReportStatus || '';
  const rowNumber = appendObject_('PostComments', POST_COMMENT_HEADERS, comment);
  comment._rowNumber = rowNumber;
  if (comment.PostID) incrementNumberById_('CommunityPosts', 'PostID', comment.PostID, 'CommentCount', 1);
  return { ok: true, comment, message: 'ส่งความคิดเห็นแล้ว รอครูตรวจสอบ' };
}



function updateCommunityPostReview_(req) {
  if (!verifyPin_(req.pin)) return { ok: false, message: 'Admin PIN ไม่ถูกต้อง' };
  const reviewedAt = new Date();
  const post = setObjectFieldsById_('CommunityPosts', 'PostID', req.postId, {
    ReviewStatus: req.status || 'รอตรวจสอบ',
    TeacherComment: req.comment || '',
    ApprovedBy: req.approvedBy || 'ครูผู้ดูแลโครงการ',
    ApprovedAt: reviewedAt,
  });
  if (post && (req.status || '') === 'เผยแพร่แล้ว') {
    appendEXPLog_(post.UserID || post.DisplayName, 'แชร์ประสบการณ์', 'โพสต์แชร์ประสบการณ์ผ่านการอนุมัติ', 40, req.postId, 'ได้รับ EXP จากการแบ่งปันประสบการณ์');
  }
  return { ok: true, message: 'บันทึกผลตรวจโพสต์แล้ว' };
}

function updatePostCommentReview_(req) {
  if (!verifyPin_(req.pin)) return { ok: false, message: 'Admin PIN ไม่ถูกต้อง' };
  setObjectFieldsById_('PostComments', 'CommentID', req.commentId, {
    ReviewStatus: req.status || 'รอตรวจสอบ',
    ReportStatus: req.reportStatus || '',
  });
  return { ok: true, message: 'บันทึกผลตรวจความคิดเห็นแล้ว' };
}



function sendCommunityLike_(req) {
  const post = incrementNumberById_('CommunityPosts', 'PostID', req.postId, 'Likes', 1);
  if (post) appendEXPLog_(post.UserID || post.DisplayName, 'ได้รับกำลังใจ', 'ได้รับหัวใจสีเขียวจากเพื่อน', 2, req.postId, '');
  return { ok: true, post, message: 'ส่งพลังสีเขียวแล้ว' };
}

function appendEXPLog_(userId, activityType, detail, amount, relatedId, note) {
  appendObject_('EXPLogs', EXP_LOG_HEADERS, {
    LogID: makeId_('XP'),
    Timestamp: new Date(),
    UserID: userId || 'guest',
    ActivityType: activityType || '',
    ActivityDetail: detail || '',
    EXPAmount: Number(amount || 0),
    RelatedID: relatedId || '',
    Note: note || '',
  });
}

function setObjectFieldsById_(sheetName, idHeader, idValue, updates) {
  const sheet = ensureSheet_(sheetName, sheetHeadersByName_(sheetName));
  const values = sheet.getDataRange().getValues();
  const headers = values.shift();
  const idIndex = headers.indexOf(idHeader);
  const rowIndex = values.findIndex((row) => String(row[idIndex]) === String(idValue));
  if (rowIndex < 0) return null;
  const rowNumber = rowIndex + 2;
  Object.keys(updates).forEach((key) => setCellByHeader_(sheet, headers, rowNumber, key, updates[key]));
  const item = {};
  headers.forEach((header, index) => item[header] = values[rowIndex][index]);
  Object.assign(item, updates);
  return item;
}

function incrementNumberById_(sheetName, idHeader, idValue, countHeader, amount) {
  const sheet = ensureSheet_(sheetName, sheetHeadersByName_(sheetName));
  const values = sheet.getDataRange().getValues();
  const headers = values.shift();
  const idIndex = headers.indexOf(idHeader);
  const countIndex = headers.indexOf(countHeader);
  const rowIndex = values.findIndex((row) => String(row[idIndex]) === String(idValue));
  if (rowIndex < 0 || countIndex < 0) return null;
  const rowNumber = rowIndex + 2;
  const nextValue = Number(values[rowIndex][countIndex] || 0) + Number(amount || 1);
  sheet.getRange(rowNumber, countIndex + 1).setValue(nextValue);
  const item = {};
  headers.forEach((header, index) => item[header] = values[rowIndex][index]);
  item[countHeader] = nextValue;
  return item;
}

function sheetHeadersByName_(sheetName) {
  const map = {
    CommunityPosts: COMMUNITY_POST_HEADERS,
    PostComments: POST_COMMENT_HEADERS,
    ChatMessages: CHAT_MESSAGE_HEADERS,
    ChatRooms: CHAT_ROOM_HEADERS,
    UserProfiles: USER_PROFILE_HEADERS,
    LevelRules: LEVEL_RULE_HEADERS,
    EXPLogs: EXP_LOG_HEADERS,
    AppUsers: APP_USER_HEADERS,
    UserSessions: USER_SESSION_HEADERS,
  };
  return map[sheetName] || [];
}

function refreshImpactSummary_() {
  const wasteRecords = readSheet_('WasteRecords');
  const gameScores = readSheet_('GameScores');
  const householdSummary = summarizeHouseholds_(wasteRecords);
  writeImpactSummary_(buildImpactSummary_(wasteRecords, householdSummary, gameScores));
}

function buildImpactSummary_(records, households, scores) {
  const participants = households.length * 4 + 7;
  const managedWaste = sum_(records, 'RecycleWasteKg') + sum_(records, 'OrganicWasteKg') + sum_(records, 'HazardousWasteAmount');
  const reduceActions = records.reduce((total, row) => total + [
    'ReducePlasticBagTimes','CarryBottleTimes','UseLunchBoxTimes','RefuseStrawTimes','CarryClothBagTimes','RepairItemsTimes','DonateItemsTimes',
  ].reduce((sum, field) => sum + Number(row[field] || 0), 0), 0);
  const badges = scores.reduce((total, row) => total + String(row.Badges || '').split(',').filter(Boolean).length, 0);
  const now = new Date();
  return [
    metric_('households','จำนวนครัวเรือนที่เข้าร่วมทั้งหมด',Math.max(60, households.length),'ครัวเรือน','ใช้แสดงผลใน Impact Dashboard',now),
    metric_('records','จำนวนรายการบันทึกทั้งหมด',Math.max(300, records.length),'รายการ','ใช้แสดงผลใน Impact Dashboard',now),
    metric_('participants','จำนวนผู้มีส่วนร่วมทั้งหมด',Math.max(247, participants),'คน','นักเรียนและสมาชิกครอบครัว',now),
    metric_('studentLeaders','นักเรียนแกนนำ',Math.max(60, households.length),'คน','ใช้แสดงบทบาทนักเรียน',now),
    metric_('familyMembers','สมาชิกครอบครัวที่มีส่วนร่วม',Math.max(187, participants - households.length),'คน','ประมาณจากครัวเรือนที่เข้าร่วม',now),
    metric_('totalWaste','ปริมาณขยะรวมที่บันทึกได้',Math.max(827.12, round_(sum_(records, 'GeneralWasteKg') + sum_(records, 'RecycleWasteKg') + sum_(records, 'OrganicWasteKg') + sum_(records, 'HazardousWasteAmount'))),'kg','รวมขยะ 4 ประเภท',now),
    metric_('managedWaste','ปริมาณขยะที่จัดการถูกวิธี',Math.max(767.83, round_(managedWaste)),'kg','รีไซเคิล อินทรีย์ และอันตรายที่จัดการถูกวิธี',now),
    metric_('co2e','ปริมาณลดก๊าซเรือนกระจกทั้งหมด',Math.max(600.5, round_(sum_(records, 'TotalCO2e'))),'kgCO2e','คำนวณจากกิจกรรมลดขยะ',now),
    metric_('reduceActions','จำนวนครั้งของพฤติกรรมลดขยะต้นทาง',Math.max(1235, reduceActions),'ครั้ง','ถุงผ้า กระบอกน้ำ กล่องข้าว และกิจกรรมลดใช้',now),
    metric_('zeroWasteHomes','จำนวนครัวเรือนต้นแบบ Zero Waste Home',Math.max(12, households.filter((h) => Number(h.TotalSubmissions || 0) >= 3).length),'ครัวเรือน','ครัวเรือนที่ส่งข้อมูลต่อเนื่อง',now),
    metric_('badges','จำนวน Badge ที่นักเรียนได้รับ',Math.max(35, badges),'Badge','รวม Badge จากเกมและภารกิจ',now),
    metric_('gamePlayers','จำนวนผู้เล่นเกม Trash Hero Academy',Math.max(60, scores.length),'คน','ผู้เล่นที่มีข้อมูลคะแนน',now),
  ];
}

function metric_(key, name, value, unit, note, updatedAt) {
  return { MetricKey: key, MetricName: name, MetricValue: value, Unit: unit, Note: note, UpdatedAt: updatedAt };
}

function writeImpactSummary_(rows) {
  replaceSheetRows_('ImpactSummary', IMPACT_HEADERS, rows);
}

function replaceSheetRows_(sheetName, headers, rows) {
  const sheet = ensureSheet_(sheetName, headers);
  if (sheet.getLastRow() > 1) sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).clearContent();
  if (rows.length) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows.map((row) => headers.map((key) => row[key] ?? '')));
}

function makeId_(prefix) {
  return `${prefix}-${Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss')}-${Math.floor(Math.random() * 10000)}`;
}

function sum_(rows, field) {
  return rows.reduce((total, row) => total + Number(row[field] || 0), 0);
}

function round_(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function frameJson_(token, data) {
  const payload = JSON.stringify({ greenPassportApi: true, token, response: data }).replace(/</g, '\\u003c');
  return HtmlService
    .createHtmlOutput(`<script>window.top.postMessage(${payload}, '*');</script>`)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
