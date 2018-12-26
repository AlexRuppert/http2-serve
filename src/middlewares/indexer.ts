import pug from 'pug'
import { promises as fs, promises } from 'fs'
import path from 'path'
import { createContext } from 'vm'

const fn = pug.compileFile(__dirname + '/../pug/index.pug')
const formatDate = function(date: Date) {
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}
const formatSize = function(num) {
  const table = ['B', 'k', 'M', 'G', 'T']
  const pows = [1, 1024, 1024 * 1024, 1024 * 1024 * 1024, 1024 * 1024 * 1024 * 1024]
  for (let i = 0; i < table.length; i++) {
    const result = num / pows[i]
    if (result < 1024) {
      return result.toFixed(1) + table[i]
    }
  }
  return 'Huge'
}
const getHashCode = function(str: string) {
  let hash = 0
  if (str.length === 0) return hash
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}
const numberToHSL = function(num: number) {
  return num % 360 //`hsl(${num % 360}, 100%, 30%)`
}
const formatColor = function(name: string, isDirectory) {
  return !isDirectory ? numberToHSL(getHashCode(path.extname(name))) : null
}
async function getDirectoryContents(directory: string, url: string) {
  const currentPath = path.join(directory, decodeURI(url))
  const dir = await fs.readdir(currentPath)
  const statsPromises = dir.map(d => fs.stat(path.join(currentPath, d)))
  const stats = (await Promise.all(statsPromises.map(p => p.catch(() => undefined)))).filter(p => p)

  const result = dir.map((d, i) => {
    const stat = stats[i]
    const isDir = stat.isDirectory()
    const suffix = isDir ? '/' : ''
    return {
      name: d,
      //uri: url + encodeURI(d) + suffix,
      isDir,
      size: formatSize(stat.size),
      modified: formatDate(stat.mtime),
      hue: formatColor(d, isDir),
    }
  })

  let uriParts = url.split('/').filter(u => u)
  let uriSets = uriParts
    .reduce(
      (acc, val, i) => {
        acc.push(acc[i] + val + '/')
        return acc
      },
      ['/'],
    )
    .slice(1)

  let current = uriParts.map((d, i) => {
    return {
      part: decodeURI(d),
      href: uriSets[i],
    }
  })

  return {
    url,
    files: result.sort((a, b) => {
      return a.isDir === b.isDir ? 0 : a.isDir ? -1 : 1 || a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    }),
  }
}

export default function indexer(options = { rootDir: __dirname }) {
  return async function(ctx, next) {
    if (/\/$/i.test(ctx.url)) {
      const directoryContents = await getDirectoryContents(options.rootDir, ctx.url)
      if (ctx.accepts('html')) {
        ctx.body = /*fn(directoryContents)*/ pug.renderFile(__dirname + '/../pug/index.pug', directoryContents)
      } else if (ctx.accepts('json')) {
        ctx.body = directoryContents
      }
    } else {
      await next()
    }
  }
}
