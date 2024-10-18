import { personIcon } from "./constants.js";
import ui from "./ui.js";
import getIcon, { getStatus } from "./helpers.js";

let map;
let clickedCoords;
let layer;
let notes = JSON.parse(localStorage.getItem("notes")) || [];

// Kullanıcının mevcut konumunu al
window.navigator.geolocation.getCurrentPosition(
    (e) => {
        loadMap([e.coords.latitude, e.coords.longitude], "Current Location");
    },
    () => {
        loadMap([59.919490351970495, 10.714284212349943], "Default Location");
    }
);

function loadMap(currentPosition, msg) {
    map = L.map('map').setView(currentPosition, 10);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    layer = L.layerGroup().addTo(map);
    L.marker(currentPosition, { icon: personIcon }).addTo(map).bindPopup(msg);

    map.on("click", onMapClick);
    renderNotes();
    renderMarkers();
}

function onMapClick(e) {
    clickedCoords = [e.latlng.lat, e.latlng.lng];
    ui.aside.className = "add"; // Yan paneli aç
}

ui.cancelBtn.addEventListener('click', () => {
    ui.aside.className = ""; // Yan paneli kapat
});

// Form gönderme işlemi
ui.form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = e.target[0].value;
    const date = e.target[1].value;
    const status = e.target[2].value;

    if (!clickedCoords) {
        alert("Please select a location on the map.");
        return;
    }

    const newNote = { id: Date.now(), title, date, status, coords: clickedCoords }; // `Date.now()` kullanarak id oluştur

    notes.unshift(newNote);
    localStorage.setItem("notes", JSON.stringify(notes));

    e.target.reset();
    renderNotes();
    renderMarkers();
    ui.aside.className = ""; // Yan paneli kapat
});

function renderNotes() {
    const noteCards = notes.map((item) => {
        const status = getStatus(item.status);

        return `
        <li data-id="${item.id}">
            <div>
                <p>${item.title}</p>
                <p>${new Date(item.date).toLocaleString("en", {
            day: "2-digit",
            month: "short",
            year: "2-digit"
        })}</p>
                <p>${status}</p>
            </div>
            <div class="icons">
                <i data-id="${item.id}" class="bi bi-airplane-fill" id="fly"></i>
                <i data-id="${item.id}" class="bi bi-trash3-fill" id="delete"></i>
            </div>
        </li>`;
    }).join("");

    ui.list.innerHTML = noteCards;

    // Silme butonlarına event listener ekleme
    document.querySelectorAll("li #delete").forEach((btn) => {
        btn.addEventListener('click', () => deleteNote(btn.dataset.id));
    });

    // Uçuş butonlarına event listener ekleme
    document.querySelectorAll("li #fly").forEach((btn) => {
        btn.addEventListener('click', () => flytoLocation(btn.dataset.id));
    });
}

function renderMarkers() {
    layer.clearLayers();

    notes.forEach((item) => {
        const icon = getIcon(item.status);
        L.marker(item.coords, { icon })
            .addTo(layer)
            .bindPopup(item.title);
    });
}

// Silme işlemi
function deleteNote(id) {
    const res = confirm("Are you sure?");
    if (res) {
        notes = notes.filter((note) => note.id !== +id);
        localStorage.setItem("notes", JSON.stringify(notes));
        renderNotes();
        renderMarkers();
    }
}

// Uçuş
function flytoLocation(id) {
    const note = notes.find((note) => note.id === +id);
    map.flyTo(note.coords, 12)
}


ui.arrow.addEventListener("click", () => {
    ui.aside.classList.toggle("hide");
})