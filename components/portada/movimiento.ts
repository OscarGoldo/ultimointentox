/**
 * ¿Hay que reducir el movimiento? Respeta la preferencia del sistema, salvo
 * que la página se haya abierto con ?movimiento=completo para revisarla.
 */
export function movimientoReducido() {
  return (
    matchMedia("(prefers-reduced-motion: reduce)").matches &&
    !document.querySelector('.rd[data-motion="full"]')
  );
}
