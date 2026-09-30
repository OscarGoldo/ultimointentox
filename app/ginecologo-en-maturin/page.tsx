import { getPaginaLocal, metadataLocal } from "@/lib/paginas-locales";
import PaginaLocalView from "@/components/PaginaLocalView";

const pagina = getPaginaLocal("ginecologo-en-maturin");

export const metadata = metadataLocal(pagina);

export default function Page() {
  return <PaginaLocalView pagina={pagina} />;
}
