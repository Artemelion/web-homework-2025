const SEATS_IN_WAGON = 28;

// направления и цены
const directions = [
    { id: 1, name: "Odessa - Lviv", price: 62 },
    { id: 2, name: "Kyiv - Odessa", price: 48 },
    { id: 3, name: "Kyiv - Lviv", price: 55 },
    { id: 4, name: "Kharkiv - Kyiv", price: 40 }
];

function dayFromToday(offset) {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().slice(0, 10);
}

// уже занятые места
const bookedSeats = [
    { directionId: 1, date: dayFromToday(0), seats: [3, 4, 9, 10, 17] },
    { directionId: 1, date: dayFromToday(1), seats: [1, 2, 5, 6, 7, 8, 21, 22] },
    { directionId: 2, date: dayFromToday(0), seats: [11, 12, 25, 26, 27, 28] },
    { directionId: 3, date: dayFromToday(2), seats: [1, 14, 15] }
];

let myTickets = [];

const STORAGE_KEY = "trainBooking";

// сохраняем в localStorage
function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ bookedSeats, myTickets }));
}

function load() {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) return;
    try {
        const data = JSON.parse(json);
        bookedSeats.splice(0, bookedSeats.length, ...data.bookedSeats);
        myTickets = data.myTickets;
    } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
    }
}

const directionSelect = document.querySelector("#direction");
const dateInput = document.querySelector("#date");
const seatsPanel = document.querySelector("#seatsPanel");
const seatsBox = document.querySelector("#seats");
const totalPrice = document.querySelector("#totalPrice");
const bookButton = document.querySelector("#bookButton");

let currentTrip = null;

function getBooked(directionId, date) {
    let record = bookedSeats.find(b => b.directionId === directionId && b.date === date);
    if (!record) {
        record = { directionId, date, seats: [] };
        bookedSeats.push(record);
    }
    return record;
}

function formatDate(iso) {
    return iso.split("-").reverse().join(".");
}

directions.forEach(d => directionSelect.add(new Option(d.name, d.id)));

const today = new Date().toISOString().slice(0, 10);
dateInput.min = today;
dateInput.value = today;

document.querySelector("#searchForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const direction = directions.find(d => d.id === Number(directionSelect.value));
    currentTrip = { direction, date: dateInput.value };
    renderSeats();
});

// рисуем места в вагоне
function renderSeats() {
    const booked = getBooked(currentTrip.direction.id, currentTrip.date).seats;

    document.querySelector("#trainInfo").textContent =
        `${currentTrip.direction.name}, ${formatDate(currentTrip.date)} — ${currentTrip.direction.price}$ per seat`;

    seatsBox.innerHTML = "";
    for (let seat = 1; seat <= SEATS_IN_WAGON; seat++) {
        const label = document.createElement("label");
        label.className = "seat";
        label.style.gridRow = seat % 2 ? 1 : 2;
        label.style.gridColumn = Math.ceil(seat / 2);

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = seat;
        checkbox.disabled = booked.includes(seat);

        label.append(checkbox, seat);
        seatsBox.append(label);
    }

    seatsPanel.hidden = false;
    updateTotal();
}

function getChosenSeats() {
    return [...seatsBox.querySelectorAll("input:checked")].map(c => Number(c.value));
}

function updateTotal() {
    const count = getChosenSeats().length;
    totalPrice.textContent = count * currentTrip.direction.price + "$";
    bookButton.disabled = count === 0;
}

seatsBox.addEventListener("change", updateTotal);

// бронирование
bookButton.addEventListener("click", function () {
    const chosen = getChosenSeats();
    const record = getBooked(currentTrip.direction.id, currentTrip.date);

    chosen.forEach(seat => {
        record.seats.push(seat);
        myTickets.push({
            direction: currentTrip.direction.name,
            directionId: currentTrip.direction.id,
            date: currentTrip.date,
            seat: seat
        });
    });

    save();
    renderSeats();
    renderTickets();
});

// мои билеты
function renderTickets() {
    const tbody = document.querySelector("#tickets");
    tbody.innerHTML = "";

    myTickets.forEach((ticket, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${ticket.direction.replace(" - ", "-")}</td>
            <td>${formatDate(ticket.date)}</td>
            <td>${ticket.seat}</td>
            <td><button class="cancel" data-index="${index}" title="Cancel">✕</button></td>`;
        tbody.append(tr);
    });

    document.querySelector("#noTickets").hidden = myTickets.length > 0;
}

document.querySelector("#tickets").addEventListener("click", function (e) {
    if (!e.target.classList.contains("cancel")) return;

    const ticket = myTickets[e.target.dataset.index];
    const record = getBooked(ticket.directionId, ticket.date);
    record.seats = record.seats.filter(s => s !== ticket.seat);
    myTickets.splice(e.target.dataset.index, 1);

    save();
    renderTickets();
    if (currentTrip) renderSeats();
});

load();
renderTickets();
