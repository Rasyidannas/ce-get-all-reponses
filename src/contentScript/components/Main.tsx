import { useEffect, useState } from 'react'
import Dropdown from '../ui/Dropdown'
import Textarea from '../ui/Textarea'
import FormPost from './FormPost'
import './Main.css'

export default () => {
  const [allResponses, setAllResponses] = useState<
    Array<{
      type: 'fetch' | 'xhr'
      url: string
      body: string
      timestamp: number
    }>
  >([])

  const [selectedUrl, setSelectedUrl] = useState<string | null>(null)
  const [resJson, setResJson] = useState<any | null>(null)

  useEffect(() => {
    const handlerNetSniff = (event: CustomEvent) => {
      const { type, url, body } = event.detail

      localStorage.setItem(url, body)

      setAllResponses((prev) => [
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
    window.addEventListener('net-sniff', handlerNetSniff as EventListener)

    // Cleanup
    return () => {
      window.removeEventListener('net-sniff', handlerNetSniff as EventListener)
    }
  })

  return (
    <div className="main">
      <h3>Get All Reponses</h3>
      <p>Select a url/endpoint from the dropdown to view its corresponding JSON value</p>

      <Dropdown
        items={allResponses.map((res) => res.url)}
        onSelect={(url) => {
          setSelectedUrl(url)
        }}
      />

      <Textarea
        selectedUrl={selectedUrl ?? ''}
        onJson={(json) => {
          setResJson(json)
        }}
      />

      <FormPost resJson={resJson} />
    </div>
  )
}
