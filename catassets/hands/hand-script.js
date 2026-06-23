// Original title
const originalTitle = "Click to bap text around";
let currentTitle = originalTitle;

// Start CatHands with the original title
CatHands.start(document.body, { title: currentTitle });

// Function to change the title
function changeTitle(newTitle) {
  currentTitle = newTitle;
  CatHands.start(document.body, { title: currentTitle });
}

// Function to reset the title
function resetTitle() {
  currentTitle = originalTitle;
  CatHands.remove();
  CatHands.start(document.body, { title: currentTitle });
}

// Start CatHands after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  CatHands.start(document.body, { title: currentTitle });

  // Event listener for key presses
  document.addEventListener("keydown", (event) => {
    if (event.key === "r" || event.key === "R") {
      resetTitle(); // Reset title on "R" key press
    } else if (event.key === "t" || event.key === "T") {
      const newTitle = prompt("Enter new title:", currentTitle);
      if (newTitle) {
        changeTitle(newTitle); // Change title on "T" key press
      }
    }
  });
});

// Cookie helper functions
function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Timer variables
let totalTimeSeconds = 0;
let sessionStartTime = Date.now();
let sessionTimeSeconds = 0;
let timerInterval;

// Format time as HH:MM:SS
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// Update display
function updateTimerDisplays() {
  document.getElementById("globalTimer").textContent =
    `Total Time: ${formatTime(totalTimeSeconds)}`;
  document.getElementById("sessionTimer").textContent =
    `Current Session: ${formatTime(sessionTimeSeconds)}`;
}

// Initialize timer
function initializeTimer() {
  // Get saved total time from cookies (defaults to 0 if not found)
  totalTimeSeconds = parseInt(getCookie("cats_totalTime") || "0");

  // Update timers every second
  timerInterval = setInterval(() => {
    // Update session time
    sessionTimeSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);

    // Update total time (session + previous total)
    const currentTotalTime =
      parseInt(getCookie("cats_totalTime") || "0") + sessionTimeSeconds;
    totalTimeSeconds = currentTotalTime;

    // Save to cookie every 10 seconds to avoid excessive writes
    if (sessionTimeSeconds % 10 === 0) {
      setCookie(
        "cats_totalTime",
        (
          parseInt(getCookie("cats_totalTime") || "0") + sessionTimeSeconds
        ).toString(),
        365,
      );
      sessionStartTime = Date.now(); // Reset session start for next interval
    }

    updateTimerDisplays();
  }, 1000);

  // Initial display update
  updateTimerDisplays();
}

// Save time when leaving the page
function saveTimeOnExit() {
  const currentSessionTime = Math.floor((Date.now() - sessionStartTime) / 1000);
  const savedTime = parseInt(getCookie("cats_totalTime") || "0");
  setCookie("cats_totalTime", (savedTime + currentSessionTime).toString(), 365);
}

// Initialize timer when page loads
document.addEventListener("DOMContentLoaded", function () {
  initializeTimer();
});

// Save time when user leaves the page
window.addEventListener("beforeunload", saveTimeOnExit);
window.addEventListener("pagehide", saveTimeOnExit);

// Also save periodically and when page becomes hidden
document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    saveTimeOnExit();
    sessionStartTime = Date.now(); // Reset for when they come back
  }
});
