export default ({ items, onSelect }: { items: string[]; onSelect: (url: string) => void }) => {
  const uniqueItems = [...new Set(items)]
  uniqueItems.unshift('Choose a url')

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const url = e.target.value
    if (url === 'Choose a url') return
    onSelect(url)
  }

  return (
    <div className="dropdown-container">
      <label className="label">Select a URL/Endpoint</label>
      <select className="dropdown" onChange={handleChange}>
        {uniqueItems.length === 0 && <option value="">No items</option>}
        {uniqueItems.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  )
}
