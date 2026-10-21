(() => {
  const form = document.querySelector('#contact-form');
  const status = document.querySelector('#form-status');
  const button = document.querySelector('#send-button');
  if (!form || !status || !button) return;
  let submitting = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting) return;
    if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form));
    for (const key of ['name', 'email', 'subject', 'message']) values[key] = String(values[key] || '').trim();
    if (values.message.length < 10) {
      status.classList.add('error');
      status.textContent = 'Please write a message of at least 10 characters.';
      return;
    }
    submitting = true;
    button.disabled = true;
    status.classList.remove('error');
    status.textContent = 'Sending…';
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(values),
        signal: AbortSignal.timeout(16000)
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true) {
        const message = response.status === 400 ? 'Please check your name, email, subject and message (at least 10 characters).' : 'Your message could not be submitted. Your text has been kept—please use the email link on this page.';
        throw new Error(message);
      }
      status.textContent = 'Message submitted. Thank you for reaching out.';
      form.reset();
    } catch (error) {
      status.classList.add('error');
      status.textContent = error.name === 'TimeoutError' || error.name === 'TypeError' ? 'Submission could not be confirmed. Your text has been kept—please use the email link on this page.' : error.message;
    } finally {
      button.disabled = false;
      submitting = false;
    }
  });
})();
