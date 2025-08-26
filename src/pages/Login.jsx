export default function Login() {
  const handleLogin = () => {
    window.location.href = 'http://localhost:3000/api/auth/linkedin'
  }

  return (
    <div style={{ maxWidth: 720, margin: '40px auto', padding: 16 }}>
      <h1>Get Discovered on LinkedIn</h1>
      <p>
        Consistent, high-quality posts improve your visibility to recruiters and hiring managers.
        Posting weekly drives more profile views and engagement, helping you stand out.
      </p>
      <ul>
        <li>Showcase your expertise with AI-assisted content</li>
        <li>Stay top-of-mind with a steady cadence</li>
        <li>Increase inbound opportunities</li>
      </ul>
      <button onClick={handleLogin} style={{ padding: '10px 16px', fontSize: 16 }}>
        Sign in with LinkedIn
      </button>
    </div>
  )
}
