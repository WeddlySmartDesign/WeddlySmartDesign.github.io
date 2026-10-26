/* Datos comerciales editables en un único sitio. */
window.GUEST_CONFIG = {
  price: '59,90 €',
  priceLabel: 'Precio de lanzamiento',
  customPrice: '120 €',
  whatsapp: '34620843264',
  whatsappDisplay: '620 843 264',
  email: 'info@weddlysmartdesign.com',
  // Pasarela de compra (Stripe a través de GUEST). Con null, «La quiero» abre WhatsApp.
  // En local y en las vistas previas de Cloudflare (salvo la rama guest-lanzamiento) todo va a las funciones de prueba con Stripe test; en la web publicada, a las reales.
  checkoutApi: 'https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/'+(/^(localhost|127\.0\.0\.1)$|^(?!guest-lanzamiento\.).*\.pages\.dev$/.test(location.hostname)?'guest-stripe-checkout-qa':'guest-order-checkout'),
  // Diseño a medida: solicitud, presupuesto y cobro.
  customApi: 'https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/'+(/^(localhost|127\.0\.0\.1)$|^(?!guest-lanzamiento\.).*\.pages\.dev$/.test(location.hostname)?'guest-custom-qa':'guest-order-custom'),
  guarantee:
    'Si después de los cambios la propuesta no os convence, os devolvemos el 100 % antes de aprobarla.'
};
