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

function setupGreenPassport() {
  ensureSheet_('WasteRecords', WASTE_HEADERS);
  ensureSheet_('GameScores', GAME_HEADERS);
  const carbon = ensureSheet_('CarbonFactors', CARBON_HEADERS);
  if (carbon.getLastRow() < 2) seedCarbonFactors_(carbon);
  const settings = ensureSheet_('AdminSettings', SETTINGS_HEADERS);
  if (settings.getLastRow() < 2) {
    settings.getRange(2, 1, 4, 3).setValues([
      ['AdminPIN', '2468', 'เปลี่ยนทันทีหลัง deploy จริง'],
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
  if (req.action === 'adminLogin') return verifyPin_(req.pin) ? { ok: true } : { ok: false, message: 'Admin PIN ไม่ถูกต้อง' };
  if (req.action === 'updateReview') return updateReview_(req);
  return { ok: false, message: 'Unknown action' };
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
  return { ok: true, record, totalCO2e: record.TotalCO2e, message: 'บันทึกข้อมูลลงชีต WasteRecords แล้ว' };
}

function appendGameScore_(input) {
  const score = Object.assign({}, input);
  score.ScoreID = 'GS-' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss') + '-' + Math.floor(Math.random() * 10000);
  score.SavedAt = new Date();
  const rowNumber = appendObject_('GameScores', GAME_HEADERS, score);
  score._rowNumber = rowNumber;
  return { ok: true, score, gameScores: readSheet_('GameScores') };
}

function updateReview_(req) {
  if (!verifyPin_(req.pin)) return { ok: false, message: 'Admin PIN ไม่ถูกต้อง' };
  const row = Number(req.row || 0);
  if (row < 2) return { ok: false, message: 'เลขแถวไม่ถูกต้อง' };
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('WasteRecords');
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  setCellByHeader_(sheet, headers, row, 'ReviewStatus', req.status || 'รอตรวจสอบ');
  setCellByHeader_(sheet, headers, row, 'TeacherComment', req.comment || '');
  setCellByHeader_(sheet, headers, row, 'ReviewedBy', 'ครูผู้ดูแลโครงการ');
  setCellByHeader_(sheet, headers, row, 'ReviewedAt', new Date());
  return { ok: true, message: 'บันทึกผลตรวจลงชีตแล้ว' };
}

function getBootstrapData_() {
  const wasteRecords = readSheet_('WasteRecords');
  return {
    wasteRecords,
    gameScores: readSheet_('GameScores'),
    carbonFactors: readSheet_('CarbonFactors'),
    householdSummary: summarizeHouseholds_(wasteRecords),
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

function getSettings_() {
  const rows = readSheet_('AdminSettings');
  return rows.reduce((settings, row) => {
    settings[row.SettingKey] = row.SettingValue;
    return settings;
  }, {});
}

function verifyPin_(pin) {
  return String(pin || '') === String(getSettings_().AdminPIN || '2468');
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
