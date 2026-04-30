import { useEffect, useMemo, useState } from 'react'

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

  // If the file is a full `<svg ...>...</svg>`, extract `viewBox` + inner markup.
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

  // Otherwise assume it’s already inner markup (paths/groups), keep a default viewBox.
  return { inner: text, viewBox: '0 0 24 24' }
}

export function SvgIcon({ icon, size = 24, color = 'currentColor' }: Props) {
  const [loaded, setLoaded] = useState<LoadedSvg | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch(`/assets/icons/${encodeURIComponent(icon)}.svg`)
        if (!res.ok) throw new Error('SVG not found')
        const svgText = await res.text()
        const parsed = parseSvg(svgText)
        if (!cancelled) setLoaded(parsed)
      } catch (err) {
        // Keep behavior aligned with Vue: log and render nothing on failure.
        console.error(`Error loading icon: ${icon}`, err)
        if (!cancelled) setLoaded(null)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [icon])

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

