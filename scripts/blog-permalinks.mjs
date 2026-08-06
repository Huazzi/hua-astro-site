import { randomInt } from 'node:crypto'
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { slug as githubSlug } from 'github-slugger'
import YAML from 'yaml'

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const BLOG_DIR = path.join(PROJECT_ROOT, 'src/content/blog')
const POST_ID_PATTERN = /^\d{6}$/
const MARKDOWN_PATTERN = /\.(?:md|mdx)$/i

function walkMarkdownFiles(directory) {
  return readdirSync(directory)
    .flatMap((name) => {
      const filePath = path.join(directory, name)
      return statSync(filePath).isDirectory() ? walkMarkdownFiles(filePath) : [filePath]
    })
    .filter((filePath) => MARKDOWN_PATTERN.test(filePath))
    .sort((a, b) => a.localeCompare(b, 'zh-CN'))
}

function parseFrontmatter(filePath) {
  const source = readFileSync(filePath, 'utf8')
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?=\r?\n|$)/)

  if (!match) {
    throw new Error(`Missing or invalid frontmatter: ${path.relative(PROJECT_ROOT, filePath)}`)
  }

  const data = YAML.parse(match[1]) ?? {}
  return { data, source, openingLength: source.indexOf('\n') + 1 }
}

function normalizeAliases(value, filePath) {
  if (value === undefined) return []
  if (!Array.isArray(value) || value.some((alias) => typeof alias !== 'string')) {
    throw new Error(`"aliases" must be a string array: ${path.relative(PROJECT_ROOT, filePath)}`)
  }
  return value
}

function normalizePostId(value, filePath) {
  if (typeof value !== 'string' || !POST_ID_PATTERN.test(value)) {
    throw new Error(
      `"slug" must be a quoted 6-digit string: ${path.relative(PROJECT_ROOT, filePath)}`
    )
  }
  return value
}

export function getLegacySlug(filePath, blogDir = BLOG_DIR) {
  const relativePath = path.relative(blogDir, filePath).split(path.sep).join('/')
  const withoutExtension = relativePath.replace(MARKDOWN_PATTERN, '')
  return withoutExtension
    .split('/')
    .map((segment) => githubSlug(segment))
    .join('/')
    .replace(/\/index$/, '')
}

function collectEntries(blogDir = BLOG_DIR) {
  return walkMarkdownFiles(blogDir).map((filePath) => {
    const frontmatter = parseFrontmatter(filePath)
    return {
      filePath,
      ...frontmatter,
      aliases: normalizeAliases(frontmatter.data.aliases, filePath)
    }
  })
}

function validateEntries(entries, { allowMissingSlug = false } = {}) {
  const slugs = new Map()
  const aliases = new Map()

  for (const entry of entries) {
    const rawSlug = entry.data.slug
    if (rawSlug === undefined && allowMissingSlug) continue

    const slug = normalizePostId(rawSlug, entry.filePath)
    const duplicateSlug = slugs.get(slug)
    if (duplicateSlug) {
      throw new Error(
        `Duplicate slug "${slug}":\n- ${path.relative(PROJECT_ROOT, duplicateSlug)}\n- ${path.relative(PROJECT_ROOT, entry.filePath)}`
      )
    }
    slugs.set(slug, entry.filePath)
  }

  for (const entry of entries) {
    for (const alias of entry.aliases) {
      if (!alias || alias.startsWith('/') || alias.endsWith('/')) {
        throw new Error(
          `Alias must be a non-empty path without leading/trailing slashes: ${path.relative(PROJECT_ROOT, entry.filePath)}`
        )
      }

      const slugOwner = slugs.get(alias)
      if (slugOwner) {
        throw new Error(
          `Alias "${alias}" conflicts with a post slug:\n- ${path.relative(PROJECT_ROOT, slugOwner)}\n- ${path.relative(PROJECT_ROOT, entry.filePath)}`
        )
      }

      const duplicateAlias = aliases.get(alias)
      if (duplicateAlias) {
        throw new Error(
          `Duplicate alias "${alias}":\n- ${path.relative(PROJECT_ROOT, duplicateAlias)}\n- ${path.relative(PROJECT_ROOT, entry.filePath)}`
        )
      }
      aliases.set(alias, entry.filePath)
    }
  }

  return { aliases, slugs }
}

function generateUniquePostId(usedIds) {
  let postId
  do {
    postId = String(randomInt(100_000, 1_000_000))
  } while (usedIds.has(postId))
  return postId
}

function insertPermalinkFields(entry, slug, aliases) {
  const fields = YAML.stringify({ slug, ...(aliases.length > 0 ? { aliases } : {}) }).trimEnd()
  return `${entry.source.slice(0, entry.openingLength)}${fields}\n${entry.source.slice(entry.openingLength)}`
}

export function ensureBlogPermalinks({ blogDir = BLOG_DIR, preserveCurrentUrls = false } = {}) {
  const entries = collectEntries(blogDir)
  const { slugs } = validateEntries(entries, { allowMissingSlug: true })
  const generated = []

  for (const entry of entries) {
    if (entry.data.slug !== undefined) continue

    const slug = generateUniquePostId(slugs)
    slugs.set(slug, entry.filePath)

    const aliases = [...entry.aliases]
    if (preserveCurrentUrls) {
      const legacySlug = getLegacySlug(entry.filePath, blogDir)
      if (legacySlug && legacySlug !== slug && !aliases.includes(legacySlug))
        aliases.push(legacySlug)
    }

    writeFileSync(entry.filePath, insertPermalinkFields(entry, slug, aliases))
    generated.push({ filePath: entry.filePath, slug, aliases })
  }

  validateEntries(collectEntries(blogDir))
  return generated
}

export function getBlogRedirects(blogDir = BLOG_DIR) {
  const entries = collectEntries(blogDir)
  validateEntries(entries)

  return Object.fromEntries(
    entries.flatMap((entry) => {
      const slug = normalizePostId(entry.data.slug, entry.filePath)
      return entry.aliases.map((alias) => [
        `/blog/${alias}`,
        { destination: `/blog/${slug}`, status: 301 }
      ])
    })
  )
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href
if (isDirectRun) {
  const preserveCurrentUrls = process.argv.includes('--preserve-current-urls')
  const generated = ensureBlogPermalinks({ preserveCurrentUrls })

  if (generated.length === 0) {
    console.log('Blog permalinks are valid; no new IDs were needed.')
  } else {
    console.log(`Generated and persisted ${generated.length} blog permalink ID(s):`)
    for (const item of generated) {
      const relativePath = path.relative(PROJECT_ROOT, item.filePath)
      const aliases = item.aliases.length > 0 ? ` (alias: ${item.aliases.join(', ')})` : ''
      console.log(`- ${item.slug}  ${relativePath}${aliases}`)
    }
  }
}
