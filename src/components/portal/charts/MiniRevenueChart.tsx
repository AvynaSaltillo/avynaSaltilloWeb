import {
  useEffect,
  useState
} from "react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip
} from "recharts";

type ChartData = {
  month: string;
  total: number;
};

export default function MiniRevenueChart() {

  const [data, setData] =
    useState<ChartData[]>([]);

  useEffect(() => {

    const loadAnalytics = () => {

      const analytics =
        (window as any)
          .portalAnalytics;

      if (
        analytics?.charts
          ?.salesByMonth
      ) {

        setData(
          analytics.charts
            .salesByMonth
        );

      }

    };

    loadAnalytics();

    window.addEventListener(
      "portal-analytics-ready",
      loadAnalytics
    );

    return () => {

      window.removeEventListener(
        "portal-analytics-ready",
        loadAnalytics
      );

    };

  }, []);

  if (!data.length) {

    return (

      <div className="mt-6 flex h-28 items-center justify-center text-xs text-white/35">
        Sin datos disponibles
      </div>

    );

  }

  return (

    <div className="mt-5 h-32 w-full min-w-0 overflow-hidden">

      <ResponsiveContainer
  width="99%"
  height="100%"
>

        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 0,
            left: 0,
            bottom: 0
          }}
        >

          <defs>

            <linearGradient
              id="revenueGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >

              <stop
                offset="0%"
                stopColor="rgba(255,255,255,0.32)"
              />

              <stop
                offset="100%"
                stopColor="rgba(255,255,255,0)"
              />

            </linearGradient>

          </defs>

          <Tooltip

          labelFormatter={() => ""}

            cursor={{
              stroke:
                "rgba(255,255,255,0.15)"
            }}

            contentStyle={{

              background:
                "rgba(10,10,10,0.96)",

              border:
                "1px solid rgba(255,255,255,0.08)",

              borderRadius: 20,

              color: "white",

              backdropFilter:
                "blur(12px)",

              boxShadow:
                "0 10px 40px rgba(0,0,0,0.45)"
            }}

            labelStyle={{
              color:
                "rgba(255,255,255,0.45)",

              marginBottom: 6,

              fontSize: 12
            }}

            formatter={(value: any) => [

              `$${Number(value)
                .toLocaleString("es-MX")}`,

              "Compras"

            ]}
          />

          <Area
            type="monotone"
            dataKey="total"
            stroke="rgba(255,255,255,0.92)"
            strokeWidth={2.5}
            fill="url(#revenueGradient)"
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>

  );

}