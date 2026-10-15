import type { ReactNode } from 'react'
import '../index.css'

type ProvidersProps = {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return children
}
