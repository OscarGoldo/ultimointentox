# Landing Page - Dra. Hilda Mary Díaz García

## Pasos para poner en marcha

### 1. Copiar las imágenes
Crea la carpeta `public/images/` y copia las fotos con estos nombres:
- `public/images/logo.png` → Logo (tarjeta de presentación / logotipo)
- `public/images/foto1.jpg` → Foto en uniforme azul marino (usada en Hero)
- `public/images/foto2.jpg` → Foto con copa menstrual (usada en About)
- `public/images/foto3.jpg` → Foto en rosado escribiendo (usada en About)
- `public/images/foto4.jpg` → Foto con paciente en silla de ruedas (usada en About)

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar en desarrollo
```bash
npm run dev
```
Abre http://localhost:3000

### 4. Construir para producción
```bash
npm run build
npm start
```

## Personalizar

### Cambiar número de WhatsApp
Edita `components/WhatsAppButton.tsx`, línea:
```
const WHATSAPP_NUMBER = "584120896444";
```

### Activar formulario de contacto real
El formulario actualmente simula el envío. Para integrarlo con un servicio real:
- **Formspree** (gratuito): Reemplaza el `await new Promise(...)` en `Contact.tsx` por un `fetch` a tu endpoint de Formspree.
- **EmailJS**: Integra emailjs-com.
- **API propia**: Crea `app/api/contact/route.ts` con Next.js Route Handler.

### Actualizar mapa de Google Maps
El iframe en `Contact.tsx` tiene un embed de Google Maps de Maturín. Para mayor precisión, busca "Clínica Tierra Santa Maturín" en Google Maps, haz clic en Compartir → Insertar mapa y reemplaza el src del iframe.

### Actualizar redes sociales
En `Footer.tsx` actualiza los href de Instagram y Facebook con los perfiles reales de la doctora.

## Deploy
Recomendado: **Vercel** (gratis para proyectos personales)
1. Sube el código a GitHub
2. Importa el repositorio en vercel.com
3. Deploy automático con cada push

## Estructura de archivos
```
├── app/
│   ├── layout.tsx        # Metadatos SEO, fuente Inter
│   ├── page.tsx          # Página principal (ensambla componentes)
│   └── globals.css       # Estilos base + Tailwind v4
├── components/
│   ├── Header.tsx        # Sticky header con menú móvil
│   ├── Hero.tsx          # Sección principal con CTA
│   ├── About.tsx         # Sobre la doctora + formación
│   ├── Services.tsx      # Grid de especialidades
│   ├── Contact.tsx       # Mapa + formulario validado
│   ├── FAQ.tsx           # Acordeón de preguntas frecuentes
│   ├── Footer.tsx        # Pie de página con CTA final
│   └── WhatsAppButton.tsx # Botón flotante WhatsApp
└── public/
    └── images/           # ← Coloca tus fotos aquí
```
