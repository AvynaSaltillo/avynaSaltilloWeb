import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip
} from "recharts";

type Props = {
  data?: {
    month: string;
    total: number;
  }[];
};

export default function DashboardRevenue({
  data = []
}: Props) {

  return (

    <section
      className="
        group relative overflow-hidden

        rounded-[2.2rem]

        border border-white/10

        bg-gradient-to-br
        from-white/[0.07]
        via-white/[0.03]
        to-black

        p-6 sm:p-7
      "
    >

      {/* TOP LINE */}
      <div
        className="
          absolute left-0 top-0 h-px w-full

          bg-gradient-to-r
          from-white/50
          via-white/10
          to-transparent
        "
      />

      {/* GLOWS */}
      <div
        className="
          absolute -right-20 top-0

          h-72 w-72

          rounded-full

          bg-white/[0.04]

          blur-3xl
        "
      />

      <div
        className="
          absolute bottom-0 left-0

          h-64 w-64

          rounded-full

          bg-white/[0.025]

          blur-3xl
        "
      />

      {/* HEADER */}
      <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">

        {/* LEFT */}
        <div>

          {/* BADGE */}
          <div
            className="
              inline-flex items-center gap-2

              rounded-full

              border border-white/10

              bg-white/[0.04]

              px-4 py-2

              text-[11px]
              uppercase
              tracking-[0.32em]

              text-white/45

              backdrop-blur-xl
            "
          >

            <div
              className="
                h-2 w-2 rounded-full

                bg-emerald-400

                shadow-[0_0_20px_rgba(74,222,128,0.8)]
              "
            />

            Revenue Analytics

          </div>

          {/* TITLE */}
          <h3
            className="
              mt-5

              text-3xl
              font-semibold
              tracking-tight

              sm:text-4xl
            "
          >
            Ventas e ingresos
          </h3>

          <p className="mt-4 max-w-xl text-sm leading-7 text-white/45">

            Seguimiento visual de ventas, comportamiento comercial
            y crecimiento operativo del periodo seleccionado.

          </p>

        </div>

        {/* RIGHT */}
        <div className="flex flex-wrap gap-3">

          {/* LIVE */}
          <div
            className="
              inline-flex items-center gap-2

              rounded-2xl

              border border-emerald-500/15

              bg-emerald-500/10

              px-4 py-3

              text-sm
              font-medium

              text-emerald-300
            "
          >

            <div
              className="
                h-2 w-2 rounded-full

                bg-emerald-400

                animate-pulse
              "
            />

            Live

          </div>

          {/* GROWTH */}
          <div
            className="
              rounded-2xl

              border border-white/10

              bg-white/[0.04]

              px-4 py-3
            "
          >

            <p className="text-[10px] uppercase tracking-[0.28em] text-white/30">
              Growth
            </p>

            <p className="mt-1 text-lg font-semibold">
              +18%
            </p>

          </div>

        </div>

      </div>

      {/* KPI STRIP */}
      <div
        className="
          relative z-10

          mt-8

          grid gap-4

          sm:grid-cols-3
        "
      >

        {/* SALES */}
        <div
          className="
            rounded-[1.75rem]

            border border-white/10

            bg-black/25

            p-5

            backdrop-blur-xl
          "
        >

          <p className="text-[10px] uppercase tracking-[0.28em] text-white/30">
            Ventas
          </p>

          <p className="mt-3 text-3xl font-semibold">
            $0.00
          </p>

          <p className="mt-2 text-xs text-emerald-300">
            +12% vs anterior
          </p>

        </div>

        {/* ORDERS */}
        <div
          className="
            rounded-[1.75rem]

            border border-white/10

            bg-black/25

            p-5

            backdrop-blur-xl
          "
        >

          <p className="text-[10px] uppercase tracking-[0.28em] text-white/30">
            Pedidos
          </p>

          <p className="mt-3 text-3xl font-semibold">
            0
          </p>

          <p className="mt-2 text-xs text-white/35">
            Actividad comercial
          </p>

        </div>

        {/* TICKET */}
        <div
          className="
            rounded-[1.75rem]

            border border-white/10

            bg-black/25

            p-5

            backdrop-blur-xl
          "
        >

          <p className="text-[10px] uppercase tracking-[0.28em] text-white/30">
            Ticket promedio
          </p>

          <p className="mt-3 text-3xl font-semibold">
            $0.00
          </p>

          <p className="mt-2 text-xs text-white/35">
            Promedio por operación
          </p>

        </div>

      </div>

      {/* CHART */}
      <div
        className="
          relative z-10

          mt-8

          overflow-hidden

          rounded-[2rem]

          border border-white/10

          bg-gradient-to-b
          from-black/40
          to-black/20

          p-4
        "
      >

        {/* INNER GLOW */}
        <div
          className="
            absolute inset-0

            bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_65%)]
          "
        />

        {/* GRID */}
        <div
          className="
            absolute inset-0 opacity-[0.04]

            [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)]

            [background-size:42px_42px]
          "
        />

        {/* CHART */}
        <div className="relative z-10 h-[360px] w-full">

          <ResponsiveContainer>

            <AreaChart data={data}>

              <defs>

                <linearGradient
                  id="fill"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >

                  <stop
                    offset="0%"
                    stopColor="white"
                    stopOpacity={0.3}
                  />

                  <stop
                    offset="100%"
                    stopColor="white"
                    stopOpacity={0}
                  />

                </linearGradient>

              </defs>

              <XAxis
                dataKey="month"
                stroke="rgba(255,255,255,.3)"
                tickLine={false}
                axisLine={false}
              />

              <Tooltip
                contentStyle={{
                  background: "#090909",
                  border: "1px solid rgba(255,255,255,.08)",
                  borderRadius: 18,
                  color: "white"
                }}
              />

              <Area
                type="monotone"
                dataKey="total"
                stroke="white"
                strokeWidth={3}
                fill="url(#fill)"
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>

      </div>

    </section>

  );

}