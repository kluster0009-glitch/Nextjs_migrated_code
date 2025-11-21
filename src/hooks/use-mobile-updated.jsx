"use client"

import * as React from "react"
import { useMediaQuery } from "@/hooks/use-media-query"

const MOBILE_BREAKPOINT = 768

export function useMobile() {
  return useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
}
