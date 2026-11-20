const get = id => document.getElementById(id);
const historyByTopic = notebooks.map(topic => [topic.questions[0]]);
let active = 0;

function makeButton(label, action) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", action);
  return button;
}

async function copyAnswer(answer, paragraph) {
  try {
    await navigator.clipboard.writeText(answer);
    get("status").textContent = "Answer copied.";
  } catch {
    const range = document.createRange();
    range.selectNodeContents(paragraph);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    get("status").textContent = "Answer selected. Use your device’s Copy command.";
  }
}

function renderCard([question, answer]) {
  const card = document.createElement("article");
  const heading = document.createElement("h2");
  heading.textContent = question;
  const body = document.createElement("p");
  body.textContent = answer;
  const copy = makeButton("Copy answer", () => copyAnswer(answer, body));
  copy.className = "copy";
  card.append(heading, body, copy);
  return card;
}

function openNotebook(index) {
  active = index;
  const topic = notebooks[index];
  get("title").textContent = topic.title;
  get("intro").textContent = topic.intro;
  get("thread").replaceChildren(...historyByTopic[index].map(renderCard));
  get("question").value = "";
  get("status").textContent = "";
  Array.from(get("notebooks").children).forEach((button, i) => {
    if (i === index) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  get("suggestions").replaceChildren(...topic.questions.map(([question]) =>
    makeButton(question, () => {
      get("question").value = question;
      get("question").focus();
    })
  ));
}

function normalize(value) {
  return value.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
}

get("composer").addEventListener("submit", event => {
  event.preventDefault();
  const question = get("question").value.trim();
  if (!question) {
    get("question").focus();
    return;
  }
  const match = notebooks[active].questions.find(([label]) => normalize(label) === normalize(question));
  const answer = match ? match[1] : "This offline demo has prepared answers for the suggestions below. Select one, then choose Ask.";
  const entry = [question, answer];
  historyByTopic[active].push(entry);
  get("thread").append(renderCard(entry));
  get("question").value = "";
  get("status").textContent = "";
  get("question").focus();
});

notebooks.forEach((topic, index) => {
  get("notebooks").append(makeButton(topic.title, () => openNotebook(index)));
});
openNotebook(0);
