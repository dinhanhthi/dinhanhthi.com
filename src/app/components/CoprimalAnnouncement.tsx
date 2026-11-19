import cn from 'classnames'
import Image from 'next/image'

import Container from './Container'
import { Button } from './ui/button'

const coprimalUrl = 'https://coprimal.dev'

const links = [
  { label: '🌐 Visit coprimal.dev', href: coprimalUrl, primary: true },
  { label: '🐙 GitHub', href: 'https://github.com/Coprimal' },
  { label: '💡 Share an idea', href: 'https://github.com/Coprimal/round-table/discussions' },
  { label: '𝕏 @coprimal_dev', href: 'https://x.com/coprimal_dev' }
]

// Coprimal brand blues (Bright Navy #225DB4, Blue #3977CF) for the primary action only
const primaryButtonClass =
  'border-transparent bg-[#225DB4] text-white hover:bg-[#11376E] hover:text-white dark:bg-[#3977CF] dark:hover:bg-[#225DB4]'

function CoprimalLogo({ size }: { size: number }) {
  return (
    <Image
      src="/coprimal/logo.png"
      alt="Coprimal"
      width={size}
      height={size}
      className="shrink-0"
    />
  )
}

function JustLaunchedBadge() {
  return (
    <span className="shrink-0 rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-sky-800 dark:bg-sky-400/15 dark:text-sky-200">
      🎉 Just launched
    </span>
  )
}

/** Announcement box shown on the home page, above "Recent tools I create". */
export function CoprimalBox() {
  return (
    <section
      data-pagefind-ignore
      className="flex flex-col gap-3 rounded-xl border border-sky-200 bg-sky-50/70 p-4 sm:flex-row sm:items-start sm:gap-4 dark:border-sky-400/20 dark:bg-sky-400/5"
    >
      <CoprimalLogo size={44} />
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-heading text-text-heading text-lg font-medium">
            Meet Coprimal, the new home of my open source projects
          </h2>
          <JustLaunchedBadge />
        </div>
        <p className="text-text text-sm">
          <i>By devs. For devs. Still devs.</i> I started Coprimal as one home for every open source
          project I build with friends: free apps for macOS, Windows, the browser and the terminal,
          plus free learning materials in Vietnamese on Math2IT. Everything is free and open source,
          and where a tool uses AI, it runs with your own key or a local model.
        </p>
        <div className="mt-1 flex flex-wrap gap-2">
          {links.map(link => (
            <Button
              key={link.href}
              size="xs"
              variant="outline"
              className={cn({ [primaryButtonClass]: link.primary })}
              asChild
            >
              <a href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Full-width strip shown right below the post header. */
export function CoprimalBanner() {
  return (
    <div
      data-pagefind-ignore
      className="border-y border-sky-200 bg-sky-50 px-4 py-2.5 dark:border-sky-400/20 dark:bg-[#262b36]"
    >
      <Container className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
        <CoprimalLogo size={22} />
        <JustLaunchedBadge />
        <p className="text-text min-w-0 flex-1 basis-56">
          All my open source projects now live at <b>Coprimal</b>.
        </p>
        <Button size="xs" variant="outline" className={primaryButtonClass} asChild>
          <a href={coprimalUrl} target="_blank" rel="noopener noreferrer">
            🌐 Visit coprimal.dev
          </a>
        </Button>
      </Container>
    </div>
  )
}
