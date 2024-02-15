import React from 'react'
import { classNames } from '../lib/styling'
import DynamicIcon, { IconTheme } from '../DynamicIcon'
import Link from 'next/link'

interface TextMenuSideProps {
  menuEntries: TextMenuSideEntry[]
}

interface TextMenuSideEntry {
  label: string
  iconName: string
  href: string
  isSelected?: boolean
}

const TextMenuSide: React.FC<React.PropsWithChildren<TextMenuSideProps>> = (
  props: React.PropsWithChildren<TextMenuSideProps>,
) => {
  return (
    <aside className="w-64">
      <nav>
        <ul className="flex flex-col gap-y-1 whitespace-nowrap">
          {props.menuEntries.map((entry, index) => (
            <li key={index}>
              <Link
                href={entry.href}
                className={classNames(
                  !!entry.isSelected
                    ? 'menu-item-colors-selected'
                    : 'menu-item-colors',
                  'p-2 flex gap-x-2 rounded menu-item-typography',
                )}
              >
                <DynamicIcon
                  iconTheme={IconTheme.OutlineIcons24}
                  iconName={entry.iconName}
                  className={'icon-size'}
                />
                {entry.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default TextMenuSide
