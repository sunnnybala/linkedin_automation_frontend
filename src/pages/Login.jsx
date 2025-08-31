import Button from '../components/Button.jsx'

export default function Login() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
  const handleLogin = () => {
    window.location.href = `${API_BASE}/api/check/linkedin`
  }

  return (
    <div>
      <section className="hero">
        <div className="container" style={{ maxWidth: 880 }}>
          <div className="card hero-card" style={{ padding: 42 }}>
            <div className="stack-lg">
              <div style={{ textAlign: 'center', marginBottom: 50 }}>
                <h1 className="hero-title">Turn Consistent LinkedIn Posts into Interviews</h1>
                <p className="hero-subtitle">Recruiters check your profile before shortlisting. Show up with signal, not noise.</p>
              </div>
              <div className="stats" style={{ marginBottom: 30 }}>
                <div className="stat" style={{ minHeight: 180, maxWidth: 250 }}>
                  <strong>Recruiters screen profiles</strong>
                  <p className="muted">92% of employers review candidates' online presence before interviews.</p>
                </div>
                
                <div className="stat" style={{ minHeight: 180, maxWidth: 250 }}>
                  <strong>More touchpoints, better signal</strong>
                  <p className="muted">Posting showcases skills, thinking, and growth—beyond a static resume.</p>
                </div>
                
              </div>
              <div className="source-list">
                <div>
                  - See industry stats on recruiter screening and candidate research:
                  <a href="https://www.adaface.com/blog/job-interview-statistics/" target="_blank" rel="noreferrer"> Adaface: Job Interview Statistics</a>,
                  <a href="https://www.totaljobs.com/recruiter-advice/shortlisting-candidates-a-comprehensive-guide" target="_blank" rel="noreferrer"> Totaljobs: Shortlisting Candidates Guide</a>
                </div>
              </div>

              <div className="divider" />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container" style={{ maxWidth: 880 }}>
          <div className="card" style={{ padding: 32 }}>
            <div className="stack-lg">
              

              <div className="section section--alt">
                <h2 style={{ marginBottom: 8, textAlign: 'center' }}>How it works</h2>
                <p className="muted" style={{ marginBottom: 12 }}>Set your topics and schedule once—our AI agents keep your profile active with high-signal posts.</p>
                <ul style={{ margin: '0 0 12px 20px' }}>
                  <li>Sign in with LinkedIn (secure OAuth—no password stored).</li>
                  <br />
                  <li>Add topics you care about (e.g., AI Engineering, PM, ML Research).</li>
                  <br />
                  <li>Choose your time window.</li>
                  <br />
                  <li>Our AI agents track trusted sources and latest Industry Trends.</li>  
                  <br />
                  <li>We generate concise, relevant posts and publish on your schedule.</li>
                  <br />
                  <li>We send a email to you with the generated post for approval before publishing.</li>
                  <br />
                  <li>Every post costs one credit, you start with 5 free credits. You can buy more credits later .</li>
                </ul>
                <p className="muted">Update topics or schedule anytime.</p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <Button
                  aria-label="Sign in with LinkedIn"
                  variant="linkedin"
                  size="lg"
                  onClick={handleLogin}
                >
                  <svg className="btn__icon" viewBox="0 0 34 34" aria-hidden="true" focusable="false">
                    <path fill="currentColor" d="M34,34H27V22.2c0-3-1.2-4.5-3.4-4.5
                      c-2.5,0-3.8,1.7-3.8,4.5V34h-7V11.5h7v3c1.1-1.9,3.1-3.4,6.7-3.4
                      c4.9,0,7.8,3.1,7.8,9.3V34z M4,8C1.8,8,0,6.2,0,4s1.8-4,4-4s4,1.8,4,4
                      S6.2,8,4,8z M0,34h8V11.5H0V34z" />
                  </svg>
                  <span id="sign-in-with-linkedin">Sign in with LinkedIn</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
