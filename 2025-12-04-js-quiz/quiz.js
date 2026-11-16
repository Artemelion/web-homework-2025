// весь код внутри функции, чтобы из консоли нельзя было поменять счёт
(function () {
    "use strict";

    const SALT = "kn-p-241";
    const SECONDS = 10;
    const STATE_KEY = "jsQuiz.state";
    const HISTORY_KEY = "jsQuiz.history";
    const RESULT_KEY = "jsQuiz.lastResult";

    const $ = selector => document.querySelector(selector);
    const startScreen = $("#startScreen");
    const questionScreen = $("#questionScreen");
    const finishScreen = $("#finishScreen");

    let state = null;
    let timerId = null;

    // хеш для проверки ответов
    function hash(str) {
        let h = 5381;
        for (const ch of str) h = ((h << 5) + h + ch.charCodeAt(0)) >>> 0;
        return h.toString(36);
    }

    function sign(data) {
        return hash(SALT + JSON.stringify(data));
    }

    // сохраняем прогресс в localStorage
    function saveState() {
        localStorage.setItem(STATE_KEY, JSON.stringify({ data: state, sign: sign(state) }));
    }

    function loadState() {
        try {
            const saved = JSON.parse(localStorage.getItem(STATE_KEY));
            if (saved && saved.sign === sign(saved.data)) return saved.data;
        } catch (e) { }
        localStorage.removeItem(STATE_KEY);
        return null;
    }

    function getHistory() {
        try {
            return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
        } catch (e) {
            return [];
        }
    }

    function renderHistory() {
        const history = getHistory();
        $("#historyBlock").hidden = history.length === 0;
        $("#historyList").innerHTML = "";
        history.slice(-5).reverse().forEach(item => {
            const li = document.createElement("li");
            li.textContent = `${item.name} — ${item.percent}% (${item.date})`;
            $("#historyList").append(li);
        });
    }

    function show(screen) {
        [startScreen, questionScreen, finishScreen].forEach(s => s.hidden = s !== screen);
    }

    function showQuestion() {
        const q = QUESTIONS[state.index];
        $("#questionTitle").textContent = `Вопрос №${state.index + 1} из ${QUESTIONS.length}`;
        $("#questionText").textContent = q.text;
        $("#progressBar").style.width = (state.index / QUESTIONS.length * 100) + "%";

        const options = $("#options");
        options.innerHTML = "";
        q.options.forEach((text, i) => {
            const label = document.createElement("label");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = i;
            label.append(checkbox, " " + text);
            options.append(label);
        });

        show(questionScreen);
        startTimer();
    }

    // таймер на вопрос
    function startTimer() {
        clearInterval(timerId);
        const tick = () => {
            const left = Math.max(0, Math.ceil((state.deadline - Date.now()) / 1000));
            $("#timer").textContent = left;
            $("#timer").classList.toggle("danger", left <= 3);
            if (left === 0) answer(true);
        };
        tick();
        timerId = setInterval(tick, 250);
    }

    // проверка ответа
    function answer(timeIsOver) {
        clearInterval(timerId);

        if (!timeIsOver) {
            const chosen = [...$("#options").querySelectorAll("input:checked")].map(c => c.value).sort();
            if (hash(`${SALT}|${state.index}|${chosen.join(",")}`) === QUESTIONS[state.index].key) {
                state.score++;
            }
        }

        state.index++;
        state.deadline = Date.now() + SECONDS * 1000;
        saveState();

        if (state.index < QUESTIONS.length) showQuestion();
        else finish();
    }

    // конец теста
    function finish() {
        const percent = Math.round(state.score / QUESTIONS.length * 100);
        const result = {
            name: state.name,
            score: state.score,
            total: QUESTIONS.length,
            percent: percent,
            date: new Date().toLocaleString("ru-RU")
        };

        const history = getHistory();
        history.push(result);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        localStorage.setItem(RESULT_KEY, JSON.stringify(result));
        localStorage.removeItem(STATE_KEY);
        state = null;

        $("#progressBar").style.width = "100%";
        $("#finishText").textContent = `${result.name}, ваш результат: ${result.score} из ${result.total} (${percent}%).`;
        show(finishScreen);
        renderHistory();

        if (!openResultWindow()) {
            alert(`Поздравляем, ${result.name}! Тест сдан на ${result.score} баллов (${percent}%).`);
        }
    }

    function openResultWindow() {
        const win = window.open("result.html", "quizResult", "width=460,height=420");
        if (win) win.focus();
        return Boolean(win);
    }

    startScreen.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = $("#userName").value.trim();
        if (!name) return;

        state = { name: name, index: 0, score: 0, deadline: Date.now() + SECONDS * 1000 };
        saveState();
        showQuestion();
    });

    questionScreen.addEventListener("submit", function (e) {
        e.preventDefault();
        answer(false);
    });

    $("#openResult").addEventListener("click", openResultWindow);

    $("#restart").addEventListener("click", function () {
        $("#userName").value = "";
        show(startScreen);
    });

    // если тест не закончен - продолжаем с того же вопроса
    state = loadState();
    renderHistory();
    if (state && state.index < QUESTIONS.length) showQuestion();
    else show(startScreen);
})();
