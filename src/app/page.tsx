'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

const API_BASE = 'http://localhost:8000/api/events';

interface EventData {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  poster: string | null;
}



export default function Home() {
  const [event, setEvent] = useState<EventData | null>(null);
  const [step, setStep] = useState(1); // 1: Register Init, 2: OTP

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    otp_code: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Fetch latest event
    fetch(`${API_BASE}/latest/`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch event');
        return res.json();
      })
      .then(data => {
        if (data.data) {
          setEvent(data.data);
        } else {
          setEvent(data); // Fallback if wrapper is missing
        }
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const handleRegisterInit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch(`${API_BASE}/register-init/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          event_id: event?.id
        }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Request failed');

      setStep(2);
      setStatus('idle');

    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('error');
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch(`${API_BASE}/verify-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp_code: formData.otp_code,
          event_id: event?.id
        }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Verification failed');

      setStatus('success');

    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Verification failed');
      setStatus('error');
    }
  };

  if (!event) return <div className={styles.main}>Loading Event...</div>;

  return (
    <main className={styles.main}>
      <div className={styles.hero}>

        {/* Logo Section */}
        <div className={styles.logoContainer}>
          <img src="/logo.png" alt="High Rollin Logo" style={{ maxWidth: '300px', height: 'auto' }} />
        </div>

        <h1 className={styles.title}>{event.title}</h1>
        <p className={styles.description}>{event.description}</p>

        <p style={{ color: 'var(--secondary)', marginBottom: '2rem', fontWeight: '600', letterSpacing: '1px' }}>
          {new Date(event.start_date).toDateString()} — {new Date(event.end_date).toDateString()}
        </p>

        <div className={styles.card}>

          {/* SUCCESS STATES */}
          {status === 'success' && (
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Success!</h2>
              <p style={{ color: 'white' }}>Please check your email for the link to complete your personalized setup or access the event.</p>
            </div>
          )}

          {/* FORM STEPS */}
          {status !== 'success' && (
            <>
              {step === 1 && (
                <form onSubmit={handleRegisterInit}>
                  <h2 style={{ marginBottom: '2rem', textAlign: 'center', color: 'white' }}>Event Registration</h2>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Username</label>
                    <input className={styles.input} type="text" required value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} placeholder="Enter your username" />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Email</label>
                    <input className={styles.input} type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="your@email.com" />
                  </div>

                  <button type="submit" disabled={status === 'loading'} className={styles.cta}>
                    {status === 'loading' ? 'Processing...' : 'Continue'}
                  </button>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleVerifyOTP}>
                  <h2 style={{ marginBottom: '2rem', textAlign: 'center', color: 'white' }}>Verify Identity</h2>
                  <p style={{ marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Enter the code sent to {formData.email}.
                  </p>

                  <div className={styles.inputGroup}>
                    <label className={styles.label} style={{ textAlign: 'center' }}>One-Time Password</label>
                    <input
                      className={`${styles.input} ${styles.otpInput}`}
                      type="text"
                      required
                      maxLength={6}
                      value={formData.otp_code}
                      onChange={e => setFormData({ ...formData, otp_code: e.target.value })}
                    />
                  </div>

                  <button type="submit" disabled={status === 'loading'} className={styles.cta}>
                    {status === 'loading' ? 'Verifying...' : 'Finalize'}
                  </button>
                </form>
              )}

              {status === 'error' && (
                <p className={styles.error}>{errorMsg}</p>
              )}
            </>
          )}

        </div>
      </div>
    </main>
  );
}
