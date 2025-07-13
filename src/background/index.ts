console.log('background is running')

chrome.runtime.onMessage.addListener((request) => {
  if (request.type === 'COUNT') {
    console.log('background has received a message from popup, and count is ', request?.count)
  }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'POST_REQUEST') {
    console.log('Post Request is running')
    // Handle the async operation properly
    fetch(request.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request.data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        console.log('Background script response:', data)
        sendResponse({ success: true, data })
      })
      .catch((error) => {
        console.error('Background script error:', error)
        sendResponse({ success: false, error: error.message })
      })

    // Return true to indicate we'll send a response asynchronously
    return true
  }
})
