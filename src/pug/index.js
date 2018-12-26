const q = p => document.querySelector(p)
window.addEventListener('keydown', e => {
  let selected
  const keyUp = e.which === 40
  const li = 'li a'
  if (e.which === 38 || keyUp) {
    selected = q(li + ':focus') || q(li)
    selected.focus()
    let next = selected.parentElement
    try {
      if (keyUp) {
        next = next.nextElementSibling
      } else {
        next = next.previousElementSibling
      }
      next = next.firstElementChild
      next.focus()
    } catch (r) {}
    selected = null
  }
  if (e.which === 39) {
    selected = q(li + ':focus')
  }
  if (e.which === 37) {
    selected = q(li)
  }
  if (selected) {
    selected.click()
  }
})

function s() {
  document.querySelectorAll('a').forEach(a => {
    let href = a.href
    if (href.endsWith('/')) {
      a.href = 'javascript:'
      a.onclick = () => {
        console.log(href)
        fetch(href, { headers: { Accept: 'application/json' } }).then(result => {
          result.json().then(json => {
            const url = json.url
            console.log(json)
            history.pushState({}, '', url)
            let html = ''
            ;[{ name: '..', isDir: true }, ...json.files].forEach(file => {
              console.log(file.name)
              html += `<li><a href="${url + encodeURI(file.name) + (file.isDir ? '/' : '')} "><div><svg ${
                file.hue ? `style="color:hsl(${file.hue},100%,30%)"` : ''
              }><use xlink:href="${file.isDir ? '#d' : '#f'}"></use></svg><div>${
                file.name
              }</div></div><div><div>${file.modified || ''}</div>${
                file.isDir ? '' : `<div class="size">${file.size}</div>`
              }</div></a></li>`
            })
            q('ul').innerHTML = html
            html = '<a href="/">../</a>'
            let hurl = '/'
            json.url
              .split('/')
              .filter(a => a.trim())
              .forEach(part => {
                hurl += part + '/'
                html += `<a href="${hurl}">${decodeURI(part) + '/'}</a>`
              })
            q('h1').innerHTML = html
            setTimeout(() => {
              s()
            }, 1)
          })
        })
      }
    }
  })
}
if (fetch) {
  s()
}
