import { useState, useEffect } from 'react'

const findResponseStorage = (url: string): any => {
  const response = localStorage.getItem(url)
  if (!response) return null
  return response
}

export default ({ selectedUrl, onJson }: { selectedUrl: string; onJson: (any: {}) => void }) => {
  const [textareaValue, setTextareaValue] = useState<any>('')

  // Use useEffect to handle localStorage data when selectedUrl changes
  useEffect(() => {
    if (selectedUrl && selectedUrl !== '') {
      console.log('now if selectedUrl is', selectedUrl)
      const storedValue = findResponseStorage(selectedUrl)
      if (storedValue) {
        setTextareaValue(storedValue)
        onJson(storedValue)
      } else {
        setTextareaValue('')
        onJson({})
      }
    } else {
      console.log('now else selectedUrl is', selectedUrl)
      setTextareaValue('')
      onJson({})
    }
  }, [selectedUrl])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setTextareaValue(value)
    // Optionally call onJson with the new value when manually typed
    onJson(value)
  }

  return (
    <div className="textarea-container">
      <label className="label">Response</label>
      <textarea
        className="textarea"
        value={textareaValue}
        onChange={handleChange}
        disabled={!!selectedUrl && selectedUrl !== ''}
      />
    </div>
  )
}
