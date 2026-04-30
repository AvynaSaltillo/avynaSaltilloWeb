// src/components/public/LeafletMap.jsx

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function LeafletMap({ salons = [] }) {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const readyRef = useRef(false);
  const boundsRef = useRef(null);

  useEffect(() => {
    if (readyRef.current) return;
    readyRef.current = true;

    const map = L.map("leafletMap", {
      zoomControl: false,
      scrollWheelZoom: true
    }).setView([25.4383, -100.9737], 12);

    mapRef.current = map;

    L.control.zoom({
      position: "bottomright"
    }).addTo(map);

    /* TILE */
L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  {
    subdomains: "abcd",
    maxZoom: 20,
    attribution: "&copy; OpenStreetMap &copy; CARTO"
  }
).addTo(map);

    /* ICONS */
    const normalIcon = L.icon({
      iconUrl: "/icons/pin-normal.png",
      iconSize: [38, 52],
      iconAnchor: [19, 52],
      popupAnchor: [0, -46]
    });

    const activeIcon = L.icon({
      iconUrl: "/icons/pin-active.png",
      iconSize: [46, 62],
      iconAnchor: [23, 62],
      popupAnchor: [0, -56]
    });

    const bounds = [];

    salons.forEach((salon, i) => {
      const marker = L.marker(
        [salon.lat, salon.lng],
        { icon: normalIcon }
      ).addTo(map);

      marker.bindPopup(`
        <div style="min-width:190px">
          <div style="
            font-weight:700;
            font-size:15px;
            color:#111;
          ">
            ${salon.name}
          </div>

          <div style="
            margin-top:6px;
            font-size:13px;
            color:#555;
            line-height:1.45;
          ">
            ${salon.address}
          </div>
        </div>
      `);

      marker.on("click", () => {
        setActive(i, true, true);
      });

      marker.on("popupclose", () => {
        resetMap();
      });

      markersRef.current.push(marker);
      bounds.push([salon.lat, salon.lng]);
    });

    boundsRef.current = bounds;

    map.fitBounds(bounds, {
      padding: [50, 50]
    });

    /* RESET */
    function resetPins() {
      markersRef.current.forEach((m) =>
        m.setIcon(normalIcon)
      );
    }

    function resetCards() {
      document
        .querySelectorAll(".salon-card")
        .forEach((el) =>
          el.classList.remove(
            "ring-2",
            "ring-white",
            "bg-white/8"
          )
        );
    }

    function resetMap() {
      resetPins();
      resetCards();

      if (boundsRef.current?.length) {
        map.fitBounds(boundsRef.current, {
          padding: [50, 50]
        });
      }
    }

    /* ACTIVE */
    function setActive(
      index,
      zoom = false,
      popup = false
    ) {
      resetPins();
      resetCards();

      const marker =
        markersRef.current[index];

      const salon =
        salons[index];

      if (!marker || !salon) return;

      marker.setIcon(activeIcon);

      const card = document.querySelector(
        `.salon-card[data-id="${salon.id}"]`
      );

      if (card) {
        card.classList.add(
          "ring-2",
          "ring-white",
          "bg-white/8"
        );

        card.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });
      }

      if (zoom) {
        map.flyTo(
          [salon.lat, salon.lng],
          16,
          { duration: 1.2 }
        );
      }

      if (popup) {
        marker.openPopup();
      }
    }

    /* CARD CLICK = SOLO RESALTAR */
    window.highlightSalon = (id) => {
      const index =
        salons.findIndex(
          (s) => s.id === id
        );

      if (index >= 0) {
        setActive(index, false, false);
      }
    };

    /* BUTTON MAP */
    window.focusSalon = (id) => {
      const index =
        salons.findIndex(
          (s) => s.id === id
        );

      if (index < 0) return;

      setActive(index, true, true);

      /* MOBILE AUTO SCROLL */
      if (window.innerWidth < 1024) {
        const mapEl =
          document.getElementById(
            "leafletMap"
          );

        setTimeout(() => {
  const y =
    mapEl.getBoundingClientRect().top +
    window.pageYOffset -
    90;

  window.scrollTo({
    top: y,
    behavior: "smooth"
  });
}, 350);
      }
    };

    /* CLICK GENERAL CARDS */
    setTimeout(() => {
      document
        .querySelectorAll(".salon-card")
        .forEach((card) => {
          card.addEventListener(
            "click",
            (e) => {
              if (
                e.target.closest(".go-map") ||
                e.target.closest("a")
              ) return;

              const id = Number(
                card.dataset.id
              );

              window.highlightSalon(id);
            }
          );
        });

      map.invalidateSize();
    }, 350);

  }, [salons]);

  return (
    <div
      id="leafletMap"
      className="h-155 w-full min-h-155"
    />
  );
}