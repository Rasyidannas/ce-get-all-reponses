import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import Main from './components/Main'

console.info('contentScript is running')

function injectScript(file_path: string, tag: string) {
  const node = document.getElementsByTagName(tag)[0]
  const script = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('src', file_path)
  node.appendChild(script)
}

injectScript(chrome.runtime.getURL('injector.js'), 'head')

// Create a container element if it doesn't exist
let appElement = document.getElementById('app')
if (!appElement) {
  appElement = document.createElement('div')
  appElement.id = 'app'
  document.body.appendChild(appElement)
}

// React Component to display captured URLs
const NetworkMonitor = () => {
  const [capturedRequests, setCapturedRequests] = useState<
    Array<{
      type: 'fetch' | 'xhr'
      url: string
      body: string
      timestamp: number
    }>
  >([])

  useEffect(() => {
    // Listen for custom events from injector.js
    const handleNetSniff = (event: CustomEvent) => {
      const { type, url, body } = event.detail
      setCapturedRequests((prev) => [
        ...prev,
        {
          type,
          url,
          body,
          timestamp: Date.now(),
        },
      ])
    }

    // Add event listener
    window.addEventListener('net-sniff', handleNetSniff as EventListener)

    // Cleanup
    return () => {
      window.removeEventListener('net-sniff', handleNetSniff as EventListener)
    }
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        width: '400px',
        maxHeight: '500px',
        backgroundColor: 'white',
        border: '2px solid #ccc',
        borderRadius: '8px',
        padding: '10px',
        zIndex: 10000,
        overflow: 'auto',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      }}
    >
      <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
        Network Requests ({capturedRequests.length})
      </h3>
      <div style={{ fontSize: '12px' }}>
        {capturedRequests.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>
            No requests captured yet. Try making some network requests on this page.
          </p>
        ) : (
          capturedRequests.map((request, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #ddd',
                margin: '5px 0',
                padding: '8px',
                borderRadius: '4px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <div style={{ fontWeight: 'bold', color: '#007acc' }}>
                {request.type.toUpperCase()}: {request.url}
              </div>
              <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
                {new Date(request.timestamp).toLocaleTimeString()}
              </div>
              <details style={{ marginTop: '8px' }}>
                <summary style={{ cursor: 'pointer', color: '#555' }}>
                  View Response ({request.body.length} chars)
                </summary>
                <pre
                  style={{
                    fontSize: '10px',
                    maxHeight: '200px',
                    overflow: 'auto',
                    backgroundColor: '#f0f0f0',
                    padding: '8px',
                    margin: '8px 0 0 0',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                  }}
                >
                  {request.body}
                </pre>
              </details>
            </div>
          ))
        )}
      </div>
      <button
        onClick={() => setCapturedRequests([])}
        style={{
          marginTop: '10px',
          padding: '5px 10px',
          backgroundColor: '#ff4444',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
        }}
      >
        Clear All
      </button>
    </div>
  )
}

// React Render
ReactDOM.createRoot(appElement as HTMLElement).render(
  <React.StrictMode>
    {/* <NetworkMonitor /> */}
    <Main />
  </React.StrictMode>,
)
