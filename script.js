"use strict";

const startDate = new Date();
startDate.setHours(0, 0, 0, 0);
const endDate = new Date("2026-01-05T00:00:00");
endDate.setHours(0, 0, 0, 0);
const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

const pourButton = document.getElementById("pour-button");
const jamLevel = document.getElementById("jam-level");
const messageArea = document.getElementById("message-area");
const dayCounter = document.getElementById("day-counter");
const overlay = document.getElementById("overlay");

document.addEventListener("DOMContentLoaded", () => {
  pourButton.addEventListener("click", pourJam);
  checkState();
});

function updateJarVisual(filledDays) {
  const percent = (filledDays / totalDays) * 100;
  jamLevel.style.height = `${percent}%`;

  const remaining = totalDays - filledDays;

  const specialMessages = {
    10: "🎈 Ура! Уже 10 дней сладких моментов!",
    50: "💖 Полтинник радости — ты создаёшь чудо!",
    100: "💯 Вареньевой сотник! Кто молодец? 🍓 Ты!",
    150: "🌟 150 дней — почти вся банка в любви!",
    180: "🔥 Почти максимум! Осталось совсем чуть-чуть!",
    190: "👑 Ты почти у финиша — поздравляю заранее!"
  };

  if (specialMessages[filledDays]) {
    dayCounter.textContent = specialMessages[filledDays];
  } else {
    const phrase = filledDays <= phrases188.length
      ? phrases188[filledDays - 1]
      : extraPhrases[Math.floor(Math.random() * extraPhrases.length)];
    dayCounter.textContent = `🔖 Осталось собрать ещё ${remaining} ${declineDays(remaining)} — ${phrase}`;
  }
}

function checkState() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filledDays = parseInt(localStorage.getItem("jamJarFilledDays") || "0");
  const lastPourDate = localStorage.getItem("jamJarLastPourDate");

  updateJarVisual(filledDays);

  if (today > endDate || filledDays >= totalDays) {
    finishJar(filledDays);
    return;
  }

  if (lastPourDate === today.toISOString().split("T")[0]) {
    pourButton.disabled = true;
    messageArea.textContent = "На сегодня варенье уже влито 🍓";
  } else {
    pourButton.disabled = false;
    messageArea.textContent = "Нажми, чтобы добавить немного тепла 🙂";
  }
}

function pourJam() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split("T")[0];

  let filledDays = parseInt(localStorage.getItem("jamJarFilledDays") || "0");
  const lastPourDate = localStorage.getItem("jamJarLastPourDate");

  if (lastPourDate === todayStr) {
    messageArea.textContent = "Сегодня уже добавлено 💧";
    return;
  }

  filledDays++;
  localStorage.setItem("jamJarFilledDays", filledDays);
  localStorage.setItem("jamJarLastPourDate", todayStr);
  updateJarVisual(filledDays);

  messageArea.textContent = `📅 День ${filledDays} добавлен в банку воспоминаний!`;
  pourButton.disabled = true;

  if (filledDays >= totalDays) {
    finishJar(filledDays);
  }
}

function finishJar(filledDays) {
  updateJarVisual(filledDays);
  messageArea.textContent = "С Днём Рождения! Банка полна! 🎉";
  pourButton.disabled = true;
  overlay.classList.remove("hidden");
}

function declineDays(n) {
  if (n % 10 === 1 && n % 100 !== 11) return "день";
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return "дня";
  return "дней";
}
