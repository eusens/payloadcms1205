import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header } from '@/payload-types'

export async function Header() {
  const header: Header = await getCachedGlobal('header', 1)()

  return (
    <div className="bg-gray-500 text-white"> {/* or any other color class you prefer */}
      <HeaderClient header={header} />
    </div>
  )
}
