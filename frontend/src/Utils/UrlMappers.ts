export function mapToQueryString(params: object) {
  return Object.keys(params).map((key) => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
  }).join('&');
}
