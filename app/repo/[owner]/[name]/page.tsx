import React from 'react'

interface RepositoryPageParams {
  provider: string
  owner: string
  name: string
}

// TODO remove this page and instead send users directly to a default branch, e.g. `main`
export default function RepositoryPage({
  params,
}: {
  params: RepositoryPageParams
}) {
  return <></>
}
