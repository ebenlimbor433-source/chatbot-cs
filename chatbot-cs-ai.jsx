import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'

function ChatbotApp() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Halo! Ada yang bisa saya bantu terkait layanan Customer Service kami?' }
  ])
  const [input, setInput] = useState('')

  const handleSend = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg = { sender: 'user', text: input }
    const botReply = { sender: 'bot', text: `Terima kasih atas pesannya: "${input}". Tim CS kami akan merespons secepatnya.` }

    setMessages((prev) => [...prev, userMsg, botReply])
    setInput('')
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif', border: '1px solid #ccc', borderRadius: '8px', padding: '20px' }}>
      <h2>Customer Service Chatbot</h2>
      <div style={{ height: '300px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', margin: '8px 0' }}>
            <span style={{
              display: 'inline-block',
              padding: '8px 12px',
              borderRadius: '16px',
              backgroundColor: msg.sender === 'user' ? '#007bff' : '#f1f1f1',
              color: msg.sender === 'user' ? '#fff' : '#333'
            }}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ketik pesan..."
          style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Kirim
        </button>
      </form>
    </div>
  )
}

// Render langsung ke DOM
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChatbotApp />
  </React.StrictMode>
)

export default ChatbotApp
