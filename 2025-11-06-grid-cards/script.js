// считаем высоту каждой карточки и растягиваем её на нужное кол-во строк
function layout() {
    const grid = document.querySelector(".grid");
    const rowHeight = parseInt(getComputedStyle(grid).gridAutoRows);

    document.querySelectorAll(".card").forEach(card => {
        card.style.gridRowEnd = "auto";
        const height = card.getBoundingClientRect().height + parseInt(getComputedStyle(card).marginBottom);
        card.style.gridRowEnd = "span " + Math.ceil(height / rowHeight);
    });
}

window.addEventListener("load", layout);
window.addEventListener("resize", layout);
