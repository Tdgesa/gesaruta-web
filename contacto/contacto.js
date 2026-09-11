(() => {
  const form = document.querySelector('#contact-form');
  const status = document.querySelector('#form-status');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const name = values.get('name').trim();
    const message = values.get('message').trim();
    if (!name || !message) {
      status.textContent = 'Escribe tu nombre y el mensaje para preparar la consulta.';
      document.querySelector(!name ? '#contact-name' : '#contact-message').focus();
      return;
    }
    const body = [
      `Nombre: ${name}`, `Email: ${values.get('email')}`,
      `Teléfono: ${values.get('phone') || 'No indicado'}`,
      `Provincia: ${values.get('province') || 'No indicada'}`,
      `Número de vehículos: ${values.get('vehicles') || 'No indicado'}`,
      '', message,
    ].join('\n');
    window.location.href = `mailto:atencionalcliente@gesagrupo.com?subject=${encodeURIComponent('Consulta GESARUTA — ' + name)}&body=${encodeURIComponent(body)}`;
    status.textContent = 'Mensaje preparado. Completa el envío en tu aplicación de correo. Si no se abre, escríbenos a atencionalcliente@gesagrupo.com o llámanos al +34 942 353 046.';
  });
})();
