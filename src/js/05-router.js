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

    function renderNav() {
      const side = document.getElementById('sideNav');
      const mobile = document.getElementById('mobileNav');
      const navPages = mainNavPages();
      const primaryPages = navPages.filter(([id]) => id !== 'profile');
      const mobilePages = primaryPages.slice(0, 5);
      side.innerHTML = primaryPages.map(([id, label, icon]) => `<button class="nav-btn" data-page="${id}" title="${label}">${icons[icon]}<span>${label}</span></button>`).join('');
      mobile.innerHTML = mobilePages.map(([id, label, icon]) => `<button data-page="${id}" title="${label}">${icons[icon]}<span>${shortLabel(label)}</span></button>`).join('');
      document.querySelectorAll('[data-page]').forEach((btn) => btn.addEventListener('click', () => showPage(btn.dataset.page)));
    }

    function shortLabel(label) {
      return label.replace('ข้อมูลขยะ', '').replace('Trash Hero Academy', 'เกม').replace('Leaderboard', 'อันดับ');
    }

    function showPage(page) {
      if (!isAuthenticated()) {
        renderAuth();
        return;
      }
      state.active = page;
      document.body.classList.toggle('chat-active', page === 'chat');
      renderAll();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

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
