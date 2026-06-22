// --- Generated Module: sheet-api.js ---

// --- sheetApiConfigured ---
function sheetApiConfigured() {
      return !!sheetApiUrl;
    }

// --- fetchSheetData ---
async function fetchSheetData(sheetName) {
      const params = new URLSearchParams({ sheet: sheetName, tq: 'select *', headers: '1' });
      const response = await fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?${params}`);
      if (!response.ok) throw new Error(`อ่านชีต ${sheetName} ไม่สำเร็จ`);
      return parseGvizResponse(await response.text()).map((row, index) => normalizeRow(Object.assign({ _rowNumber: index + 2 }, row)));
    }

// --- parseGvizResponse ---
function parseGvizResponse(text) {
      const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\);?$/);
      if (!match) return [];
      const payload = Function(`"use strict";return (${match[1]});`)();
      const table = payload.table || {};
      const headers = (table.cols || []).map((col, index) => String(col.label || col.id || `Column${index + 1}`).trim());
      return (table.rows || []).map((row) => {
        const item = {};
        (row.c || []).forEach((cell, index) => {
          const key = headers[index];
          if (!key) return;
          const value = cell?.v instanceof Date ? cell.v.toISOString().slice(0, 10) : cell?.v;
          item[key] = value ?? '';
        });
        return item;
      }).filter((row) => Object.values(row).some((value) => String(value || '').trim()));
    }

// --- loadBootstrapFromPublicSheets ---
async function loadBootstrapFromPublicSheets() {
      const [wasteRecords, gameScores, carbonFactors, settingsRows] = await Promise.all([
        fetchSheetData('WasteRecords').catch(() => []),
        fetchSheetData('GameScores').catch(() => []),
        fetchSheetData('CarbonFactors').catch(() => []),
        fetchSheetData('AdminSettings').catch(() => []),
      ]);
      const settings = Object.fromEntries(settingsRows.map((row) => [row.SettingKey || row.Key, row.SettingValue || row.Value]).filter(([key]) => key));
      return buildBootstrapData({ wasteRecords, gameScores, carbonFactors, settings });
    }

// --- buildBootstrapData ---
function buildBootstrapData(data) {
      const wasteRecords = (data.wasteRecords || []).map(normalizeRow);
      const gameScores = (data.gameScores || []).map(normalizeRow);
      const householdSummary = data.householdSummary || summarizeHouseholds(wasteRecords);
      return {
        carbonFactors: data.carbonFactors?.length ? data.carbonFactors.map(normalizeRow) : state.data.carbonFactors,
        wasteRecords,
        gameScores,
        householdSummary,
        dashboard: data.dashboard || buildDashboard(wasteRecords, householdSummary),
        communityPosts: data.communityPosts || state.data.communityPosts || [],
        postComments: data.postComments || state.data.postComments || [],
        chatMessages: data.chatMessages || state.data.chatMessages || [],
        chatRooms: data.chatRooms?.length ? data.chatRooms : state.data.chatRooms || defaultChatRooms(),
        userProfiles: data.userProfiles || state.data.userProfiles || [],
        levelRules: data.levelRules?.length ? data.levelRules : state.data.levelRules || defaultLevelRules(),
        expLogs: data.expLogs || state.data.expLogs || [],
        settings: data.settings || state.data.settings || {},
      };
    }

// --- normalizeRow ---
function normalizeRow(row) {
      const numericFields = [
        'GeneralWasteKg','RecycleWasteKg','OrganicWasteKg','HazardousWasteAmount','PaperKg','PlasticBottleKg','CanKg','AluminumKg','SteelCanKg',
        'ScrapIronKg','GlassBottleKg','CompostFoodKg','BioExtractKg','FeedAnimalsKg','ReducePlasticBagTimes','CarryBottleTimes','UseLunchBoxTimes',
        'RefuseStrawTimes','CarryClothBagTimes','RepairItemsTimes','DonateItemsTimes','DisposeBatteriesAmount','DisposeBulbsAmount',
        'DisposeExpiredMedicineAmount','TotalCO2e','TotalScore','TotalStars','LatestStageScore','LatestStageStars','EF',
        'Likes','CommentCount','LikeCount','CurrentEXP','EXPAmount','TotalBadges','TotalPosts','TotalComments','TotalSubmissions',
      ];
      for (let i = 1; i <= 9; i += 1) numericFields.push(`Stage${i}Score`, `Stage${i}Stars`);
      const result = Object.assign({}, row);
      numericFields.forEach((field) => {
        if (result[field] !== undefined && result[field] !== '') result[field] = Number(result[field] || 0);
      });
      if (!result.ReviewStatus && result.HouseholdName) result.ReviewStatus = 'รอตรวจสอบ';
      return result;
    }

// --- sheetApi ---
async function sheetApi(action, payload = {}) {
      if (!sheetApiConfigured()) throw new Error('ยังไม่ได้ตั้งค่า Apps Script Web App endpoint สำหรับบันทึกลง Google Sheets');
      return sheetApiViaFrame(action, payload);
    }

// --- sheetApiViaFrame ---
function sheetApiViaFrame(action, payload = {}) {
      return new Promise((resolve, reject) => {
        const token = `gp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const frameName = `green-passport-api-${token}`;
        const iframe = document.createElement('iframe');
        const form = document.createElement('form');
        const cleanup = () => {
          window.removeEventListener('message', onMessage);
          clearTimeout(timer);
          iframe.remove();
          form.remove();
        };
        const timer = setTimeout(() => {
          cleanup();
          reject(new Error('รอคำตอบจาก Google Sheets Web App นานเกินไป'));
        }, 30000);
        const onMessage = (event) => {
          const message = event.data || {};
          if (!message.greenPassportApi || message.token !== token) return;
          cleanup();
          const data = message.response || {};
          if (data.ok === false) reject(new Error(data.message || `เรียก API ${action} ไม่สำเร็จ`));
          else resolve(data);
        };
        window.addEventListener('message', onMessage);
        iframe.name = frameName;
        iframe.style.display = 'none';
        form.method = 'POST';
        form.action = sheetApiUrl;
        form.target = frameName;
        form.style.display = 'none';
        form.innerHTML = `
          <input type="hidden" name="frame" value="1">
          <input type="hidden" name="payload">
        `;
        form.elements.payload.value = JSON.stringify(Object.assign({ action, _token: token }, payload));
        document.body.append(iframe, form);
        form.submit();
      });
    }

// --- saveToLocalStorage ---
function saveToLocalStorage() {
      localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify({
        wasteRecords: state.data.wasteRecords,
        gameScores: state.data.gameScores,
        communityPosts: state.data.communityPosts,
        postComments: state.data.postComments,
        chatMessages: state.data.chatMessages,
        chatRooms: state.data.chatRooms,
        userProfiles: state.data.userProfiles,
        levelRules: state.data.levelRules,
        expLogs: state.data.expLogs,
        settings: state.data.settings,
      }));
    }

// --- loadFromLocalStorage ---
function loadFromLocalStorage() {
      try {
        const cached = JSON.parse(localStorage.getItem(LOCAL_DATA_KEY) || '{}');
        if (!cached.wasteRecords && !cached.gameScores && !cached.communityPosts && !cached.chatMessages) return;
        hydrateData(buildBootstrapData({
          wasteRecords: cached.wasteRecords || [],
          gameScores: cached.gameScores || [],
          communityPosts: cached.communityPosts || [],
          postComments: cached.postComments || [],
          chatMessages: cached.chatMessages || [],
          chatRooms: cached.chatRooms || [],
          userProfiles: cached.userProfiles || [],
          levelRules: cached.levelRules || [],
          expLogs: cached.expLogs || [],
          settings: cached.settings || {},
          carbonFactors: state.data.carbonFactors,
        }));
      } catch (e) {}
    }

// --- queuePendingWrite ---
function queuePendingWrite(action, payload) {
      const pending = JSON.parse(localStorage.getItem(LOCAL_QUEUE_KEY) || '[]');
      pending.push({ action, payload, queuedAt: new Date().toISOString() });
      localStorage.setItem(LOCAL_QUEUE_KEY, JSON.stringify(pending));
    }

// --- syncPendingWrites ---
async function syncPendingWrites() {
      if (!sheetApiConfigured()) return;
      const pending = JSON.parse(localStorage.getItem(LOCAL_QUEUE_KEY) || '[]');
      if (!pending.length) return;
      const remaining = [];
      for (const item of pending) {
        try {
          await sheetApi(item.action, item.payload);
        } catch (e) {
          remaining.push(item);
        }
      }
      localStorage.setItem(LOCAL_QUEUE_KEY, JSON.stringify(remaining));
      if (remaining.length !== pending.length) await reloadData(true);
    }

