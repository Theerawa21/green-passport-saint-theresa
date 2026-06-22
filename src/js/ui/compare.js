// --- Generated Module: compare.js ---

// --- renderCompare ---
function renderCompare() {
      const options = state.data.householdSummary.map((h) => `<option>${h.HouseholdName}</option>`).join('');
      document.getElementById('compare').innerHTML = `
        <div class="panel">
          <div class="field-grid">
            <label>เลือกครัวเรือน<select id="compareHouse" onchange="renderCompareResult()">${options}</select></label>
          </div>
          <div id="compareResult" style="margin-top:16px"></div>
        </div>`;
      renderCompareResult();
    }

// --- renderCompareResult ---
function renderCompareResult() {
      const el = document.getElementById('compareResult');
      if (!el) return;
      const house = document.getElementById('compareHouse')?.value || state.data.householdSummary[0]?.HouseholdName;
      const rows = state.data.wasteRecords.filter((r) => r.HouseholdName === house).sort((a, b) => a.ReportMonth.localeCompare(b.ReportMonth));
      if (rows.length < 2) {
        el.innerHTML = '<div class="notice">ต้องมีข้อมูลอย่างน้อย 2 เดือนเพื่อเปรียบเทียบก่อน-หลัง</div>';
        return;
      }
      const first = rows[0];
      const last = rows[rows.length - 1];
      const generalDrop = first.GeneralWasteKg ? ((first.GeneralWasteKg - last.GeneralWasteKg) / first.GeneralWasteKg) * 100 : 0;
      const co2Increase = Number(last.TotalCO2e) - Number(first.TotalCO2e);
      el.innerHTML = `
        <div class="grid three">
          ${kpi('ขยะทั่วไปลดลง', format(generalDrop), '%')}
          ${kpi('คาร์บอนเพิ่มขึ้น', format(co2Increase), 'kgCO₂e')}
          ${kpi('พฤติกรรมลดขยะ', sumOne(last, ['ReducePlasticBagTimes','CarryBottleTimes','UseLunchBoxTimes','RefuseStrawTimes','CarryClothBagTimes']), 'ครั้ง')}
        </div>
        <div class="notice" style="margin-top:16px">ครัวเรือนนี้ลดขยะทั่วไปได้ ${format(generalDrop)}% เมื่อเทียบกับเดือนแรก และมีพัฒนาการด้านการจัดการขยะอินทรีย์</div>
        <div style="margin-top:16px">${greenBuddy(generalDrop > 0 ? `ขยะทั่วไปลดลง ${format(generalDrop)}% แล้ว เก็บหลักฐานต่อเนื่องเพื่อก้าวสู่ Zero Waste Home นะ 🏡` : 'เดือนนี้ยังลดขยะทั่วไปได้ไม่ชัด ลองเริ่มจากลดถุงพลาสติกและตั้งมุมแยกขยะนะ ♻️', true)}</div>`;
    }

