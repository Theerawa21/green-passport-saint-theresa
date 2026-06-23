    function renderRecord() {
      const month = new Date().toISOString().slice(0, 7);
      const defaults = authRecordDefaults();
      document.getElementById('record').innerHTML = `
        <div class="grid record-layout">
          <form class="panel" id="recordForm">
            <h3>ข้อมูลนักเรียนและครัวเรือน</h3>
            <div class="field-grid">
              ${input('StudentName', 'ชื่อ-สกุลนักเรียน', 'text', true, defaults.StudentName)}
              ${input('ClassName', 'ระดับชั้น/ห้อง', 'text', true, defaults.ClassName)}
              ${input('StudentID', 'เลขที่หรือรหัสนักเรียน', 'text', true, defaults.StudentID)}
              ${input('HouseholdName', 'ชื่อครัวเรือน', 'text', true, defaults.HouseholdName)}
              ${input('ReportMonth', 'เดือนที่รายงานผล', 'month', true, month)}
            </div>
            <div class="form-group">
              <h3>ปริมาณขยะ 4 ประเภท</h3>
              <div class="field-grid">
                ${input('GeneralWasteKg', 'ขยะทั่วไป (kg)', 'number')}
                ${input('RecycleWasteKg', 'ขยะรีไซเคิล (kg)', 'number')}
                ${input('OrganicWasteKg', 'ขยะอินทรีย์/เศษอาหาร (kg)', 'number')}
                ${input('HazardousWasteAmount', 'ขยะอันตราย (ชิ้นหรือ kg)', 'number')}
              </div>
            </div>
            <div class="form-group">
              <h3>กิจกรรมจัดการขยะเพิ่มเติม</h3>
              <div class="activity-grid">
                ${activityFields.map(([field, label, unit]) => input(field, `${label} (${unit})`, 'number')).join('')}
              </div>
            </div>
            <div class="form-group">
              <h3>หลักฐานและความยินยอม</h3>
              <div class="field-grid">
                <label>อัปโหลดรูปภาพหลักฐาน<input id="EvidenceFiles" name="EvidenceFiles" type="file" accept="image/*" multiple></label>
                ${input('VideoLink', 'ลิงก์วิดีโอเพิ่มเติม', 'url')}
              </div>
              <div class="privacy-box" style="margin-top:12px">
                <label><span><input type="checkbox" name="Consent" required style="width:auto;min-height:auto"> ข้าพเจ้ายินยอมให้โรงเรียนใช้ข้อมูลและภาพหลักฐานที่ส่งผ่านระบบ Green Passport เพื่อการติดตามผลโครงการด้านสิ่งแวดล้อม การจัดทำรายงาน และการนำเสนอผลงานทางการศึกษา โดยโรงเรียนจะใช้ข้อมูลอย่างเหมาะสมและไม่เปิดเผยข้อมูลส่วนบุคคลต่อสาธารณะโดยไม่จำเป็น</span></label>
              </div>
            </div>
            <div class="btn-row" style="margin-top:16px">
              <button class="btn" type="submit">${icons.edit}ส่งข้อมูล</button>
              <button class="btn ghost" type="reset">ล้างข้อมูล</button>
            </div>
          </form>
          <div class="result-box">
            <h3>ผลคำนวณทันที</h3>
            <div class="number"><span id="liveCo2e">0.00</span></div>
            <p>kgCO₂e จากกิจกรรมที่บันทึก</p>
            <div style="margin-top:12px">${greenBuddy('<span id="liveAdvice">กรอกกิจกรรมเพื่อดูคำแนะนำอัตโนมัติ</span>', true)}</div>
            <div class="panel" style="margin-top:14px">
              <h3>สถานะ Google Sheets</h3>
              <p>${sheetApiConfigured() ? 'เชื่อมต่อ Google Sheets Web App พร้อมบันทึกลงชีต' : 'ยังไม่ได้ตั้งค่า endpoint สำหรับเขียนข้อมูล: เปิดด้วย ?api=WEB_APP_URL หลัง deploy Code.gs'}</p>
            </div>
          </div>
        </div>`;
      const form = document.getElementById('recordForm');
      form.addEventListener('input', updateLiveCarbon);
      form.addEventListener('submit', submitRecord);
      updateLiveCarbon();
    }

    function input(name, label, type, required, value = '') {
      const step = type === 'number' ? ' step="0.01" min="0"' : '';
      return `<label>${label}<input name="${name}" type="${type}" value="${value}" ${required ? 'required' : ''}${step}></label>`;
    }

    function updateLiveCarbon() {
      const form = document.getElementById('recordForm');
      if (!form) return;
      const data = Object.fromEntries(new FormData(form).entries());
      const co2e = calculateCo2e(data);
      document.getElementById('liveCo2e').textContent = format(co2e);
      document.getElementById('liveAdvice').textContent = advice(data, co2e);
    }

    async function submitRecord(event) {
      event.preventDefault();
      const form = event.currentTarget;
      const data = Object.fromEntries(new FormData(form).entries());
      const identity = currentUserIdentity();
      data.UserID = identity.UserID;
      data.TotalCO2e = calculateCo2e(data);
      data.EvidenceFiles = await filesToPayload(document.getElementById('EvidenceFiles').files);
      if (!data.EvidenceFiles.length) {
        alert('กรุณาแนบรูปภาพหลักฐานอย่างน้อย 1 รูป');
        return;
      }
      try {
        const result = await sheetApi('appendWasteRecord', { record: data });
        if (result.record) state.data.wasteRecords.push(normalizeRow(result.record));
        refreshLocalDashboard();
        applyCurrentUserToState();
        saveToLocalStorage();
        alert(`บันทึกลง Google Sheets สำเร็จ\nลดคาร์บอน ${format(result.totalCO2e || data.TotalCO2e)} kgCO₂e\n${result.message || advice(data, data.TotalCO2e)}`);
        form.reset();
        renderAll();
      } catch (error) {
        state.data.wasteRecords.push(normalizeRow(data));
        refreshLocalDashboard();
        applyCurrentUserToState();
        saveToLocalStorage();
        queuePendingWrite('appendWasteRecord', { record: data });
        alert('ยังบันทึกลง Google Sheets ไม่สำเร็จ ระบบเก็บคำขอนี้ไว้เพื่อส่งซ้ำเมื่อ endpoint พร้อม: ' + error.message);
        form.reset();
        renderAll();
      }
    }

    function filesToPayload(files) {
      return Promise.all([...files].map((file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ name: file.name, mimeType: file.type, data: reader.result });
        reader.onerror = reject;
        reader.readAsDataURL(file);
      })));
    }

    function calculateCo2e(data) {
      return round(activityFields.reduce((total, [field]) => total + Number(data[field] || 0) * Number(factorMap[field] || 0), 0));
    }

    function advice(data, co2e) {
      if (Number(data.GeneralWasteKg || 0) > 10) return '🗑️ ขยะทั่วไปยังสูง ลองลดซองขนม ถุงพลาสติก และของใช้ครั้งเดียวทิ้งนะ';
      if (Number(data.OrganicWasteKg || 0) > Number(data.CompostFoodKg || 0) + Number(data.BioExtractKg || 0) + Number(data.FeedAnimalsKg || 0)) return '🍃 ขยะอินทรีย์เยอะมาก ลองทำถังหมักปุ๋ยหรือน้ำหมักชีวภาพที่บ้านกันเถอะ';
      if (Number(data.RecycleWasteKg || 0) > 0 && Number(data.RecycleWasteKg || 0) < 3) return '♻️ เดือนนี้ขยะรีไซเคิลยังน้อย ลองตั้งมุมแยกขวด กระดาษ และกระป๋องในบ้านนะ';
      if (co2e >= 20) return '🌍 เยี่ยมมาก! เดือนนี้ครอบครัวของคุณลดคาร์บอนได้ดีขึ้นมาก';
      return '📸 อย่าลืมเพิ่มรูปภาพหลักฐานก่อนส่งข้อมูลนะ';
    }
