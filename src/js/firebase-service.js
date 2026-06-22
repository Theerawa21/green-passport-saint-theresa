// --- Generated Module: firebase-service.js ---

// --- currentChatSubscription ---
let currentChatSubscription = null;

// --- firebaseEmailLookup ---
async function firebaseEmailLookup(login) {
      if (!login) throw new Error('กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ');
      const cleanLogin = String(login).trim().toLowerCase();
      if (cleanLogin.includes('@')) {
        return cleanLogin;
      }
      if (!firebaseFs) {
        throw new Error('ระบบเชื่อมต่อฐานข้อมูลยังไม่พร้อมใช้งาน');
      }
      const usernameDoc = await firebaseFs.collection('usernames').doc(cleanLogin).get();
      if (usernameDoc.exists) {
        return usernameDoc.data().email;
      }
      const studentDoc = await firebaseFs.collection('studentIDs').doc(cleanLogin).get();
      if (studentDoc.exists) {
        return studentDoc.data().email;
      }
      throw new Error('ไม่พบข้อมูลบัญชีผู้ใช้นี้ในระบบ');
    }

// --- deriveEmail ---
function deriveEmail(usernameOrStudentId, emailInput) {
      const cleanInput = String(emailInput || '').trim().toLowerCase();
      if (cleanInput && cleanInput.includes('@')) {
        return cleanInput;
      }
      const cleanId = String(usernameOrStudentId || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      return `${cleanId}@greenpassport.local`;
    }

// --- fetchUserProfilesFromFirestore ---
async function fetchUserProfilesFromFirestore() {
      if (!firebaseFs || !firebaseAuth || !firebaseAuth.currentUser) {
        console.log("Postponing Firestore profiles fetch: Firebase Auth not ready");
        return;
      }
      try {
        const snapshot = await firebaseFs.collection('userProfiles').get();
        const profiles = [];
        snapshot.forEach((doc) => {
          profiles.push(Object.assign({ UserID: doc.id }, doc.data()));
        });
        state.data.userProfiles = profiles.map(normalizeRow);
        renderAll();
      } catch (e) {
        console.error("Error fetching user profiles from Firestore:", e);
      }
    }

// --- subscribeToFirebaseChat ---
function subscribeToFirebaseChat(roomId) {
      if (currentChatSubscription) {
        currentChatSubscription.off();
      }
      if (!firebaseDb || !firebaseAuth || !firebaseAuth.currentUser) {
        console.log("Postponing Realtime DB chat subscribe: Firebase Auth not ready");
        return;
      }
      currentChatSubscription = firebaseDb.ref(`chatMessages/${roomId}`).orderByChild('Timestamp');
      currentChatSubscription.on('value', (snapshot) => {
        const val = snapshot.val();
        const list = [];
        if (val) {
          Object.keys(val).forEach(key => {
            list.push(val[key]);
          });
        }
        // sort by Timestamp
        list.sort((a, b) => String(a.Timestamp || '').localeCompare(String(b.Timestamp || '')));
        
        // Update local state.data.chatMessages with these messages
        state.data.chatMessages = state.data.chatMessages.filter(m => m.ChatRoomID !== roomId);
        state.data.chatMessages.push(...list.map(normalizeRow));
        
        // Render chat if current page is chat
        if (state.active === 'chat') {
          renderChat();
        }
      });
    }

// --- authStateChangedSyncBlock ---
if (firebaseAuth) {
      firebaseAuth.onAuthStateChanged(async (user) => {
        if (user) {
          console.log("Firebase Auth synced: User authenticated");
          try {
            if (firebaseFs) {
              const profileDoc = await firebaseFs.collection('userProfiles').doc(user.uid).get();
              if (profileDoc.exists) {
                const profile = profileDoc.data();
                state.currentUser = Object.assign({}, state.currentUser, {
                  UserID: user.uid,
                  Username: profile.Username || (state.currentUser && state.currentUser.Username) || '',
                  Email: user.email,
                  Role: profile.Role || (state.currentUser && state.currentUser.Role) || 'student',
                  FirstName: profile.FirstName || (state.currentUser && state.currentUser.FirstName) || '',
                  LastName: profile.LastName || (state.currentUser && state.currentUser.LastName) || '',
                  DisplayName: profile.DisplayName || (state.currentUser && state.currentUser.DisplayName) || '',
                  ClassName: profile.ClassName || (state.currentUser && state.currentUser.ClassName) || '',
                  StudentID: profile.StudentID || (state.currentUser && state.currentUser.StudentID) || '',
                  HouseholdName: profile.HouseholdStatus || (state.currentUser && state.currentUser.HouseholdName) || ''
                });
                applyCurrentUserToState();
              }
            }
          } catch (e) {
            console.error("Error restoring user profile from Firestore:", e);
          }
          await fetchUserProfilesFromFirestore();
          if (state.active === 'chat' && firebaseDb) {
            subscribeToFirebaseChat(state.chatRoom || 'CR-MISSION-01');
          }
        } else {
          console.log("Firebase Auth synced: No active session");
        }
      });
    }

