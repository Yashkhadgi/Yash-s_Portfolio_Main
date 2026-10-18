(() => {
  const form = document.querySelector('#contact-form');
  const status = document.querySelector('#form-status');
  const button = document.querySelector('#send-button');
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    button.disabled = true;
    status.classList.remove('error');
    status.textContent = 'Sending…';
    try {
      const values = Object.fromEntries(new FormData(form));
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(values)
      });
      if (!response.ok) throw new Error('Delivery is unavailable right now. Please use the email link on this page.');
      status.textContent = 'Message sent. Thank you for reaching out.';
      form.reset();
    } catch (error) {
      status.classList.add('error');
      status.textContent = error.message;
    } finally {
      button.disabled = false;
    }
  });
})();
