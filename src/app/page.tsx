'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

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
    username: '', // Still needed for API but maybe hide/auto-fill if design only shows Name/Email? Design shows "Name" and "Email". 
    // I will map "Name" to username for now, or keep username field hidden/auto-generated?
    // The backend likely expects 'username'. The design asks for "Name" (could be Full Name).
    // User request: "I wnt this design". Design has "Name" and "Email".
    // I'll assume "Name" -> Username for simplicity, or add a Name field and use email prefix as username.
    // Let's stick to Name -> Username label change for now to minimize backend churn, or treat "Name" as username.
    email: '',
    otp_code: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'already_registered'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/latest/`)
      .then(res => res.ok ? res.json() : Promise.reject('Failed'))
      .then(data => setEvent(data.data || data))
      .catch(console.error);
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
          username: formData.username, // Using Name input as username
          email: formData.email,
          event_id: event?.id
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || (data.errors && data.errors.error) || data.error || 'Request failed');
      }

      setStep(2);
      setStatus('idle');
    } catch (err: unknown) {
      let message = 'Something went wrong';
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        message = String((err as Record<string, unknown>).message);
      }

      if (message.toLowerCase().includes('already registered')) {
        setStatus('already_registered');
      } else {
        setErrorMsg(message);
        setStatus('error');
      }
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

  if (!event) return <div className={styles.main} style={{ justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;

  return (
    <main className={styles.main}>
      {/* Background Decor */}
      <div className={styles.bgGradientRight} />
      <div className={styles.bgGradientLeft} />

      {/* Specific Shapes from Design */}
      <div className={styles.shapeLeftGold} />
      <div className={styles.shapeLeftGeo} />

      <div className={styles.shapeRightGreen} />
      <div className={styles.shapeRightShard} />
      <div className={styles.shapeRightGeo} />

      <div className={styles.shapeBottomPink} />
      <div className={styles.shapeBottomGreen} />

      {/* Header */}
      <header className={styles.header}>
        <img src="/logo.png?v=2" alt="Logo" className={styles.logoIcon} />
        <div className={styles.headerText}>
          <span className={styles.brandName}>Rollin Community</span>
          <span className={styles.brandTagline}>&quot;A private community experience&quot;</span>
        </div>
      </header>

      <div className={styles.container}>
        {/* Main Content */}
        <div className={styles.topSection}>
          <div className={styles.preTitle}>Rollin Community Event</div>
          <h1 className={styles.mainTitle}>Community Access Registration</h1>
          <p className={styles.subText}>
            Rollin Community is a private, community-led platform created to bring players together through shared interests and exclusive events in a secure environment.
          </p>
        </div>

        {/* Registration Card */}
        <div className={styles.card}>
          {status === 'success' ? (
            <div style={{ textAlign: 'center' }}>
              <h2 className={styles.successTitle}>Check your inbox!</h2>
              <p className={styles.featureText}>
                We&apos;ve sent an email to <strong>{formData.email}</strong> with your secure credentials and access link.
              </p>
            </div>
          ) : status === 'already_registered' ? (
            <div style={{ textAlign: 'center' }}>
              <h2 className={styles.successTitle} style={{ color: '#4ade80' }}>Welcome Back!</h2>
              <p className={styles.featureText}>
                You are already registered for this event.
              </p>
              <p className={styles.featureText} style={{ marginTop: '1rem' }}>
                Please check your email for your access credentials.
              </p>
            </div>
          ) : (
            <>
              {step === 1 ? (
                <form onSubmit={handleRegisterInit}>
                  <div className={styles.inputGroup}>
                    <input
                      className={styles.input}
                      type="text"
                      placeholder="Username"
                      required
                      value={formData.username}
                      onChange={e => setFormData({ ...formData, username: e.target.value })}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <input
                      className={styles.input}
                      type="email"
                      placeholder="Email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <button type="submit" className={styles.cta} disabled={status === 'loading'}>
                    {status === 'loading' ? 'Sending...' : 'Send Verification Code'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP}>
                  <p className={styles.featureText} style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    Enter the code sent to {formData.email}
                  </p>
                  <div className={styles.inputGroup}>
                    <input
                      className={`${styles.input} ${styles.otpInput}`}
                      type="text"
                      placeholder="000000"
                      maxLength={6}
                      required
                      value={formData.otp_code}
                      onChange={e => setFormData({ ...formData, otp_code: e.target.value })}
                    />
                  </div>
                  <button type="submit" className={styles.cta} disabled={status === 'loading'}>
                    {status === 'loading' ? 'Verifying...' : 'Verify Access'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    style={{ background: 'none', color: '#999', fontSize: '0.9rem', marginTop: '1rem', width: '100%', textDecoration: 'underline' }}
                  >
                    Change Email
                  </button>
                </form>
              )}

              {status === 'error' && <div className={styles.error}>{errorMsg}</div>}
            </>
          )}
        </div>

        {/* Footer Features */}
        <div className={styles.features}>
          <div className={styles.featureCol}>
            <div className={styles.featureIcon}>✉️</div>
            <div className={styles.featureTitle}>1) What happens next</div>
            <div className={styles.featureText}>
              Receive an email with secure credentials. Follow the link to enter the community portal.
            </div>
          </div>
          <div className={styles.featureCol}>
            <div className={styles.featureIcon}>👥</div>
            <div className={styles.featureTitle}>2) Who is this for</div>
            <div className={styles.featureText}>
              This event is for registered members of the Rollin Community interested in participating.
            </div>
          </div>
          <div className={styles.featureCol}>
            <div className={styles.featureIcon}>🛡️</div>
            <div className={styles.featureTitle}>3) Privacy & access control</div>
            <div className={styles.featureText}>
              Your information is secure and used solely for community access verification purposes.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
