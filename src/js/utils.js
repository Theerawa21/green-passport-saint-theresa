// --- Generated Module: utils.js ---

// --- readJsonStorage ---
function readJsonStorage(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) {
        return fallback;
      }
    }

// --- summarizeHouseholds ---
function summarizeHouseholds(records) {
      const groups = {};
      records.forEach((r) => (groups[r.HouseholdName] ||= []).push(r));
      return Object.entries(groups).map(([house, rows]) => {
        const sorted = rows.sort((a, b) => a.ReportMonth.localeCompare(b.ReportMonth));
        const first = sorted[0];
        const last = sorted[sorted.length - 1];
        const totalCO2e = sum(rows, 'TotalCO2e');
        const totalWaste = rows.reduce((t, r) => t + sumOne(r, ['GeneralWasteKg','RecycleWasteKg','OrganicWasteKg','HazardousWasteAmount']), 0);
        const managed = rows.reduce((t, r) => t + sumOne(r, ['PaperKg','PlasticBottleKg','CanKg','AluminumKg','SteelCanKg','ScrapIronKg','GlassBottleKg','CompostFoodKg','BioExtractKg','FeedAnimalsKg']), 0);
        return {
          HouseholdName: house,
          StudentName: last.StudentName,
          ClassName: last.ClassName,
          TotalSubmissions: rows.length,
          TotalWasteKg: round(totalWaste),
          TotalManagedWasteKg: round(managed),
          TotalCO2e: round(totalCO2e),
          GeneralWasteReductionPercent: first.GeneralWasteKg ? round(((first.GeneralWasteKg - last.GeneralWasteKg) / first.GeneralWasteKg) * 100) : 0,
          OrganicWasteManagedPercent: last.OrganicWasteKg ? round(((last.CompostFoodKg + last.BioExtractKg + last.FeedAnimalsKg) / last.OrganicWasteKg) * 100) : 0,
          BestImprovementScore: round(totalCO2e / 2),
          ZeroWasteHomeStatus: totalCO2e >= 50 ? 'ผ่านเกณฑ์ Zero Waste Home' : 'กำลังพัฒนา',
          CertificateStatus: totalCO2e >= 30 ? 'พร้อมออกเกียรติบัตร' : 'รอสะสมผลลัพธ์',
        };
      });
    }

// --- safeDisplayName ---
function safeDisplayName(name = '') {
      const clean = String(name || 'ผู้ใช้ Green').trim();
      if (clean.length <= 8) return clean;
      return `${clean.slice(0, 1)}.${clean.split(' ').slice(-1)[0] || 'Green'}`;
    }

// --- avatarText ---
function avatarText(name = '') {
      return String(name || 'G').trim().slice(0, 2).toUpperCase();
    }

// --- splitTags ---
function splitTags(value = '') {
      return String(value || '').split(',').map((x) => x.trim()).filter(Boolean);
    }

// --- buildProfilesFromData ---
function buildProfilesFromData(households = [], scores = [], posts = [], comments = [], expLogs = []) {
      const profiles = {};
      function ensureProfile(key, base = {}) {
        const id = key || base.StudentID || base.UserID || base.DisplayName || base.StudentName || base.FullName || 'guest';
        profiles[id] ||= {
          UserID: id,
          DisplayName: safeDisplayName(base.DisplayName || base.StudentName || base.FullName || id),
          FirstName: '',
          LastName: '',
          ClassName: base.ClassName || '',
          StudentIDMasked: String(base.StudentID || id || '').replace(/(.{2}).+(.{2})/, '$1***$2'),
          Avatar: avatarText(base.DisplayName || base.StudentName || base.FullName || id),
          CurrentEXP: 0,
          TotalScore: 0,
          TotalStars: 0,
          TotalBadges: 0,
          TotalPosts: 0,
          TotalComments: 0,
          TotalSubmissions: 0,
          TotalCO2e: 0,
          HouseholdStatus: '',
          LastActiveAt: '',
          ConsentStatus: 'ยินยอม',
        };
        Object.assign(profiles[id], Object.fromEntries(Object.entries(base).filter(([, value]) => value !== '' && value !== undefined)));
        return profiles[id];
      }
      households.forEach((h) => {
        const profile = ensureProfile(h.StudentName || h.HouseholdName, h);
        profile.TotalSubmissions = Math.max(Number(profile.TotalSubmissions || 0), Number(h.TotalSubmissions || 0));
        profile.TotalCO2e = Math.max(Number(profile.TotalCO2e || 0), Number(h.TotalCO2e || 0));
        profile.HouseholdStatus = h.ZeroWasteHomeStatus || profile.HouseholdStatus;
        profile.CurrentEXP += Number(h.TotalSubmissions || 0) * 20 + Math.round(Number(h.TotalCO2e || 0));
      });
      scores.forEach((s) => {
        const profile = ensureProfile(s.StudentID || s.FullName, s);
        const badgeCount = String(s.Badges || '').split(',').filter(Boolean).length;
        profile.TotalScore = Math.max(Number(profile.TotalScore || 0), Number(s.TotalScore || 0));
        profile.TotalStars = Math.max(Number(profile.TotalStars || 0), Number(s.TotalStars || 0));
        profile.TotalBadges = Math.max(Number(profile.TotalBadges || 0), badgeCount);
        profile.CurrentEXP += Math.round(Number(s.TotalScore || 0) / 3) + badgeCount * 50;
      });
      posts.filter((p) => p.ReviewStatus === 'เผยแพร่แล้ว').forEach((p) => {
        const profile = ensureProfile(p.UserID || p.DisplayName, p);
        profile.TotalPosts += 1;
        profile.CurrentEXP += 40 + Number(p.Likes || 0) * 2;
      });
      comments.filter((c) => c.ReviewStatus === 'เผยแพร่แล้ว').forEach((c) => {
        const profile = ensureProfile(c.UserID || c.DisplayName, c);
        profile.TotalComments += 1;
        profile.CurrentEXP += 5 + Number(c.LikeCount || 0);
      });
      expLogs.forEach((log) => {
        const profile = ensureProfile(log.UserID || 'guest', log);
        profile.CurrentEXP += Number(log.EXPAmount || 0);
      });
      return Object.values(profiles).map((profile) => {
        const level = levelInfoByEXP(profile.CurrentEXP);
        return { ...profile, CurrentLevel: `${level.emoji} ${level.name}`, LevelName: level.name, LevelEmoji: level.emoji, LevelColor: level.color };
      }).sort((a, b) => Number(b.CurrentEXP || 0) - Number(a.CurrentEXP || 0));
    }

// --- allProfiles ---
function allProfiles() {
      const generated = buildProfilesFromData(state.data.householdSummary || [], state.data.gameScores || [], state.data.communityPosts || [], state.data.postComments || [], state.data.expLogs || []);
      const stored = (state.data.userProfiles || []).filter((p) => p.UserID || p.DisplayName);
      const merged = {};
      [...generated, ...stored].forEach((profile) => {
        const id = profile.UserID || profile.DisplayName;
        merged[id] = { ...(merged[id] || {}), ...profile };
      });
      return Object.values(merged).map((profile) => {
        const exp = Number(profile.CurrentEXP || 0);
        const level = levelInfoByEXP(exp);
        return { ...profile, CurrentEXP: exp, CurrentLevel: profile.CurrentLevel || `${level.emoji} ${level.name}`, LevelName: profile.LevelName || level.name, LevelEmoji: profile.LevelEmoji || level.emoji, LevelColor: profile.LevelColor || level.color };
      }).sort((a, b) => Number(b.CurrentEXP || 0) - Number(a.CurrentEXP || 0));
    }

// --- buildDashboard ---
function buildDashboard(records, households) {
      const monthMap = {};
      records.forEach((r) => {
        const m = r.ReportMonth || 'ไม่ระบุ';
        monthMap[m] ||= { month: m, general: 0, recycle: 0, organic: 0, organicManaged: 0, hazardous: 0, co2e: 0 };
        monthMap[m].general += Number(r.GeneralWasteKg || 0);
        monthMap[m].recycle += Number(r.RecycleWasteKg || 0);
        monthMap[m].organic += Number(r.OrganicWasteKg || 0);
        monthMap[m].organicManaged += sumOne(r, ['CompostFoodKg','BioExtractKg','FeedAnimalsKg']);
        monthMap[m].hazardous += Number(r.HazardousWasteAmount || 0);
        monthMap[m].co2e += Number(r.TotalCO2e || 0);
      });
      return {
        householdCount: households.length,
        recordCount: records.length,
        totalWasteKg: round(records.reduce((t, r) => t + sumOne(r, ['GeneralWasteKg','RecycleWasteKg','OrganicWasteKg','HazardousWasteAmount']), 0)),
        managedWasteKg: round(records.reduce((t, r) => t + sumOne(r, ['PaperKg','PlasticBottleKg','CanKg','AluminumKg','SteelCanKg','ScrapIronKg','GlassBottleKg','CompostFoodKg','BioExtractKg','FeedAnimalsKg']), 0)),
        totalCO2e: round(sum(records, 'TotalCO2e')),
        monthSeries: Object.values(monthMap).sort((a, b) => a.month.localeCompare(b.month)),
        completedHouseholds: households.filter((h) => Number(h.TotalSubmissions) >= 3).length,
        pendingHouseholds: households.filter((h) => Number(h.TotalSubmissions) < 3).length,
        topHouseholds: [...households].sort((a, b) => b.TotalCO2e - a.TotalCO2e).slice(0, 10),
      };
    }

// --- greenPassportLogoSrc ---
function greenPassportLogoSrc() {
      return document.querySelector('.brand-logos .logo-slot img')?.getAttribute('src') || '';
    }

// --- hashText ---
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

// --- randomToken ---
function randomToken(prefix = 'local') {
      return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
    }

