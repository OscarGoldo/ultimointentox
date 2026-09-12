import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const alt =
  "Dra. Hilda Mary Díaz García — Ginecología, Obstetricia y Fertilidad en Maturín, Venezuela";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const dir = join(process.cwd(), "app", "_og");
const file = (n: string) => readFileSync(join(dir, n));
const dataUrl = (n: string, mime: string) =>
  `data:${mime};base64,${file(n).toString("base64")}`;

/**
 * Tarjeta que se ve al compartir el enlace en WhatsApp, Instagram, Facebook o
 * al pegarlo en cualquier chat: el logo de la doctora y su retrato.
 * Se genera en build; las tipografías viven en el repo, sin llamadas de red.
 */
export default async function Image() {
  const retrato = dataUrl("retrato.jpg", "image/jpeg");
  const marca = dataUrl("marca.png", "image/png");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#FDF7F4",
          fontFamily: "Figtree",
        }}
      >
        {/* Panel de marca */}
        <div
          style={{
            width: 700,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 64px",
            position: "relative",
          }}
        >
          {/* Velo rosa de fondo */}
          <div
            style={{
              position: "absolute",
              top: -160,
              left: -200,
              width: 620,
              height: 620,
              borderRadius: 620,
              backgroundColor: "#FBEDF0",
            }}
          />

          <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={marca} width={108} height={108} alt="" />

            <div
              style={{
                display: "flex",
                fontFamily: "Cormorant",
                fontSize: 78,
                lineHeight: 1.02,
                color: "#332229",
                marginTop: 30,
                letterSpacing: -1,
              }}
            >
              Dra. Hilda Mary
            </div>
            <div
              style={{
                display: "flex",
                fontFamily: "Cormorant",
                fontSize: 78,
                lineHeight: 1.02,
                color: "#332229",
                letterSpacing: -1,
              }}
            >
              Díaz García
            </div>

            <div
              style={{
                display: "flex",
                width: 88,
                height: 4,
                backgroundColor: "#C2185B",
                borderRadius: 4,
                marginTop: 30,
              }}
            />

            <div
              style={{
                display: "flex",
                fontSize: 21,
                fontWeight: 700,
                color: "#C2185B",
                marginTop: 28,
                letterSpacing: 1.4,
                whiteSpace: "nowrap",
              }}
            >
              GINECOLOGÍA · OBSTETRICIA · FERTILIDAD
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 25,
                fontWeight: 500,
                color: "#5F4A52",
                marginTop: 16,
              }}
            >
              Clínica Tierra Santa · Maturín, Venezuela
            </div>
          </div>
        </div>

        {/* Retrato */}
        <div
          style={{
            display: "flex",
            width: 500,
            height: "100%",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={retrato}
            width={500}
            height={630}
            alt=""
            style={{ objectFit: "cover", objectPosition: "50% 18%" }}
          />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Cormorant",
          data: file("CormorantGaramond-SemiBold.ttf"),
          weight: 600,
          style: "normal",
        },
        {
          name: "Figtree",
          data: file("Figtree-Medium.ttf"),
          weight: 500,
          style: "normal",
        },
        {
          name: "Figtree",
          data: file("Figtree-Bold.ttf"),
          weight: 700,
          style: "normal",
        },
      ],
    }
  );
}
