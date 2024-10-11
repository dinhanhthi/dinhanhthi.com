'use client'

import cn from 'classnames'

import { MENUS, MenuType } from '../../../data/menus'
import useReadingProgress from '../../hooks/useReadingProgress'
import { containerWide } from '../../lib/config'
import Container from '../Container'
import NavAvatar from './NavAvatar'
import NavHidden from './NavHidden'
import NavSearch from './NavSearch'
import NavTopicItem from './NavTopicItem'
import NavTopicsDropdown from './NavTopicsDropdown'

const navHeight = 'h-14'
export const paddingTopNav = 'pt-14' // Must be the same as navHeight!
const navClasses = 'bg-nav-dark-bg shadow-transparent text-gray-300'
export const textClass = 'text-gray-300 md:hover:text-white md:hover:bg-gray-700'
export const groupSpaceClass = 'ml-2 md:ml-4'

export default function Nav() {
  const completion = useReadingProgress()

  return (
    <>
      {/* Make sure the z-index in NavHidden is bigger than this  */}
      <div className={`sticky left-0 top-0 z-[999] w-full ${navClasses} ${navHeight}`}>
        <Container className={cn('h-full', containerWide)}>
          <div className="flex h-full flex-wrap items-center justify-items-stretch">
            <div className="w-full">
              <div
                className="mx-anav-
            uto px-4 lg:px-2"
              >
                <div className="relative flex items-center justify-between">
                  <nav
                    className="flex flex-1 items-center justify-center gap-2 sm:gap-0 md:justify-start"
                    aria-label="Menu"
                  >
                    <NavAvatar />
                    <div className={groupSpaceClass}>
                      <div className="flex items-center sm:space-x-2">
                        {MENUS?.map((item: MenuType) => (
                          <NavTopicItem
                            uri={item.uri as string}
                            label={item.name}
                            key={item.uri}
                            customClass="hidden lg:flex"
                          />
                        ))}
                        <NavHidden className="hidden lg:block" />
                        <NavTopicsDropdown />
                      </div>
                    </div>
                    <NavSearch />
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </Container>
        <span
          style={{ transform: `translateX(${completion - 100}%)` }}
          className="absolute bg-[#ffa541] h-[3px] w-full bottom-0"
        />
      </div>
    </>
  )
}
