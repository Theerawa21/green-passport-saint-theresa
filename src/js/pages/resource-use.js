
    // Electricity and water: browser-local pilot until secure backend is ready.
    // These records are NOT verified carbon credits.
    const resourceSpecs = {
      electricity: {
        title: 'GREEN ENERGY – พลังงานไฟฟ้า', icon: '⚡', unit: 'kWh',
        usage: 'การใช้ไฟฟ้าจากบิลหรือมิเตอร์ (kWh)',
        cost: 'ค่าไฟฟ้าตามบิล (บาท)',
        tip: 'ลดการเปิดไฟที่ไม่จำเป็น ตั้งอุณหภูมิเครื่องปรับอากาศอย่างเหมาะสม และตรวจสอบอุปกรณ์ที่กินไฟ',
      },
      water: {
        title: 'GREEN WATER – การใช้น้ำ', icon: '💧', unit: 'm³',
        usage: 'ปริมาณน้ำจากบิลหรือมิเตอร์ (ลูกบาศก์เมตร)',
        cost: 'ค่าน้ำตามบิล (บาท)',
        tip: 'ตรวจสอบจุดรั่ว ปิดก๊อกเมื่อไม่ใช้ และเลือกอุปกรณ์ประหยัดน้ำ',
      },
    };

    function resourceRecords(type) {
      if (!resourceSpecs[type]) return [];
      // Use only pseudonymous account IDs; do not store names or bill images.
      const identity = state.currentUser || {};
      const userKey = String(identity.UserID || identity.uid || identity.Username || identity.StudentID || 'current-account').replace(/[^\w-]/g,'_');
      const key = 'greenPassportResourcePilot:' + type + ':' + userKey;
      let items = [];
      try {
        const raw = localStorage.getItem(key);
        items = raw ? JSON.parse(raw) : [];
      } catch (error) { items = []; }
      return { key, items: Array.isArray(items) ? items : [] };
    }

    function resourceComparison(items, unit) {
      const sorted = [...items].filter((r) => r.Source !== 'estimate').sort((a, b) => a.ReportMonth.localeCompare(b.ReportMonth));
      if (sorted.length < 2) return '<p class="notice">บันทึกข้อมูลจริงจากบิลหรือมิเตอร์อย่างน้อย 2 เดือนจึงจะเปรียบเทียบก่อน–หลังได้ (ไม่นำค่าประมาณมาคำนวณ)</p>';
      const first = sorted[0], last = sorted[sorted.length - 1];
      const difference = Number(first.Usage) - Number(last.Usage);
      const percent = Number(first.Usage) > 0 ? difference / Number(first.Usage) * 100 : null;
      const message = difference > 0 ? 'ลดลง' : difference < 0 ? 'เพิ่มขึ้น' : 'ไม่เปลี่ยนแปลง';
      const costDifference = Number.isFinite(first.Cost) && Number.isFinite(last.Cost) && first.Cost !== null && last.Cost !== null
        ? (Number(first.Cost) - Number(last.Cost)) : null;
      return `<div class="panel"><h3>เปรียบเทียบ ${escapeHtml(first.ReportMonth)} → ${escapeHtml(last.ReportMonth)}</h3>
        <p>การใช้ทรัพยากร${message} <strong>${format(Math.abs(difference))} ${unit}</strong>
        ${percent === null ? '' : '(' + format(Math.abs(percent)) + '%)'}</p>
        ${costDifference === null ? '' : '<p>ค่าใช้จ่าย' + (costDifference >= 0 ? 'ลดลง ' : 'เพิ่มขึ้น ') + '<strong>' + format(Math.abs(costDifference)) + ' บาท</strong></p>'}
        <p class="notice">เป็นการเปรียบเทียบปริมาณที่บันทึก ไม่ใช่หลักฐานยืนยันว่าประหยัดจากมาตรการเพียงอย่างเดียว ควรพิจารณาจำนวนผู้อยู่อาศัยและรอบบิลที่เท่ากัน</p>
      </div>`;
    }

    function renderResource(type) {
      const spec = resourceSpecs[type];
      if (!spec) return;
      const { items } = resourceRecords(type);
      const records = [...items].sort((a,b)=>b.ReportMonth.localeCompare(a.ReportMonth));
      const month = new Date().toISOString().slice(0,7);
      document.getElementById(type).innerHTML = `
        <div class="panel">
          <h2>${spec.icon} ${spec.title}</h2>
          <p>ติดตามปริมาณการใช้จริง ตั้งเป้าหมายลดการใช้ และเปรียบเทียบก่อน–หลัง เพื่อสร้างพฤติกรรมการใช้ทรัพยากรอย่างรับผิดชอบ</p>
          <p class="notice">ต้นแบบ: ข้อมูลบันทึกเฉพาะเบราว์เซอร์นี้ ยังไม่ได้เชื่อม Google Sheets หรือระบบตรวจรับรอง หลีกเลี่ยงการใช้บนอุปกรณ์สาธารณะ</p>
        </div>
        <div class="grid two" style="margin-top:16px">
          <form id="${type}ResourceForm" class="panel">
            <h3>บันทึกข้อมูลรายเดือน</h3>
            <div class="field-grid">
              <label>เดือนที่รายงาน <input required name="ReportMonth" type="month" value="${month}"></label>
              <label>แหล่งข้อมูล
                <select name="Source" required>
                  <option value="bill">บิลค่าสาธารณูปโภค</option>
                  <option value="meter">อ่านมิเตอร์</option>
                  <option value="estimate">ค่าประมาณ (แยกจากข้อมูลจริง)</option>
                </select>
              </label>
              <label>${spec.usage} <input required name="Usage" type="number" min="0" step="0.01" placeholder="0.00"></label>
              <label>${spec.cost} <input name="Cost" type="number" min="0" step="0.01" placeholder="ไม่บังคับ"></label>
              <label>จำนวนสมาชิกครัวเรือน (คน) <input name="Members" type="number" min="1" step="1" placeholder="ไม่บังคับ"></label>
            </div>
            <p class="notice">หากบันทึกเดือนเดิมซ้ำ ระบบจะปรับปรุงข้อมูลของเดือนนั้น</p>
            <button class="btn" type="submit">บันทึกข้อมูล${type==='electricity'?'ไฟฟ้า':'น้ำ'}</button>
          </form>
          <div class="panel">
            <h3>แนวทางลดการใช้ทรัพยากร</h3>
            <p>${spec.tip}</p>
            <p>ข้อมูลที่ควรนำมาเปรียบเทียบ: ปริมาณการใช้ (${spec.unit}) ค่าใช้จ่าย (บาท) และปริมาณต่อคนเมื่อจำนวนสมาชิกเปลี่ยน</p>
            <p><strong>จำนวนเดือนที่บันทึก:</strong> ${records.length} เดือน</p>
          </div>
        </div>
        <div style="margin-top:16px">${resourceComparison(items, spec.unit)}</div>
        <div class="panel" style="margin-top:16px">
          <h3>ประวัติการใช้ทรัพยากร</h3>
          ${records.length ? '<div class="table-wrap"><table><thead><tr><th>เดือน</th><th>ปริมาณ ('+spec.unit+')</th><th>ค่าใช้จ่าย (บาท)</th><th>แหล่งข้อมูล</th><th>แก้ไข</th></tr></thead><tbody>'+records.map(r=>`<tr><td>${escapeHtml(r.ReportMonth)}</td><td>${format(r.Usage)}</td><td>${r.Cost===null?'-':format(r.Cost)}</td><td>${r.Source==='bill'?'บิล':r.Source==='meter'?'มิเตอร์':'ประมาณการ'}</td><td><button class="btn ghost" type="button" data-delete-month="${escapeAttr(r.ReportMonth)}">ลบ</button></td></tr>`).join('')+'</tbody></table></div>' : '<p>ยังไม่มีข้อมูล</p>'}
        </div>`;
      document.getElementById(type+'ResourceForm').addEventListener('submit',e=>submitResource(e,type));
      document.getElementById(type).querySelectorAll('[data-delete-month]').forEach(button=>{
        button.addEventListener('click',()=>deleteResource(type,button.dataset.deleteMonth));
      });
    }

    function submitResource(event,type) {
      event.preventDefault();
      const form = event.currentTarget, fd = new FormData(form);
      const usage = Number(fd.get('Usage'));
      const costText = String(fd.get('Cost')||'').trim();
      const cost = costText === '' ? null : Number(costText);
      const membersText = String(fd.get('Members')||'').trim();
      const members = membersText === '' ? null : Number(membersText);
      const month = String(fd.get('ReportMonth')||'');
      if (!/^\d{4}-\d{2}$/.test(month) || !Number.isFinite(usage) || usage < 0 || (cost !== null && (!Number.isFinite(cost)||cost<0)) || (members !== null && (!Number.isInteger(members)||members<1))) {
        alert('กรุณาตรวจสอบเดือน ปริมาณการใช้ ค่าใช้จ่าย และจำนวนสมาชิก'); return;
      }
      const record = { ReportMonth: month, Source: String(fd.get('Source')), Usage: usage, Cost: cost, Members: members };
      const store = resourceRecords(type);
      store.items = store.items.filter(r=>r.ReportMonth!==month);
      store.items.push(record);
      try { localStorage.setItem(store.key,JSON.stringify(store.items)); } catch(error) { alert('ไม่สามารถบันทึกในอุปกรณ์นี้ได้'); return; }
      renderResource(type);
    }

    function deleteResource(type,month) {
      if (!confirm('ยืนยันลบข้อมูลเดือน '+month+' หรือไม่?')) return;
      const store=resourceRecords(type);
      try { localStorage.setItem(store.key,JSON.stringify(store.items.filter(r=>r.ReportMonth!==month))); } catch(error) { alert('ไม่สามารถลบข้อมูลได้');return; }
      renderResource(type);
    }
