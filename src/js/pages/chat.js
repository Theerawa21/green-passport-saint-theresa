    function ensureChatRoom() {
      const rooms = (state.data.chatRooms || defaultChatRooms()).filter((room) => String(room.IsActive) !== 'false');
      if (!rooms.some((room) => room.ChatRoomID === state.chatRoom)) {
        const activeRoom = rooms.find((room) => latestRoomMessage(room.ChatRoomID)) || rooms.find((room) => room.ChatRoomID === 'CR-MISSION-01') || rooms[0];
        state.chatRoom = activeRoom?.ChatRoomID || 'CR-MISSION-01';
      }
      return rooms;
    }

    function chatRoomTone(room) {
      const text = `${room.ChatRoomID || ''} ${room.ChatRoomType || ''} ${room.ChatRoomName || ''}`;
      if (text.includes('TEACHER') || text.includes('ครู')) return 'teacher';
      if (text.includes('MISSION') || text.includes('กิจกรรม') || text.includes('Challenge')) return 'mission';
      return '';
    }

    function latestRoomMessage(roomId) {
      return (state.data.chatMessages || [])
        .filter((message) => message.ChatRoomID === roomId && !statusIsHidden(message.ModerationStatus))
        .sort((a, b) => String(b.Timestamp || '').localeCompare(String(a.Timestamp || '')))[0] || null;
    }

    function chatRoomMembers(roomId) {
      const members = {};
      (state.data.chatMessages || []).filter((message) => message.ChatRoomID === roomId).forEach((message) => {
        const key = message.UserID || message.DisplayName;
        if (!key) return;
        members[key] = { DisplayName: message.DisplayName, ClassName: message.ClassName, UserID: message.UserID };
      });
      return Object.values(members);
    }

    function chatRoomRowHtml(room, activeRoom) {
      const latest = latestRoomMessage(room.ChatRoomID);
      const count = (state.data.chatMessages || []).filter((message) => message.ChatRoomID === room.ChatRoomID && !statusIsHidden(message.ModerationStatus)).length;
      const tone = chatRoomTone(room);
      const preview = latest ? `${safeDisplayName(latest.DisplayName)}: ${latest.MessageText || (latest.ImageLink ? 'ส่งรูปภาพ' : 'ข้อความใหม่')}` : room.Description || 'ยังไม่มีข้อความ';
      return `
        <button class="chat-room-row ${room.ChatRoomID === activeRoom.ChatRoomID ? 'active' : ''}" type="button" onclick="setChatRoom('${escapeAttr(room.ChatRoomID)}')">
          <span class="room-avatar ${tone}">${escapeHtml(avatarText(room.ChatRoomName || 'GC'))}</span>
          <span style="min-width:0">
            <span class="room-title">${escapeHtml(room.ChatRoomName)}</span>
            <span class="room-preview">${escapeHtml(preview)}</span>
            <span class="room-meta">${escapeHtml(room.ChatRoomType || '')} · ${chatRoomMembers(room.ChatRoomID).length || 1} สมาชิก</span>
          </span>
          <span style="text-align:right">
            <span class="room-time">${latest ? escapeHtml(chatTimeLabel(latest.Timestamp)) : ''}</span>
            ${count ? `<span class="room-unread">${count > 99 ? '99+' : count}</span>` : ''}
          </span>
        </button>`;
    }

    function parseChatDate(value) {
      const text = String(value || '').trim();
      if (!text) return null;
      const direct = new Date(text.replace(' ', 'T'));
      if (!Number.isNaN(direct.getTime())) return direct;
      const match = text.match(/(\d{4})-(\d{2})-(\d{2}).*?(\d{1,2}):(\d{2})/);
      if (match) return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), Number(match[4]), Number(match[5]));
      return null;
    }

    function chatDayKey(value) {
      const date = parseChatDate(value);
      if (!date) return String(value || '').slice(0, 10) || 'today';
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    function chatDateLabel(value) {
      const date = parseChatDate(value);
      if (!date) return String(value || 'วันนี้').slice(0, 16);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      const key = chatDayKey(value);
      const todayKey = chatDayKey(today.toISOString());
      const yesterdayKey = chatDayKey(yesterday.toISOString());
      if (key === todayKey) return 'วันนี้';
      if (key === yesterdayKey) return 'เมื่อวาน';
      return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    function chatTimeLabel(value) {
      const date = parseChatDate(value);
      if (date) return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
      const match = String(value || '').match(/\d{1,2}:\d{2}/);
      return match ? match[0] : '';
    }

    function isTeacherMessage(message) {
      const text = `${message.UserID || ''} ${message.ClassName || ''} ${message.DisplayName || ''} ${message.MessageType || ''}`;
      return text.includes('TEACHER') || text.includes('Admin') || text.includes('ครู') || text.includes('announcement');
    }

    function isSystemMessage(message) {
      return String(message.MessageType || '').toLowerCase() === 'system';
    }

    function isOwnMessage(message) {
      const identity = currentUserIdentity();
      return !!((identity.UserID && message.UserID === identity.UserID) || (identity.DisplayName && message.DisplayName === identity.DisplayName));
    }

    function chatMessageStreamHtml(messages) {
      let lastDay = '';
      let lastSender = '';
      return messages.map((message) => {
        const day = chatDayKey(message.Timestamp);
        const sender = message.UserID || message.DisplayName || '';
        const divider = day !== lastDay ? `<div class="chat-date-divider"><span>${escapeHtml(chatDateLabel(message.Timestamp))}</span></div>` : '';
        const compact = day === lastDay && sender === lastSender && !isSystemMessage(message);
        lastDay = day;
        lastSender = sender;
        return divider + chatMessageHtml(message, { compact });
      }).join('');
    }

    function chatMessageHtml(message, options = {}) {
      if (isSystemMessage(message)) return `<div class="chat-system">${escapeHtml(message.MessageText)}</div>`;
      const id = String(message.MessageID || '');
      const arg = escapeAttr(jsString(id));
      const reported = String(message.ReportStatus || '').trim();
      const own = isOwnMessage(message);
      const teacher = isTeacherMessage(message);
      const reactions = state.chatReactions?.[id] || {};
      const reply = message.ReplyToMessageID ? (state.data.chatMessages || []).find((item) => item.MessageID === message.ReplyToMessageID) : null;
      const image = String(message.ImageLink || '').trim();
      const classes = ['chat-message', own ? 'own' : '', teacher ? 'teacher' : '', options.compact ? 'compact' : '', message.MessageType === 'sticker' ? 'sticker' : ''].filter(Boolean).join(' ');
      return `
        <div class="${classes}">
          <button class="chat-avatar ${teacher ? 'teacher' : chatRoomTone({ ChatRoomID: message.ChatRoomID })}" type="button" onclick="showChatProfile(${escapeAttr(jsString(message.UserID || message.DisplayName))})">${escapeHtml(avatarText(message.DisplayName))}</button>
          <div class="chat-stack">
            <div class="chat-sender">
              <button class="chat-action" type="button" onclick="showChatProfile(${escapeAttr(jsString(message.UserID || message.DisplayName))})">${escapeHtml(safeDisplayName(message.DisplayName))}</button>
              ${teacher ? '<span class="teacher-badge">ครูผู้ดูแล</span>' : `<span>${escapeHtml(message.ClassName || '')}</span>`}
            </div>
            <div class="chat-bubble ${reported ? 'reported' : ''}">
              ${truthy(message.IsPinned) ? '<span class="badge earned">ปักหมุด</span>' : ''}
              ${reported ? '<span class="status bad">ถูกรายงาน</span>' : ''}
              ${reply ? `<div class="chat-quote">${escapeHtml(safeDisplayName(reply.DisplayName))}: ${escapeHtml(String(reply.MessageText || 'รูปภาพ').slice(0, 80))}</div>` : ''}
              ${message.MessageText ? `<div>${escapeHtml(message.MessageText)}</div>` : ''}
              ${image ? `<img class="chat-image" src="${escapeAttr(image)}" alt="รูปภาพที่แชร์ใน Green Chat" onclick="openChatImage('${escapeAttr(image)}')" onerror="this.style.display='none'">` : ''}
            </div>
            <div class="chat-time">${escapeHtml(chatTimeLabel(message.Timestamp))} ${own ? 'อ่านแล้ว' : ''}</div>
            <div class="chat-reactions">
              ${Object.entries(reactions).map(([emoji, count]) => `<button class="chat-reaction" type="button" onclick="reactToMessage(${arg}, '${escapeAttr(emoji)}')">${emoji} ${count}</button>`).join('')}
            </div>
            <div class="chat-actions">
              ${['💚','👍','⭐','🍃'].map((emoji) => `<button class="chat-action" type="button" onclick="reactToMessage(${arg}, '${emoji}')">${emoji}</button>`).join('')}
              <button class="chat-action" type="button" onclick="replyToChatMessage(${arg})">ตอบกลับ</button>
              <button class="chat-action" type="button" onclick="reportChatMessage(${arg})">รายงาน</button>
            </div>
          </div>
        </div>`;
    }

    function renderChat() {
      const rooms = ensureChatRoom();
      const room = rooms.find((item) => item.ChatRoomID === state.chatRoom) || rooms[0] || {};
      const messages = (state.data.chatMessages || [])
        .filter((message) => message.ChatRoomID === room.ChatRoomID && !statusIsHidden(message.ModerationStatus))
        .sort((a, b) => String(a.Timestamp || '').localeCompare(String(b.Timestamp || '')));
      const members = chatRoomMembers(room.ChatRoomID);
      const mediaCount = messages.filter((message) => String(message.ImageLink || '').trim()).length;
      const identity = state.chatIdentity || {};
      const reply = state.replyToMessageID ? messages.find((message) => message.MessageID === state.replyToMessageID) : null;
      document.getElementById('chat').innerHTML = `
        <div class="chat-layout">
          <aside class="chat-sidebar">
            <div class="chat-sidebar-head">
              <h3>Green Chat</h3>
              <p>เลือกห้องสนทนา แชทอย่างสุภาพ และไม่เปิดเผยข้อมูลส่วนตัว</p>
            </div>
            <div class="chat-room-list">
              ${rooms.map((item) => chatRoomRowHtml(item, room)).join('')}
            </div>
            <div class="chat-room-safe">พื้นที่สนทนาสำหรับโรงเรียน ครูสามารถตรวจข้อความ รายงาน และซ่อนได้เมื่อจำเป็น</div>
          </aside>
          <section class="chat-shell">
            <header class="chat-header">
              <div class="chat-header-main">
                <button class="chat-icon-btn" type="button" onclick="showPage('friends')" title="กลับไปดูเพื่อน">‹</button>
                <div class="room-avatar ${chatRoomTone(room)}">${escapeHtml(avatarText(room.ChatRoomName || 'GC'))}</div>
                <div style="min-width:0">
                  <span class="chat-line-title">${escapeHtml(room.ChatRoomName || 'Green Chat')}</span>
                  <span class="chat-line-sub">${escapeHtml(room.ChatRoomType || 'ห้องสนทนา')} · ${members.length || 1} สมาชิก · ผู้ดูแล ${escapeHtml(room.TeacherModerator || 'ครูผู้ดูแล')}</span>
                </div>
              </div>
              <div class="chat-toolbar">
                <button class="chat-icon-btn" type="button" onclick="showChatMembers()" title="ดูสมาชิก">👥</button>
                <button class="chat-icon-btn" type="button" onclick="showChatMedia()" title="ดูรูปภาพ">🖼</button>
                <button class="chat-icon-btn" type="button" onclick="showChatRules()" title="กติกา">ⓘ</button>
              </div>
            </header>
            <div class="chat-window" id="chatWindow">
              ${truthy(messages.find((message) => truthy(message.IsPinned))?.IsPinned) ? `<div class="chat-system">มีข้อความปักหมุดในห้องนี้ กรุณาอ่านประกาศจากครูผู้ดูแล</div>` : ''}
              ${messages.length ? chatMessageStreamHtml(messages) : '<div class="chat-system">ยังไม่มีข้อความในห้องนี้ เริ่มทักทายด้วยเรื่องลดขยะได้เลย</div>'}
            </div>
            <form class="chat-composer" id="chatForm" onsubmit="sendChatMessage(event)">
              <div class="chat-identity-row">
                <input name="DisplayName" required maxlength="40" placeholder="ชื่อเล่น" value="${escapeAttr(identity.DisplayName || '')}" readonly>
                <input name="ClassName" maxlength="20" placeholder="ชั้น/ห้อง" value="${escapeAttr(identity.ClassName || '')}" readonly>
                <input name="UserID" maxlength="30" placeholder="รหัสย่อ เช่น ST***01" value="${escapeAttr(identity.UserID || '')}" readonly>
              </div>
              <div class="chat-reply-bar" id="chatReplyBar" ${reply ? '' : 'hidden'}>
                <span>ตอบกลับ ${reply ? escapeHtml(safeDisplayName(reply.DisplayName)) : ''}: ${reply ? escapeHtml(String(reply.MessageText || 'รูปภาพ').slice(0, 90)) : ''}</span>
                <button class="chat-action" type="button" onclick="clearChatReply()">ยกเลิก</button>
              </div>
              <div class="chat-emoji-tray" id="chatEmojiTray" hidden>
                ${['🌱','♻️','💚','🍃','🌍','🏡','🗑️','📷','⭐','🏆'].map((emoji) => `<button class="chat-reaction" type="button" onclick="insertChatEmoji('${emoji}')">${emoji}</button>`).join('')}
              </div>
              <div class="chat-sticker-tray" id="chatStickerTray" hidden>
                ${['เก่งมาก 💚','สู้ ๆ 🌱','ไอเดียดีมาก 🍃','สุดยอด ⭐','ช่วยโลกได้อีกก้าว 🌍'].map((text) => `<button class="chat-sticker" type="button" onclick="sendSticker(${escapeAttr(jsString(text))})">${escapeHtml(text)}</button>`).join('')}
              </div>
              <input id="chatImageFile" type="file" accept="image/*" hidden onchange="showChatImageName()">
              <div class="chat-compose-row">
                <button class="chat-icon-btn" type="button" onclick="toggleChatTray('chatEmojiTray')" title="อิโมจิ">☺</button>
                <button class="chat-icon-btn" type="button" onclick="document.getElementById('chatImageFile').click()" title="แนบรูป">📎</button>
                <textarea id="chatMessageInput" name="MessageText" rows="1" maxlength="500" placeholder="พิมพ์ข้อความถึงเพื่อน ๆ..." onkeydown="chatTextareaKey(event)"></textarea>
                <button class="chat-send-btn" type="submit" title="ส่งข้อความ">➤</button>
              </div>
              <div class="btn-row" style="justify-content:space-between">
                <span class="room-meta" id="chatImageName">กด Enter เพื่อส่งข้อความ หรือ Shift+Enter เพื่อขึ้นบรรทัดใหม่</span>
                <span>
                  <button class="chat-action" type="button" onclick="toggleChatTray('chatStickerTray')">สติกเกอร์</button>
                  <button class="chat-action" type="button" onclick="askTeacherShortcut()">ถามครู</button>
                  <button class="chat-action" type="button" onclick="toggleChatNotifications()">แจ้งเตือน: เปิด</button>
                </span>
              </div>
            </form>
          </section>
        </div>`;
      requestAnimationFrame(() => {
        const windowEl = document.getElementById('chatWindow');
        if (windowEl) windowEl.scrollTop = windowEl.scrollHeight;
      });
    }

    function setChatRoom(roomId) {
      state.chatRoom = roomId;
      state.replyToMessageID = '';
      if (firebaseDb) {
        subscribeToFirebaseChat(roomId);
      }
      renderChat();
    }

    function toggleChatTray(id) {
      const el = document.getElementById(id);
      if (el) el.hidden = !el.hidden;
    }

    function insertChatEmoji(emoji) {
      const input = document.getElementById('chatMessageInput');
      if (!input) return;
      input.value = `${input.value || ''}${emoji}`;
      input.focus();
    }

    function chatTextareaKey(event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        document.getElementById('chatForm')?.requestSubmit();
      }
    }

    function showChatImageName() {
      const file = document.getElementById('chatImageFile')?.files?.[0];
      const label = document.getElementById('chatImageName');
      if (label) label.textContent = file ? `แนบรูป: ${file.name}` : 'กด Enter เพื่อส่งข้อความ หรือ Shift+Enter เพื่อขึ้นบรรทัดใหม่';
    }

    function replyToChatMessage(messageId) {
      state.replyToMessageID = messageId;
      renderChat();
      document.getElementById('chatMessageInput')?.focus();
    }

    function clearChatReply() {
      state.replyToMessageID = '';
      renderChat();
    }

    function reactToMessage(messageId, emoji) {
      state.chatReactions ||= {};
      state.chatReactions[messageId] ||= {};
      state.chatReactions[messageId][emoji] = Number(state.chatReactions[messageId][emoji] || 0) + 1;
      localStorage.setItem('greenPassportChatReactions', JSON.stringify(state.chatReactions));
      renderChat();
    }

    function openChatImage(src) {
      window.open(src, '_blank', 'noopener');
    }

    function showChatMembers() {
      const members = chatRoomMembers(state.chatRoom);
      alert(members.length ? members.map((member) => `${safeDisplayName(member.DisplayName)} ${member.ClassName || ''}`).join('\n') : 'ยังไม่มีรายชื่อสมาชิกในห้องนี้');
    }

    function showChatMedia() {
      const images = (state.data.chatMessages || []).filter((message) => message.ChatRoomID === state.chatRoom && message.ImageLink);
      alert(images.length ? images.map((message) => `${safeDisplayName(message.DisplayName)} - ${chatTimeLabel(message.Timestamp)}`).join('\n') : 'ยังไม่มีรูปภาพที่แชร์ในห้องนี้');
    }

    function showChatRules() {
      alert('กติกา Green Chat\n1. ใช้ถ้อยคำสุภาพ\n2. ไม่เปิดเผยเบอร์โทร ที่อยู่ หรือบัญชีส่วนตัว\n3. คุยเรื่องการลดขยะและภารกิจสีเขียว\n4. รายงานข้อความที่ไม่เหมาะสมให้ครูตรวจ');
    }

    function showChatProfile(profileId) {
      const profile = allProfiles().find((item) => item.UserID === profileId || item.DisplayName === profileId);
      if (!profile) {
        alert('ยังไม่มีข้อมูลโปรไฟล์ของผู้ใช้นี้');
        return;
      }
      alert(`${safeDisplayName(profile.DisplayName)}\n${profile.ClassName || ''}\n${profile.CurrentLevel || ''}\nEXP ${profile.CurrentEXP || 0}\nBadge ${profile.TotalBadges || 0}`);
    }

    function askTeacherShortcut() {
      state.chatRoom = 'CR-TEACHER-01';
      renderChat();
      const input = document.getElementById('chatMessageInput');
      if (input) {
        input.value = 'ครูครับ/ค่ะ ขอสอบถามเรื่อง ';
        input.focus();
      }
    }

    function toggleChatNotifications() {
      const key = 'greenPassportChatNotifications';
      const next = localStorage.getItem(key) === 'off' ? 'on' : 'off';
      localStorage.setItem(key, next);
      alert(`ตั้งค่าการแจ้งเตือน Green Chat: ${next === 'on' ? 'เปิด' : 'ปิด'}`);
    }

    function moderateMessageText(text) {
      const value = String(text || '').trim();
      if (/(https?:\/\/|www\.)/i.test(value)) return { ok: false, message: 'ยังไม่อนุญาตให้ส่งลิงก์ใน Green Chat' };
      if (/\d{8,}/.test(value.replace(/[\s-]/g, ''))) return { ok: false, message: 'ไม่ควรส่งเบอร์โทรหรือข้อมูลติดต่อส่วนตัวใน Green Chat' };
      if (/(ที่อยู่|เบอร์|ไลน์|line id|facebook|ig|instagram)/i.test(value)) return { ok: false, message: 'กรุณาไม่เปิดเผยข้อมูลส่วนตัวหรือช่องทางติดต่อ' };
      if (/(โง่|เกลียด|ด่า|หยาบ|บูลลี่)/i.test(value)) return { ok: false, message: 'กรุณาใช้ถ้อยคำสุภาพและให้กำลังใจกัน' };
      return { ok: true };
    }

    async function sendChatMessage(event) {
      event.preventDefault();
      const form = event.currentTarget;
      const data = Object.fromEntries(new FormData(form).entries());
      const fileInput = document.getElementById('chatImageFile');
      const imagePayload = fileInput?.files?.length ? (await filesToPayload(fileInput.files))[0] : null;
      const text = String(data.MessageText || '').trim();
      if (!text && !imagePayload) {
        alert('กรุณาพิมพ์ข้อความหรือแนบรูปภาพก่อนส่ง');
        return;
      }
      const check = moderateMessageText(text);
      if (!check.ok) {
        alert(check.message);
        return;
      }
      state.chatIdentity = {
        DisplayName: data.DisplayName || '',
        ClassName: data.ClassName || '',
        UserID: data.UserID || data.DisplayName || '',
      };
      localStorage.setItem('greenPassportChatIdentity', JSON.stringify(state.chatIdentity));
      const message = {
        MessageID: `MSG-${Date.now()}`,
        ChatRoomID: state.chatRoom,
        Timestamp: nowStamp(),
        UserID: data.UserID || data.DisplayName || 'guest',
        DisplayName: data.DisplayName,
        ClassName: data.ClassName,
        MessageText: text,
        ImageLink: imagePayload?.data || '',
        MessageType: imagePayload ? 'image' : 'text',
        ReplyToMessageID: state.replyToMessageID || '',
        IsPinned: false,
        ReportStatus: '',
        ModerationStatus: 'ปกติ',
      };
      if (firebaseDb) {
        try {
          await firebaseDb.ref(`chatMessages/${state.chatRoom}/${message.MessageID}`).set(message);
        } catch (error) {
          console.error("Firebase send message error:", error);
          alert("ส่งข้อความเข้า Firebase ไม่สำเร็จ: " + error.message);
        }
      } else {
        try {
          const result = await sheetApi('appendChatMessage', { message });
          state.data.chatMessages.push(normalizeRow(result.message || message));
        } catch (error) {
          state.data.chatMessages.push(normalizeRow(message));
          queuePendingWrite('appendChatMessage', { message });
          alert('บันทึกข้อความไว้ในเครื่องแล้ว และจะส่งเข้า Google Sheets เมื่อเชื่อมต่อได้');
        }
      }
      saveToLocalStorage();
      state.replyToMessageID = '';
      form.reset();
      renderChat();
    }

    async function sendSticker(text) {
      const identity = state.chatIdentity || {};
      if (!identity.DisplayName) {
        alert('กรุณากรอกชื่อที่แสดงก่อนส่งสติกเกอร์');
        return;
      }
      const message = {
        MessageID: `MSG-${Date.now()}`,
        ChatRoomID: state.chatRoom,
        Timestamp: nowStamp(),
        UserID: identity.UserID || identity.DisplayName || 'guest',
        DisplayName: identity.DisplayName,
        ClassName: identity.ClassName || '',
        MessageText: text,
        ImageLink: '',
        MessageType: 'sticker',
        ReplyToMessageID: state.replyToMessageID || '',
        IsPinned: false,
        ReportStatus: '',
        ModerationStatus: 'ปกติ',
      };
      if (firebaseDb) {
        try {
          await firebaseDb.ref(`chatMessages/${state.chatRoom}/${message.MessageID}`).set(message);
        } catch (error) {
          console.error("Firebase send sticker error:", error);
        }
      } else {
        try {
          const result = await sheetApi('appendChatMessage', { message });
          state.data.chatMessages.push(normalizeRow(result.message || message));
        } catch (error) {
          state.data.chatMessages.push(normalizeRow(message));
          queuePendingWrite('appendChatMessage', { message });
        }
      }
      state.replyToMessageID = '';
      saveToLocalStorage();
      renderChat();
    }

    async function reportChatMessage(messageId) {
      if (!await customConfirm('รายงานข้อความนี้ให้ครูตรวจสอบหรือไม่')) return;
      const message = (state.data.chatMessages || []).find((item) => item.MessageID === messageId);
      if (message) {
        message.ReportStatus = 'ถูกรายงาน';
        message.ModerationStatus = 'รอครูตรวจสอบ';
      }
      if (firebaseDb) {
        try {
          await firebaseDb.ref(`chatMessages/${state.chatRoom}/${messageId}`).update({
            ReportStatus: 'ถูกรายงาน',
            ModerationStatus: 'รอครูตรวจสอบ'
          });
        } catch (error) {
          console.error("Firebase report message error:", error);
        }
      } else {
        try {
          await sheetApi('reportChatMessage', { messageId });
        } catch (error) {
          queuePendingWrite('reportChatMessage', { messageId });
        }
      }
      saveToLocalStorage();
      renderChat();
    }
