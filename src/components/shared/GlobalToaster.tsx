import { Toaster } from "sonner";

export default function GlobalToaster() {

  return (

    <Toaster

      position="top-right"

      richColors

      theme="dark"

      toastOptions={{

        style: {

          background:
            "rgba(10,10,10,0.96)",

          border:
            "1px solid rgba(255,255,255,0.08)",

          color: "white",

          borderRadius: "18px",

          backdropFilter:
            "blur(12px)"
        }

      }}

    />

  );

}