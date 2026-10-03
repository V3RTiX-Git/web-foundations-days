let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

function searchNotes(word) {
  const searchWord = word.toLowerCase();

  return notes.filter((note) =>
    note.text.toLowerCase().includes(searchWord)
  );
}

function longestNote() {
  if (notes.length === 0) {
    return null;
  }

  let longest = notes[0];

  for (let i = 1; i < notes.length; i++) {
    if (notes[i].text.length > longest.text.length) {
      longest = notes[i];
    }
  }

  return longest;
}

function countByCategory() {
  const counts = {
    personal: 0,
    work: 0,
    study: 0,
  };

  for (const note of notes) {
    counts[note.category]++;
  }

  return counts;
}

function getSummary() {
  const counts = countByCategory();
  const word = notes.length === 1 ? "note" : "notes";

  return `${notes.length} ${word}: ${counts.personal} personal, ${counts.work} work, ${counts.study} study.`;
}

function isDuplicate(text) {
  const cleanedText = text.trim().toLowerCase();

  return notes.some(
    (note) => note.text.trim().toLowerCase() === cleanedText
  );
}

function addNote(text, category) {
  const cleanedText = text.trim();

  if (cleanedText.length < 1 || cleanedText.length > 200) {
    console.log("Note rejected: text must be 1-200 characters.");
    return false;
  }

  if (isDuplicate(cleanedText)) {
    console.log("Note rejected: duplicate note.");
    return false;
  }

  if (
    category !== "personal" &&
    category !== "work" &&
    category !== "study"
  ) {
    console.log("Note rejected: invalid category.");
    return false;
  }

  const newNote = {
    id: notes.length + 1,
    text: cleanedText,
    category: category,
  };

  notes.push(newNote);
  console.log(`Added: "${newNote.text}"`);
  return true;
}

// --- Tests ---

console.log(searchNotes("day"));
// Expected: [{ id: 2, text: "Finish the Day 3 assignment", category: "study" }]

console.log(searchNotes("python"));
// Expected: []

console.log(longestNote());
// Expected: the note object with the most characters

notes = [];

console.log(longestNote());
// Expected: null

notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

console.log(countByCategory());
// Expected: { personal: 2, work: 1, study: 2 }

console.log(countByCategory());
// Expected: { personal: 2, work: 1, study: 2 }

console.log(getSummary());
// Expected: "5 notes: 2 personal, 1 work, 2 study."

notes = [
  { id: 1, text: "Call mum", category: "personal" },
];

console.log(getSummary());
// Expected: "1 note: 1 personal, 0 work, 0 study."

notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

console.log(isDuplicate("Call mum"));
// Expected: true

console.log(isDuplicate("  call mum  "));
// Expected: true

console.log(addNote("Read about JavaScript functions", "study"));
// Expected: true

console.log(addNote("Call mum", "personal"));
// Expected: false because the note is a duplicate

console.log(addNote("", "personal"));
// Expected: false because the text is too short

console.log(addNote("A valid note", "school"));
// Expected: false because the category is invalid