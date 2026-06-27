let map,
  control,
  distanceKm = 0,
  userLocation = null;

let userMarker, startMarker, endMarker;

const distModal = new bootstrap.Modal(document.getElementById("distanceModal"));

const loader = document.getElementById("loading");

// 🎨 custom icons
const userIcon = L.icon({
  iconUrl: "images/user.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const startIcon = L.icon({
  iconUrl: "images/start.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

const endIcon = L.icon({
  iconUrl: "images/end.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

// error UI
function showError(msg) {
  const err = document.getElementById("errorBox");
  err.innerText = msg;
  err.style.display = "block";

  setTimeout(() => {
    err.style.display = "none";
  }, 3000);
}

// init
function initApp() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;

        userLocation = {
          lat: userLat,
          lon: userLng,
        };

        setupMap(userLat, userLng, 15);

        // ✅ custom marker
        userMarker = L.marker([userLat, userLng], { icon: userIcon })
          .addTo(map)
          .bindPopup("Your current location!")
          .openPopup();

        document.getElementById("start").value = "My current location";
      },
      () => {
        showError("دسترسی به موقعیت داده نشد!");
        setupMap(34.52, 69.18, 13);
      },
    );
  } else {
    showError("مرورگر شما پشتیبانی نمی‌کند!");
    setupMap(34.52, 69.18, 13);
  }
}

// map
function setupMap(lat, lng, zoomLevel) {
  map = L.map("map").setView([lat, lng], zoomLevel);

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    {
      attribution: "&copy; OpenStreetMap &copy; CartoDB",
    },
  ).addTo(map);
}

initApp();

// fetch
async function searchLocation(query) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${query}`,
    {
      headers: {
        "User-Agent": "TaxiApp (example@email.com)",
      },
    },
  );

  const data = await res.json();

  if (data.length === 0) throw new Error("آدرس پیدا نشد!");

  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
  };
}

let timeout = null;

// 🚀 show route
document.getElementById("showRoute").addEventListener("click", async () => {
  const startLoc = document.getElementById("start").value.trim();
  const endLoc = document.getElementById("end").value.trim();

  if (!startLoc || !endLoc) {
    showError("مبدا و مقصد را وارد کنید!");
    return;
  }

  loader.style.display = "block";

  clearTimeout(timeout);

  timeout = setTimeout(async () => {
    try {
      let startPoint;

      if (startLoc === "My current location") {
        if (!userLocation) throw new Error("موقعیت آماده نیست!");
        startPoint = userLocation;
      } else {
        startPoint = await searchLocation(startLoc);
      }

      const endPoint = await searchLocation(endLoc);

      // حذف route قبلی
      if (control) map.removeControl(control);

      // حذف marker قبلی
      if (startMarker) map.removeLayer(startMarker);
      if (endMarker) map.removeLayer(endMarker);

      // ✅ اضافه کردن marker سفارشی
      startMarker = L.marker([startPoint.lat, startPoint.lon], {
        icon: startIcon,
      })
        .addTo(map)
        .bindPopup("Start");

      endMarker = L.marker([endPoint.lat, endPoint.lon], {
        icon: endIcon,
      })
        .addTo(map)
        .bindPopup("Destination");

      // route
      control = L.Routing.control({
        waypoints: [
          L.latLng(startPoint.lat, startPoint.lon),
          L.latLng(endPoint.lat, endPoint.lon),
        ],
        show: false,
        addWaypoints: false,
        createMarker: () => null, // ❌ حذف مارکرهای پیش‌فرض
        lineOptions: {
          styles: [{ color: "#3b82f6", weight: 6 }],
        },
      }).addTo(map);

      control.on("routesfound", (e) => {
        distanceKm = (e.routes[0].summary.totalDistance / 1000).toFixed(2);

        document.getElementById("distanceText").innerText = `${distanceKm} KM`;

        document.getElementById("confirm").disabled = false;

        distModal.show();
      });
    } catch (err) {
      showError(err.message);
    } finally {
      loader.style.display = "none";
    }
  }, 400);
});

// confirm
document.getElementById("confirm").addEventListener("click", () => {
  localStorage.setItem("distance", distanceKm);
  window.location.href = "taxi-type.html";
});
