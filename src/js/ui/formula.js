// --- Generated Module: formula.js ---

// --- renderFormula ---
function renderFormula() {
      document.getElementById('formula').innerHTML = `
        <div class="panel">
          <h3>สูตรคำนวณคาร์บอนและแหล่งอ้างอิงค่า EF</h3>
          <p><strong>kgCO₂e</strong> หรือกิโลกรัมคาร์บอนไดออกไซด์เทียบเท่า เป็นหน่วยที่ใช้วัดผลกระทบของก๊าซเรือนกระจก เพื่อให้สามารถเปรียบเทียบผลจากกิจกรรมต่าง ๆ ได้ในรูปแบบเดียวกัน</p>
          <div class="formula-box">
            <strong>ปริมาณลดก๊าซเรือนกระจก = ปริมาณกิจกรรม × ค่า Emission Factor</strong>
            <p>ตัวอย่างที่ 1: รีไซเคิลขวดพลาสติก 2 kg × EF 1.50 = 3.00 kgCO₂e</p>
            <p>ตัวอย่างที่ 2: หมักเศษอาหารทำปุ๋ย 10 kg × EF 0.286 = 2.86 kgCO₂e</p>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>ActivityCode</th><th>ActivityName</th><th>Unit</th><th>EF</th><th>Source</th><th>Remark</th></tr></thead>
              <tbody>${state.data.carbonFactors.map((f) => `<tr><td>${f.ActivityCode}</td><td>${f.ActivityName}</td><td>${f.Unit}</td><td>${f.EF}</td><td>${f.Source}</td><td>${f.Note}</td></tr>`).join('')}</tbody>
            </table>
          </div>
          <div class="notice" style="margin-top:14px">ค่า EF ในระบบใช้เพื่อการเรียนรู้และการประเมินโครงการเบื้องต้น ควรตรวจสอบกับแหล่งอ้างอิงที่เป็นทางการ เช่น องค์การบริหารจัดการก๊าซเรือนกระจก (อบก.) หรือ IPCC ก่อนนำไปใช้ในรายงานอย่างเป็นทางการ</div>
        </div>`;
    }

