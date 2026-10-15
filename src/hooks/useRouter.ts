import { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'

/**
 * State management for app navigation (href clicks, popstate).
 * Use this in `app/router.tsx` to keep the router thin — it only handles
 * route path matching and component composition, not the history plumbing.
 */
export type AppLocation = {
  pathname: string
  search: string
}

/**
 * Handles navigation on anchor (`<a>`) clicks within origin.
 * Also listens for browser back/forward (popstate).
 */
export function useRouter(initialLocation?: AppLocation) {
  const [location, setLocation] = useState(initialLocation ?? {
    pathname: window.location.pathname,
    search: window.location.search,
  })

  // Listener for browser back/forward
  useEffect(() => {
    const handlePopState = () =>
      setLocation({
        pathname: window.location.pathname,
        search: window.location.search,
      })
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleNavigation = (event: MouseEvent<HTMLElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      !(event.target instanceof Element)
    ) {
      return
    }

    const anchor = event.target.closest('a[href]')
    if (
      !(anchor instanceof HTMLAnchorElement) ||
      anchor.target ||
      anchor.hasAttribute('download')
    ) {
      return
    }
    const destination = new URL(anchor.href, window.location.href)
    if (destination.origin !== window.location.origin) {
      return
    }
    if (
      destination.pathname === window.location.pathname &&
      destination.hash !== window.location.hash
    ) {
      return
    }
    event.preventDefault()
    window.history.pushState(
      {},
      '',
      `${destination.pathname}${destination.search}${destination.hash}`,
    )
    setLocation({
      pathname: destination.pathname,
      search: destination.search,
    })
  }

  const navigateTo = (pathname: string) => {
    window.history.pushState({}, '', pathname)
    setLocation({ pathname, search: '' })
  }

  return {
    location,
    handleNavigation,
    navigateTo,
  }
}