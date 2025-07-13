const findResponseStorage = (url: string) => {
  const response = localStorage.getItem(url)
  if (!response) return null
  return JSON.parse(response)
}

export default ({ selectedUrl, onJson }: { selectedUrl: string; onJson: (any: {}) => void }) => {
  if (selectedUrl) {
    onJson(findResponseStorage(selectedUrl))
  }

  return (
    <div className="textarea-container">
      <label className="label">Response</label>
      <textarea
        className="textarea"
        value={findResponseStorage(selectedUrl)}
        disabled={!selectedUrl}
      />
    </div>
  )
}
