/* ===========================
LOGIN
=========================== */

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === "klsvdit" && password === "1234") {
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("error").innerHTML = "Invalid Username or Password";
  }
}

/* ===========================
SLIDESHOW
=========================== */

const defaultSlides = [
  {
    image: "images/topper.jpg",
    title: "Congratulations to the 6th Semester Toppers",
    caption: "Your hard work and dedication inspire the entire EEE Department."
  },
  {
    image: "images/workshop.jpg",
    title: "AI Powered Playwright + TypeScript Automation",
    caption: "Join the workshop and enhance your technical skills."
  },
  {
    image: "images/participation.jpg",
    title: "Student Achievements",
    caption: "Congratulations for outstanding participation in sports, technical events and online courses."
  },
  {
    image: "images/placement.jpg",
    title: "Campus Placement",
    caption: "Congratulations on your placement at Indus Towers."
  },
  {
    image: "images/quote.jpg",
    title: "Quote of the Day",
    caption: "Your habits shape your future more than your goals."
  },
  {
    image: "images/notice.jpg",
    title: "Department Notice",
    caption: "Project Review III Presentation Schedule."
  }
];

let slideshowSlides = [];
let currentSlideIndex = 0;
let slideshowTimer = null;
let urgentPopupTimer = null;

function parseExpiryValue(value) {
  if (!value || value === "never") return null;
  switch (value) {
    case "1h": return Date.now() + 60 * 60 * 1000;
    case "8h": return Date.now() + 8 * 60 * 60 * 1000;
    case "1d": return Date.now() + 24 * 60 * 60 * 1000;
    case "1w": return Date.now() + 7 * 24 * 60 * 60 * 1000;
    case "1m": return Date.now() + 30 * 24 * 60 * 60 * 1000;
    default: return null;
  }
}

function getStoredSlides() {
  try {
    const stored = JSON.parse(localStorage.getItem("slides") || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

function getSlides() {
  const activeSlides = getStoredSlides().filter((slide) => {
    if (!slide || !slide.image) return false;
    if (!slide.expiresAt) return true;
    return Date.now() < slide.expiresAt;
  });

  if (activeSlides.length > 0) {
    const allSlides = getStoredSlides();
    if (activeSlides.length !== allSlides.length) {
      localStorage.setItem("slides", JSON.stringify(activeSlides));
    }
    return activeSlides;
  }

  return defaultSlides.map((slide) => ({ ...slide }));
}

function renderSlide() {
  const slide = slideshowSlides[currentSlideIndex];
  if (!slide) return;

  const imageEl = document.getElementById("slideImage");
  const secondaryImageEl = document.getElementById("slideSecondaryImage");
  const titleEl = document.getElementById("slideTitle");
  const captionEl = document.getElementById("slideCaption");

  if (imageEl) imageEl.src = slide.image || "";
  if (secondaryImageEl) secondaryImageEl.src = slide.secondaryImage || slide.image || "";
  if (titleEl) titleEl.textContent = slide.title || "";
  if (captionEl) captionEl.textContent = slide.caption || "";
}

function startSlideshow() {
  slideshowSlides = getSlides();
  if (!slideshowSlides.length) return;

  currentSlideIndex = 0;
  renderSlide();

  if (slideshowTimer) {
    clearInterval(slideshowTimer);
  }

  slideshowTimer = setInterval(() => {
    slideshowSlides = getSlides();
    if (!slideshowSlides.length) return;
    currentSlideIndex = (currentSlideIndex + 1) % slideshowSlides.length;
    renderSlide();
  }, 5000);
}

function addSlides() {

  const input = document.getElementById("slideImages");
  const expiryValue = document.getElementById("slideExpiry")?.value || "never";
  const messageBox = document.getElementById("uploadMessage");

  if (!input || !input.files || input.files.length === 0) {

    if (messageBox) {
      messageBox.textContent = "Please select one or more images.";
      messageBox.style.color = "red";
    }

    return;
  }

  const expiresAt = parseExpiryValue(expiryValue);
  const files = Array.from(input.files);

  const readAsDataURL = (file) => {
    return new Promise((resolve, reject) => {

      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);

      reader.onerror = () => reject(reader.error);

      reader.readAsDataURL(file);

    });
  };

  Promise.all(files.map(file => readAsDataURL(file)))

    .then((images) => {

      const existingSlides = getStoredSlides();

      const newSlides = images.map((image) => ({
        image: image,
        expiresAt: expiresAt || null
      }));

      const updatedSlides = [
        ...existingSlides,
        ...newSlides
      ];

      localStorage.setItem(
        "slides",
        JSON.stringify(updatedSlides)
      );

      if (messageBox) {

        messageBox.textContent =
          `${images.length} image(s) uploaded successfully!`;

        messageBox.style.color = "green";
      }

      input.value = "";

      if (document.getElementById("slideExpiry")) {
        document.getElementById("slideExpiry").value = "never";
      }

    })

    .catch((err) => {

      console.error(err);

      if (messageBox) {

        messageBox.textContent =
          "Something went wrong while uploading images.";

        messageBox.style.color = "red";
      }

    });
}

function getImportantMessage() {
  try {
    const storedMessage = JSON.parse(localStorage.getItem("importantMessage") || "null");

    if (!storedMessage || !storedMessage.text) return null;
    if (storedMessage.expiresAt && Date.now() > storedMessage.expiresAt) {
      localStorage.removeItem("importantMessage");
      return null;
    }

    return storedMessage;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function hideImportantMessage(onClose) {
  const popup = document.getElementById("urgentPopup");
  if (popup) popup.classList.add("hidden");

  if (urgentPopupTimer) {
    clearTimeout(urgentPopupTimer);
    urgentPopupTimer = null;
  }

  if (typeof onClose === "function") onClose();
}

function showImportantMessage(onClose) {
  const popup = document.getElementById("urgentPopup");
  const messageText = document.getElementById("urgentMessageText");
  const message = getImportantMessage();

  if (!popup || !messageText || !message) {
    if (typeof onClose === "function") onClose();
    return;
  }

  messageText.textContent = message.text;
  popup.classList.remove("hidden");

  if (urgentPopupTimer) {
    clearTimeout(urgentPopupTimer);
  }

  urgentPopupTimer = setTimeout(() => {
    hideImportantMessage(onClose);
  }, 8000);

  const closeButton = document.getElementById("urgentCloseButton");
  if (closeButton) {
    closeButton.onclick = () => hideImportantMessage(onClose);
  }
}

/* ===========================
DATE • DAY • TIME
=========================== */

function updateDateTime() {
  const now = new Date();
  const dateOptions = { day: "2-digit", month: "long", year: "numeric" };
  const dayOptions = { weekday: "long" };

  const dateEl = document.getElementById("date");
  const dayEl = document.getElementById("day");
  const clockEl = document.getElementById("clock");

  if (dateEl) dateEl.innerHTML = now.toLocaleDateString("en-IN", dateOptions);
  if (dayEl) dayEl.innerHTML = now.toLocaleDateString("en-IN", dayOptions);
  if (clockEl) clockEl.innerHTML = now.toLocaleTimeString("en-IN");
}

setInterval(updateDateTime, 1000);
updateDateTime();

/* ===========================
SOLAR
=========================== */

function saveSolar() {
  const solar = document.getElementById("solar").value;
  localStorage.setItem("solarPower", solar);
  alert("Solar Updated Successfully");
}

function loadSolar() {
  const solar = localStorage.getItem("solarPower");
  const solarEl = document.getElementById("solarPower");

  if (solarEl) {
    solarEl.innerHTML = (solar || "0") + " kWh";
  }
}

loadSolar();

/* ===========================
WEATHER
=========================== */

function loadWeather() {
  const weatherEl = document.getElementById("weather");
  if (weatherEl) {
    weatherEl.innerHTML = "28°C | Sunny";
  }
}

loadWeather();

/* ===========================
RUNNING TICKER
=========================== */

function saveTicker() {
  const tickerText = document.getElementById("ticker").value;
  localStorage.setItem("runningTicker", tickerText);
  alert("Ticker Updated Successfully");
}

function loadTicker() {
  const ticker = localStorage.getItem("runningTicker");
  const runningTextEl = document.getElementById("runningText");

  if (runningTextEl) {
    runningTextEl.innerHTML = ticker || "Welcome to KLS VDIT Smart Digital Information System";
  }
}

loadTicker();

/* ===========================
TIMETABLE
=========================== */

function saveTimetable() {
  localStorage.setItem("facultyA", document.getElementById("facultyA").value);
  localStorage.setItem("subjectA", document.getElementById("subjectA").value);
  localStorage.setItem("timeA", document.getElementById("timeA").value);
  localStorage.setItem("facultyB", document.getElementById("facultyB").value);
  localStorage.setItem("subjectB", document.getElementById("subjectB").value);
  localStorage.setItem("timeB", document.getElementById("timeB").value);

  alert("Timetable Saved Successfully");
}

function loadTimetable() {
  if (document.getElementById("displayFacultyA")) {
    document.getElementById("displayFacultyA").innerHTML = localStorage.getItem("facultyA") || "-";
    document.getElementById("displaySubjectA").innerHTML = localStorage.getItem("subjectA") || "-";
    document.getElementById("displayTimeA").innerHTML = localStorage.getItem("timeA") || "-";
    document.getElementById("displayFacultyB").innerHTML = localStorage.getItem("facultyB") || "-";
    document.getElementById("displaySubjectB").innerHTML = localStorage.getItem("subjectB") || "-";
    document.getElementById("displayTimeB").innerHTML = localStorage.getItem("timeB") || "-";
  }
}

loadTimetable();

/* ===========================
DISPLAY UPDATE
=========================== */

function updateDisplay() {
  loadSolar();
  loadTicker();
  loadTimetable();
  loadNotice();
  startSlideshow();
  alert("Display Updated Successfully!");
}

function startDisplay() {
  window.open("display.html");
}

function stopDisplay() {
  alert("Display Closed");
}

/* ===========================
NOTICE MANAGEMENT
=========================== */

function saveNotice() {
  const title = document.getElementById("noticeTitle").value;
  const description = document.getElementById("noticeDescription").value;

  localStorage.setItem("noticeTitle", title);
  localStorage.setItem("noticeDescription", description);

  alert("Notice Saved Successfully");
}

function loadNotice() {
  if (document.getElementById("displayNoticeTitle")) {
    document.getElementById("displayNoticeTitle").innerHTML = localStorage.getItem("noticeTitle") || "No Notice";
  }

  if (document.getElementById("displayNoticeDescription")) {
    document.getElementById("displayNoticeDescription").innerHTML = localStorage.getItem("noticeDescription") || "No Notice Available";
  }
}

loadNotice();

function initDisplayPage() {
  if (window.location.pathname.includes("display.html")) {
    showImportantMessage(function () {
      startSlideshow();
    });
  }
}

if (window.location.pathname.includes("display.html")) {
  initDisplayPage();
}

