import React from 'react'
import NotFound from '../components/NotFound'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Commitspark - Page not found',
}

const NotFoundPage: React.FC = () => {
  return <NotFound />
}

export default NotFoundPage
