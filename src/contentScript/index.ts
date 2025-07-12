console.info('contentScript is running')

// Content script (runs in page context)
// const originalFetch = window.fetch;
// window.fetch = async (...args) => {
//   const response = await originalFetch(...args);
//   const clone = response.clone();
//   clone.json().then(data => console.log("API Response:", data));
//   return response;
// };
//
// const originalOpen = XMLHttpRequest.prototype.open;
// XMLHttpRequest.prototype.open = function (...args) {
//   this.addEventListener('load', function () {
//     console.log('XHR Loaded:', args[1], this);
//   });
//   originalOpen.apply(this, args);
// };

function injectScript(file_path, tag) {
  var node = document.getElementsByTagName(tag)[0]
  var script = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('src', file_path)
  node.appendChild(script)
}

injectScript(chrome.runtime.getURL('injector.js'), 'head')
