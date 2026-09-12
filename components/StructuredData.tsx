const SITE = "https://drahildadiaz.com";

/**
 * Datos estructurados schema.org del consultorio.
 *
 * Es lo que permite a Google entender que la web corresponde a un consultorio
 * médico real con dirección, teléfono y horario, y asociarla con su ficha de
 * Google Maps. No crea la ficha —eso se hace desde Google Business Profile—
 * pero sin esto Google tiene que adivinar los datos leyendo el texto.
 *
 * Solo se declara aquí información que ya aparece en la página. Nada de
 * valoraciones, número de pacientes ni coordenadas inventadas.
 */
const consultorio = {
  "@context": "https://schema.org",
  "@type": "Physician",
  "@id": `${SITE}/#consultorio`,
  name: "Dra. Hilda Mary Díaz García",
  alternateName: "Consultorio de la Dra. Hilda Díaz",
  description:
    "Consultorio de ginecología, obstetricia y fertilidad en Maturín, Monagas. Control prenatal, ecografía obstétrica, colposcopia, planificación familiar y tratamientos de reproducción asistida.",
  url: SITE,
  image: `${SITE}/opengraph-image`,
  logo: `${SITE}/icon.png`,
  telephone: "+58-412-089-6444",
  email: "dochildadiaz@gmail.com",
  taxID: "V-10353086-1",
  currenciesAccepted: "USD, VES",
  medicalSpecialty: ["Gynecologic", "Obstetric"],
  address: {
    "@type": "PostalAddress",
    name: "Clínica Tierra Santa, Piso 3, Consultorio 3",
    streetAddress: "Av. Fuerzas Armadas, Clínica Tierra Santa, Piso 3, Consultorio 3",
    addressLocality: "Maturín",
    addressRegion: "Monagas",
    postalCode: "6201",
    addressCountry: "VE",
  },
  areaServed: [
    { "@type": "City", name: "Maturín" },
    { "@type": "AdministrativeArea", name: "Monagas" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
  ],
  hasMap:
    "https://maps.google.com/?q=Clinica+Tierra+Santa+Maturin+Venezuela",
  sameAs: ["https://www.instagram.com/doc.hildadiaz/"],
  availableService: [
    { "@type": "MedicalProcedure", name: "Control prenatal" },
    { "@type": "MedicalProcedure", name: "Consulta de ginecología general" },
    { "@type": "MedicalProcedure", name: "Tratamiento de fertilidad y reproducción asistida" },
    { "@type": "MedicalTest", name: "Diagnóstico colposcópico" },
    { "@type": "MedicalProcedure", name: "Planificación familiar" },
    { "@type": "MedicalTest", name: "Ecografía obstétrica" },
    { "@type": "MedicalProcedure", name: "Manejo de menopausia y climaterio" },
    { "@type": "MedicalProcedure", name: "Procedimientos ginecológicos ambulatorios" },
  ],
  potentialAction: {
    "@type": "ReserveAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://ozmedical.app/reservar/hildadiaz",
      inLanguage: "es-VE",
      actionPlatform: [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform",
      ],
    },
    result: { "@type": "Reservation", name: "Cita médica" },
  },
};

/** Ficha profesional de la doctora, enlazada al consultorio. */
const profesional = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE}/#dra-hilda-diaz`,
  name: "Hilda Mary Díaz García",
  honorificPrefix: "Dra.",
  jobTitle: "Ginecóloga, Obstetra y Especialista en Fertilidad",
  url: SITE,
  worksFor: { "@id": `${SITE}/#consultorio` },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Universidad de Oriente (UDO)" },
    { "@type": "EducationalOrganization", name: "UNIFERTES — Clínica El Ávila" },
  ],
  memberOf: {
    "@type": "Organization",
    name: "Colegio de Médicos del estado Monagas",
    identifier: "1947",
  },
  knowsLanguage: "es",
  sameAs: ["https://www.instagram.com/doc.hildadiaz/"],
};

export default function StructuredData() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(consultorio) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profesional) }}
      />
    </>
  );
}
