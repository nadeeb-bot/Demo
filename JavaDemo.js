/* script.js */

/* ===== ฟังก์ชันย้าย indicator ไปยังปุ่มที่กด ===== */
function setActive(btn) {

        /* ===== ลบ class active จากทุกปุ่ม ===== */
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

        /* ===== เพิ่ม class active ให้ปุ่มที่กด ===== */
        btn.classList.add('active');

        /* ===== เลื่อน indicator ไปยังปุ่มที่กด ===== */
        moveIndicator(btn);
    }

    /* ===== ฟังก์ชันคำนวณและเลื่อนตำแหน่ง indicator ===== */
    function moveIndicator(btn) {
        const indicator = document.getElementById('tabIndicator');
        const tabBar    = document.getElementById('tabBar');

        /* ===== คำนวณตำแหน่งของปุ่มเทียบกับ tab-bar ===== */
        const barRect = tabBar.getBoundingClientRect();
        const btnRect = btn.getBoundingClientRect();

        /* ===== ตั้งค่าตำแหน่งและขนาดของ indicator ===== */
        indicator.style.left  = (btnRect.left - barRect.left) + 'px';
        indicator.style.width = btnRect.width + 'px';
    }

    /* ===== ตั้งค่า indicator ตอนโหลดหน้า (ให้ตรงกับปุ่ม active เริ่มต้น) ===== */
    window.addEventListener('load', () => {
        const activeBtn = document.querySelector('.tab-btn.active');
        if (activeBtn) moveIndicator(activeBtn);
    });

    /* ===== อัปเดต indicator เมื่อขนาดหน้าจอเปลี่ยน ===== */
    window.addEventListener('resize', () => {
        const activeBtn = document.querySelector('.tab-btn.active');
        if (activeBtn) moveIndicator(activeBtn);
    });

    /* ===== โหลดโน้ตจาก localStorage เมื่อเปิดหน้าเว็บ ===== */
    window.addEventListener('load', function () {
        loadNotes();
        loadInput();
    });
    /* ===== ปิด Quick Notes ===== */
    function closeQuickNotes() {
        document.getElementById('quickNotes').style.display = 'none';
        document.getElementById('openNotesBtn').style.display = 'flex';
    }

    /* ===== เปิด Quick Notes ===== */
    function openQuickNotes() {
        document.getElementById('quickNotes').style.display = 'flex';
        document.getElementById('openNotesBtn').style.display = 'none';
    }

    /* ===== เพิ่มโน้ต ===== */
    function addNote() {
        const input     = document.getElementById('notesInput');
        const notesList = document.getElementById('notesList');
        const text      = input.value.trim();

        /* ===== ถ้าไม่มีข้อความ ไม่ทำอะไร ===== */
        if (!text) return;

     /* ===== ดึงโน้ตเดิมจาก localStorage ===== */
        const notes = getSavedNotes();

        /* ===== เพิ่มโน้ตใหม่ ===== */
        notes.push(text);

        /* ===== บันทึกลง localStorage ===== */
        localStorage.setItem('quickNotes', JSON.stringify(notes));

        /* ===== ล้างกล่องพิมพ์และ localStorage ของ input ===== */
        input.value = '';
        localStorage.removeItem('quickNoteInput');

        /* ===== แสดงโน้ตใหม่ ===== */
        renderNotes();
        input.focus();
    }

    /* ===== แสดงโน้ตทั้งหมด ===== */
    function renderNotes() {
        const notesList = document.getElementById('notesList');
        const notes     = getSavedNotes();

        notesList.innerHTML = '';

        notes.forEach(function (text, index) {
            const noteItem = document.createElement('div');
            noteItem.classList.add('note-item');
            noteItem.innerHTML = `
                <span>${text.replace(/\n/g, '')}</span>
                <button class="delete-note-btn" onclick="deleteNote(${index})">✕</button>
            `;
            notesList.appendChild(noteItem);
        });

        /* ===== เลื่อนลงโน้ตล่าสุด ===== */
        notesList.scrollTop = notesList.scrollHeight;
    }

    /* ===== ลบโน้ตชิ้นที่เลือก ===== */
    function deleteNote(index) {
        const notes = getSavedNotes();
        notes.splice(index, 1);
        localStorage.setItem('quickNotes', JSON.stringify(notes));
        renderNotes();
    }

    /* ===== ล้างทุกอย่าง (กดปุ่ม Clear) ===== */
    function clearAll() {
        document.getElementById('notesInput').value = '';
        localStorage.removeItem('quickNotes');
        localStorage.removeItem('quickNoteInput');
        renderNotes();
    }

    /* ===== ดึงโน้ตจาก localStorage ===== */
    function getSavedNotes() {
        return JSON.parse(localStorage.getItem('quickNotes') || '[]');
    }

    /* ===== โหลดโน้ตทั้งหมด ===== */
    function loadNotes() {
        renderNotes();
    }

    /* ===== บันทึกข้อความใน input แบบ real-time ===== */
    function loadInput() {
        const input       = document.getElementById('notesInput');
        const savedInput  = localStorage.getItem('quickNoteInput');

        /* ===== โหลดข้อความที่พิมพ์ค้างไว้ ===== */
        if (savedInput) {
            input.value = savedInput;
        }

        /* ===== บันทึกทุกครั้งที่พิมพ์ ===== */
        input.addEventListener('input', function () {
            localStorage.setItem('quickNoteInput', input.value);
        });

        /* ===== กด Enter เพิ่มโน้ต / Shift+Enter ขึ้นบรรทัดใหม่ ===== */
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                addNote();
            }
        });
    }
// ===== ตัวแปรเก็บอารมณ์ที่ผู้ใช้เลือกในขณะนั้น =====
    let selectedMood = "";
    // ===== ฟังก์ชันเลือกอารมณ์ (Emoji) =====   
    function selectMood(mood) {               
        selectedMood = mood;             // เก็บค่าอารมณ์ที่เลือกไว้ในตัวแปร
         // แสดงข้อความบอกอารมณ์ที่เลือกบนหน้าจอ
        document.getElementById("selectedMoodText").innerText = "Selected mood: " + mood;
    }
    // ===== ฟังก์ชันบันทึกอารมณ์ =====
    function saveMood() {
        // ดึงค่าคะแนนอารมณ์จาก Dropdownและข้อความโน้ตจาก Textarea
        const score = document.getElementById("moodScore").value;
        // ดึงข้อความโน้ตและตัดช่องว่างหัว-ท้ายออก
        const note = document.getElementById("moodNote").value.trim();
         // ดึง element รายการบันทึกอารมณ์เพื่อเพิ่มรายการใหม่เข้าไป
        const moodList = document.getElementById("moodList");
         // ตรวจสอบว่าผู้ใช้ยังไม่ได้เลือกอารมณ์และไม่ได้พิมพ์โน้ต
        if (!selectedMood && !note) {
            alert("Please select a mood or write a note.");
            return;     // หยุดการทำงานถ้าไม่มีข้อมูล
        }
        // สร้าง element div สำหรับแสดงรายการอารมณ์ใหม่
        const item = document.createElement("div");
        item.className = "mood-item";                // กำหนด class สำหรับ CSS

        // ใส่เนื้อหาใน element โดยแสดง Emoji, คะแนน และโน้ต
    // ถ้าไม่มี Emoji ให้ใช้ 🙂 แทน / ถ้าไม่มีโน้ตให้แสดง "No note added"
        item.innerHTML = `
            <strong>${selectedMood || "🙂"}</strong> 
            Score: ${score}
            <span>${note || "No note added"}</span>
        `;
        // เพิ่มรายการใหม่ไว้ด้านบนสุดของรายการ (ล่าสุดขึ้นก่อน)
        moodList.prepend(item);
         // ล้างฟอร์มหลังจากบันทึกเสร็จ
        clearMood();
    }
        // ===== ฟังก์ชันล้างข้อมูลในฟอร์ม =====
    function clearMood() {
        // รีเซ็ตตัวแปรอารมณ์ที่เลือกเป็นค่าว่าง
        selectedMood = "";
        // รีเซ็ตข้อความแสดงอารมณ์ที่เลือกกลับเป็น None
        document.getElementById("selectedMoodText").innerText = "Selected mood: None";
        document.getElementById("moodScore").value = "1";
        document.getElementById("moodNote").value = "";
    }

    function closeMoodBox() {
        document.getElementById("moodBox").style.display = "none";
        document.getElementById("openMoodBtn").style.display = "inline-flex"
    }

    function openMoodBox() {
        document.getElementById("moodBox").style.display = "block";
        document.getElementById("openMoodBtn").style.display = "none";
    }
    /* ===== ข้อมูลชื่อเดือนและวันเป็นภาษาไทย ===== */
const thMonths = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
const thDays = ['Sun','Mon','Tus','Wen','Thu','Fri','Sat'];

/* ===== state เดือนที่กำลังแสดงอยู่ และวันที่ปัจจุบัน ===== */
let calDate = new Date();
const today = new Date();

function renderCalendar() {
    const y = calDate.getFullYear(), m = calDate.getMonth();

    /* แสดงชื่อเดือน + ปี พ.ศ. */
    document.getElementById('calTitle').textContent = thMonths[m] + ' ' + (y + 543);

    const grid = document.getElementById('calGrid');

    /* สร้างหัวแถวชื่อวัน */
    grid.innerHTML = thDays.map(d => `<div class="cal-day-name">${d}</div>`).join('');

    /* หาวันแรกของเดือน, จำนวนวันในเดือน, วันสุดท้ายของเดือนก่อน */
    const firstDay = new Date(y, m, 1).getDay();
    const lastDate = new Date(y, m + 1, 0).getDate();
    const prevLast = new Date(y, m, 0).getDate();

    /* เติมวันที่เดือนก่อน (แสดงจางๆ) */
    for (let i = 0; i < firstDay; i++)
        grid.innerHTML += `<div class="cal-cell other">${prevLast - firstDay + 1 + i}</div>`;

    /* เติมวันที่ของเดือนนี้ และ highlight วันปัจจุบัน */
    for (let d = 1; d <= lastDate; d++) {
        const isToday = d === today.getDate() && m === today.getMonth() && y === today.getFullYear();
        grid.innerHTML += `<div class="cal-cell${isToday ? ' today' : ''}">${d}</div>`;
    }

    /* เติมวันที่เดือนหน้า (ให้ครบ 42 ช่อง = 6 แถว) */
    const remaining = 42 - (firstDay + lastDate);
    for (let i = 1; i <= remaining; i++)
        grid.innerHTML += `<div class="cal-cell other">${i}</div>`;
}

/* ===== ปุ่มเลื่อนเดือนก่อนหน้า ===== */
document.getElementById('prevBtn').addEventListener('click', () => {
    calDate.setMonth(calDate.getMonth() - 1);
    renderCalendar();
});

/* ===== ปุ่มเลื่อนเดือนถัดไป ===== */
document.getElementById('nextBtn').addEventListener('click', () => {
    calDate.setMonth(calDate.getMonth() + 1);
    renderCalendar();
});

/* ===== เรียก render ครั้งแรกตอนโหลดหน้า ===== */
renderCalendar();

function closeCalendar() {
    document.getElementById('calendar').style.display = 'none';
    document.getElementById('openCalBtn').style.display = 'inline-flex';
    document.getElementById('openNotesBtn').style.display = 'inline-flex';
}

function openCalendar() {
    document.getElementById('calendar').style.display = 'block';
    document.getElementById('openCalBtn').style.display = 'none';
    document.getElementById('openNotesBtn').style.display = 'none';
}
