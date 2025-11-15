'use client'

import { TechItem } from '@/src/data/techs'
import { cn } from '@/src/lib/utils'
import { useMemo } from 'react'
import skills from '../../data/skills'
import techs from '../../data/techs'
import BadgeTechBigSimple from './BadgeTechBigSimple'
import Container from './Container'
import HeadingPage from './HeadingPage'

type AnimatedSkillsSectionProps = {
  className?: string
}

export default function AnimatedSkillsSection(props: AnimatedSkillsSectionProps) {
  const { className } = props

  // Flatten all skills into a single array
  const allSkillIds = useMemo(() => {
    return skills.flatMap(group => group.list)
  }, [])

  // Get tech items for all skills
  const allTechs = useMemo(() => {
    return allSkillIds
      .map(id => {
        const techItem = techs.find(tech => tech.id === id)
        if (!techItem) return null
        return { ...techItem, icon: { staticImageData: techItem.icon } } as TechItem
      })
      .filter((item): item is TechItem => item !== null)
  }, [allSkillIds])

  // Split into 3 rows
  const itemsPerRow = Math.ceil(allTechs.length / 3)
  const row1 = allTechs.slice(0, itemsPerRow)
  const row2 = allTechs.slice(itemsPerRow, itemsPerRow * 2)
  const row3 = allTechs.slice(itemsPerRow * 2)

  // Duplicate items for seamless loop
  const duplicatedRow1 = [...row1, ...row1]
  const duplicatedRow2 = [...row2, ...row2]
  const duplicatedRow3 = [...row3, ...row3]

  return (
    <Container className={cn('w-full overflow-hidden', className)}>
      <HeadingPage title="Techs that I work with" className="mb-4 text-center" />

      <div className="relative flex flex-col gap-4">
        {/* Row 1: Right to Left */}
        <div className="relative overflow-hidden">
          <div className="animate-scroll-rtl flex gap-3">
            {duplicatedRow1.map((tech, index) => (
              <div key={`row1-${tech.id}-${index}`} className="flex-shrink-0">
                <BadgeTechBigSimple tech={tech} />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Left to Right */}
        <div className="relative overflow-hidden">
          <div className="animate-scroll-ltr flex gap-3">
            {duplicatedRow2.map((tech, index) => (
              <div key={`row2-${tech.id}-${index}`} className="flex-shrink-0">
                <BadgeTechBigSimple tech={tech} />
              </div>
            ))}
          </div>
        </div>

        {/* Row 3: Right to Left */}
        <div className="relative overflow-hidden">
          <div className="animate-scroll-rtl flex gap-3">
            {duplicatedRow3.map((tech, index) => (
              <div key={`row3-${tech.id}-${index}`} className="flex-shrink-0">
                <BadgeTechBigSimple tech={tech} />
              </div>
            ))}
          </div>
        </div>

        {/* Left fade overlay */}
        <div className="fade-left" />
        {/* Right fade overlay */}
        <div className="fade-right" />
      </div>

      <style jsx>{`
        @keyframes scroll-rtl {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-ltr {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-scroll-rtl {
          animation: scroll-rtl 30s linear infinite;
        }

        .animate-scroll-ltr {
          animation: scroll-ltr 30s linear infinite;
        }

        @media (max-width: 768px) {
          .animate-scroll-rtl {
            animation: scroll-rtl 10s linear infinite;
          }

          .animate-scroll-ltr {
            animation: scroll-ltr 10s linear infinite;
          }
        }

        .fade-left {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 100px;
          background: linear-gradient(90deg, rgb(35 38 46), transparent);
          pointer-events: none;
          z-index: 10;
        }

        .fade-right {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 100px;
          background: linear-gradient(270deg, rgb(35 38 46), transparent);
          pointer-events: none;
          z-index: 10;
        }

        :global([data-theme='light']) {
          .fade-left {
            background: linear-gradient(90deg, rgb(245 245 245), transparent);
          }
          .fade-right {
            background: linear-gradient(270deg, rgb(245 245 245), transparent);
          }
        }
      `}</style>
    </Container>
  )
}
