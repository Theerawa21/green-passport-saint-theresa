// --- Generated Module: community.js ---

// --- communityCategories ---
function communityCategories() {
      return [
        'ตั้งมุมแยกขยะที่บ้าน',
        'ทำปุ๋ยหมักจากเศษอาหาร',
        'ลดพลาสติกใช้ครั้งเดียว',
        'ซ่อม ใช้ซ้ำ ส่งต่อ',
        'ธนาคารขยะและรีไซเคิล',
        'คำถามหรือไอเดีย Zero Waste',
      ];
    }

// --- communityRulesAccepted ---
function communityRulesAccepted() {
      return localStorage.getItem('greenPassportCommunityRules') === 'accepted';
    }

// --- acceptCommunityRules ---
function acceptCommunityRules() {
      localStorage.setItem('greenPassportCommunityRules', 'accepted');
      renderAll();
    }

// --- renderCommunityRules ---
function renderCommunityRules() {
      const accepted = communityRulesAccepted();
      return `
        <div class="rules-box">
          <strong>กติกาชุมชน Green Passport</strong>
          <p>ใช้ชื่อเล่นหรือชื่อที่ไม่เปิดเผยข้อมูลส่วนตัว, แชร์เฉพาะประสบการณ์ลดขยะที่สร้างสรรค์, ไม่ส่งเบอร์โทร ที่อยู่ ลิงก์ส่วนตัว หรือข้อความที่ทำให้ผู้อื่นเสียหาย และทุกโพสต์ต้องรอครูตรวจสอบก่อนเผยแพร่</p>
          <div class="btn-row" style="margin-top:10px">
            <span class="status ${accepted ? 'ok' : ''}">${accepted ? 'ยอมรับกติกาแล้ว' : 'ยังไม่ได้ยอมรับกติกา'}</span>
            ${accepted ? '' : `<button class="btn ghost" type="button" onclick="acceptCommunityRules()">ยอมรับกติกา</button>`}
          </div>
        </div>`;
    }

// --- publishedPosts ---
function publishedPosts() {
      return (state.data.communityPosts || [])
        .filter((post) => statusIsPublished(post.ReviewStatus) && !statusIsHidden(post.ReviewStatus))
        .sort((a, b) => String(b.Timestamp || '').localeCompare(String(a.Timestamp || '')));
    }

// --- renderCommunity ---
function renderCommunity() {
      const posts = publishedPosts();
      const pending = (state.data.communityPosts || []).filter((post) => String(post.ReviewStatus || '').includes('รอตรวจ')).length;
      const identity = currentUserIdentity();
      document.getElementById('community').innerHTML = `
        <div class="grid two">
          <div class="panel">
            <h3>ชุมชน Green Passport</h3>
            <p>พื้นที่แบ่งปันประสบการณ์ลดขยะในบ้าน ให้กำลังใจเพื่อน และเก็บตัวอย่างวิธีทำจริงจากนักเรียน โดยครูตรวจสอบก่อนเผยแพร่เสมอ</p>
            ${renderCommunityRules()}
            <form id="communityPostForm" style="margin-top:16px">
              <div class="field-grid">
                <label>ชื่อที่แสดงในชุมชน<input name="DisplayName" required maxlength="40" value="${escapeAttr(identity.DisplayName)}" readonly></label>
                <label>ชั้น/ห้อง<input name="ClassName" maxlength="20" value="${escapeAttr(identity.ClassName)}" readonly></label>
                <label>รหัสหรือชื่อย่อผู้ใช้<input name="UserID" maxlength="30" value="${escapeAttr(identity.UserID)}" readonly></label>
                <label>หมวดหมู่<select name="Category">${communityCategories().map((item) => `<option>${item}</option>`).join('')}</select></label>
              </div>
              <label style="margin-top:12px">หัวข้อโพสต์<input name="PostTitle" required maxlength="90" placeholder="เล่าว่าบ้านหรือห้องเรียนทำอะไร"></label>
              <label style="margin-top:12px">เรื่องเล่า<textarea name="PostContent" required rows="4" maxlength="1200" placeholder="เล่าปัญหา วิธีทำ และผลที่เกิดขึ้น"></textarea></label>
              <div class="field-grid" style="margin-top:12px">
                <label>วิธีที่ใช้<textarea name="MethodUsed" rows="3" maxlength="600"></textarea></label>
                <label>ผลลัพธ์<textarea name="Result" rows="3" maxlength="600"></textarea></label>
                <label>ปัญหาที่พบ<textarea name="Problem" rows="3" maxlength="600"></textarea></label>
                <label>วิธีแก้/คำแนะนำ<textarea name="Solution" rows="3" maxlength="600"></textarea></label>
              </div>
              <label style="margin-top:12px">ฝากถึงเพื่อน<textarea name="AdviceToFriends" rows="2" maxlength="400"></textarea></label>
              <div class="field-grid" style="margin-top:12px">
                <label>ลิงก์รูปภาพหรือหลักฐาน<input name="ImageLinks" type="url" placeholder="https://..."></label>
                <label>แท็ก<input name="Tags" placeholder="เช่น แยกขยะ, ปุ๋ยหมัก"></label>
              </div>
              <label style="margin-top:12px"><span><input name="CommunityRulesConsent" type="checkbox" required style="width:auto;min-height:auto"> ยอมรับกติกาชุมชนและยืนยันว่าไม่เปิดเผยข้อมูลส่วนตัว</span></label>
              <div class="btn-row" style="margin-top:14px">
                <button class="btn" type="submit">ส่งโพสต์ให้ครูตรวจ</button>
                <button class="btn ghost" type="reset">ล้างข้อมูล</button>
              </div>
            </form>
          </div>
          <div class="panel">
            <h3>ภาพรวมชุมชน</h3>
            <div class="grid two">
              ${kpi('โพสต์เผยแพร่', posts.length, 'โพสต์')}
              ${kpi('รอครูตรวจ', pending, 'โพสต์')}
              ${kpi('หัวใจสีเขียว', sum(posts, 'Likes'), 'ครั้ง')}
              ${kpi('ความคิดเห็น', (state.data.postComments || []).length, 'รายการ')}
            </div>
            <div class="notice" style="margin-top:14px">นักเรียนได้รับ EXP จากการแชร์ประสบการณ์ที่ผ่านการตรวจ การให้กำลังใจ และการมีส่วนร่วมที่สร้างสรรค์</div>
          </div>
        </div>
        <div class="panel" style="margin-top:16px">
          <h3>ประสบการณ์จากเพื่อน</h3>
          ${posts.length ? posts.map(postCardHtml).join('') : '<div class="notice">ยังไม่มีโพสต์ที่เผยแพร่แล้ว โพสต์ใหม่จะปรากฏหลังครูตรวจสอบ</div>'}
        </div>`;
      document.getElementById('communityPostForm')?.addEventListener('submit', submitCommunityPost);
    }

// --- postCardHtml ---
function postCardHtml(post) {
      const id = String(post.PostID || '');
      const safe = domId(id);
      const identity = currentUserIdentity();
      const comments = (state.data.postComments || []).filter((comment) => comment.PostID === id && statusIsPublished(comment.ReviewStatus) && !statusIsHidden(comment.ReviewStatus));
      const profile = allProfiles().find((item) => item.UserID === post.UserID || item.DisplayName === post.DisplayName) || {};
      const image = String(post.ImageLinks || '').split(',').map((x) => x.trim()).find(Boolean);
      const arg = escapeAttr(jsString(id));
      return `
        <article class="post-card">
          <div class="btn-row" style="justify-content:space-between;align-items:flex-start">
            <div class="btn-row">
              <div class="avatar">${escapeHtml(avatarText(post.DisplayName))}</div>
              <div>
                <strong>${escapeHtml(post.PostTitle)}</strong>
                <p>${escapeHtml(safeDisplayName(post.DisplayName))} · ${escapeHtml(post.ClassName || '')} · ${escapeHtml(profile.CurrentLevel || '')}</p>
              </div>
            </div>
            <span class="badge earned">${escapeHtml(post.Category || 'Green Story')}</span>
          </div>
          ${image ? `<div class="post-image" style="margin-top:12px"><img src="${escapeAttr(image)}" alt="หลักฐานกิจกรรม" onerror="this.parentElement.style.display='none'"></div>` : ''}
          <p style="margin-top:12px">${escapeHtml(post.PostContent)}</p>
          <div class="grid two" style="margin-top:12px">
            ${post.MethodUsed ? `<div class="notice"><strong>วิธีทำ</strong><br>${escapeHtml(post.MethodUsed)}</div>` : ''}
            ${post.Result ? `<div class="notice"><strong>ผลลัพธ์</strong><br>${escapeHtml(post.Result)}</div>` : ''}
            ${post.Problem ? `<div class="notice"><strong>ปัญหา</strong><br>${escapeHtml(post.Problem)}</div>` : ''}
            ${post.Solution ? `<div class="notice"><strong>แก้ไขอย่างไร</strong><br>${escapeHtml(post.Solution)}</div>` : ''}
          </div>
          ${post.AdviceToFriends ? `<div style="margin-top:12px">${greenBuddy(escapeHtml(post.AdviceToFriends), true)}</div>` : ''}
          <div class="tag-row" style="margin-top:12px">${splitTags(post.Tags).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}</div>
          <div class="btn-row" style="margin-top:12px">
            <button class="btn ghost" type="button" onclick="encouragePost(${arg})">ให้กำลังใจ (${Number(post.Likes || 0)})</button>
            <span class="status">${comments.length} ความคิดเห็น</span>
          </div>
          <div class="comment-list">
            ${comments.map((comment) => `<div class="comment-item"><strong>${escapeHtml(safeDisplayName(comment.DisplayName))}</strong> <small>${escapeHtml(comment.ClassName || '')}</small><br>${escapeHtml(comment.CommentText)}</div>`).join('')}
          </div>
          <div class="field-grid" style="margin-top:12px">
            <label>ชื่อผู้แสดงความคิดเห็น<input id="comment-name-${safe}" maxlength="40" value="${escapeAttr(identity.DisplayName)}" readonly></label>
            <label>ความคิดเห็นสร้างสรรค์<input id="comment-text-${safe}" maxlength="300" placeholder="ให้กำลังใจหรือถามวิธีทำ"></label>
          </div>
          <button class="btn secondary" style="margin-top:10px" type="button" onclick="commentOnPost(${arg})">ส่งความคิดเห็นให้ครูตรวจ</button>
        </article>`;
    }

// --- submitCommunityPost ---
async function submitCommunityPost(event) {
      event.preventDefault();
      const form = event.currentTarget;
      const data = Object.fromEntries(new FormData(form).entries());
      if (!communityRulesAccepted() && !data.CommunityRulesConsent) {
        alert('กรุณายอมรับกติกาชุมชนก่อนส่งโพสต์');
        return;
      }
      if (String(data.PostContent || '').trim().length < 20) {
        alert('กรุณาเล่าประสบการณ์ให้ละเอียดขึ้นเล็กน้อย เพื่อให้เพื่อนนำไปทำตามได้');
        return;
      }
      localStorage.setItem('greenPassportCommunityRules', 'accepted');
      const post = {
        PostID: `CP-${Date.now()}`,
        Timestamp: nowStamp(),
        UserID: data.UserID || data.DisplayName || 'guest',
        DisplayName: data.DisplayName,
        ClassName: data.ClassName,
        Category: data.Category,
        PostTitle: data.PostTitle,
        PostContent: data.PostContent,
        MethodUsed: data.MethodUsed,
        Result: data.Result,
        Problem: data.Problem,
        Solution: data.Solution,
        AdviceToFriends: data.AdviceToFriends,
        ImageLinks: data.ImageLinks,
        Tags: data.Tags,
        Likes: 0,
        CommentCount: 0,
        ReviewStatus: 'รอตรวจสอบ',
        TeacherComment: '',
        ApprovedBy: '',
        ApprovedAt: '',
      };
      try {
        const result = await sheetApi('appendCommunityPost', { post });
        state.data.communityPosts.push(normalizeRow(result.post || post));
        alert('ส่งโพสต์แล้ว รอครูตรวจสอบก่อนเผยแพร่');
      } catch (error) {
        state.data.communityPosts.push(normalizeRow(post));
        queuePendingWrite('appendCommunityPost', { post });
        alert('บันทึกโพสต์ไว้ในเครื่องแล้ว และจะส่งเข้า Google Sheets เมื่อเชื่อมต่อได้: ' + error.message);
      }
      saveToLocalStorage();
      form.reset();
      renderCommunity();
    }

// --- encouragePost ---
async function encouragePost(postId) {
      const post = (state.data.communityPosts || []).find((item) => item.PostID === postId);
      if (post) post.Likes = Number(post.Likes || 0) + 1;
      try {
        const result = await sheetApi('sendCommunityLike', { postId });
        if (result.post && post) Object.assign(post, normalizeRow(result.post));
      } catch (error) {
        queuePendingWrite('sendCommunityLike', { postId });
      }
      saveToLocalStorage();
      renderCommunity();
    }

// --- commentOnPost ---
async function commentOnPost(postId) {
      const safe = domId(postId);
      const identity = currentUserIdentity();
      const name = identity.DisplayName || document.getElementById(`comment-name-${safe}`)?.value.trim();
      const text = document.getElementById(`comment-text-${safe}`)?.value.trim();
      if (!name || !text) {
        alert('กรุณากรอกชื่อและความคิดเห็น');
        return;
      }
      const comment = {
        CommentID: `CM-${Date.now()}`,
        PostID: postId,
        Timestamp: nowStamp(),
        UserID: identity.UserID || name,
        DisplayName: name,
        ClassName: identity.ClassName || '',
        CommentText: text,
        LikeCount: 0,
        ReviewStatus: 'รอตรวจสอบ',
        ReportStatus: '',
      };
      try {
        const result = await sheetApi('appendPostComment', { comment });
        state.data.postComments.push(normalizeRow(result.comment || comment));
        alert('ส่งความคิดเห็นแล้ว รอครูตรวจสอบก่อนเผยแพร่');
      } catch (error) {
        state.data.postComments.push(normalizeRow(comment));
        queuePendingWrite('appendPostComment', { comment });
        alert('บันทึกความคิดเห็นไว้ในเครื่องแล้ว และจะส่งเข้า Google Sheets เมื่อเชื่อมต่อได้');
      }
      saveToLocalStorage();
      renderCommunity();
    }

