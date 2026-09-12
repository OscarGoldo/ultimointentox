import Image from "next/image";

type WordmarkProps = {
  /** `light` para usarlo sobre la banda magenta. */
  tone?: "dark" | "light";
  /** Oculta el bloque de texto y deja solo el símbolo. */
  compact?: boolean;
  className?: string;
};

/**
 * Su logo real acompañado del nombre. El símbolo vive en /brand/mark.png,
 * recortado y con fondo transparente a partir del archivo original.
 */
export default function Wordmark({
  tone = "dark",
  compact = false,
  className = "",
}: WordmarkProps) {
  const isLight = tone === "light";

  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <span
        aria-hidden="true"
        className={`grid shrink-0 place-items-center ${
          isLight ? "h-12 w-12 rounded-full bg-white p-1.5 sm:h-[52px] sm:w-[52px]" : "h-11 w-11 sm:h-12 sm:w-12"
        }`}
      >
        <Image
          src="/brand/mark.png"
          alt=""
          width={512}
          height={512}
          className="h-full w-full object-contain"
          priority
        />
      </span>

      {!compact && (
        <span className="flex flex-col gap-1">
          <span
            className={`display-md text-[17px] leading-none sm:text-[18px] ${
              isLight ? "text-white" : ""
            }`}
          >
            Dra. Hilda Mary Díaz García
          </span>
          <span
            className={`eyebrow text-[9px] ${
              isLight ? "text-on-dark-soft" : "text-magenta"
            }`}
          >
            Ginecología · Obstetricia · Fertilidad
          </span>
        </span>
      )}
    </span>
  );
}
