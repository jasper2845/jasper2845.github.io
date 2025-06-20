
document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Search submitted!");
});
 
    const departureInput = document.getElementById("departure-date");
    const returnInput = document.getElementById("return-date");

    const today = new Date();
    const returnDate = new Date();
    returnDate.setDate(today.getDate() + 7);

    const formatDate = date => date.toISOString().split("T")[0];

    departureInput.value = formatDate(today);
    returnInput.value = formatDate(returnDate);

    const countries = [
      "Kolkata", "London", "New York", "Tokyo", "Paris", "Sydney", "Dubai",
      "Toronto", "Berlin", "Rome", "Bangkok", "Istanbul", "Singapore", "Barcelona",
      "Amsterdam", "Chicago", "Seoul", "Los Angeles", "Mumbai", "Cape Town"
    ];

    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    document.getElementById("destination").value = randomCountry;

    document.addEventListener("DOMContentLoaded", function() {
  const originInput = document.getElementById("origin");

  if (!navigator.geolocation) {
    originInput.value = "Geolocation unsupported";
    return;
  }

  navigator.geolocation.getCurrentPosition(async ({ coords }) => {
    const { latitude, longitude } = coords;

    try {
      // Query Overpass API for major airports nearby (within ~100km) filtered by IATA code
      const query = `
        [out:json][timeout:25];
        (
          node["aeroway"="aerodrome"]["iata"](around:100000,${latitude},${longitude});
          way["aeroway"="aerodrome"]["iata"](around:100000,${latitude},${longitude});
          relation["aeroway"="aerodrome"]["iata"](around:100000,${latitude},${longitude});
        );
        out center tags;
      `;

      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query
      });
      const data = await response.json();

      if (data.elements && data.elements.length > 0) {
        // Sort by proximity
        data.elements.sort((a, b) => {
          const adist = Math.hypot((a.lat || a.center.lat) - latitude, (a.lon || a.center.lon) - longitude);
          const bdist = Math.hypot((b.lat || b.center.lat) - latitude, (b.lon || b.center.lon) - longitude);
          return adist - bdist;
        });

        const nearest = data.elements[0];
        const name = nearest.tags.name || nearest.tags["icao"] || nearest.tags["iata"] || "Unknown airport";
        originInput.value = name;
      } else {
        originInput.value = "No airport nearby";
      }

    } catch (err) {
      console.error(err);
      originInput.value = "Airport lookup error";
    }

  }, () => {
    originInput.value = "Location blocked";
  });
});
  
document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("flights-container");
  if (!container) return;

  const cities = ["London", "Paris", "New York", "Tokyo", "Dubai", "Berlin", "Rome", "Seoul", "Toronto", "Mumbai", "Bangkok", "Amsterdam", "Chicago", "Istanbul", "Singapore", "Sydney", "Los Angeles", "San Francisco", "Doha", "Zurich"];
  const statuses = ["On Time", "Delayed", "Cancelled"];
  const flights = [];

  for (let i = 0; i < 100; i++) {
    let from = cities[Math.floor(Math.random() * cities.length)];
    let to;
    do {
      to = cities[Math.floor(Math.random() * cities.length)];
    } while (to === from);

    const departHour = Math.floor(Math.random() * 24);
    const departMin = Math.floor(Math.random() * 60);
    const duration = Math.floor(Math.random() * 6) + 1;
    const arriveHour = (departHour + duration) % 24;
    const arriveMin = (departMin + Math.floor(Math.random() * 60)) % 60;

    const pad = n => n.toString().padStart(2, '0');

    flights.push({
      from,
      to,
      depart: `${pad(departHour)}:${pad(departMin)}`,
      arrive: `${pad(arriveHour)}:${pad(arriveMin)}`,
      status: statuses[Math.floor(Math.random() * statuses.length)]
    });
  }

  const shuffled = flights.sort(() => 0.5 - Math.random()).slice(0, 5);

  shuffled.forEach(flight => {
    const div = document.createElement("div");
    div.style.padding = "1rem";
    div.style.border = "1px solid #ccc";
    div.style.borderRadius = "5px";
    div.innerHTML = `
      <strong>${flight.from} → ${flight.to}</strong><br />
      Departure: ${flight.depart} | Arrival: ${flight.arrive} <br />
      Status: <span style="color: ${flight.status === 'On Time' ? 'green' : (flight.status === 'Delayed' ? 'orange' : 'red')}">${flight.status}</span>
    `;
    container.appendChild(div);
  });
});
