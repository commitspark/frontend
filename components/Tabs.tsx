'use client'

import React, { useState } from 'react'
import { classNames } from './lib/styling'
import Link from 'next/link'

export interface Tab {
  label: string
  content: React.ReactNode
  pill?: number
}

interface TabsProps {
  tabs: Tab[]
}

const Tabs: React.FC<TabsProps> = (props: TabsProps) => {
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0)

  return (
    <div>
      <div>
        <nav className="flex flex-row text-sm font-medium">
          {props.tabs.map((tab, index) => (
            <Link
              key={index}
              href="#"
              className={classNames(
                index === currentTabIndex
                  ? 'border-indigo-600 menu-item-colors-selected'
                  : 'border-transparent menu-item-colors hover:border-gray-200',
                'px-8 py-3 flex items-center whitespace-nowrap border-b-2 rounded-t',
              )}
              onClick={(event) => {
                event.preventDefault()
                setCurrentTabIndex(index)
              }}
            >
              {tab.label}
              {tab.pill ? (
                <span
                  className={
                    'border app-border-color ml-3 py-0.5 px-2.5 text-xs rounded-full'
                  }
                >
                  {tab.pill}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>
      </div>
      {props.tabs[currentTabIndex].content}
    </div>
  )
}

export default Tabs
