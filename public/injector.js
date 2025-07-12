// inpage-hook.js   (in MAIN world, run_at=document_start)
;(() => {
  // console.log('this is function in injector.js')
  /* --- fetch --------------------------------------------------- */
  const realFetch = window.fetch
  window.fetch = async (...args) => {
    const resp = await realFetch(...args)
    resp
      .clone()
      .text()
      .then((body) => {
        // console.log('[Sniff‑fetch]', args[0], body) // pipe to devtools
        // localStorage.setItem(`getRes-${args[0]}`, body)
        window.dispatchEvent(
          new CustomEvent('net-sniff', {
            detail: { type: 'fetch', url: resp.url, body },
          }),
        )
      })
    return resp
  }

  /* --- XMLHttpRequest ------------------------------------------ */
  const RealXHR = window.XMLHttpRequest
  function PatchedXHR() {
    const xhr = new RealXHR()
    let url = ''
    xhr.open = new Proxy(xhr.open, {
      apply(target, thisArg, [method, u, ...rest]) {
        url = u
        return target.apply(thisArg, [method, u, ...rest])
      },
    })
    xhr.addEventListener('load', function () {
      // console.log('[Sniff‑xhr]', url, this.responseText)
      // localStorage.setItem(`getRes-${url}`, this.responseText)
      window.dispatchEvent(
        new CustomEvent('net-sniff', {
          detail: { type: 'xhr', url, body: this.responseText },
        }),
      )
    })
    return xhr
  }
  window.XMLHttpRequest = PatchedXHR
})()
