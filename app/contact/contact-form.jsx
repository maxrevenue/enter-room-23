'use client'

export default function ContactForm() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        alert('Thank you for your message. We will respond within 24 hours. For immediate assistance, email support@room23.net.')
      }}
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      <div>
        <label htmlFor="contact-name" className="input-label">Full Name</label>
        <input
          id="contact-name"
          type="text"
          className="input-field"
          placeholder="Your name"
          required
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="input-label">Email Address</label>
        <input
          id="contact-email"
          type="email"
          className="input-field"
          placeholder="you@email.com"
          required
        />
      </div>

      <div>
        <label htmlFor="contact-order" className="input-label">Order Number (if applicable)</label>
        <input
          id="contact-order"
          type="text"
          className="input-field"
          placeholder="e.g. R23-12345"
        />
      </div>

      <div>
        <label htmlFor="contact-subject" className="input-label">Subject</label>
        <select
          id="contact-subject"
          className="input-field"
          defaultValue=""
        >
          <option value="" disabled style={{ color: 'var(--text-muted)' }}>Select a topic</option>
          <option value="order">Order Status / Tracking</option>
          <option value="returns">Returns &amp; Refunds</option>
          <option value="product">Product Questions</option>
          <option value="billing">Billing &amp; Payments</option>
          <option value="privacy">Privacy Concern</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="input-label">Message</label>
        <textarea
          id="contact-message"
          className="input-field"
          rows={5}
          placeholder="How can we help?"
          required
          style={{ resize: 'vertical' }}
        />
      </div>

      <button type="submit" className="btn-primary" style={{ width: '100%' }}>
        Send Message
      </button>

      <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', textAlign: 'center' }}>
        Your message is handled with complete discretion and never shared.
      </p>
    </form>
  )
}
