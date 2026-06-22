    async function reloadData(silent = false) {
      const result = sheetApiConfigured()
        ? await sheetApi('getBootstrapData')
        : await loadBootstrapFromPublicSheets();
      hydrateData(result.data || result);
      saveToLocalStorage();
      renderAll();
      if (!silent) alert('โหลดข้อมูลจาก Google Sheets ล่าสุดแล้ว');
    }

    function refreshLocalDashboard() {
      state.data.householdSummary = summarizeHouseholds(state.data.wasteRecords);
      state.data.dashboard = buildDashboard(state.data.wasteRecords, state.data.householdSummary);
    }

    function sum(rows, field) {
      return rows.reduce((total, row) => total + Number(row[field] || 0), 0);
    }
    function sumOne(row, fields) {
      return fields.reduce((total, field) => total + Number(row[field] || 0), 0);
    }
    function round(value) {
      return Math.round(Number(value || 0) * 100) / 100;
    }
    function format(value) {
      return Number(value || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    function maskId(id) {
      const text = String(id || '');
      return text.length <= 3 ? '***' : text.slice(0, 2) + '***' + text.slice(-2);
    }

    init();
