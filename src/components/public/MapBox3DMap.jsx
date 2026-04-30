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

  const popup = new mapboxgl.Popup({
    offset: 18,
    closeOnClick: false
  });

  popup
    .setLngLat([salon.lng, salon.lat])
    .setHTML(`
      <div style="min-width:210px">
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
      className="h-155 w-full min-h-155 rounded-[1.7rem] overflow-hidden"
    />
  );
}