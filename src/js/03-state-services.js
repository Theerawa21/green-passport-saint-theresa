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

    function defaultChatRooms() {
      const now = new Date().toISOString();
      return [
        { ChatRoomID: 'CR-CLASS-01', ChatRoomName: 'ม.1/1 Green Chat', ChatRoomType: 'ห้องเรียน', ClassName: 'ม.1/1', Description: 'พื้นที่พูดคุยเรื่องการลดขยะของห้องเรียน', CreatedBy: 'ระบบ', CreatedAt: now, IsActive: true, TeacherModerator: 'ครูผู้ดูแลโครงการ' },
        { ChatRoomID: 'CR-MISSION-01', ChatRoomName: 'Zero Waste Challenge', ChatRoomType: 'กิจกรรม', ClassName: '', Description: 'แลกเปลี่ยนไอเดียภารกิจลดขยะรายเดือน', CreatedBy: 'ระบบ', CreatedAt: now, IsActive: true, TeacherModerator: 'ครูผู้ดูแลโครงการ' },
        { ChatRoomID: 'CR-TEACHER-01', ChatRoomName: 'ถามครู Green Passport', ChatRoomType: 'ถามครู', ClassName: '', Description: 'ถามเรื่องการบันทึก หลักฐาน และการคำนวณคาร์บอน', CreatedBy: 'ระบบ', CreatedAt: now, IsActive: true, TeacherModerator: 'ครูผู้ดูแลโครงการ' },
      ];
    }

    function makeMockCommunityData(householdSummary, gameScores) {
      const profiles = buildProfilesFromData(householdSummary, gameScores, [], [], []);
      const communityPosts = [
        { PostID: 'CP-DEMO-01', Timestamp: '2026-06-18 09:00', UserID: 'ST***01', DisplayName: 'ปุณณ์ภัสสร', ClassName: 'ป.5/1', Category: 'ตั้งมุมแยกขยะที่บ้าน 🏡', PostTitle: 'บ้านเราตั้งมุมแยกขยะ 4 ถังแล้ว', PostContent: 'เริ่มจากติดป้ายสีให้ทุกคนในบ้านเห็นง่าย และแยกขวด กระดาษ เศษอาหาร กับขยะทั่วไป', MethodUsed: 'ใช้กล่องเก่าและป้ายสี แยกวางใกล้ครัว', Result: 'ขยะทั่วไปลดลงและรีไซเคิลขายได้มากขึ้น', Problem: 'ช่วงแรกทุกคนยังสับสนเรื่องถัง', Solution: 'ติดตัวอย่างขยะบนป้ายแต่ละถัง', AdviceToFriends: 'เริ่มจากมุมเล็ก ๆ ก่อน แล้วค่อยชวนคนในบ้านช่วยกัน', ImageLinks: '', Tags: 'Zero Waste Home, แยกขยะ, ครอบครัว', Likes: 18, CommentCount: 2, ReviewStatus: 'เผยแพร่แล้ว', TeacherComment: 'เนื้อหาดีมาก สามารถเผยแพร่เป็นตัวอย่างได้', ApprovedBy: 'ครูผู้ดูแลโครงการ', ApprovedAt: '2026-06-18 10:00' },
        { PostID: 'CP-DEMO-02', Timestamp: '2026-06-19 13:20', UserID: 'ST***08', DisplayName: 'ธนกฤต', ClassName: 'ป.6/2', Category: 'ทำปุ๋ยหมักจากเศษอาหาร 🍃', PostTitle: 'ถังหมักเศษอาหารหลังบ้าน', PostContent: 'บ้านเราลองแยกเศษผักและเปลือกผลไม้ไปทำปุ๋ยหมัก ทำให้ถังขยะเหม็นน้อยลง', MethodUsed: 'ใช้ถังพลาสติกเก่า เจาะรู และโรยใบไม้แห้ง', Result: 'ลดเศษอาหารที่ทิ้งรวมกับขยะทั่วไป', Problem: 'บางวันมีกลิ่น', Solution: 'เติมใบไม้แห้งและปิดฝาให้สนิท', AdviceToFriends: 'อย่าใส่อาหารมันมากเกินไป', ImageLinks: '', Tags: 'ปุ๋ยหมัก, ขยะอินทรีย์', Likes: 12, CommentCount: 1, ReviewStatus: 'เผยแพร่แล้ว', TeacherComment: 'ตัวอย่างดี เหมาะกับภารกิจรายเดือน', ApprovedBy: 'ครูผู้ดูแลโครงการ', ApprovedAt: '2026-06-19 15:00' },
      ];
      const postComments = [
        { CommentID: 'CM-DEMO-01', PostID: 'CP-DEMO-01', Timestamp: '2026-06-18 12:00', UserID: 'ST***12', DisplayName: 'ณัฐธิดา', ClassName: 'ม.1/1', CommentText: 'ไอเดียติดตัวอย่างขยะบนป้ายดีมากค่ะ', LikeCount: 4, ReviewStatus: 'เผยแพร่แล้ว', ReportStatus: '' },
        { CommentID: 'CM-DEMO-02', PostID: 'CP-DEMO-02', Timestamp: '2026-06-19 16:00', UserID: 'ST***01', DisplayName: 'ปุณณ์ภัสสร', ClassName: 'ป.5/1', CommentText: 'จะลองทำถังหมักตามบ้างนะคะ', LikeCount: 3, ReviewStatus: 'เผยแพร่แล้ว', ReportStatus: '' },
      ];
      const chatRooms = defaultChatRooms();
      const chatMessages = [
        { MessageID: 'MSG-DEMO-01', ChatRoomID: 'CR-MISSION-01', Timestamp: '2026-06-20 08:00', UserID: 'ST***01', DisplayName: 'ปุณณ์ภัสสร', ClassName: 'ป.5/1', MessageText: 'บ้านเราเริ่มแยกขวดพลาสติกแล้วนะ ♻️', ImageLink: '', MessageType: 'text', IsPinned: false, ReportStatus: '', ModerationStatus: 'ปกติ' },
        { MessageID: 'MSG-DEMO-02', ChatRoomID: 'CR-MISSION-01', Timestamp: '2026-06-20 08:20', UserID: 'ST***08', DisplayName: 'ธนกฤต', ClassName: 'ป.6/2', MessageText: 'ใครมีวิธีลดเศษอาหารบ้างครับ 🍃', ImageLink: '', MessageType: 'text', IsPinned: false, ReportStatus: '', ModerationStatus: 'ปกติ' },
        { MessageID: 'MSG-DEMO-03', ChatRoomID: 'CR-TEACHER-01', Timestamp: '2026-06-20 09:00', UserID: 'TEACHER', DisplayName: 'ครูผู้ดูแล', ClassName: 'Admin', MessageText: 'อย่าลืมใช้ถ้อยคำสุภาพและไม่เปิดเผยข้อมูลส่วนตัวนะคะ', ImageLink: '', MessageType: 'announcement', IsPinned: true, ReportStatus: '', ModerationStatus: 'ปักหมุด' },
      ];
      return { communityPosts, postComments, chatMessages, chatRooms, userProfiles: profiles, levelRules: defaultLevelRules(), expLogs: [] };
    }

    function record(house, student, room, id, month, general, recycle, organic, co2e, status) {
      return {
        _rowNumber: Math.floor(Math.random() * 100) + 2,
        UserID: id, HouseholdName: house, StudentName: student, ClassName: room, StudentID: id, ReportMonth: month,
        GeneralWasteKg: general, RecycleWasteKg: recycle, OrganicWasteKg: organic, HazardousWasteAmount: 1,
        PaperKg: recycle * .25, PlasticBottleKg: recycle * .18, CanKg: recycle * .12, AluminumKg: .3, SteelCanKg: .2,
        ScrapIronKg: .2, GlassBottleKg: recycle * .18, CompostFoodKg: organic * .45, BioExtractKg: organic * .1, FeedAnimalsKg: organic * .15,
        ReducePlasticBagTimes: 18, CarryBottleTimes: 20, UseLunchBoxTimes: 12, RefuseStrawTimes: 16, CarryClothBagTimes: 14,
        RepairItemsTimes: 2, DonateItemsTimes: 3, DisposeBatteriesAmount: 1, DisposeBulbsAmount: 1, DisposeExpiredMedicineAmount: 0,
        TotalCO2e: co2e, EvidenceFolderLink: 'https://drive.google.com/example', VideoLink: '', ReviewStatus: status, TeacherComment: '',
        SubmittedAt: `${month}-15 18:30`, ReviewedBy: status === 'รอตรวจสอบ' ? '' : 'ครูผู้ดูแลโครงการ', ReviewedAt: status === 'รอตรวจสอบ' ? '' : `${month}-18 09:00`,
      };
    }

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
          UserID: last.UserID || '',
          StudentName: last.StudentName,
          ClassName: last.ClassName,
          StudentID: last.StudentID || '',
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

    function levelInfoByEXP(exp) {
      const value = Number(exp || 0);
      return [...levelCatalog].reverse().find((level) => value >= level.min) || levelCatalog[0];
    }

    function nextLevelInfo(exp) {
      const value = Number(exp || 0);
      return levelCatalog.find((level) => value < level.min) || levelCatalog[levelCatalog.length - 1];
    }

    function progressToNextLevel(exp) {
      const current = levelInfoByEXP(exp);
      const next = nextLevelInfo(exp);
      if (current.name === next.name) return 100;
      const span = Math.max(1, next.min - current.min);
      return Math.min(100, Math.max(0, ((Number(exp || 0) - current.min) / span) * 100));
    }

    function safeDisplayName(name = '') {
      const clean = String(name || 'ผู้ใช้ Green').trim();
      if (clean.length <= 8) return clean;
      return `${clean.slice(0, 1)}.${clean.split(' ').slice(-1)[0] || 'Green'}`;
    }

    function avatarText(name = '') {
      return String(name || 'G').trim().slice(0, 2).toUpperCase();
    }

    function splitTags(value = '') {
      return String(value || '').split(',').map((x) => x.trim()).filter(Boolean);
    }

    function buildProfilesFromData(households = [], scores = [], posts = [], comments = [], expLogs = [], records = []) {
      const profiles = {};
      function ensureProfile(key, base = {}) {
        const id = key || base.UserID || base.StudentID || base.DisplayName || base.StudentName || base.FullName || 'guest';
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
      if (records.length) {
        records.forEach((r) => {
          const profile = ensureProfile(r.UserID || r.StudentID || r.StudentName || r.HouseholdName, {
            UserID: r.UserID || '',
            DisplayName: r.DisplayName || '',
            StudentName: r.StudentName || '',
            ClassName: r.ClassName || '',
            StudentID: r.StudentID || '',
          });
          profile.TotalSubmissions = Number(profile.TotalSubmissions || 0) + 1;
          profile.TotalCO2e = round(Number(profile.TotalCO2e || 0) + Number(r.TotalCO2e || 0));
          profile.HouseholdStatus = profile.HouseholdStatus || r.HouseholdName || '';
          profile.CurrentEXP += 20 + Math.round(Number(r.TotalCO2e || 0));
        });
      } else {
        households.forEach((h) => {
          const profile = ensureProfile(h.UserID || h.StudentID || h.StudentName || h.HouseholdName, h);
          profile.TotalSubmissions = Math.max(Number(profile.TotalSubmissions || 0), Number(h.TotalSubmissions || 0));
          profile.TotalCO2e = Math.max(Number(profile.TotalCO2e || 0), Number(h.TotalCO2e || 0));
          profile.HouseholdStatus = h.ZeroWasteHomeStatus || profile.HouseholdStatus;
          profile.CurrentEXP += Number(h.TotalSubmissions || 0) * 20 + Math.round(Number(h.TotalCO2e || 0));
        });
      }
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

    function currentUserProfileAliases() {
      const user = normalizeAuthUser(state.currentUser || {});
      const fullName = `${user.FirstName || ''} ${user.LastName || ''}`.trim();
      return new Set([
        user.UserID,
        user.StudentID,
        user.StudentIDMasked,
        user.DisplayName,
        safeDisplayName(user.DisplayName),
        fullName,
        safeDisplayName(fullName),
      ].map((value) => String(value || '').trim()).filter(Boolean));
    }

    function profileCanonicalId(profile) {
      const id = String(profile.UserID || profile.DisplayName || '').trim();
      const currentId = String(state.currentUser?.UserID || '').trim();
      
      const aliases = typeof currentUserProfileAliases === 'function' ? currentUserProfileAliases() : new Set();
      const candidates = [
        profile.UserID,
        profile.StudentID,
        profile.StudentIDMasked,
        profile.DisplayName,
        profile.StudentName,
        profile.FullName,
      ].map((value) => String(value || '').trim()).filter(Boolean);
      
      if (currentId && (id === currentId || candidates.some((value) => aliases.has(value)))) {
        return currentId;
      }
      
      // Look up candidate references in state.data.userProfiles to merge matches for all users
      const profilesList = state.data.userProfiles || [];
      for (const candidate of candidates) {
        if (!candidate || candidate === 'guest') continue;
        const matched = profilesList.find((p) => {
          const pId = String(p.UserID || '').trim();
          const pStudentId = String(p.StudentID || '').trim();
          const pDisplayName = String(p.DisplayName || '').trim();
          const pFullName = `${p.FirstName || ''} ${p.LastName || ''}`.trim();
          return (pId && pId === candidate) ||
                 (pStudentId && pStudentId === candidate) ||
                 (pDisplayName && pDisplayName.toLowerCase() === candidate.toLowerCase()) ||
                 (pFullName && pFullName.toLowerCase() === candidate.toLowerCase());
        });
        if (matched && matched.UserID) {
          return matched.UserID;
        }
      }
      
      return id;
    }

    function mergeProfiles(base = {}, next = {}) {
      const merged = { ...base, ...next };
      ['CurrentEXP','TotalScore','TotalStars','TotalBadges','TotalPosts','TotalComments','TotalSubmissions','TotalCO2e'].forEach((field) => {
        merged[field] = Math.max(Number(base[field] || 0), Number(next[field] || 0));
      });
      return merged;
    }

    function allProfiles() {
      const generated = buildProfilesFromData(state.data.householdSummary || [], state.data.gameScores || [], state.data.communityPosts || [], state.data.postComments || [], state.data.expLogs || [], state.data.wasteRecords || []);
      const stored = (state.data.userProfiles || []).filter((p) => p.UserID || p.DisplayName);
      const merged = {};
      [...generated, ...stored].forEach((profile) => {
        const id = profileCanonicalId(profile);
        merged[id] = mergeProfiles(merged[id], { ...profile, UserID: id || profile.UserID || profile.DisplayName });
      });
      return Object.values(merged).map((profile) => {
        const exp = Number(profile.CurrentEXP || 0);
        const level = levelInfoByEXP(exp);
        return { ...profile, CurrentEXP: exp, CurrentLevel: `${level.emoji} ${level.name}`, LevelName: level.name, LevelEmoji: level.emoji, LevelColor: level.color };
      }).sort((a, b) => Number(b.CurrentEXP || 0) - Number(a.CurrentEXP || 0));
    }

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

    function sheetApiConfigured() {
      return !!sheetApiUrl;
    }

    async function fetchSheetData(sheetName) {
      const params = new URLSearchParams({ sheet: sheetName, tq: 'select *', headers: '1' });
      const response = await fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?${params}`);
      if (!response.ok) throw new Error(`อ่านชีต ${sheetName} ไม่สำเร็จ`);
      return parseGvizResponse(await response.text()).map((row, index) => normalizeRow(Object.assign({ _rowNumber: index + 2 }, row)));
    }

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

    // Firebase helper functions
    async function firebaseEmailLookup(login) {
      if (!login) throw new Error('กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ');
      const cleanLogin = String(login).trim().toLowerCase();
      if (cleanLogin.includes('@')) {
        return cleanLogin;
      }
      if (!firebaseFs) {
        throw new Error('ระบบเชื่อมต่อฐานข้อมูลยังไม่พร้อมใช้งาน');
      }
      const usernameDoc = await firebaseFs.collection('usernames').doc(cleanLogin).get();
      if (usernameDoc.exists) {
        return usernameDoc.data().email;
      }
      const studentDoc = await firebaseFs.collection('studentIDs').doc(cleanLogin).get();
      if (studentDoc.exists) {
        return studentDoc.data().email;
      }
      throw new Error('ไม่พบข้อมูลบัญชีผู้ใช้นี้ในระบบ');
    }

    function deriveEmail(usernameOrStudentId, emailInput) {
      const cleanInput = String(emailInput || '').trim().toLowerCase();
      if (cleanInput && cleanInput.includes('@')) {
        return cleanInput;
      }
      const cleanId = String(usernameOrStudentId || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      return `${cleanId}@greenpassport.local`;
    }

    async function fetchUserProfilesFromFirestore() {
      if (!firebaseFs || !firebaseAuth || !firebaseAuth.currentUser) {
        console.log("Postponing Firestore profiles fetch: Firebase Auth not ready");
        return;
      }
      try {
        const snapshot = await firebaseFs.collection('userProfiles').get();
        const profiles = [];
        snapshot.forEach((doc) => {
          profiles.push(Object.assign({ UserID: doc.id }, doc.data()));
        });
        state.data.userProfiles = profiles.map(normalizeRow);
        renderAll();
      } catch (e) {
        console.error("Error fetching user profiles from Firestore:", e);
      }
    }

    // Firebase Realtime DB Chat Subscriptions
    let currentChatSubscription = null;
    function subscribeToFirebaseChat(roomId) {
      if (currentChatSubscription) {
        currentChatSubscription.off();
      }
      if (!firebaseDb || !firebaseAuth || !firebaseAuth.currentUser) {
        console.log("Postponing Realtime DB chat subscribe: Firebase Auth not ready");
        return;
      }
      currentChatSubscription = firebaseDb.ref(`chatMessages/${roomId}`).orderByChild('Timestamp');
      currentChatSubscription.on('value', (snapshot) => {
        const val = snapshot.val();
        const list = [];
        if (val) {
          Object.keys(val).forEach(key => {
            list.push(val[key]);
          });
        }
        // sort by Timestamp
        list.sort((a, b) => String(a.Timestamp || '').localeCompare(String(b.Timestamp || '')));
        
        // Update local state.data.chatMessages with these messages
        state.data.chatMessages = state.data.chatMessages.filter(m => m.ChatRoomID !== roomId);
        state.data.chatMessages.push(...list.map(normalizeRow));
        
        // Render chat if current page is chat
        if (state.active === 'chat') {
          renderChat();
        }
      });
    }

    // Sync Firebase Auth state with Firestore/Realtime DB
    if (firebaseAuth) {
      firebaseAuth.onAuthStateChanged(async (user) => {
        if (user) {
          console.log("Firebase Auth synced: User authenticated");
          try {
            if (firebaseFs) {
              const profileDoc = await firebaseFs.collection('userProfiles').doc(user.uid).get();
              if (profileDoc.exists) {
                const profile = profileDoc.data();
                state.currentUser = Object.assign({}, state.currentUser, {
                  UserID: user.uid,
                  Username: profile.Username || (state.currentUser && state.currentUser.Username) || '',
                  Email: user.email,
                  Role: profile.Role || (state.currentUser && state.currentUser.Role) || 'student',
                  FirstName: profile.FirstName || (state.currentUser && state.currentUser.FirstName) || '',
                  LastName: profile.LastName || (state.currentUser && state.currentUser.LastName) || '',
                  DisplayName: profile.DisplayName || (state.currentUser && state.currentUser.DisplayName) || '',
                  ClassName: profile.ClassName || (state.currentUser && state.currentUser.ClassName) || '',
                  StudentID: profile.StudentID || (state.currentUser && state.currentUser.StudentID) || '',
                  HouseholdName: profile.HouseholdStatus || (state.currentUser && state.currentUser.HouseholdName) || ''
                });
                applyCurrentUserToState();
              }
            }
          } catch (e) {
            console.error("Error restoring user profile from Firestore:", e);
          }
          await fetchUserProfilesFromFirestore();
          if (state.active === 'chat' && firebaseDb) {
            subscribeToFirebaseChat(state.chatRoom || 'CR-MISSION-01');
          }
        } else {
          console.log("Firebase Auth synced: No active session");
        }
      });
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

    function sheetApiLoadingText(action) {
      return {
        getBootstrapData: ['กำลังโหลดข้อมูลล่าสุด', 'ระบบกำลังอ่านข้อมูลจาก Google Sheets'],
        appendWasteRecord: ['กำลังบันทึกข้อมูลขยะ', 'ระบบกำลังส่งข้อมูลและหลักฐานไปยัง Google Sheets'],
        appendGameScore: ['กำลังบันทึกคะแนนเกม', 'ระบบกำลังบันทึกคะแนน Trash Hero Academy'],
        appendCommunityPost: ['กำลังบันทึกโพสต์', 'ระบบกำลังส่งโพสต์ไปยัง Google Sheets'],
        appendPostComment: ['กำลังบันทึกความคิดเห็น', 'ระบบกำลังส่งความคิดเห็นไปยัง Google Sheets'],
        appendChatMessage: ['กำลังส่งข้อความ', 'ระบบกำลังบันทึกข้อความไปยัง Google Sheets'],
        reportChatMessage: ['กำลังส่งรายงานข้อความ', 'ระบบกำลังบันทึกรายงานให้ครูผู้ดูแล'],
        archiveChatMessages: ['กำลังสำรองข้อความ', 'ระบบกำลังบันทึกข้อความแชทลง Google Sheets'],
        sendCommunityLike: ['กำลังบันทึกกำลังใจ', 'ระบบกำลังอัปเดตจำนวนกำลังใจใน Google Sheets'],
        updateReview: ['กำลังบันทึกผลตรวจ', 'ระบบกำลังบันทึกผลตรวจหลักฐานลง Google Sheets'],
        updateCommunityPostReview: ['กำลังบันทึกผลตรวจโพสต์', 'ระบบกำลังอัปเดตสถานะโพสต์ใน Google Sheets'],
        updatePostCommentReview: ['กำลังบันทึกผลตรวจความคิดเห็น', 'ระบบกำลังอัปเดตสถานะความคิดเห็นใน Google Sheets'],
        updateChatMessageModeration: ['กำลังบันทึกสถานะแชท', 'ระบบกำลังอัปเดตสถานะข้อความใน Google Sheets'],
        logExportReport: ['กำลังบันทึกประวัติ Export', 'ระบบกำลังบันทึกประวัติรายงานใน Google Sheets'],
        adminLogin: ['กำลังตรวจสอบ PIN', 'ระบบกำลังตรวจสอบสิทธิ์ผู้ดูแลผ่าน Google Sheets'],
        loginUser: ['กำลังเข้าสู่ระบบ', 'ระบบกำลังตรวจสอบบัญชีผู้ใช้'],
        signupUser: ['กำลังสมัครสมาชิก', 'ระบบกำลังสร้างบัญชีและบันทึกข้อมูล'],
        logoutUser: ['กำลังออกจากระบบ', 'ระบบกำลังปิด session ผู้ใช้'],
      }[action] || ['กำลังเชื่อมต่อ Google Sheets', 'กรุณารอสักครู่ ระบบกำลังดำเนินการ'];
    }

    async function sheetApi(action, payload = {}) {
      if (!sheetApiConfigured()) throw new Error('ยังไม่ได้ตั้งค่า Apps Script Web App endpoint สำหรับบันทึกลง Google Sheets');
      const [title, message] = sheetApiLoadingText(action);
      window.showGlobalLoading?.(message, title);
      try {
        return await sheetApiViaFrame(action, payload);
      } finally {
        window.hideGlobalLoading?.();
      }
    }

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

    function saveToLocalStorage() {
      try {
        // Limit the size of social/log data stored in localStorage to prevent quota exceeded errors
        const recentChatMessages = (state.data.chatMessages || [])
          .slice()
          .sort((a, b) => String(b.Timestamp || '').localeCompare(String(a.Timestamp || '')))
          .slice(0, 50);

        const recentCommunityPosts = (state.data.communityPosts || [])
          .slice()
          .sort((a, b) => String(b.Timestamp || '').localeCompare(String(a.Timestamp || '')))
          .slice(0, 50);

        // Keep comments associated with the recent posts
        const recentPostIds = new Set(recentCommunityPosts.map(p => p.PostID));
        const recentPostComments = (state.data.postComments || [])
          .filter(c => recentPostIds.has(c.PostID))
          .slice(0, 100);

        const recentExpLogs = (state.data.expLogs || [])
          .slice()
          .sort((a, b) => String(b.Timestamp || b.CreatedAt || '').localeCompare(String(a.Timestamp || a.CreatedAt || '')))
          .slice(0, 50);

        localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify({
          wasteRecords: state.data.wasteRecords,
          gameScores: state.data.gameScores,
          communityPosts: recentCommunityPosts,
          postComments: recentPostComments,
          chatMessages: recentChatMessages,
          chatRooms: state.data.chatRooms,
          userProfiles: state.data.userProfiles,
          levelRules: state.data.levelRules,
          expLogs: recentExpLogs,
          settings: state.data.settings,
        }));
      } catch (e) {
        console.warn("Failed to save data to localStorage:", e);
      }
    }

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

    function queuePendingWrite(action, payload) {
      const pending = JSON.parse(localStorage.getItem(LOCAL_QUEUE_KEY) || '[]');
      pending.push({ action, payload, queuedAt: new Date().toISOString() });
      localStorage.setItem(LOCAL_QUEUE_KEY, JSON.stringify(pending));
    }

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

    function isAuthenticated() {
      return !!(state.currentUser && state.currentUser.UserID);
    }

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

    function persistAuthSession(session) {
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({
        token: session.token || '',
        user: normalizeAuthUser(session.user || {}),
        savedAt: new Date().toISOString(),
      }));
    }

    function clearAuthSession() {
      localStorage.removeItem(AUTH_SESSION_KEY);
      sessionStorage.removeItem(AUTH_SESSION_KEY);
      state.authToken = '';
      state.currentUser = null;
      state.chatIdentity = {};
      localStorage.removeItem('greenPassportChatIdentity');
    }

    function greenPassportLogoSrc() {
      return document.querySelector('.brand-logos .logo-slot img')?.getAttribute('src') || '';
    }
