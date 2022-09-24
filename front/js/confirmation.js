document.addEventListener('DOMContentLoaded', () => {
  const {
    orderId,
  } = parseGETParams(window.location.href)
  const domOrderId = document.getElementById('orderId')
  domOrderId.innerHTML = orderId
})

// ========== parseGETParams
// Inspiration: https://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-get-parameters
const parseGETParams = (url = '') => {
  const query = url
    // Replace + by ' '
    .split('+').join(' ')
    // Remove before '?'
    .slice(url.indexOf('?'))

  const params = {}
  let tokens
  const re = /[?&]?([^=]+)=([^&]*)/g
  // eslint-disable-next-line
  while (tokens = re.exec(query)) {
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2])
  }

  return params
}
