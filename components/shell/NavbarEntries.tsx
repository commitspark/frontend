import React from 'react'
import {
  RepositoryInfoState,
  useRepositoryInfo,
} from '../context/RepositoryInfoProvider'
import { routes } from '../lib/route-generator'
import BackButton from './BackButton'
import DropDown, { ButtonType } from '../DropDown'
import Avatar from './Avatar'
import { DropDownEntryProps } from '../DropDownEntry'

interface NavbarEntries {
  userNavigation: DropDownEntryProps[]
}

const NavbarEntries: React.FC<NavbarEntries> = (props: NavbarEntries) => {
  const repositoryInfoState = useRepositoryInfo() as RepositoryInfoState
  return (
    <div className="flex-grow border-b app-border-color flex flex-row gap-x-4 pr-4">
      {repositoryInfoState?.repository && (
        <BackButton
          href={routes.repositoryList(repositoryInfoState.provider)}
          className={'border-r'}
        />
      )}
      <div className="flex items-center text-gray-900">
        {repositoryInfoState?.repository &&
          repositoryInfoState.owner &&
          repositoryInfoState.repository && (
            <>
              {repositoryInfoState?.owner}/{repositoryInfoState?.repository}
            </>
          )}
      </div>
      <div className={'flex-grow'} />
      <div className="flex items-center">
        <DropDown
          menuButtonType={ButtonType.custom}
          button={<Avatar />}
          menuEntries={props.userNavigation}
        />
      </div>
    </div>
  )
}

export default NavbarEntries
