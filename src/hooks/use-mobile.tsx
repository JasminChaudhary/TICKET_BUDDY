import * as React from "react"

// Breakpoints that match Tailwind's default breakpoints
export const BREAKPOINTS = {
  xs: 0,     // Extra small devices
  sm: 640,   // Small devices like phones
  md: 768,   // Medium devices like tablets
  lg: 1024,  // Large devices like laptops
  xl: 1280,  // Extra large devices
  '2xl': 1536 // 2X Large devices
}

/**
 * Hook to detect mobile devices based on screen width
 * @returns {boolean} Whether the device is a mobile device
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BREAKPOINTS.md - 1}px)`)
    
    const onChange = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.md)
    }
    
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < BREAKPOINTS.md)
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

/**
 * Hook to detect the current viewport size
 * @returns {string} The current viewport size (xs, sm, md, lg, xl, 2xl)
 */
export function useViewportSize() {
  const [viewport, setViewport] = React.useState<string>("xs")

  React.useEffect(() => {
    const checkViewport = () => {
      const width = window.innerWidth
      
      if (width >= BREAKPOINTS["2xl"]) {
        setViewport("2xl")
      } else if (width >= BREAKPOINTS.xl) {
        setViewport("xl")
      } else if (width >= BREAKPOINTS.lg) {
        setViewport("lg")
      } else if (width >= BREAKPOINTS.md) {
        setViewport("md")
      } else if (width >= BREAKPOINTS.sm) {
        setViewport("sm")
      } else {
        setViewport("xs")
      }
    }

    window.addEventListener("resize", checkViewport)
    checkViewport() // Initial check
    
    return () => window.removeEventListener("resize", checkViewport)
  }, [])

  return viewport
}

/**
 * Hook to check if viewport is at least a specific size
 * @param {string} size The minimum size to check for
 * @returns {boolean} Whether the viewport is at least the specified size
 */
export function useMinViewport(size: keyof typeof BREAKPOINTS) {
  const [isMin, setIsMin] = React.useState<boolean>(false)

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${BREAKPOINTS[size]}px)`)
    
    const onChange = () => {
      setIsMin(mql.matches)
    }
    
    mql.addEventListener("change", onChange)
    setIsMin(mql.matches)
    
    return () => mql.removeEventListener("change", onChange)
  }, [size])

  return isMin
}
