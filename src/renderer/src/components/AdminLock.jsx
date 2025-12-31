export default function AdminLock() {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a1a1a',
        color: '#ff4d4f',
        textAlign: 'center',
        padding: '40px',
        fontFamily: 'sans-serif'
      }}
    >
      <h1 style={{ marginBottom: '10px' }}>Administrator Privileges Required</h1>
      <p style={{ color: '#ccc', fontSize: '1.2em' }}>
        This application requires Administrator access to modify core system settings (Registry,
        Services, Firewall).
      </p>
      <div
        style={{
          marginTop: '30px',
          padding: '15px',
          border: '1px solid #555',
          borderRadius: '8px',
          background: '#222'
        }}
      >
        <p style={{ margin: 0, color: '#fff' }}>
          Please close the app and <strong>Run as Administrator</strong>.
        </p>
      </div>
    </div>
  )
}
