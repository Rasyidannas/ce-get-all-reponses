import { useState } from 'react'

const postData = async (url: string, json: any): Promise<void> => {
  try {
    // Send message to background script
    const response = await chrome.runtime.sendMessage({
      type: 'POST_REQUEST',
      url: url,
      data: json,
    })

    console.log(response)
  } catch (error) {
    console.error('Error posting data:', error)
  }
}

export default ({ resJson }: { resJson: any }) => {
  const [url, setUrl] = useState<string>('')

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUrl(value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!resJson || !url) return

    postData(url, resJson)
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="input-container">
        <label className="label">Send to URL</label>
        <input
          type="text"
          placeholder="https://example.com"
          className="text-field"
          onChange={inputChange}
        ></input>
      </div>

      <button className="btn-primary">Submit</button>
    </form>
  )
}
