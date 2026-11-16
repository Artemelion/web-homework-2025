// вопросы, вместо правильных ответов хранится только хеш
const QUESTIONS = Object.freeze([
    {
        "text": "Для чего можно использовать JavaScript?",
        "options": [
            "Для создания самостоятельной исполняемой программы",
            "Для обработки событий на web-странице",
            "Для добавления динамики и 'интеллекта' в web-страницу",
            "Все варианты верны"
        ],
        "key": "e30sgm"
    },
    {
        "text": "Какие из перечисленных — примитивные типы JavaScript?",
        "options": [
            "string",
            "number",
            "array",
            "boolean"
        ],
        "key": "g2sc50"
    },
    {
        "text": "Что выведет typeof null?",
        "options": [
            "\"null\"",
            "\"object\"",
            "\"undefined\"",
            "\"number\""
        ],
        "key": "1nd9inu"
    },
    {
        "text": "Какие ключевые слова объявляют переменную?",
        "options": [
            "let",
            "var",
            "const",
            "def"
        ],
        "key": "1mslm9h"
    },
    {
        "text": "Чему равно выражение \"5\" + 3?",
        "options": [
            "8",
            "\"53\"",
            "NaN",
            "Ошибка"
        ],
        "key": "1nd9kcc"
    },
    {
        "text": "Какой метод добавляет элемент в конец массива?",
        "options": [
            "push()",
            "pop()",
            "shift()",
            "unshift()"
        ],
        "key": "1nd9l6k"
    },
    {
        "text": "Какой оператор сравнивает без приведения типов?",
        "options": [
            "==",
            "===",
            "=",
            "!=="
        ],
        "key": "e79au5"
    },
    {
        "text": "Как правильно подписаться на клик по элементу?",
        "options": [
            "el.addEventListener(\"click\", fn)",
            "el.onclick = fn",
            "el.click(fn)",
            "el.on(\"click\", fn)"
        ],
        "key": "e7yp23"
    },
    {
        "text": "Какой метод находит первый элемент по CSS-селектору?",
        "options": [
            "getElementsByClassName",
            "querySelector",
            "querySelectorAll",
            "getElementById"
        ],
        "key": "1nd9npc"
    },
    {
        "text": "Где хранятся данные, которые не пропадают после закрытия браузера?",
        "options": [
            "localStorage",
            "sessionStorage",
            "Обычная переменная",
            "cookie с датой истечения"
        ],
        "key": "e9dj6n"
    },
    {
        "text": "Что вернёт [1, 2, 3].map(x => x * 2)?",
        "options": [
            "[2, 4, 6]",
            "[1, 2, 3]",
            "12",
            "undefined"
        ],
        "key": "15bm4vc"
    },
    {
        "text": "Какие методы есть у объекта window (BOM)?",
        "options": [
            "alert()",
            "open()",
            "setTimeout()",
            "querySelector()"
        ],
        "key": "17e76xw"
    }
].map(Object.freeze));
