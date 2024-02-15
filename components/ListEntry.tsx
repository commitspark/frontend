import React from 'react'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { classNames } from './lib/styling'
import type { Route } from 'next'
import Link from 'next/link'

export interface ListEntryProps {
  linkTarget: Route
  linkContent: Record<string, string>
  isCurrent?: boolean
}

const ListEntry: React.FC<React.PropsWithChildren<ListEntryProps>> = (
  props: React.PropsWithChildren<ListEntryProps>,
) => {
  return (
    <li>
      <Link
        href={props.linkTarget}
        className={classNames(
          'block menu-item-colors',
          props.isCurrent ? 'menu-item-colors-selected' : '',
        )}
      >
        <div className="flex flex-row px-4 py-4">
          {/* min-w-0 is needed for text ellipsis to appear */}
          <div className="min-w-0 flex-grow flex flex-row">
            {Object.keys(props.linkContent).map((key: string, index) => (
              <div className="min-w-0 flex-1" key={index}>
                <p className="truncate menu-item-typography">
                  {props.linkContent[key]}
                </p>
              </div>
            ))}
          </div>
          <div className="flex-none ml-2">
            <ChevronRightIcon className="icon-size" />
          </div>
        </div>
      </Link>
    </li>
  )
}

export default ListEntry
