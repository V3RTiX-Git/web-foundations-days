// ---------- 1. Select the elements we need ----------
const noteText = document.querySelector("#note-text");
const charCount = document.querySelector("#char-count");
const wordCount = document.querySelector("#word-count");
const clearBtn = document.querySelector("#clear-btn");
const themeToggle = document.querySelector("#theme-toggle");

const DRAFT_KEY = "quicknotes-draft";
const THEME_KEY = "quicknotes-theme";


// ---------- 2. Update the counters ----------
function updateCounts() {
  const text = noteText.value;
  const characters = text.length;

  let words = 0;

  if (text.trim() !== "") {
    words = text.trim().split(/\s+/).length;
  }

  charCount.textContent = `${characters} / 200 characters`;
  wordCount.textContent = `${words} words`;

  charCount.classList.remove("warning");
  charCount.classList.remove("over");

  if (characters > 200) {
    charCount.classList.add("over");
  } else if (characters > 180) {
    charCount.classList.add("warning");
  }
}


// ---------- 3. Save the draft ----------
function saveDraft() {
  localStorage.setItem(DRAFT_KEY, noteText.value);
}


// ---------- 4. Clear the note ----------
function clearNote() {
  noteText.value = "";
  localStorage.removeItem(DRAFT_KEY);
  updateCounts();
  noteText.focus();
}


// ---------- 5. Handle note input ----------
noteText.addEventListener("input", () => {
  updateCounts();
  saveDraft();
});


// ---------- 6. Clear button ----------
clearBtn.addEventListener("click", () => {
  clearNote();
});


// ---------- 7. Escape key clears the note ----------
noteText.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    clearNote();
  }
});


// ---------- 8. Theme ----------
function updateThemeButton() {
  if (document.body.classList.contains("dark")) {
    themeToggle.textContent = "Light mode";
  } else {
    themeToggle.textContent = "Dark mode";
  }
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem(THEME_KEY, "dark");
  } else {
    localStorage.setItem(THEME_KEY, "light");
  }

  updateThemeButton();
});


// ---------- 9. Restore saved data when the page loads ----------
const savedDraft = localStorage.getItem(DRAFT_KEY);

if (savedDraft) {
  noteText.value = savedDraft;
}

const savedTheme = localStorage.getItem(THEME_KEY);

if (savedTheme === "dark") {
  document.body.classList.add("dark");
}


// ---------- 10. Draw the initial state ----------
updateCounts();
updateThemeButton();