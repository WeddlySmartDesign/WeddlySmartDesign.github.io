/* Datos comerciales editables en un único sitio. */
window.GUEST_CONFIG = {
  price: '59,90 €',
  priceLabel: 'Precio de lanzamiento',
  customPrice: '120 €',
  whatsapp: '34620843264',
  whatsappDisplay: '620 843 264',
  email: 'info@weddlysmartdesign.com',
  // Pasarela de compra (Stripe a través de GUEST). Con null, «La quiero» abre WhatsApp.
  // PRUEBA: guest-stripe-checkout-qa solo acepta Stripe en modo test. Cambiar antes de publicar.
  checkoutApi: 'https://dnjsxequwgtyyauuofxj.supabase.co/functions/v1/guest-stripe-checkout-qa',
  guarantee:
    'Si después de los cambios la propuesta no os convence, os devolvemos el 100 % antes de aprobarla.'
};
