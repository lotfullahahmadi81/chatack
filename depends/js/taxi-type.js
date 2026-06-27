const distance = parseFloat(localStorage.getItem("distance")) || 0;
const start = localStorage.getItem("start");
const end = localStorage.getItem("end");
const modern = document.getElementById("modern");
const simple = document.getElementById("simole");
const riksha = document.getElementById("riksha");
const taxis = [
  { name: modern, rate: 15, img: "../../photos/12 (2).PNG" },
  { name: simple, rate: 10, img: "../../photos/12.PNG" },
  { name: riksha, rate: 5, img: "../../photos/14.jpg" },
];
const container = document.getElementById("taxiContainer");
taxis.forEach((t) => {
  const price = (distance * t.rate).toFixed(0);
  container.innerHTML += `
        <div class="col-md-4">
          <div class="card h-100">
            <img id="taxiImg" src="${t.img}" alt="${t.name}">
            <div class="card-body">
              <h4 class="card-title">${t.name}</h4>
              <p class="card-text btn-outline-custom1"> ${distance} KM </p>
              <p class="price btn-outline-custom1"> ${price} AFN</p>
              <button class="btn btn-outline-custom w-100 btn-select" onclick="selectTaxi('${t.name}', ${price})">
               Select taxi
              </button>
            </div>
          </div>
        </div>`;
});
function selectTaxi(type, price) {
  localStorage.setItem("taxiType", type);
  localStorage.setItem("taxiPrice", price);

  window.location.href = "radar.html";
}
