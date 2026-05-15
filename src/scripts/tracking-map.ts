import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";

declare global {

  interface Window {

    openTrackingMap?: (
      lat: number,
      lng: number,
      label?: string
    ) => void;

    MAPBOX_TOKEN?: string;

  }

}

window.openTrackingMap = (

  lat,
  lng,
  label = "Pedido en ruta"

) => {

  const old =
    document.getElementById(
      "trackingMapModal"
    );

  if (old) {
    old.remove();
  }

  mapboxgl.accessToken =
    window.MAPBOX_TOKEN || "";

  const modal =
    document.createElement(
      "div"
    );

  modal.id =
    "trackingMapModal";

  modal.className = `
fixed inset-0 z-[99999]

flex items-center justify-center

bg-black/80 backdrop-blur-md

p-4
`;

  modal.innerHTML = `

<div
  class="
    relative

    w-full
    max-w-6xl

    overflow-hidden

    rounded-[2rem]

    border
    border-white/10

    bg-zinc-950
  "
>

  <!-- CLOSE -->

  <button
    id="closeTrackingMap"

    class="
      absolute
      right-5
      top-5
      z-20

      flex
      h-11
      w-11

      items-center
      justify-center

      rounded-2xl

      border
      border-white/10

      bg-black/40

      text-white/70

      transition

      hover:bg-white/10
      hover:text-white
    "
  >
    ✕
  </button>

  <!-- INFO -->

  <div
    class="
      absolute
      left-6
      top-6
      z-10

      rounded-2xl

      border
      border-white/10

      bg-black/50

      px-5
      py-4

      backdrop-blur-xl
    "
  >

    <p
      class="
        text-[10px]

        uppercase

        tracking-[0.24em]

        text-white/40
      "
    >
      Pedido en ruta
    </p>

    <p
      class="
        mt-2

        text-lg

        font-medium

        text-white
      "
    >
      🚚 ${label}
    </p>

  </div>

  <!-- MAP -->

  <div
    id="trackingMap"

    class="
      h-[78vh]
      w-full
    "
  ></div>

</div>

`;

  document.body.appendChild(
    modal
  );

  const map =
    new mapboxgl.Map({

      container:
        "trackingMap",

      style:
        "mapbox://styles/mapbox/dark-v11",

      center: [
        lng,
        lat
      ],

      zoom: 13.8,

      pitch: 58,

      bearing: -20,

      antialias: true

    });

  map.addControl(
    new mapboxgl.NavigationControl(),
    "bottom-right"
  );

  const marker =
    document.createElement(
      "div"
    );

  marker.className = `
h-5
w-5

rounded-full

bg-emerald-400

shadow-[0_0_0_10px_rgba(16,185,129,0.22)]

animate-pulse
`;

  new mapboxgl.Marker(marker)

    .setLngLat([
      lng,
      lat
    ])

    .addTo(map);

  function close() {

    map.remove();

    modal.remove();

  }

  modal
    .querySelector(
      "#closeTrackingMap"
    )
    ?.addEventListener(
      "click",
      close
    );

  modal.addEventListener(
    "click",
    (e) => {

      if (e.target === modal) {
        close();
      }

    }
  );

};