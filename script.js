"use strict";

const startDate = new Date();
startDate.setHours(0, 0, 0, 0);

const endDate = new Date("2026-01-05");
endDate.setHours(0, 0, 0, 0);

const totalDays = Math.ceil((endDate - startDate) / 86400000);

const elements = {
  button: document.getElementById("pour-button"),
  jam: document.getElementById("jam-level"),
  message: document.getElementById("message-area"),
  counter: document.getElementById("day-counter"),
  overlay: document.getElementById("overlay")
};

document.addEventListener("DOMContentLoaded", () => {
  elements.button.addEventListener("click", pourJam);
  updateState();
});

function updateState() {
  const today = getToday();
  const filledDays = +localStorage.getItem("jamJarFilledDays") || 0;
  const lastPour = localStorage.getItem("jamJarLastPourDate");

  updateJar(filledDays);

  if (filledDays >= totalDays || today > endDate) return finishJar(filledDays);

  elements.button.disabled = (lastPour === today.toISOString().split("T")[0]);
  elements.message.textContent = elements.button.disabled
    ? "На сегодня варенье уже влито 🍓"
    : "Нажми, чтобы добавить немного тепла 🙂";
}

function pourJam() {
  const today = getToday();
  const todayStr = today.toISOString().split("T")[0];
  const lastPour = localStorage.getItem("jamJarLastPourDate");

  if (lastPour === todayStr) return;

  let filledDays = (+localStorage.getItem("jamJarFilledDays") || 0) + 1;

  localStorage.setItem("jamJarFilledDays", filledDays);
  localStorage.setItem("jamJarLastPourDate", todayStr);

  updateJar(filledDays);
  elements.message.textContent = `📅 День ${filledDays} добавлен в банку воспоминаний!`;
  elements.button.disabled = true;

  if (filledDays >= totalDays) finishJar(filledDays);
}

function updateJar(filled) {
  elements.jam.style.height = `${(filled / totalDays) * 100}%`;

  const remaining = totalDays - filled;
  const special = {
    10: "🎈 Ура! Уже 10 дней сладких моментов!",
    50: "💖 Полтинник радости — ты создаёшь чудо!",
    100: "💯 Вареньевой сотник! Кто молодец? 🍓 Ты!",
    150: "🌟 150 дней — почти вся банка в любви!",
    180: "🔥 Почти максимум! Осталось совсем чуть-чуть!",
    190: "👑 Ты почти у финиша — поздравляю заранее!"
  };

  elements.counter.textContent = special[filled]
    || `🔖 Осталось собрать ещё ${totalDays - filled} ${declineDays(remaining)} — ${
        phrases188[filled - 1] || extraPhrases[Math.floor(Math.random() * extraPhrases.length)]
      }`;
}

function finishJar(filled) {
  updateJar(filled);
  elements.message.textContent = "С Днём Рождения! Банка полна! 🎉";
  elements.button.disabled = true;
  elements.overlay.classList.remove("hidden");
}

function getToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function declineDays(n) {
  const rem10 = n % 10, rem100 = n % 100;
  if (rem10 === 1 && rem100 !== 11) return "день";
  if ([2, 3, 4].includes(rem10) && ![12, 13, 14].includes(rem100)) return "дня";
  return "дней";
}
