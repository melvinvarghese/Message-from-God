/*
 * Message from God
 * These messages are original inspirational reflections, not claims of divine revelation.
 * This project works as a static site: no server, API key, or database is required.
 */

const messages = [
  { text: "You do not have to see the whole path to take one gentle step forward.", category: "COURAGE & NEW BEGINNINGS" },
  { text: "May you find the strength to change what you can, the patience to accept what you cannot, and the wisdom to know the difference.", category: "WISDOM & ACCEPTANCE" },
  { text: "Your worth is not measured by how much you accomplish. You are worthy of care even on the days you do very little.", category: "SELF-WORTH & REST" },
  { text: "Let kindness be the thing you leave behind in every room you enter.", category: "KINDNESS & CONNECTION" },
  { text: "You can begin again without pretending the past never happened. Healing can carry the truth and still move toward hope.", category: "HEALING & HOPE" },
  { text: "When the future feels too large, return to this breath, this moment, and the next small thing you can do.", category: "PRESENCE & PEACE" },
  { text: "You do not need to have all the answers to be moving in a meaningful direction.", category: "TRUST & UNCERTAINTY" },
  { text: "May you offer yourself the same patience you so freely give to the people you love.", category: "COMPASSION & SELF-CARE" },
  { text: "A quiet act of goodness still matters, even when nobody sees it or says thank you.", category: "GOODNESS & PURPOSE" },
  { text: "Rest is not a reward you must earn. Sometimes it is the wisest next step.", category: "REST & RENEWAL" },
  { text: "There is courage in asking for help. You were never meant to carry every burden alone.", category: "COURAGE & SUPPORT" },
  { text: "Let what you cannot control loosen its hold on you. Give your energy to the things your hands can reach.", category: "RELEASE & CLARITY" },
  { text: "A difficult chapter is part of your story, not the whole of it.", category: "RESILIENCE & HOPE" },
  { text: "Listen with curiosity. Speak with care. Leave room for someone else's story to be different from yours.", category: "UNDERSTANDING & RESPECT" },
  { text: "You are allowed to grow beyond old versions of yourself, even the ones that helped you survive.", category: "GROWTH & CHANGE" },
  { text: "Notice one small thing that is good today. Let gratitude be a window, not a demand to ignore what hurts.", category: "GRATITUDE & HONESTY" },
  { text: "May peace find you in ordinary things: a kind word, a warm cup, a patch of sunlight, a moment of quiet.", category: "PEACE IN THE EVERYDAY" },
  { text: "You can be both a work in progress and someone deserving of love right now.", category: "LOVE & ACCEPTANCE" },
  { text: "When you make a mistake, choose repair over shame. What you do next matters.", category: "FORGIVENESS & REPAIR" },
  { text: "Do not confuse a slower season with a wasted one. Roots grow where nobody can see them.", category: "PATIENCE & GROWTH" },
  { text: "May you have the courage to set a boundary without closing your heart.", category: "COURAGE & BOUNDARIES" },
  { text: "You cannot always choose the weather around you, but you can seek shelter, reach for a hand, and wait for the light to change.", category: "RESILIENCE & CARE" },
  { text: "Let your next choice be guided by the person you hope to become, not only by the fear you feel today.", category: "PURPOSE & COURAGE" },
  { text: "The people around you may be carrying stories you cannot see. A little gentleness can travel farther than you know.", category: "EMPATHY & KINDNESS" },
  { text: "You do not have to turn every hurt into a lesson today. Sometimes it is enough to let yourself heal.", category: "HEALING & PATIENCE" },
  { text: "May you find belonging without having to hide the parts of yourself that make you human.", category: "BELONGING & ACCEPTANCE" },
  { text: "Small steps taken with care can still carry you toward a life that feels more like your own.", category: "PROGRESS & PURPOSE" },
  { text: "Make room for wonder. Not everything meaningful needs to be explained before it can be appreciated.", category: "WONDER & OPENNESS" },
  { text: "If today is heavy, let the goal be simple: get through it gently, and let someone know if you need support.", category: "HARD DAYS & SUPPORT" },
  { text: "May you remember that hope is not a promise that everything will be easy. It is permission to keep looking for what is possible.", category: "HOPE & POSSIBILITY" },
  { text: "Choose honesty with tenderness. Truth does not need cruelty to be clear.", category: "HONESTY & GRACE" },
  { text: "You can appreciate how far you have come and still want things to change. Both can be true.", category: "GRATITUDE & GROWTH" },
  { text: "Let today be a place to begin, not a courtroom where you put your whole life on trial.", category: "FRESH STARTS" },
  { text: "When you cannot offer a solution, your steady presence may still be a gift.", category: "FRIENDSHIP & CARE" },
  { text: "May you release the need to be perfect and choose instead to be present, sincere, and willing to learn.", category: "PRESENCE & GROWTH" },
  { text: "There is no shame in taking the long way toward peace.", category: "PATIENCE & PEACE" }
];

const textEl = document.getElementById("message-text");
const categoryEl = document.getElementById("message-category");
const numberEl = document.getElementById("message-number");
const anotherButton = document.getElementById("another-button");
const shareButton = document.getElementById("share-button");
const statusEl = document.getElementById("action-status");

let currentIndex = -1;
let previousIndex = Number.parseInt(sessionStorage.getItem("messageFromGodLastIndex") || "-1", 10);

function chooseMessage() {
  if (messages.length < 2) return 0;

  // Avoid repeating the immediately previous message, including across reloads in this tab.
  let nextIndex;
  do {
    nextIndex = Math.floor(Math.random() * messages.length);
  } while (nextIndex === previousIndex);

  previousIndex = nextIndex;
  currentIndex = nextIndex;
  try {
    sessionStorage.setItem("messageFromGodLastIndex", String(nextIndex));
  } catch (_) {
    // Storage may be disabled; random selection still works.
  }
  return nextIndex;
}

function renderMessage(index) {
  const message = messages[index];
  textEl.style.opacity = "0";
  textEl.style.transform = "translateY(5px)";

  window.setTimeout(() => {
    textEl.textContent = message.text;
    categoryEl.textContent = message.category;
    numberEl.textContent = String(index + 1).padStart(2, "0");
    textEl.style.opacity = "1";
    textEl.style.transform = "translateY(0)";
  }, 120);

  statusEl.textContent = "";
}

function showAnotherMessage() {
  renderMessage(chooseMessage());
}

async function shareMessage() {
  const message = messages[currentIndex];
  const shareText = `“${message.text}”\n\n— Message from God\n${window.location.href}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "A thought from Message from God",
        text: `“${message.text}” — Message from God`,
        url: window.location.href
      });
      statusEl.textContent = "Thanks for sharing a little kindness.";
      return;
    } catch (error) {
      if (error && error.name === "AbortError") return;
      // Fall through to clipboard if the share sheet is unavailable.
    }
  }

  try {
    await navigator.clipboard.writeText(shareText);
    statusEl.textContent = "Message copied. Share it with someone who may need it.";
  } catch (_) {
    // Fallback for browsers without Clipboard API support.
    const temporary = document.createElement("textarea");
    temporary.value = shareText;
    temporary.setAttribute("readonly", "");
    temporary.style.position = "absolute";
    temporary.style.left = "-9999px";
    document.body.appendChild(temporary);
    temporary.select();
    const copied = document.execCommand("copy");
    temporary.remove();
    statusEl.textContent = copied
      ? "Message copied. Share it with someone who may need it."
      : "Your message is ready to share: “" + message.text + "”";
  }
}

anotherButton.addEventListener("click", showAnotherMessage);
shareButton.addEventListener("click", shareMessage);

// Every page load chooses a message. Static hosting means no backend is needed.
renderMessage(chooseMessage());
