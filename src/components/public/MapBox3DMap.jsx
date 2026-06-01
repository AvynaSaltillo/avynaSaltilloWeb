// src/components/public/Mapbox3DMap.jsx

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function Mapbox3DMap({ salons = [] }) {
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const loadedRef = useRef(false);
  const boundsRef = useRef(null);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    mapboxgl.accessToken =
      import.meta.env.PUBLIC_MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: "mapbox3d",
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-100.9737, 25.4383],
      zoom: 11.8,
      pitch: 56,
      bearing: -18,
      antialias: true
    });

    mapRef.current = map;

    map.addControl(
      new mapboxgl.NavigationControl(),
      "bottom-right"
    );

map.on("load", () => {
  loadIcons();

  map.on("popupclose", () => {
    resetMap();
  });
});

    /* ===================== */
    /* ICONS */
    /* ===================== */

    function loadIcons() {
      map.loadImage(
        "/icons/pin-normal.png",
        (err, normalImg) => {
          if (err) {
            console.error(err);
            return;
          }

          map.loadImage(
            "/icons/pin-active.png",
            (err2, activeImg) => {
              if (err2) {
                console.error(err2);
                return;
              }

              if (!map.hasImage("pin-normal")) {
                map.addImage(
                  "pin-normal",
                  normalImg
                );
              }

              if (!map.hasImage("pin-active")) {
                map.addImage(
                  "pin-active",
                  activeImg
                );
              }

              buildMap();
            }
          );
        }
      );
    }

    /* ===================== */
    /* BUILD MAP */
    /* ===================== */

    function buildMap() {
      const geojson = {
        type: "FeatureCollection",
        features: salons.map(
          (salon) => ({
            type: "Feature",
            properties: {
              id: salon.id,
              name: salon.name,
              address:
                salon.address,
              active: false
            },
            geometry: {
              type: "Point",
              coordinates: [
                salon.lng,
                salon.lat
              ]
            }
          })
        )
      };

      map.addSource("salons", {
        type: "geojson",
        data: geojson
      });

      addBuildings();
      addPins();
      fitAllPins();
      bindClicks();
    }

    /* ===================== */
    /* BUILDINGS */
    /* ===================== */

    function addBuildings() {
      const layers =
        map.getStyle().layers;

      const labelLayerId =
        layers.find(
          (layer) =>
            layer.type ===
              "symbol" &&
            layer.layout[
              "text-field"
            ]
        )?.id;

      map.addLayer(
        {
          id: "3d-buildings",
          source: "composite",
          "source-layer":
            "building",
          filter: [
            "==",
            "extrude",
            "true"
          ],
          type:
            "fill-extrusion",
          minzoom: 14,
          paint: {
            "fill-extrusion-color":
              "#181818",
            "fill-extrusion-height":
              ["get", "height"],
            "fill-extrusion-base":
              [
                "get",
                "min_height"
              ],
            "fill-extrusion-opacity":
              0.82
          }
        },
        labelLayerId
      );
    }

    /* ===================== */
    /* PINS */
    /* ===================== */

    function addPins() {
      map.addLayer({
        id: "salon-pins",
        type: "symbol",
        source: "salons",
        layout: {
          "icon-image": [
            "case",
            [
              "boolean",
              [
                "get",
                "active"
              ],
              false
            ],
            "pin-active",
            "pin-normal"
          ],

"icon-size": [
  "interpolate",
  ["linear"],
  ["zoom"],
  10,
  [
    "case",
    ["boolean", ["get", "active"], false],
    0.10,
    0.07
  ],
  16,
  [
    "case",
    ["boolean", ["get", "active"], false],
    0.16,
    0.11
  ]
],

          "icon-anchor":
            "bottom",

          "icon-allow-overlap":
            true,

          "icon-ignore-placement":
            true
        }
      });
    }

    /* ===================== */
    /* FIT */
    /* ===================== */

    function fitAllPins() {
      const bounds =
        new mapboxgl.LngLatBounds();

      salons.forEach((s) =>
        bounds.extend([
          s.lng,
          s.lat
        ])
      );

      boundsRef.current =
        bounds;

      map.fitBounds(bounds, {
        padding: 70,
        pitch: 56,
        bearing: -18
      });
    }

    /* ===================== */
    /* DATA UPDATE */
    /* ===================== */

    function setActive(id) {
      const source =
        map.getSource(
          "salons"
        );

      if (!source) return;

      const data =
        source._data;

      data.features.forEach(
        (f) => {
          f.properties.active =
            Number(
              f.properties.id
            ) === id;
        }
      );

      source.setData(data);
    }

    /* ===================== */
    /* RESET */
    /* ===================== */

    function clearCards() {
      document
        .querySelectorAll(
          ".salon-card"
        )
        .forEach((el) =>
          el.classList.remove(
            "ring-2",
            "ring-white",
            "bg-white/8"
          )
        );
    }

    function highlightCard(id) {
      clearCards();

      const card =
        document.querySelector(
          `.salon-card[data-id="${id}"]`
        );

      if (!card) return;

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

    function resetMap() {
      setActive(-1);
      clearCards();

      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current =
          null;
      }

      if (boundsRef.current) {
        map.flyTo({
          center:
            boundsRef.current.getCenter(),
          zoom: 11.8,
          pitch: 56,
          bearing: -18,
          duration: 1300
        });
      }
    }

    /* ===================== */
    /* POPUP */
    /* ===================== */

function showPopup(salon) {
  if (popupRef.current) {
    popupRef.current.remove();
    popupRef.current = null;
  }

  const isSelect =
    salon.level === "select";

  const popup = new mapboxgl.Popup({
    offset: 22,
    closeButton: false,
    closeOnClick: false,
    className: "avyna-popup"
  });

  popup
    .setLngLat([salon.lng, salon.lat])
    .setHTML(`
      <div
        style="
          min-width:260px;
          padding:0;
          overflow:hidden;

          background:
            linear-gradient(
              180deg,
              rgba(17,17,17,.98),
              rgba(10,10,10,.98)
            );

          border:
            1px solid rgba(255,255,255,.08);

          border-radius:22px;

          box-shadow:
            0 20px 60px rgba(0,0,0,.45);

          color:white;

          backdrop-filter:blur(18px);
        "
      >
        <!-- TOP -->
        <div
          style="
            padding:18px 18px 14px 18px;
          "
        >
          <!-- BADGE -->
          <div
            style="
              display:inline-flex;
              align-items:center;
              gap:7px;

              padding:7px 11px;

              border-radius:999px;

              font-size:11px;
              font-weight:600;
              letter-spacing:.02em;

              ${
                isSelect
                  ? `
                    background:rgba(139,92,246,.12);
                    border:1px solid rgba(139,92,246,.22);
                    color:#d8b4fe;
                  `
                  : `
                    background:rgba(255,255,255,.06);
                    border:1px solid rgba(255,255,255,.08);
                    color:rgba(255,255,255,.72);
                  `
              }
            "
          >
            ${
              isSelect
                ? "✦ AVYNA Select"
                : "✧ AVYNA Partner"
            }
          </div>

          <!-- NAME -->
          <div
            style="
              margin-top:14px;

              font-size:19px;
              font-weight:700;

              line-height:1.15;

              color:white;
            "
          >
            ${salon.name}
          </div>

          ${
            salon.owner
              ? `
                <div
                  style="
                    margin-top:10px;

                    display:flex;
                    align-items:center;
                    gap:7px;

                    font-size:13px;

                    color:rgba(255,255,255,.52);
                  "
                >
                  Dirigido por ${salon.owner}
                </div>
              `
              : ""
          }

          <!-- ADDRESS -->
          <div
            style="
              margin-top:12px;

              font-size:13px;

              line-height:1.5;

              color:rgba(255,255,255,.68);
            "
          >
            ${salon.address}
          </div>

        </div>

        <!-- FOOTER -->
        <div
          style="
            display:flex;
            align-items:center;
            justify-content:space-between;

            gap:12px;

            padding:16px 18px;

            border-top:
              1px solid rgba(255,255,255,.06);

            background:
              linear-gradient(
                180deg,
                rgba(255,255,255,.02),
                rgba(255,255,255,.01)
              );
          "
        >
          <div
            style="
              font-size:11px;
              letter-spacing:.18em;
              text-transform:uppercase;

              color:rgba(255,255,255,.28);
            "
          >
            AVYNA Saltillo
          </div>

          ${
            salon.mapsUrl
              ? `
                <a
                  href="${salon.mapsUrl}"
                  target="_blank"

                  style="
                    display:inline-flex;
                    align-items:center;
                    justify-content:center;

                    gap:7px;

                    padding:10px 14px;

                    border-radius:999px;

                    background:linear-gradient(
  180deg,
  #ffffff,
  #f3f3f3
);

box-shadow:
  0 8px 30px rgba(255,255,255,.12);

                    color:black;

                    text-decoration:none;

                    font-size:12px;
                    font-weight:600;
                  "
                >
                  Abrir Maps
                </a>
              `
              : ""
          }
        </div>
      </div>
    `)
    .addTo(map);

  popupRef.current = popup;

  popupRef.current.once("close", () => {
    popupRef.current = null;
    resetMap();
  });
}



    /* ===================== */
    /* MAIN ACTION */
    /* ===================== */

    function activateSalon(
      id,
      zoom = false,
      popup = false
    ) {
      const salon =
        salons.find(
          (s) => s.id === id
        );

      if (!salon) return;

      setActive(id);
      highlightCard(id);

      if (zoom) {
        map.flyTo({
          center: [
            salon.lng,
            salon.lat
          ],
          zoom: 16,
          pitch: 72,
          bearing: -22,
          speed: 0.8,
          curve: 1.35
        });
      }

      if (popup) {
        showPopup(salon);
      }
    }

    /* ===================== */
    /* MAP CLICKS */
    /* ===================== */

    function bindClicks() {
      map.on(
        "click",
        "salon-pins",
        (e) => {
          const id =
            Number(
              e.features[0]
                .properties.id
            );

          activateSalon(
            id,
            true,
            true
          );
        }
      );

      map.on("click", (e) => {
  const features = map.queryRenderedFeatures(
    e.point,
    { layers: ["salon-pins"] }
  );

  if (!features.length && popupRef.current) {
    popupRef.current.remove();
  }
});

      map.on(
        "mouseenter",
        "salon-pins",
        () => {
          map.getCanvas().style.cursor =
            "pointer";
        }
      );

      map.on(
        "mouseleave",
        "salon-pins",
        () => {
          map.getCanvas().style.cursor =
            "";
        }
      );
    }

    /* ===================== */
    /* GLOBAL BUTTONS */
    /* ===================== */

    window.highlightSalon =
      (id) => {
        activateSalon(
          id,
          false,
          false
        );
      };

    window.focusSalon =
      (id) => {
        activateSalon(
          id,
          true,
          true
        );

        if (
          window.innerWidth <
          1024
        ) {
          const el =
            document.getElementById(
              "mapbox3d"
            );

          setTimeout(() => {
            const y =
              el.getBoundingClientRect()
                .top +
              window.pageYOffset -
              95;

            window.scrollTo({
              top: y,
              behavior:
                "smooth"
            });
          }, 250);
        }
      };
  }, [salons]);

  return (
  <div
    id="mapbox3d"
    className="rounded-[1.7rem] w-full h-full min-h-[720px] overflow-hidden"
  />
);
}