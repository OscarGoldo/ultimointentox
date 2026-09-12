import Reveal from "@/components/Reveal";

type SectionHeadingProps = {
  label: string;
  title: string;
  lead?: string;
  headingId?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
};

/**
 * Cabecera de sección. La etiqueta va en una píldora rosa pálido en lugar de
 * la barrita de color suelta: ancla el bloque sin añadir un elemento decorativo
 * que no significa nada.
 */
export default function SectionHeading({
  label,
  title,
  lead,
  headingId,
  align = "center",
  tone = "dark",
}: SectionHeadingProps) {
  const isLight = tone === "light";
  const centered = align === "center";

  return (
    <Reveal
      className={
        centered ? "mx-auto flex max-w-2xl flex-col items-center text-center" : "max-w-2xl"
      }
    >
      <span
        className={`eyebrow inline-flex rounded-full px-4 py-2 ${
          isLight ? "bg-white/15 text-on-dark" : "bg-blush text-magenta-deep"
        }`}
      >
        {label}
      </span>

      <h2
        id={headingId}
        className={`display mt-6 text-[2.125rem] sm:text-[2.75rem] lg:text-[3.25rem] ${
          isLight ? "text-on-dark" : ""
        }`}
      >
        {title}
      </h2>

      {lead && (
        <p
          className={`mt-5 text-[17px] leading-[1.7] ${
            isLight ? "text-on-dark-soft" : "text-plum-soft"
          }`}
        >
          {lead}
        </p>
      )}
    </Reveal>
  );
}
