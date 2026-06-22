// --- Generated Module: state.js ---

// --- SHEET_ID ---
const SHEET_ID = '1G0rL3YSQexyiMp7vPu8DdOo2tUZk9xIhi1E1poaJqi4';

// --- SHEET_URL ---
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`;

// --- SHEET_API_STORAGE_KEY ---
const SHEET_API_STORAGE_KEY = 'greenPassportSheetApiUrl';

// --- LOCAL_DATA_KEY ---
const LOCAL_DATA_KEY = 'greenPassportData';

// --- LOCAL_QUEUE_KEY ---
const LOCAL_QUEUE_KEY = 'greenPassportPendingWrites';

// --- AUTH_SESSION_KEY ---
const AUTH_SESSION_KEY = 'greenPassportAuthSession';

// --- LOCAL_AUTH_USERS_KEY ---
const LOCAL_AUTH_USERS_KEY = 'greenPassportLocalUsers';

// --- queryParams ---
const queryParams = new URLSearchParams(location.search);

// --- siteConfig ---
const siteConfig = window.GREEN_PASSPORT_CONFIG || {};

// --- sheetApiUrl ---
let sheetApiUrl = queryParams.get('api') || siteConfig.sheetApiUrl || localStorage.getItem(SHEET_API_STORAGE_KEY) || '';

// --- firebaseApp ---
let firebaseApp = null;

// --- firebaseAuth ---
let firebaseAuth = null;

// --- firebaseFs ---
let firebaseFs = null;

// --- firebaseDb ---
let firebaseDb = null;

// --- pages ---
const pages = [
      ['home', 'หน้าแรก', 'home'],
      ['record', 'บันทึกข้อมูลขยะ', 'edit'],
      ['guide', 'คู่มือแยกขยะ', 'book'],
      ['game', 'Trash Hero Academy', 'game'],
      ['leaderboard', 'Leaderboard', 'rank'],
      ['community', 'ชุมชน Green Passport', 'community'],
      ['friends', 'เพื่อน Green Passport', 'friends'],
      ['chat', 'Green Chat', 'chat'],
      ['profile', 'โปรไฟล์ของฉัน', 'profile'],
      ['impact', 'ผลกระทบของเรา', 'impact'],
      ['dashboard', 'Dashboard', 'chart'],
      ['compare', 'เปรียบเทียบก่อน-หลัง', 'compare'],
      ['formula', 'สูตรคำนวณคาร์บอน', 'formula'],
      ['missions', 'ภารกิจรายเดือน', 'mission'],
      ['reminders', 'แจ้งเตือน', 'bell'],
      ['studentRoles', 'บทบาทนักเรียนผู้พัฒนา', 'student'],
      ['starterKit', 'Starter Kit', 'kit'],
      ['certificate', 'เกียรติบัตร', 'award'],
      ['admin', 'Admin', 'lock'],
    ];

// --- adminOnlyPageIds ---
const adminOnlyPageIds = new Set(['dashboard','compare','formula','missions','reminders','studentRoles','starterKit','certificate']);

// --- icons ---
const icons = {
      home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>',
      edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
      book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"/></svg>',
      game: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="8" width="18" height="10" rx="3"/><path d="M8 12v2M7 13h2M15 13h.01M18 13h.01"/></svg>',
      rank: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v4a5 5 0 0 1-10 0Z"/><path d="M5 5H3v2a4 4 0 0 0 4 4"/><path d="M19 5h2v2a4 4 0 0 1-4 4"/></svg>',
      community: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 8h10"/><path d="M7 12h6"/><path d="M21 12c0 4.4-4 8-9 8a10 10 0 0 1-4-.8L3 20l1.4-3.5A7.3 7.3 0 0 1 3 12c0-4.4 4-8 9-8s9 3.6 9 8Z"/></svg>',
      friends: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/><path d="M8 9h8M8 13h5"/></svg>',
      profile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
      impact: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19V5"/><path d="M4 19h16"/><path d="m7 15 4-4 3 3 5-7"/><path d="M17 7h2v2"/></svg>',
      chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 15v2"/><path d="M12 10v7"/><path d="M17 6v11"/></svg>',
      compare: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h14"/><path d="m14 3 4 4-4 4"/><path d="M20 17H6"/><path d="m10 13-4 4 4 4"/></svg>',
      formula: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19h16"/><path d="m5 5 6 7-6 7"/><path d="M13 12h6"/></svg>',
      mission: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-12"/><path d="M5 6h8l-2 4h8l-3 5H8z"/></svg>',
      bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9"/><path d="M10 21h4"/></svg>',
      student: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/></svg>',
      kit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16v13H4z"/><path d="M8 7V5h8v2"/><path d="M8 13h8"/><path d="M12 9v8"/></svg>',
      award: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M8.5 12.5 7 22l5-3 5 3-1.5-9.5"/></svg>',
      lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
      code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>',
    };

// --- activityFields ---
const activityFields = [
      ['PaperKg', 'ขายกระดาษ', 'kg'],
      ['PlasticBottleKg', 'ขายขวดพลาสติก', 'kg'],
      ['CanKg', 'ขายกระป๋อง', 'kg'],
      ['AluminumKg', 'ขายอะลูมิเนียม', 'kg'],
      ['SteelCanKg', 'ขายกระป๋องเหล็ก', 'kg'],
      ['ScrapIronKg', 'ขายเศษเหล็ก', 'kg'],
      ['GlassBottleKg', 'ขายขวดแก้ว', 'kg'],
      ['CompostFoodKg', 'หมักเศษอาหารทำปุ๋ย', 'kg'],
      ['BioExtractKg', 'ทำน้ำหมักชีวภาพ', 'kg'],
      ['FeedAnimalsKg', 'นำเศษอาหารให้สัตว์', 'kg'],
      ['ReducePlasticBagTimes', 'ลดใช้ถุงพลาสติก', 'ครั้ง'],
      ['CarryBottleTimes', 'พกกระบอกน้ำส่วนตัว', 'ครั้ง'],
      ['UseLunchBoxTimes', 'ใช้กล่องข้าวส่วนตัว', 'ครั้ง'],
      ['RefuseStrawTimes', 'ปฏิเสธหลอดพลาสติก', 'ครั้ง'],
      ['CarryClothBagTimes', 'พกถุงผ้า', 'ครั้ง'],
      ['RepairItemsTimes', 'ซ่อมของใช้แทนการทิ้ง', 'ครั้ง'],
      ['DonateItemsTimes', 'บริจาคของใช้', 'ครั้ง'],
      ['DisposeBatteriesAmount', 'ส่งถ่านไฟฉายเสื่อม', 'ชิ้น'],
      ['DisposeBulbsAmount', 'ส่งหลอดไฟเสื่อม', 'ชิ้น'],
      ['DisposeExpiredMedicineAmount', 'ส่งยาหมดอายุ', 'ชิ้น'],
    ];

// --- factorMap ---
const factorMap = {
      PaperKg: .92, PlasticBottleKg: 1.45, CanKg: 1.02, AluminumKg: 9.13, SteelCanKg: 1.8,
      ScrapIronKg: 1.7, GlassBottleKg: .31, CompostFoodKg: .25, BioExtractKg: .2, FeedAnimalsKg: .18,
      ReducePlasticBagTimes: .03, CarryBottleTimes: .05, UseLunchBoxTimes: .08, RefuseStrawTimes: .01,
      CarryClothBagTimes: .04, RepairItemsTimes: 1.2, DonateItemsTimes: .8,
      DisposeBatteriesAmount: .02, DisposeBulbsAmount: .04, DisposeExpiredMedicineAmount: .03,
    };

// --- userModes ---
const userModes = [
      ['student', 'นักเรียน', '🌱', 'บันทึกข้อมูล เล่นเกม ดู Badge คะแนน ระดับ และคำแนะนำของครัวเรือน'],
      ['parent', 'ผู้ปกครอง', '🏡', 'อ่านคู่มือ ตั้งมุมแยกขยะ ช่วยส่งหลักฐาน และดูผลลัพธ์ของบ้าน'],
      ['teacher', 'ครู', '👩‍🏫', 'ตรวจหลักฐาน ดูรายงาน ส่งออกข้อมูล จัดการ Badge และข้อความแจ้งเตือน'],
      ['leader', 'ผู้บริหาร', '📊', 'ดู Impact Dashboard ผลลัพธ์ภาพรวม รายงาน และข้อมูลประกอบการนำเสนอ'],
    ];

// --- adviceRules ---
const adviceRules = [
      { RuleID: 'AR-01', Condition: 'GeneralWasteKg > 10', AdviceTitle: 'ลดขยะทั่วไป', AdviceText: 'ขยะทั่วไปยังสูง ลองลดซองขนม ถุงพลาสติก และของใช้ครั้งเดียวทิ้งนะ', Emoji: '🗑️', Priority: 1, RelatedWasteType: 'ขยะทั่วไป', SuggestedAction: 'พกกล่องข้าว ถุงผ้า และลดขนมซอง', BadgeSuggestion: 'Zero Waste Home' },
      { RuleID: 'AR-02', Condition: 'OrganicWasteKg > CompostFoodKg + BioExtractKg', AdviceTitle: 'จัดการเศษอาหาร', AdviceText: 'ขยะอินทรีย์เยอะมาก ลองทำถังหมักปุ๋ยหรือน้ำหมักชีวภาพที่บ้านกันเถอะ', Emoji: '🍃', Priority: 2, RelatedWasteType: 'ขยะอินทรีย์', SuggestedAction: 'เริ่มถังหมักเล็ก ๆ หลังบ้าน', BadgeSuggestion: 'Compost Master' },
      { RuleID: 'AR-03', Condition: 'RecycleWasteKg < 3', AdviceTitle: 'เพิ่มรีไซเคิล', AdviceText: 'เดือนนี้ขยะรีไซเคิลยังน้อย ลองตั้งมุมแยกขวด กระดาษ และกระป๋องในบ้านนะ', Emoji: '♻️', Priority: 3, RelatedWasteType: 'ขยะรีไซเคิล', SuggestedAction: 'ติดป้ายถังรีไซเคิลให้ชัด', BadgeSuggestion: 'Recycle Hero' },
      { RuleID: 'AR-04', Condition: 'TotalCO2e improves', AdviceTitle: 'คาร์บอนดีขึ้น', AdviceText: 'เยี่ยมมาก! เดือนนี้ครอบครัวของคุณลดคาร์บอนได้ดีขึ้นมาก', Emoji: '🌍', Priority: 4, RelatedWasteType: 'คาร์บอน', SuggestedAction: 'ทำต่อเนื่องและชวนครอบครัวช่วยกัน', BadgeSuggestion: 'Carbon Saver' },
      { RuleID: 'AR-05', Condition: 'Evidence missing', AdviceTitle: 'อย่าลืมหลักฐาน', AdviceText: 'อย่าลืมเพิ่มรูปภาพหลักฐานก่อนส่งข้อมูลนะ', Emoji: '📸', Priority: 1, RelatedWasteType: 'หลักฐาน', SuggestedAction: 'ถ่ายภาพกิจกรรมจริงและตัวเลขชั่งน้ำหนัก', BadgeSuggestion: 'Green Starter' },
      { RuleID: 'AR-06', Condition: 'Monthly submissions complete', AdviceTitle: 'ส่งครบต่อเนื่อง', AdviceText: 'สุดยอด! ครัวเรือนของคุณส่งข้อมูลครบทุกเดือน พร้อมก้าวสู่ Zero Waste Home', Emoji: '🏡', Priority: 5, RelatedWasteType: 'การมีส่วนร่วม', SuggestedAction: 'เตรียมสรุปผลเป็นครัวเรือนต้นแบบ', BadgeSuggestion: 'Zero Waste Home' },
    ];

// --- monthlyMissions ---
const monthlyMissions = [
      ['M01', 'มกราคม', 'ตั้งมุมแยกขยะที่บ้าน', 'ให้ครัวเรือนมีมุมแยกขยะอย่างน้อย 4 ประเภท', 'ติดป้ายถังและถ่ายภาพมุมแยกขยะ', 'ภาพมุมแยกขยะ', 'Green Starter 🌱', 100, 'เปิดใช้งาน'],
      ['M02', 'กุมภาพันธ์', 'ทำถังหมักเศษอาหาร', 'ลดขยะอินทรีย์ด้วยปุ๋ยหมักหรือน้ำหมักชีวภาพ', 'เริ่มถังหมักและบันทึกน้ำหนักเศษอาหาร', 'ภาพถังหมักหรือการทำปุ๋ย', 'Compost Master 🍃', 100, 'เปิดใช้งาน'],
      ['M03', 'มีนาคม', 'ลดใช้พลาสติกครั้งเดียวทิ้ง', 'พกถุงผ้า กระบอกน้ำ หรือกล่องข้าว', 'บันทึกจำนวนครั้งการลดใช้พลาสติก', 'ภาพกิจกรรมหรือจำนวนครั้ง', 'Plastic Reduction Hero ♻️', 100, 'เปิดใช้งาน'],
      ['M04', 'เมษายน', 'Zero Waste Challenge', 'ลดขยะทั่วไปให้เหลือน้อยที่สุด', 'เปรียบเทียบขยะทั่วไปก่อนและหลัง', 'ข้อมูลรายเดือนและภาพประกอบ', 'Zero Waste Home 🏡', 120, 'เตรียมเปิด'],
      ['M05', 'พฤษภาคม', 'ครัวเรือนต้นแบบ', 'สรุปผลและคัดเลือกครัวเรือนต้นแบบ', 'ตรวจข้อมูล หลักฐาน และผลคาร์บอน', 'รายงานผลจากระบบ', 'Carbon Saver Family 🌍', 150, 'เตรียมเปิด'],
    ];

// --- studentRoleSteps ---
const studentRoleSteps = [
      'สำรวจปัญหาขยะในครัวเรือน',
      'รวบรวมข้อมูลพฤติกรรมการแยกขยะ',
      'ออกแบบแบบฟอร์มบันทึกข้อมูล',
      'ออกแบบคู่มือแยกขยะ',
      'ออกแบบเกม Trash Hero Academy',
      'ทดลองใช้ระบบกับนักเรียนและครัวเรือน',
      'ช่วยสอนผู้ปกครองใช้งานระบบ',
      'เก็บข้อมูลและแนบหลักฐาน',
      'วิเคราะห์ผลขยะและคาร์บอน',
      'ปรับปรุงระบบจากข้อเสนอแนะ',
    ];

// --- starterKitItems ---
const starterKitItems = ['คู่มือครู', 'คู่มือนักเรียน', 'คู่มือผู้ปกครอง', 'แบบฟอร์มสมัครครัวเรือน', 'Template Google Sheets', 'Infographic 5 ถัง', 'แผนกิจกรรมรายเดือน', 'แบบประเมินก่อน–หลัง', 'คู่มือการตั้งมุมแยกขยะที่บ้าน', 'คู่มือการใช้ Green Passport', 'ตัวอย่างรายงานผลโครงการ', 'ตัวอย่างเกียรติบัตร', 'ตัวอย่าง Badge และเกณฑ์รางวัล'];

// --- gameStages ---
const gameStages = [
      {
        id: 1,
        name: 'Basic Sorter',
        thaiName: 'นักแยกขยะมือใหม่',
        type: 'organic',
        badge: '🌱 Green Starter',
        intro: 'เลือกถังให้ถูกกับขยะที่แสดงทีละรายการ',
        items: [
          q('เปลือกกล้วย', ['ขยะอินทรีย์', 'ขยะรีไซเคิล', 'ขยะทั่วไป', 'ขยะอันตราย', 'ขยะติดเชื้อ'], 0),
          q('เศษอาหาร', ['ขยะอินทรีย์', 'ขยะรีไซเคิล', 'ขยะทั่วไป', 'ขยะอันตราย', 'ขยะติดเชื้อ'], 0),
          q('ขวดน้ำพลาสติกสะอาด', ['ขยะอินทรีย์', 'ขยะรีไซเคิล', 'ขยะทั่วไป', 'ขยะอันตราย', 'ขยะติดเชื้อ'], 1),
          q('กระป๋องน้ำอัดลม', ['ขยะอินทรีย์', 'ขยะรีไซเคิล', 'ขยะทั่วไป', 'ขยะอันตราย', 'ขยะติดเชื้อ'], 1),
          q('กระดาษลัง', ['ขยะอินทรีย์', 'ขยะรีไซเคิล', 'ขยะทั่วไป', 'ขยะอันตราย', 'ขยะติดเชื้อ'], 1),
          q('ซองขนมเปื้อนอาหาร', ['ขยะอินทรีย์', 'ขยะรีไซเคิล', 'ขยะทั่วไป', 'ขยะอันตราย', 'ขยะติดเชื้อ'], 2),
          q('ถ่านไฟฉาย', ['ขยะอินทรีย์', 'ขยะรีไซเคิล', 'ขยะทั่วไป', 'ขยะอันตราย', 'ขยะติดเชื้อ'], 3),
          q('หลอดไฟเสีย', ['ขยะอินทรีย์', 'ขยะรีไซเคิล', 'ขยะทั่วไป', 'ขยะอันตราย', 'ขยะติดเชื้อ'], 3),
          q('หน้ากากอนามัยใช้แล้ว', ['ขยะอินทรีย์', 'ขยะรีไซเคิล', 'ขยะทั่วไป', 'ขยะอันตราย', 'ขยะติดเชื้อ'], 4),
          q('ชุดตรวจ ATK ใช้แล้ว', ['ขยะอินทรีย์', 'ขยะรีไซเคิล', 'ขยะทั่วไป', 'ขยะอันตราย', 'ขยะติดเชื้อ'], 4),
        ],
      },
      {
        id: 2,
        name: 'Trash Anatomy',
        thaiName: 'รู้จักขยะให้ลึกขึ้น',
        type: 'recycle',
        badge: '♻️ Recycle Hero',
        intro: 'อ่านคำอธิบาย แล้วเลือกประเภทขยะที่ถูกต้อง',
        items: [
          q('ขยะที่ย่อยสลายได้ตามธรรมชาติ มักเน่าเสียง่ายและมีกลิ่น', ['ขยะอินทรีย์', 'ขยะรีไซเคิล', 'ขยะทั่วไป', 'ขยะอันตราย'], 0),
          q('ขยะที่นำกลับมาแปรรูปหรือใช้ใหม่ได้', ['ขยะทั่วไป', 'ขยะรีไซเคิล', 'ขยะติดเชื้อ', 'ขยะอันตราย'], 1),
          q('ขยะที่มีสารเคมีหรืออาจเป็นอันตรายต่อคนและสิ่งแวดล้อม', ['ขยะอันตราย', 'ขยะทั่วไป', 'ขยะอินทรีย์', 'ขยะรีไซเคิล'], 0),
          q('ขยะที่ปนเปื้อนสารคัดหลั่งหรือเชื้อโรค', ['ขยะรีไซเคิล', 'ขยะติดเชื้อ', 'ขยะทั่วไป', 'ขยะอินทรีย์'], 1),
          q('ขยะที่ใช้ประโยชน์ต่อได้ยากและไม่ควรปนกับขยะรีไซเคิล', ['ขยะทั่วไป', 'ขยะอันตราย', 'ขยะอินทรีย์', 'ขยะรีไซเคิล'], 0),
        ],
      },
      {
        id: 3,
        name: 'The 3Rs Choices',
        thaiName: 'ทางเลือก 3Rs',
        type: 'general',
        badge: '💧 Bottle Saver',
        intro: 'เลือกพฤติกรรมที่ดีที่สุดตามหลัก Reduce, Reuse, Recycle',
        items: [
          q('ไปซื้อของที่ร้านสะดวกซื้อ ควรทำอย่างไร', ['พกถุงผ้าและปฏิเสธถุงพลาสติก', 'รับถุงเพิ่มไว้ใช้ทีหลัง', 'ซื้อถุงใหม่ทุกครั้ง', 'ไม่ต้องคิดเรื่องถุง'], 0),
          q('กระดาษใช้แล้วด้านหนึ่ง ควรทำอย่างไร', ['ทิ้งทันที', 'ใช้อีกด้านก่อนนำไปรีไซเคิล', 'เผาทำลาย', 'ใส่ถังอาหาร'], 1),
          q('ขวดน้ำพลาสติกสะอาด ควรทำอย่างไร', ['ทิ้งรวม', 'แยกใส่ถังรีไซเคิล', 'ใส่ถังอินทรีย์', 'ฝังดิน'], 1),
          q('กล่องดินสอยังใช้ได้แต่ไม่ต้องการแล้ว ควรทำอย่างไร', ['บริจาคหรือส่งต่อ', 'ทิ้งรวม', 'เผา', 'ทิ้งลงคลอง'], 0),
          q('การลดใช้หลอดพลาสติกตรงกับข้อใดมากที่สุด', ['Reduce', 'Reuse', 'Recycle', 'Dispose'], 0),
        ],
      },
      {
        id: 4,
        name: 'Carbon Master',
        thaiName: 'นักลดคาร์บอน',
        type: 'organic',
        badge: '🌍 Carbon Saver',
        intro: 'ฝึกคิดเรื่องคาร์บอนจากกิจกรรมลดขยะ',
        items: [
          q('รีไซเคิลขวดพลาสติก 2 กิโลกรัม ค่า EF 1.5 kgCO₂e/kg จะลดได้เท่าไร', ['1.5 kgCO₂e', '2.0 kgCO₂e', '3.0 kgCO₂e', '5.0 kgCO₂e'], 2),
          q('การทำปุ๋ยจากเศษอาหารช่วยลดปัญหาอะไร', ['ลดขยะฝังกลบและลดก๊าซเรือนกระจก', 'เพิ่มขยะทั่วไป', 'ทำให้รีไซเคิลยากขึ้น', 'ไม่มีผลต่อสิ่งแวดล้อม'], 0),
          q('สูตรคำนวณคาร์บอนในระบบคือข้อใด', ['ปริมาณกิจกรรม x ค่า EF', 'คะแนน x ดาว', 'น้ำหนัก x ห้องเรียน', 'จำนวนคน x เดือน'], 0),
          q('ครอบครัวพกขวดน้ำ 10 ครั้ง ถ้าลดได้ครั้งละ 0.05 kgCO₂e รวมลดได้เท่าไร', ['0.05', '0.50', '5.00', '10.00'], 1),
          q('กิจกรรมใดมักช่วยลดคาร์บอนได้มาก', ['แยกอะลูมิเนียมรีไซเคิล', 'ทิ้งขยะรวม', 'ใช้ถุงใหม่ทุกวัน', 'ไม่บันทึกข้อมูล'], 0),
        ],
      },
      {
        id: 5,
        name: 'Bin Detective',
        thaiName: 'นักสืบถังขยะ',
        type: 'recycle',
        badge: '🔋 Hazard Guard',
        intro: 'ตรวจถังขยะ แล้วเลือกสิ่งที่อยู่ผิดถัง',
        items: [
          q('ถังรีไซเคิลมี: ขวดน้ำพลาสติก, กระดาษลัง, เปลือกส้ม, กระป๋องน้ำอัดลม รายการใดผิดถัง', ['ขวดน้ำพลาสติก', 'กระดาษลัง', 'เปลือกส้ม', 'กระป๋องน้ำอัดลม'], 2),
          q('ถังอินทรีย์มี: เศษอาหาร, ใบไม้, ถ่านไฟฉาย, เปลือกกล้วย รายการใดผิดถัง', ['เศษอาหาร', 'ใบไม้', 'ถ่านไฟฉาย', 'เปลือกกล้วย'], 2),
          q('ถังอันตรายมี: หลอดไฟเสีย, ถ่านไฟฉาย, ขวดพลาสติกสะอาด รายการใดผิดถัง', ['หลอดไฟเสีย', 'ถ่านไฟฉาย', 'ขวดพลาสติกสะอาด', 'ไม่มีรายการผิด'], 2),
          q('ถังทั่วไปมี: ซองขนมเปื้อน, กล่องโฟมเปื้อน, กระดาษลังสะอาด รายการใดผิดถัง', ['ซองขนมเปื้อน', 'กล่องโฟมเปื้อน', 'กระดาษลังสะอาด', 'ไม่มีรายการผิด'], 2),
        ],
      },
      {
        id: 6,
        name: 'Waste Route Planner',
        thaiName: 'วางแผนเส้นทางขยะ',
        type: 'hazard',
        badge: '👨‍👩‍👧 Green Family',
        intro: 'เลือกเส้นทางจัดการขยะที่เหมาะสมที่สุด',
        items: [
          q('เศษผักจากครัวควรจัดการอย่างไร', ['ทำปุ๋ยหมักหรือน้ำหมักชีวภาพ', 'ทิ้งรวม', 'ส่งถังอันตราย', 'เผา'], 0),
          q('หลอดไฟเสียควรจัดการอย่างไร', ['แยกเก็บและส่งจุดรับขยะอันตราย', 'ทุบแล้วทิ้งรวม', 'ใส่ถังอินทรีย์', 'ล้างแล้วรีไซเคิล'], 0),
          q('เสื้อผ้าเก่าที่ยังใช้ได้ควรทำอย่างไร', ['บริจาคหรือส่งต่อ', 'ทิ้งรวมทันที', 'ใส่ถังติดเชื้อ', 'เผาทำลาย'], 0),
          q('ขวดแก้วสะอาดควรไปเส้นทางใด', ['รีไซเคิล', 'ฝังกลบ', 'ติดเชื้อ', 'อินทรีย์'], 0),
          q('ยาหมดอายุควรทำอย่างไร', ['ส่งจุดรับที่ปลอดภัย', 'ทิ้งลงชักโครก', 'ผสมกับเศษอาหาร', 'เก็บไว้ใช้ต่อ'], 0),
        ],
      },
      {
        id: 7,
        name: 'Zero Waste Mission',
        thaiName: 'ภารกิจบ้านปลอดขยะ',
        type: 'organic',
        badge: '🏡 Zero Waste Home',
        intro: 'เลือกภารกิจจริงที่ทำได้ที่บ้าน แล้วบันทึกว่าสำเร็จ',
        mission: true,
        items: [
          q('เลือกภารกิจที่ช่วยครอบครัวลดขยะได้จริง', ['ตั้งมุมแยกขยะที่บ้าน', 'ทิ้งขยะรวมทุกชนิด', 'ซื้อของใช้ครั้งเดียวเพิ่ม', 'ไม่ชวนคนในบ้าน'], 0),
          q('ภารกิจใดช่วยลดพลาสติกใช้ครั้งเดียว', ['พกถุงผ้า 3 ครั้งใน 1 สัปดาห์', 'รับถุงพลาสติกทุกครั้ง', 'ซื้อขวดน้ำใหม่ทุกวัน', 'ไม่แยกขวด'], 0),
          q('ภารกิจใดช่วยลดเศษอาหารตกค้าง', ['ทำถังหมักเศษอาหาร', 'เทเศษอาหารลงถังทั่วไป', 'ปล่อยให้เน่าเสีย', 'ทิ้งรวมกับถ่านไฟฉาย'], 0),
          q('การชวนสมาชิกครอบครัวร่วมกิจกรรมช่วยเรื่องใด', ['ทำให้เกิดพฤติกรรมต่อเนื่องที่บ้าน', 'ทำให้แยกขยะยากขึ้น', 'ไม่เกี่ยวกับ School to Home', 'ลดคะแนนเกม'], 0),
        ],
      },
      {
        id: 8,
        name: 'Eco Quiz Challenge',
        thaiName: 'คำถามท้าทายรักษ์โลก',
        type: 'general',
        badge: '🍃 Compost Master',
        intro: 'ตอบคำถามปรนัยเพื่อทบทวนความรู้ทั้งหมด',
        items: [
          q('ขยะชนิดใดควรนำไปทำปุ๋ยหมัก', ['เศษอาหาร', 'ถ่านไฟฉาย', 'ขวดแก้ว', 'ซองขนม'], 0),
          q('หลัก Reduce หมายถึงอะไร', ['ลดการใช้', 'ใช้ซ้ำ', 'รีไซเคิล', 'เผาทำลาย'], 0),
          q('ข้อใดเป็นขยะอันตราย', ['ใบไม้', 'กระดาษลัง', 'หลอดไฟเสีย', 'ขวดน้ำพลาสติก'], 2),
          q('ถ้าขยะรีไซเคิลต่ำ ควรเริ่มจากอะไร', ['ตั้งมุมแยกกระดาษ ขวด และกระป๋อง', 'ทิ้งทุกอย่างรวมกัน', 'ไม่ล้างภาชนะ', 'หยุดบันทึกข้อมูล'], 0),
          q('การพกกล่องข้าวส่วนตัวช่วยลดอะไร', ['บรรจุภัณฑ์ใช้ครั้งเดียว', 'ดาวในเกม', 'การแยกขยะ', 'คะแนนคาร์บอน'], 0),
          q('ขยะติดเชื้อควรจัดการอย่างไร', ['ใส่ถุงปิดสนิทและส่งตามแนวทาง', 'ทิ้งรวมกับรีไซเคิล', 'ล้างแล้วขาย', 'ทำปุ๋ย'], 0),
          q('การบันทึกข้อมูลทุกเดือนช่วยอะไร', ['ติดตามพัฒนาการของครัวเรือน', 'เพิ่มขยะ', 'ลดความรับผิดชอบ', 'ทำให้ไม่มีหลักฐาน'], 0),
          q('ขวดพลาสติกสะอาดควรอยู่ถังใด', ['รีไซเคิล', 'อินทรีย์', 'อันตราย', 'ติดเชื้อ'], 0),
          q('ถ่านไฟฉายควรทิ้งรวมกับขยะทั่วไปหรือไม่', ['ไม่ควร เพราะเป็นขยะอันตราย', 'ควรเสมอ', 'ควรใส่ถังอินทรีย์', 'ไม่มีผล'], 0),
          q('เป้าหมายของ Green Passport คืออะไร', ['ลดขยะและคาร์บอนจากโรงเรียนสู่บ้าน', 'เพิ่มการใช้พลาสติก', 'แข่งทิ้งขยะ', 'ไม่ต้องมีหลักฐาน'], 0),
        ],
      },
      {
        id: 9,
        name: 'Final Hero Test',
        thaiName: 'บททดสอบฮีโร่พิทักษ์โลก',
        type: 'infectious',
        badge: '🏆 Trash Hero Champion',
        intro: 'รวมทักษะการแยกขยะ ตอบคำถาม และวางแผนครัวเรือน',
        items: [
          q('บ้านของด.ช.ต้นมีขยะทั่วไปมาก เพราะซื้อขนมซองทุกวัน ควรเริ่มจากอะไร', ['ลดซื้อขนมซองและพกภาชนะส่วนตัว', 'ซื้อซองใหญ่ขึ้น', 'ทิ้งรวมทั้งหมด', 'ไม่ต้องบันทึก'], 0),
          q('บ้านนี้มีเศษอาหารเหลือทุกวัน ควรแนะนำอะไร', ['นำเศษอาหารไปทำปุ๋ย', 'ทิ้งลงถังทั่วไปเสมอ', 'ปนกับขยะอันตราย', 'เผาทุกวัน'], 0),
          q('บ้านนี้ยังไม่แยกขวดพลาสติก ควรทำอย่างไร', ['แยกขวดพลาสติกเข้าสู่ระบบรีไซเคิล', 'ทิ้งรวมกับเศษอาหาร', 'ฝังดิน', 'ทุบให้แตก'], 0),
          q('หลังทำกิจกรรมแล้วควรทำอะไรใน Green Passport', ['บันทึกผลและแนบหลักฐาน', 'ไม่บอกใคร', 'ลบคะแนน', 'หยุดเล่นเกม'], 0),
          q('ผู้เล่นที่ผ่านครบทุกด่านควรนำความรู้ไปทำอะไร', ['ช่วยครอบครัวและโรงเรียนลดขยะ', 'แยกขยะเฉพาะในเกม', 'เพิ่มขยะที่บ้าน', 'หลีกเลี่ยงการรีไซเคิล'], 0),
        ],
      },
    ];

// --- state ---
let state = {
      active: 'home',
      data: queryParams.get('demo') === '1' ? makeMockData() : makeEmptyData(),
      adminPIN: '',
      authMode: 'login',
      authBusy: false,
      authMessage: '',
      authMessageType: '',
      authToken: '',
      currentUser: null,
      userMode: localStorage.getItem('greenPassportUserMode') || 'student',
      chatRoom: '',
      profileUserID: '',
      chatIdentity: readJsonStorage('greenPassportChatIdentity', {}),
      chatReactions: readJsonStorage('greenPassportChatReactions', {}),
      replyToMessageID: '',
      game: createInitialGameState(),
    };

// --- makeEmptyData ---
function makeEmptyData() {
      const carbonFactors = activityFields.map(([field, label, unit]) => ({
        ActivityCode: field,
        ActivityName: label,
        Unit: unit,
        EF: factorMap[field],
        Source: 'ค่าเริ่มต้น Green Passport',
        Note: 'ปรับค่าได้ในชีต CarbonFactors',
      }));
      const householdSummary = [];
      const wasteRecords = [];
      const gameScores = [];
      return {
        carbonFactors,
        wasteRecords,
        gameScores,
        householdSummary,
        dashboard: buildDashboard(wasteRecords, householdSummary),
        communityPosts: [],
        postComments: [],
        chatMessages: [],
        chatRooms: defaultChatRooms(),
        userProfiles: [],
        levelRules: defaultLevelRules(),
        expLogs: [],
        settings: { AcademicYear: '2569', OpenMonth: new Date().toISOString().slice(0, 7) },
      };
    }

// --- makeMockData ---
function makeMockData() {
      const carbonFactors = activityFields.map(([field, label, unit]) => ({
        ActivityCode: field,
        ActivityName: label,
        Unit: unit,
        EF: factorMap[field],
        Source: 'อบก./IPCC proxy',
        Note: 'ค่าเริ่มต้นสำหรับทดสอบ ปรับได้ในชีต CarbonFactors',
      }));
      const wasteRecords = [
        record('บ้านใจดี', 'ปุณณ์ภัสสร ใจดี', 'ป.5/1', 'ST***01', '2026-01', 12, 8, 9, 13.74, 'ผ่านการตรวจสอบ'),
        record('บ้านใจดี', 'ปุณณ์ภัสสร ใจดี', 'ป.5/1', 'ST***01', '2026-02', 8, 10, 7, 19.81, 'รอตรวจสอบ'),
        record('บ้านใจดี', 'ปุณณ์ภัสสร ใจดี', 'ป.5/1', 'ST***01', '2026-03', 6, 11, 5, 26.02, 'ผ่านการตรวจสอบ'),
        record('บ้านรักษ์โลก', 'ธนกฤต รักษ์โลก', 'ป.6/2', 'ST***08', '2026-03', 7, 12, 4, 28.45, 'ผ่านการตรวจสอบ'),
        record('บ้านสีเขียว', 'ณัฐธิดา สีเขียว', 'ม.1/1', 'ST***12', '2026-03', 9, 7, 8, 11.23, 'ต้องแก้ไข'),
      ];
      const gameScores = [
        { FullName: 'ปุณณ์ภัสสร ใจดี', ClassName: 'ป.5/1', StudentID: 'ST***01', TeamName: 'Green A', TotalScore: 860, TotalStars: 24, PlayerLevel: 'Eco Fighter', Badges: 'Sorter Starter, Carbon Saver, Trash Hero Champion', CertificateStatus: 'พร้อมออกเกียรติบัตร', Stage1Score: 96, Stage2Score: 94, Stage3Score: 92, Stage4Score: 95, Stage5Score: 90, Stage6Score: 94, Stage7Score: 96, Stage8Score: 93, Stage9Score: 100, Stage9Stars: 3 },
        { FullName: 'ธนกฤต รักษ์โลก', ClassName: 'ป.6/2', StudentID: 'ST***08', TeamName: 'Green B', TotalScore: 790, TotalStars: 22, PlayerLevel: 'Eco Fighter', Badges: 'Recycle Rookie, Carbon Saver, Green Leader', CertificateStatus: 'ยังไม่ผ่านครบ 9 ด่าน', Stage1Score: 88, Stage2Score: 90, Stage3Score: 85, Stage4Score: 92, Stage5Score: 83, Stage6Score: 88, Stage7Score: 90, Stage8Score: 92, Stage9Score: 82, Stage9Stars: 2 },
        { FullName: 'ณัฐธิดา สีเขียว', ClassName: 'ม.1/1', StudentID: 'ST***12', TeamName: 'Green C', TotalScore: 710, TotalStars: 19, PlayerLevel: 'Eco Fighter', Badges: 'Sorter Starter, Zero Waste Family', CertificateStatus: 'ยังไม่ผ่านครบ 9 ด่าน', Stage1Score: 80, Stage2Score: 76, Stage3Score: 82, Stage4Score: 78, Stage5Score: 74, Stage6Score: 80, Stage7Score: 86, Stage8Score: 78, Stage9Score: 76, Stage9Stars: 2 },
      ];
      const householdSummary = summarizeHouseholds(wasteRecords);
      const communityData = makeMockCommunityData(householdSummary, gameScores);
      return { carbonFactors, wasteRecords, gameScores, householdSummary, dashboard: buildDashboard(wasteRecords, householdSummary), ...communityData, settings: { AcademicYear: '2569', OpenMonth: '2026-06' } };
    }

// --- defaultLevelRules ---
function defaultLevelRules() {
      return levelCatalog.map((level) => ({
        LevelID: level.id,
        LevelName: level.name,
        Emoji: level.emoji,
        MinEXP: level.min,
        MaxEXP: Number.isFinite(level.max) ? level.max : '',
        Description: level.text,
        UnlockFeature: 'แสดงผลในโปรไฟล์ ชุมชน เพื่อน และแชท',
        RewardBadge: level.name,
        DisplayColor: level.color,
      }));
    }

// --- defaultChatRooms ---
function defaultChatRooms() {
      const now = new Date().toISOString();
      return [
        { ChatRoomID: 'CR-CLASS-01', ChatRoomName: 'ม.1/1 Green Chat', ChatRoomType: 'ห้องเรียน', ClassName: 'ม.1/1', Description: 'พื้นที่พูดคุยเรื่องการลดขยะของห้องเรียน', CreatedBy: 'ระบบ', CreatedAt: now, IsActive: true, TeacherModerator: 'ครูผู้ดูแลโครงการ' },
        { ChatRoomID: 'CR-MISSION-01', ChatRoomName: 'Zero Waste Challenge', ChatRoomType: 'กิจกรรม', ClassName: '', Description: 'แลกเปลี่ยนไอเดียภารกิจลดขยะรายเดือน', CreatedBy: 'ระบบ', CreatedAt: now, IsActive: true, TeacherModerator: 'ครูผู้ดูแลโครงการ' },
        { ChatRoomID: 'CR-TEACHER-01', ChatRoomName: 'ถามครู Green Passport', ChatRoomType: 'ถามครู', ClassName: '', Description: 'ถามเรื่องการบันทึก หลักฐาน และการคำนวณคาร์บอน', CreatedBy: 'ระบบ', CreatedAt: now, IsActive: true, TeacherModerator: 'ครูผู้ดูแลโครงการ' },
      ];
    }

// --- levelInfoByEXP ---
function levelInfoByEXP(exp) {
      const value = Number(exp || 0);
      return [...levelCatalog].reverse().find((level) => value >= level.min) || levelCatalog[0];
    }

// --- nextLevelInfo ---
function nextLevelInfo(exp) {
      const value = Number(exp || 0);
      return levelCatalog.find((level) => value < level.min) || levelCatalog[levelCatalog.length - 1];
    }

// --- progressToNextLevel ---
function progressToNextLevel(exp) {
      const current = levelInfoByEXP(exp);
      const next = nextLevelInfo(exp);
      if (current.name === next.name) return 100;
      const span = Math.max(1, next.min - current.min);
      return Math.min(100, Math.max(0, ((Number(exp || 0) - current.min) / span) * 100));
    }

// --- createInitialGameState ---
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

// --- record ---
function record(house, student, room, id, month, general, recycle, organic, co2e, status) {
      return {
        _rowNumber: Math.floor(Math.random() * 100) + 2,
        HouseholdName: house, StudentName: student, ClassName: room, StudentID: id, ReportMonth: month,
        GeneralWasteKg: general, RecycleWasteKg: recycle, OrganicWasteKg: organic, HazardousWasteAmount: 1,
        PaperKg: recycle * .25, PlasticBottleKg: recycle * .18, CanKg: recycle * .12, AluminumKg: .3, SteelCanKg: .2,
        ScrapIronKg: .2, GlassBottleKg: recycle * .18, CompostFoodKg: organic * .45, BioExtractKg: organic * .1, FeedAnimalsKg: organic * .15,
        ReducePlasticBagTimes: 18, CarryBottleTimes: 20, UseLunchBoxTimes: 12, RefuseStrawTimes: 16, CarryClothBagTimes: 14,
        RepairItemsTimes: 2, DonateItemsTimes: 3, DisposeBatteriesAmount: 1, DisposeBulbsAmount: 1, DisposeExpiredMedicineAmount: 0,
        TotalCO2e: co2e, EvidenceFolderLink: 'https://drive.google.com/example', VideoLink: '', ReviewStatus: status, TeacherComment: '',
        SubmittedAt: `${month}-15 18:30`, ReviewedBy: status === 'รอตรวจสอบ' ? '' : 'ครูผู้ดูแลโครงการ', ReviewedAt: status === 'รอตรวจสอบ' ? '' : `${month}-18 09:00`,
      };
    }

// --- apiQueryParamTrigger ---
if (queryParams.get('api')) localStorage.setItem(SHEET_API_STORAGE_KEY, sheetApiUrl);

// --- firebaseInitBlock ---
if (siteConfig.firebase && siteConfig.firebase.apiKey) {
      try {
        firebaseApp = firebase.initializeApp(siteConfig.firebase);
        firebaseAuth = firebase.auth();
        firebaseFs = firebase.firestore();
        firebaseDb = firebase.database();
        console.log("Firebase initialized successfully");
      } catch (e) {
        console.error("Firebase initialization failed:", e);
      }
    }

