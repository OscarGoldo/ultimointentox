/**
 * La corona del óvulo del logo: trazos alargados alrededor de un círculo.
 * Se genera con una semilla fija para que el servidor y el navegador dibujen
 * exactamente lo mismo (si no, React avisa de un desajuste al hidratar).
 *
 * Coordenadas en el viewBox del óvulo: centro en (300, 300).
 */

export const CENTRO = 300;

type Petalo = {
  angulo: number;
  radio: number;
  largo: number;
  grosor: number;
  giro: number;
  opacidad: number;
  tono: string;
};

const TONOS = ["#c2185b", "#d63d78", "#e2709c", "#9c1049"];

function semilla(s: number) {
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r2 = (x: number) => Math.round(x * 100) / 100;

function crearCorona(
  n: number,
  radio: [number, number],
  largo: [number, number],
  grosor: [number, number],
  opacidad: [number, number],
  s: number
): Petalo[] {
  const azar = semilla(s);
  const entre = ([a, b]: [number, number]) => a + azar() * (b - a);
  return Array.from({ length: n }, (_, i) => ({
    angulo: r2((i / n) * 360 + (azar() - 0.5) * (360 / n) * 0.9),
    radio: r2(entre(radio)),
    largo: r2(entre(largo)),
    grosor: r2(entre(grosor)),
    giro: r2((azar() - 0.5) * 34),
    opacidad: r2(entre(opacidad)),
    tono: TONOS[Math.floor(azar() * TONOS.length)],
  }));
}

export const CORONA_INTERIOR = crearCorona(40, [226, 246], [16, 34], [3.5, 7], [0.5, 0.95], 7);
export const CORONA_EXTERIOR = crearCorona(30, [256, 286], [10, 26], [2.5, 5], [0.18, 0.55], 19);

export function Corona({
  petalos,
  animada = false,
}: {
  petalos: Petalo[];
  animada?: boolean;
}) {
  return (
    <>
      {petalos.map((p, i) => (
        <g key={i} transform={`rotate(${p.angulo} ${CENTRO} ${CENTRO})`}>
          <ellipse
            cx={CENTRO}
            cy={CENTRO - p.radio}
            rx={p.largo}
            ry={p.grosor}
            transform={`rotate(${p.giro} ${CENTRO} ${CENTRO - p.radio})`}
            fill={p.tono}
            className={animada ? "rd-petal" : undefined}
            style={
              animada
                ? ({ "--o": p.opacidad, "--d": `${i * 24}ms` } as React.CSSProperties)
                : { opacity: p.opacidad }
            }
          />
        </g>
      ))}
    </>
  );
}
