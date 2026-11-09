const feed = document.getElementById('feed')
let loading = false

async function fetchRandom() {
  for (let i = 0; i < 10; i++) {
    const res = await fetch('https://en.wikipedia.org/api/rest_v1/page/random/summary')
    const data = await res.json()
    if (data.thumbnail && data.type === "standard" && !isBlocked(data)) return data
  }
  return null
}

function addCard(a) {
  const card = document.createElement('a')
  card.className = 'card'
  card.href = a.content_urls.desktop.page
  card.target = '_blank'
  card.rel = 'noreferrer'

  const img = document.createElement('img')
  img.src = a.thumbnail.source
  img.alt = ''

  const box = document.createElement('div')
  box.className = 'text'
  const h = document.createElement('h1')
  h.textContent = a.title
  const p = document.createElement('p')
  p.textContent = a.extract.length > 220 ? a.extract.slice(0, 220) + '…' : a.extract
  const s = document.createElement('small')
  s.textContent = 'tap to read →'

  box.append(h, p, s)
  card.append(img, box)
  feed.appendChild(card)
}

async function loadMore(n = 3) {
  if (loading) return
  loading = true
  const batch = await Promise.all(Array.from({ length: n }, () => fetchRandom()))
  for (const a of batch) if (a) addCard(a)
  loading = false
}

feed.addEventListener('scroll', () => {
  if (feed.scrollTop + feed.clientHeight >= feed.scrollHeight - feed.clientHeight * 2) loadMore(3)
})

loadMore(5)

const BLOCKED = new RegExp('\\b(porn|pornography|erotic|nude|nudity|genitals?|rape|rapist|fetish|escort|stripper|gore|torture|suicide)\\b', 'i')
function isBlocked(d) {
  return BLOCKED.test(d.title + ' ' + (d.extract || ''))
}
