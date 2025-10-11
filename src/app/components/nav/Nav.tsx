'use client'

import useReadingProgress from '@/src/hooks/useReadingProgress'
import { MENUS, MenuType } from '../../../data/menus'
import Container from '../Container'
import NavHidden from './NavHidden'
import NavSearch from './NavSearch'
import NavTopicItem from './NavTopicItem'
import NavTopicsDropdown from './NavTopicsDropdown'

export const textClass = 'text-gray-300 md:hover:text-white md:hover:bg-gray-700'

export default function Nav() {
  const completion = useReadingProgress()

  return (
    <>
      {/* Make sure the z-index in NavHidden is bigger than this  */}
      <div
        className={
          'bg-nav-dark-bg sticky top-0 left-0 z-[999] h-14 w-full text-gray-300 shadow-transparent'
        }
      >
        <Container className="h-full">
          <div className="flex h-full flex-wrap items-center justify-items-stretch">
            <div className="w-full">
              <div className="mx-auto px-0">
                <div className="relative flex items-center justify-between">
                  <nav className="flex w-full items-center" aria-label="Menu">
                    {/* Left side: Avatar + Thi Notes */}
                    <div className="flex items-center gap-2 sm:gap-0">
                      {/* <NavAvatar /> */}
                      <div className={'ml-0 md:ml-2'}>
                        <NavTopicItem uri="/" label="Thi Notes" className="!text-lg !text-white" />
                      </div>
                    </div>

                    {/* Right side: Other menu items + search (desktop) */}
                    <div className="hidden flex-1 items-center justify-end gap-2 md:flex">
                      {MENUS?.filter((item: MenuType) => item.uri !== '/').map((item: MenuType) => (
                        <NavTopicItem uri={item.uri as string} label={item.name} key={item.uri} />
                      ))}
                      <NavHidden />
                      <NavSearch />
                    </div>

                    {/* Mobile menu (dropdown + search) */}
                    <div className="flex flex-1 items-center justify-end gap-2 md:hidden">
                      <NavTopicsDropdown />
                      <NavSearch />
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </Container>
        <span
          style={{ transform: `translateX(${completion - 100}%)` }}
          className="absolute bottom-0 h-[3px] w-full bg-[#ffa541]"
        />
      </div>
    </>
  )
}
