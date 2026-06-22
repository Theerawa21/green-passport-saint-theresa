    // Global Error Console storage and interceptor
    (function() {
      const ERROR_LOGS_KEY = 'greenPassportErrorLogs';
      window.errorLogs = [];
      try {
        const raw = localStorage.getItem(ERROR_LOGS_KEY);
        if (raw) window.errorLogs = JSON.parse(raw);
      } catch(e) {}

      function logError(type, message, details = '') {
        const err = {
          time: new Date().toLocaleTimeString('th-TH') + ' ' + new Date().toLocaleDateString('th-TH'),
          type: type,
          message: message,
          details: details
        };
        window.errorLogs.unshift(err); // add to beginning
        if (window.errorLogs.length > 100) {
          window.errorLogs.pop(); // keep last 100
        }
        try {
          localStorage.setItem(ERROR_LOGS_KEY, JSON.stringify(window.errorLogs));
        } catch(e) {}
        
        // Safely try to update the console DOM if it is currently visible,
        // without calling full renderAdmin() which might trigger other errors.
        try {
          const consoleLogsContainer = document.getElementById('adminConsoleLogs');
          if (consoleLogsContainer) {
            function localEscapeHtml(str) {
              if (!str) return '';
              return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
            }
            let logsHtml = window.errorLogs.map((log) => {
              let color = '#ff5f56'; 
              if (log.type === 'Promise Rejection') color = '#ffbd2e'; 
              if (log.type === 'Console Error') color = '#f77f00'; 
              return `<div style="margin-bottom:10px; border-bottom:1px solid #2d2d2d; padding-bottom:6px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-size:11px;">
                  <span style="color:${color}; font-weight:bold;">[${localEscapeHtml(log.type)}]</span>
                  <span style="color:#888;">${localEscapeHtml(log.time)}</span>
                </div>
                <div style="word-break:break-all; white-space:pre-wrap; color:#f8f8f2;">${localEscapeHtml(log.message)}</div>
                ${log.details ? `<div style="color:#888; font-size:11px; margin-top:2px; word-break:break-all; white-space:pre-wrap;">รายละเอียด: ${localEscapeHtml(log.details)}</div>` : ''}
              </div>`;
            }).join('');
            if (window.errorLogs.length === 0) {
              logsHtml = '<div style="color:#888; text-align:center; padding:20px 0;">ไม่มี Error ที่บันทึกไว้</div>';
            }
            consoleLogsContainer.innerHTML = logsHtml;
            const countEl = document.querySelector('#adminConsoleTitleCount');
            if (countEl) countEl.textContent = `(${window.errorLogs.length})`;
          }
        } catch (e) {
          // Prevent infinite loops
        }
      }

      window.addManualErrorLog = function(type, message, details) {
        logError(type, message, details);
      };

      // Capture runtime errors
      window.addEventListener('error', function(event) {
        const details = event.filename ? `${event.filename}:${event.lineno}:${event.colno}` : '';
        logError('Runtime Error', event.message || String(event.error), details);
      });

      // Capture unhandled promise rejections
      window.addEventListener('unhandledrejection', function(event) {
        const reason = event.reason;
        const msg = reason ? (reason.message || String(reason)) : 'Promise Rejection';
        const stack = (reason && reason.stack) ? reason.stack.split('\n').slice(0, 3).join('\n') : '';
        logError('Promise Rejection', msg, stack);
      });

      // Intercept console.error
      const originalConsoleError = console.error;
      console.error = function(...args) {
        try {
          originalConsoleError.apply(console, args);
          const msg = args.map(arg => {
            try {
              return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
            } catch (err) {
              return String(arg);
            }
          }).join(' ');
          logError('Console Error', msg);
        } catch (e) {
          originalConsoleError.apply(console, args);
        }
      };
    })();

    // Global loading overlay for slow Google Sheets operations.
    (function() {
      let loadingCount = 0;
      let loadingMessage = 'กำลังดำเนินการ...';

      function ensureLoadingOverlay() {
        let overlay = document.getElementById('globalLoadingOverlay');
        if (overlay) return overlay;
        overlay = document.createElement('div');
        overlay.id = 'globalLoadingOverlay';
        overlay.className = 'global-loading-overlay';
        overlay.setAttribute('role', 'status');
        overlay.setAttribute('aria-live', 'polite');
        overlay.setAttribute('aria-modal', 'true');
        overlay.innerHTML = `
          <div class="global-loading-card">
            <div class="global-loading-spinner" aria-hidden="true"></div>
            <div class="global-loading-copy">
              <strong id="globalLoadingTitle">กำลังบันทึกข้อมูล</strong>
              <p id="globalLoadingMessage">กรุณารอสักครู่ ระบบกำลังเชื่อมต่อ Google Sheets</p>
            </div>
          </div>
        `;
        document.body.appendChild(overlay);
        return overlay;
      }

      window.showGlobalLoading = function(message = 'กรุณารอสักครู่ ระบบกำลังเชื่อมต่อ Google Sheets', title = 'กำลังบันทึกข้อมูล') {
        loadingCount += 1;
        loadingMessage = message || loadingMessage;
        const overlay = ensureLoadingOverlay();
        const titleEl = document.getElementById('globalLoadingTitle');
        const messageEl = document.getElementById('globalLoadingMessage');
        if (titleEl) titleEl.textContent = title;
        if (messageEl) messageEl.textContent = loadingMessage;
        overlay.classList.add('active');
        document.body.classList.add('global-loading-active');
      };

      window.hideGlobalLoading = function() {
        loadingCount = Math.max(0, loadingCount - 1);
        if (loadingCount > 0) return;
        const overlay = document.getElementById('globalLoadingOverlay');
        if (overlay) overlay.classList.remove('active');
        document.body.classList.remove('global-loading-active');
      };

      window.resetGlobalLoading = function() {
        loadingCount = 0;
        const overlay = document.getElementById('globalLoadingOverlay');
        if (overlay) overlay.classList.remove('active');
        document.body.classList.remove('global-loading-active');
      };
    })();

    // Custom Alert & Confirm modal implementation
    (function() {
      const alertQueue = [];
      let currentAlert = null;

      function processAlertQueue() {
        if (currentAlert || alertQueue.length === 0) return;
        currentAlert = alertQueue.shift();

        if (currentAlert.type === 'alert') {
          const modal = document.getElementById('customAlertModal');
          const msgEl = document.getElementById('customAlertMessage');
          if (modal && msgEl) {
            msgEl.textContent = currentAlert.message;
            modal.style.display = 'flex';
          } else {
            console.warn("Alert UI elements not found:", currentAlert.message);
            const resolve = currentAlert.resolve;
            currentAlert = null;
            if (resolve) resolve();
            processAlertQueue();
          }
        } else if (currentAlert.type === 'confirm') {
          const modal = document.getElementById('customConfirmModal');
          const msgEl = document.getElementById('customConfirmMessage');
          const titleEl = document.getElementById('customConfirmTitle');
          if (modal && msgEl && titleEl) {
            msgEl.textContent = currentAlert.message;
            titleEl.textContent = currentAlert.title || 'ยืนยันการดำเนินการ';
            modal.style.display = 'flex';
          } else {
            console.warn("Confirm UI elements not found:", currentAlert.message);
            const resolve = currentAlert.resolve;
            currentAlert = null;
            if (resolve) resolve(false);
            processAlertQueue();
          }
        }
      }

      window.alert = function(message) {
        return new Promise((resolve) => {
          alertQueue.push({
            type: 'alert',
            message: String(message),
            resolve: resolve
          });
          processAlertQueue();
        });
      };

      window.customConfirm = function(message, title = 'ยืนยันการดำเนินการ') {
        return new Promise((resolve) => {
          alertQueue.push({
            type: 'confirm',
            message: String(message),
            title: title,
            resolve: resolve
          });
          processAlertQueue();
        });
      };

      window.closeCustomAlert = function() {
        const modal = document.getElementById('customAlertModal');
        if (modal) {
          modal.style.display = 'none';
        }
        if (currentAlert && currentAlert.type === 'alert') {
          const resolve = currentAlert.resolve;
          currentAlert = null;
          if (resolve) resolve();
          processAlertQueue();
        }
      };

      window.handleConfirmResponse = function(status) {
        const modal = document.getElementById('customConfirmModal');
        if (modal) {
          modal.style.display = 'none';
        }
        if (currentAlert && currentAlert.type === 'confirm') {
          const resolve = currentAlert.resolve;
          currentAlert = null;
          if (resolve) resolve(status);
          processAlertQueue();
        }
      };

      function bindButtons() {
        const okBtn = document.getElementById('customConfirmOkBtn');
        const cancelBtn = document.getElementById('customConfirmCancelBtn');
        if (okBtn) {
          okBtn.onclick = () => window.handleConfirmResponse(true);
        }
        if (cancelBtn) {
          cancelBtn.onclick = () => window.handleConfirmResponse(false);
        }
      }

      if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', bindButtons);
      } else {
        bindButtons();
      }
    })();
