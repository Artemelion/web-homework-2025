// регулярки для каждого поля
const rules = {
    firstName: {
        regex: /^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ]+(['’-][A-Za-zА-Яа-яЁёІіЇїЄєҐґ]+)*$/,
        message: "Имя может содержать только буквы"
    },
    lastName: {
        regex: /^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ]+(['’-][A-Za-zА-Яа-яЁёІіЇїЄєҐґ]+)*$/,
        message: "Фамилия может содержать только буквы"
    },
    email: {
        regex: /^[\w.+-]+@[A-Za-z\d-]+(\.[A-Za-z\d-]+)*\.[A-Za-z]{2,}$/,
        message: "Введите email в формате example@gmail.com"
    },
    phone: {
        regex: /^0\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/,
        message: "Номер в формате 066 123 45 67"
    },
    address: {
        regex: /^г\.\s?[А-ЯЁІЇЄҐA-Z][\wА-Яа-яЁёІіЇїЄєҐґ\s'’-]*,\s?(ул|пр|просп|пер|бул)\.\s?[\wА-Яа-яЁёІіЇїЄєҐґ\s.'’-]+,\s?\d+[А-Яа-яA-Za-z]?(\/\d+)?$/,
        message: "Адрес в формате: г. Киев, ул. Киевская, 1"
    },
    birthDate: {
        regex: /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/,
        message: "Дата в формате ДД/ММ/ГГГГ, например 18/05/1997"
    }
};

const form = document.querySelector("#profileForm");
const success = document.querySelector("#success");

// проверка что такая дата реально есть
function isRealPastDate(value) {
    const [day, month, year] = value.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    return date.getDate() === day && date.getMonth() === month - 1 && date < new Date();
}

// проверка одного поля
function validateField(id) {
    const input = document.getElementById(id);
    const field = input.closest(".field");
    const value = input.value.trim();
    const { regex, message } = rules[id];

    let error = "";
    if (value === "") error = "Это поле обязательно";
    else if (!regex.test(value)) error = message;
    else if (id === "birthDate" && !isRealPastDate(value)) error = "Такой даты не существует";

    field.querySelector(".error").textContent = error;
    field.classList.toggle("invalid", error !== "");
    field.classList.toggle("valid", error === "");
    return error === "";
}

for (const id in rules) {
    const input = document.getElementById(id);
    input.addEventListener("blur", () => validateField(id));
    input.addEventListener("input", () => {
        if (input.closest(".field").classList.contains("invalid")) validateField(id);
    });
}

// при отправке проверяем все поля
form.addEventListener("submit", function (e) {
    e.preventDefault();

    let allValid = true;
    for (const id in rules) {
        if (!validateField(id)) allValid = false;
    }

    success.textContent = allValid ? "Все данные введены верно ✔" : "";
});
