import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation } from 'react-router-dom'

export function SyncLangWithRoute({ languages }: { languages?: Readonly<Array<string>> }) {
  const { i18n } = useTranslation()
  const { pathname } = useLocation()

  useEffect(() => {
    if (languages && languages.length > 0) {
      const currentLang = i18n.language

      const firstBit = pathname.split('/')[1]
      if (languages.includes(firstBit) && firstBit !== currentLang) {
        i18n.changeLanguage(firstBit)
      }
    }
  }, [pathname])

  return <Outlet />
}
