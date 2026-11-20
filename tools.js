const page = document.querySelector("[data-tool]");
const byId = id => document.getElementById(id);
const topic = byId("topic");

function element(tag, text) {
  const node = document.createElement(tag);
  node.textContent = text;
  return node;
}

const entries = notebooks.flatMap(notebook => notebook.questions.map(([question, answer]) => ({
  topic: notebook.title,
  question,
  answer
})));

if (topic) {
  notebooks.forEach(notebook => topic.add(new Option(notebook.title, notebook.title)));
}

function selectedEntries() {
  return entries.filter(entry => !topic.value || entry.topic === topic.value);
}

function showResults() {
  const search = byId("search").value.trim().toLowerCase();
  const matches = selectedEntries().filter(entry =>
    [entry.topic, entry.question, entry.answer].some(text => text.toLowerCase().includes(search))
  );
  byId("result-count").textContent = matches.length === 1 ? "1 question" : matches.length + " questions";
  byId("results").replaceChildren(...matches.map(entry => {
    const result = document.createElement("details");
    const summary = element("summary", entry.question);
    const label = element("p", entry.topic);
    label.className = "eyebrow";
    result.append(summary, label, element("p", entry.answer));
    return result;
  }));
}

if (page.dataset.tool === "library") {
  byId("search").addEventListener("input", showResults);
  topic.addEventListener("change", showResults);
  showResults();
}

if (page.dataset.tool === "flashcards") {
  let position = 0;
  const answer = byId("card-answer");
  const reveal = byId("reveal");

  function showCard() {
    const deck = selectedEntries();
    const entry = deck[position];
    byId("position").textContent = "Card " + (position + 1) + " of " + deck.length + " / " + entry.topic;
    byId("card-question").textContent = entry.question;
    answer.textContent = entry.answer;
    setReveal(false);
    byId("previous").disabled = position === 0;
    byId("next").disabled = position === deck.length - 1;
  }

  function setReveal(visible) {
    answer.hidden = !visible;
    reveal.textContent = visible ? "Hide answer" : "Reveal answer";
    reveal.setAttribute("aria-expanded", String(visible));
  }

  reveal.addEventListener("click", () => setReveal(answer.hidden));
  byId("previous").addEventListener("click", () => { position -= 1; showCard(); });
  byId("next").addEventListener("click", () => { position += 1; showCard(); });
  topic.addEventListener("change", () => { position = 0; showCard(); });
  showCard();
}

if (page.dataset.tool === "planner") {
  const choices = byId("choices");
  const list = byId("plan");
  const progress = byId("progress");

  notebooks.forEach((notebook, index) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = String(index);
    checkbox.checked = index === 0;
    label.append(checkbox, document.createTextNode(notebook.title));
    choices.append(label);
  });

  function showProgress() {
    progress.textContent = list.querySelectorAll(":checked").length + " of " + list.children.length + " tasks complete";
  }

  byId("planner").addEventListener("submit", event => {
    event.preventDefault();
    const selected = Array.from(choices.querySelectorAll(":checked"), checkbox => notebooks[Number(checkbox.value)]);
    const tasks = selected.flatMap(notebook => notebook.questions.map(([question]) => ({ title: notebook.title, question })));
    if (!tasks.length) {
      list.replaceChildren();
      progress.textContent = "Select at least one topic.";
      choices.querySelector("input").focus();
      return;
    }
    const minutes = Number(byId("minutes").value);
    const share = Math.floor(minutes / tasks.length);
    const remainder = minutes % tasks.length;
    list.replaceChildren(...tasks.map((task, index) => {
      const item = document.createElement("li");
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      label.append(checkbox, document.createTextNode((share + Number(index < remainder)) + " min · " + task.title + " — " + task.question));
      item.append(label);
      return item;
    }));
    showProgress();
  });
  list.addEventListener("change", showProgress);
}
