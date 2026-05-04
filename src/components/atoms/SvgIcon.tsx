import { useMemo } from 'react'

type Props = {
  icon: string
  size?: number | string
  color?: string
}

type LoadedSvg = {
  inner: string
  viewBox: string
  fill?: string
  stroke?: string
  strokeWidth?: string
}

function readAttr(attrs: string, name: string): string | undefined {
  const m = attrs.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']+)["']`, 'i'))
  return m?.[1]
}

function parseSvg(svgText: string): LoadedSvg | null {
  const text = svgText.trim()
  if (!text) return null

  const svgMatch = text.match(/<svg\b([^>]*)>([\s\S]*?)<\/svg>/i)
  if (svgMatch) {
    const attrs = svgMatch[1] ?? ''
    const inner = svgMatch[2] ?? ''
    const viewBoxMatch = attrs.match(/\bviewBox\s*=\s*["']([^"']+)["']/i)
    return {
      inner,
      viewBox: viewBoxMatch?.[1] ?? '0 0 24 24',
      fill: readAttr(attrs, 'fill'),
      stroke: readAttr(attrs, 'stroke'),
      strokeWidth: readAttr(attrs, 'stroke-width'),
    }
  }

  return { inner: text, viewBox: '0 0 24 24' }
}

/**
 * Bundle-time "dynamic" icons: Vite only allows `import(\`./x/${a}\`)`-style patterns
 * when files are listed via `import.meta.glob`. Each `*.svg` here is included in the
 * build; at runtime we look up by `icon` name — no `fetch` to `/public`.
 *
 * For code-split per icon (separate async chunks), use the same glob with `eager: false`
 * and `await loaders[path]()`.
 */
const iconRawByName = (() => {
  const rawGlob = import.meta.glob<string>('../../assets/icons/*.svg', {
    query: '?raw',
    import: 'default',
    eager: true,
  })
  const map = new Map<string, string>()
  for (const [path, content] of Object.entries(rawGlob)) {
    const m = path.match(/\/([^/]+)\.svg$/)
    if (m?.[1]) map.set(m[1], content)
  }
  return map
})()

function getParsedIcon(icon: string): LoadedSvg | null {
  const raw = iconRawByName.get(icon)
  if (raw == null) {
    console.error(
      `SvgIcon: no bundled icon "${icon}". Add src/assets/icons/${icon}.svg or fix the name.`,
    )
    return null
  }
  return parseSvg(raw)
}

export function SvgIcon({ icon, size = 24, color = 'currentColor' }: Props) {
  const loaded = useMemo(() => getParsedIcon(icon), [icon])
  const svgClass = useMemo(() => `icon icon-${icon}`, [icon])

  if (!loaded?.inner) return null

  return (
    <svg
      className={svgClass}
      style={{ color, display: 'inline-block', verticalAlign: 'middle' }}
      width={size}
      height={size}
      viewBox={loaded.viewBox}
      fill={loaded.fill ?? 'currentColor'}
      stroke={loaded.stroke}
      strokeWidth={loaded.strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: loaded.inner }}
    />
  )
}
