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
            modal.hidden = false;
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
            modal.hidden = false;
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
          modal.hidden = true;
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
          modal.hidden = true;
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