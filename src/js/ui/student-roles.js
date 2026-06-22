// --- Generated Module: student-roles.js ---

// --- renderStudentRoles ---
function renderStudentRoles() {
      const evidence = ['ภาพนักเรียนประชุมวางแผน', 'ภาพนักเรียนทดลองใช้ระบบ', 'ภาพนักเรียนสอนผู้ปกครอง', 'ภาพนักเรียนเก็บข้อมูลขยะ', 'ภาพนักเรียนวิเคราะห์ข้อมูล', 'ภาพกิจกรรม School to Home'];
      document.getElementById('studentRoles').innerHTML = `
        <div class="impact-hero">
          <div>
            <h3>บทบาทนักเรียนผู้พัฒนาระบบ</h3>
            <p>ระบบ Green Passport เกิดจากคำถามของนักเรียนแกนนำว่า จะทำอย่างไรให้ครัวเรือนเห็นว่าการแยกขยะและลดขยะที่บ้านสามารถช่วยโลกได้จริงเป็นตัวเลข จึงนำไปสู่การพัฒนาระบบดิจิทัลที่ช่วยบันทึกข้อมูล คำนวณคาร์บอน และติดตามผลจากโรงเรียนสู่บ้าน</p>
          </div>
          ${greenBuddy('จุดเด่นคือให้นักเรียนเป็นเจ้าของกระบวนการเรียนรู้และเป็นผู้นำการเปลี่ยนแปลงจากโรงเรียนสู่บ้าน 🌱', true)}
        </div>
        <div class="panel">
          <h3>Timeline บทบาทของนักเรียน</h3>
          <div class="timeline">${studentRoleSteps.map((step) => `<div class="timeline-card">${step}</div>`).join('')}</div>
        </div>
        <div class="panel" style="margin-top:16px">
          <h3>หลักฐานการมีส่วนร่วม</h3>
          <div class="evidence-grid">${evidence.map((item) => `<div class="evidence-placeholder">📸 ${item}<br><small>พื้นที่สำหรับเพิ่มภาพจริง</small></div>`).join('')}</div>
        </div>
        <div class="notice" style="margin-top:16px">จุดเด่นของระบบนี้ไม่ใช่เพียงการใช้เทคโนโลยี แต่เป็นการให้นักเรียนเป็นเจ้าของกระบวนการเรียนรู้และเป็นผู้นำการเปลี่ยนแปลงด้านสิ่งแวดล้อมจากโรงเรียนสู่บ้านอย่างแท้จริง</div>`;
    }

