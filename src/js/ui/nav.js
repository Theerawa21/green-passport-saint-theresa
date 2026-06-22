// --- Generated Module: nav.js ---

// --- mainNavPages ---
function mainNavPages() {
      return pages.filter(([id]) => !adminOnlyPageIds.has(id));
    }

// --- adminToolPages ---
function adminToolPages() {
      return pages.filter(([id]) => adminOnlyPageIds.has(id));
    }

// --- renderAuthUserChip ---
function renderAuthUserChip() {
      const chip = document.getElementById('authUserChip');
      if (!chip) return;
      if (!isAuthenticated()) {
        chip.hidden = true;
        chip.innerHTML = '';
        return;
      }
      const user = currentUserIdentity();
      chip.hidden = false;
      chip.innerHTML = `
        <div class="avatar">${escapeHtml(avatarText(user.DisplayName))}</div>
        <div>
          <strong>${escapeHtml(user.DisplayName)}</strong>
          <span>${escapeHtml(user.ClassName || user.Role || 'Green Passport')}</span>
        </div>
        <button type="button" onclick="logout()">Logout</button>`;
    }

// --- renderNav ---
function renderNav() {
      const side = document.getElementById('sideNav');
      const mobile = document.getElementById('mobileNav');
      const navPages = mainNavPages();
      side.innerHTML = navPages.map(([id, label, icon]) => `<button class="nav-btn" data-page="${id}" title="${label}">${icons[icon]}<span>${label}</span></button>`).join('');
      mobile.innerHTML = navPages.slice(0, 5).map(([id, label, icon]) => `<button data-page="${id}" title="${label}">${icons[icon]}<span>${shortLabel(label)}</span></button>`).join('');
      document.querySelectorAll('[data-page]').forEach((btn) => btn.addEventListener('click', () => showPage(btn.dataset.page)));
    }

