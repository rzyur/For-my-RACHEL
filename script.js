
const letterCard = document.getElementById("letterCard");
const questionCard = document.getElementById("questionCard");
const successScreen = document.getElementById("successScreen");

const continueBtn = document.getElementById("continueBtn");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const againBtn = document.getElementById("againBtn");

const buttonArea = document.getElementById("buttonArea");
const hint = document.getElementById("hint");
const hearts = document.getElementById("hearts");
const confettiContainer = document.getElementById("confettiContainer");

let dodgeCount = 0;
let lastDodgeTime = 0;
let confettiTimer = null;
let heartTimer = null;
let celebrationStarted = false;

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// Playful messages shown whenever the No button escapes
const playfulMessages = [
  "HEHE, too slow! 😜",
  "Oops, missed me! 💗",
  "Are you sure about that? 🥺",
  "Nope, try again! 😂",
  "Catch me if you can! 💕",
  "That button has trust issues 😭",
  "Wrong button, hehe! 💖",
  "You almost got me! 👀",
  "Nice try! One more time? 😏",
  "I'm too fast for you! 💨",
  "HAHAHA, not today! 💗",
  "The button said NO to you! 😂"
];

// ==========================================
// 1. SHOW THE LOVE LETTER AND QUESTION
// ==========================================

continueBtn.addEventListener("click", () => {
  letterCard.hidden = true;
  questionCard.hidden = false;
  resetNoButton();
});

// ==========================================
// 2. PLAYFUL NO BUTTON
// ==========================================

function dodgeNoButton() {
  if (questionCard.hidden || !successScreen.hidden) {
    return;
  }

  // Prevent the button from moving too rapidly
  const now = Date.now();

  if (now - lastDodgeTime < 900) {
    return;
  }

  lastDodgeTime = now;
  dodgeCount++;

  const padding = 16;
  const buttonWidth = noBtn.offsetWidth;
  const buttonHeight = noBtn.offsetHeight;

  // Calculate safe screen boundaries
  const maxX = Math.max(
    padding,
    window.innerWidth - buttonWidth - padding
  );

  const maxY = Math.max(
    padding,
    window.innerHeight - buttonHeight - padding
  );

  let x;
  let y;

  const currentRect = noBtn.getBoundingClientRect();

  // Try to move a reasonable distance from its current position
  // without placing the button outside the screen.
  let attempts = 0;

  do {
    x = padding + Math.random() * (maxX - padding);
    y = padding + Math.random() * (maxY - padding);
    attempts++;
  } while (
    attempts < 12 &&
    Math.hypot(
      x - currentRect.left,
      y - currentRect.top
    ) < 100
  );

  // Keep the button visible while it moves
  noBtn.style.position = "fixed";
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  noBtn.style.zIndex = "20";
  noBtn.style.opacity = "1";
  noBtn.style.transform = "scale(1.08)";

  // Little bounce after escaping
  window.setTimeout(() => {
    noBtn.style.transform = "scale(1)";
  }, 180);

  // Change the playful message
  if (hint) {
    const messageIndex =
      (dodgeCount - 1) % playfulMessages.length;

    hint.textContent = playfulMessages[messageIndex];
  }
}

// Desktop: dodge when the pointer enters the button
noBtn.addEventListener("pointerenter", (event) => {
  if (event.pointerType === "mouse") {
    dodgeNoButton();
  }
});

// Phone and tablet: dodge when the user touches the button
noBtn.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  dodgeNoButton();
});

// Fallback for clicks and keyboard activation
noBtn.addEventListener("click", (event) => {
  event.preventDefault();
  dodgeNoButton();
});

// Reset the No button to its original position
function resetNoButton() {
  noBtn.style.position = "";
  noBtn.style.left = "";
  noBtn.style.top = "";
  noBtn.style.zIndex = "";
  noBtn.style.opacity = "1";
  noBtn.style.transform = "";

  dodgeCount = 0;
  lastDodgeTime = 0;

  if (hint) {
    hint.textContent =
      "Psst... there's definitely a right answer. 👀";
  }
}

// Keep a moved button on-screen when the phone rotates
window.addEventListener("resize", () => {
  if (
    questionCard.hidden ||
    noBtn.style.position !== "fixed"
  ) {
    return;
  }

  const padding = 12;
  const rect = noBtn.getBoundingClientRect();

  const x = Math.max(
    padding,
    Math.min(rect.left, window.innerWidth - rect.width - padding)
  );

  const y = Math.max(
    padding,
    Math.min(rect.top, window.innerHeight - rect.height - padding)
  );

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
});

// ==========================================
// 3. FLOATING BACKGROUND HEARTS
// ==========================================

function createFloatingHeart() {
  if (document.hidden) {
    return;
  }

  // Limit the number of hearts to keep phones running smoothly
  if (hearts.childElementCount >= 18) {
    return;
  }

  const heart = document.createElement("span");

  heart.className = "floating-heart";

  const heartOptions = ["♡", "♥", "💗", "💕"];

  heart.textContent =
    heartOptions[Math.floor(Math.random() * heartOptions.length)];

  heart.style.left = `${Math.random() * 96}%`;
  heart.style.fontSize = `${16 + Math.random() * 22}px`;
  heart.style.animationDuration = `${5 + Math.random() * 5}s`;

  hearts.appendChild(heart);

  heart.addEventListener(
    "animationend",
    () => heart.remove(),
    { once: true }
  );
}

heartTimer = window.setInterval(createFloatingHeart, 650);

// ==========================================
// 4. CONFETTI CELEBRATION
// ==========================================

function createConfettiPiece() {
  if (!confettiContainer || document.hidden) {
    return;
  }

  // Keep the number of pieces under control on mobile
  if (confettiContainer.childElementCount >= 180) {
    return;
  }

  const piece = document.createElement("span");

  piece.className = "confetti-piece";

  const shapes = [
    "💖", "💕", "💗", "♥", "✦", "●", "■"
  ];

  const colors = [
    "#ff4f9a",
    "#ff244f",
    "#ffb6d9",
    "#ffffff",
    "#ffd166"
  ];

  piece.textContent =
    shapes[Math.floor(Math.random() * shapes.length)];

  const size = 10 + Math.random() * 18;
  const duration = 3 + Math.random() * 4;
  const drift = (Math.random() - 0.5) * 180;

  piece.style.left = `${Math.random() * 100}%`;
  piece.style.fontSize = `${size}px`;
  piece.style.color =
    colors[Math.floor(Math.random() * colors.length)];

  piece.style.setProperty(
    "--duration",
    `${duration}s`
  );

  piece.style.setProperty(
    "--drift",
    `${drift}px`
  );

  confettiContainer.appendChild(piece);

  piece.addEventListener(
    "animationend",
    () => piece.remove(),
    { once: true }
  );
}

function startCelebration() {
  // Prevent duplicate celebrations from repeated taps
  if (celebrationStarted) {
    return;
  }

  celebrationStarted = true;

  // Hide previous screens
  letterCard.hidden = true;
  questionCard.hidden = true;

  // Show the full-screen celebration
  successScreen.hidden = false;
  successScreen.scrollTop = 0;

  // Clear any leftover confetti
  confettiContainer.replaceChildren();

  // Create an immediate burst
  const initialBurst = reduceMotion ? 24 : 70;

  for (let i = 0; i < initialBurst; i++) {
    createConfettiPiece();
  }

  // Continue raining hearts and confetti
  if (!reduceMotion) {
    confettiTimer = window.setInterval(() => {
      for (let i = 0; i < 8; i++) {
        createConfettiPiece();
      }
    }, 180);
  }
}

// YES!! Start the party 💖
yesBtn.addEventListener("click", startCelebration);

// ==========================================
// 5. STOP CELEBRATION AND RETURN TO LETTER
// ==========================================

function stopCelebration() {
  if (confettiTimer !== null) {
    window.clearInterval(confettiTimer);
    confettiTimer = null;
  }

  confettiContainer.replaceChildren();
  celebrationStarted = false;
}

againBtn.addEventListener("click", () => {
  stopCelebration();

  successScreen.hidden = true;
  questionCard.hidden = true;
  letterCard.hidden = false;

  resetNoButton();

  window.scrollTo({
    top: 0,
    behavior: reduceMotion ? "auto" : "smooth"
  });
});

// ==========================================
// 6. PAUSE EFFECTS WHEN THE PAGE IS HIDDEN
// ==========================================

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    if (confettiTimer !== null) {
      window.clearInterval(confettiTimer);
      confettiTimer = null;
    }
  } else if (
    celebrationStarted &&
    !reduceMotion &&
    confettiTimer === null
  ) {
    confettiTimer = window.setInterval(() => {
      for (let i = 0; i < 8; i++) {
        createConfettiPiece();
      }
    }, 180);
  }
});

// Clean up when leaving the page
window.addEventListener("pagehide", () => {
  if (heartTimer !== null) {
    window.clearInterval(heartTimer);
    heartTimer = null;
  }

  stopCelebration();
});
