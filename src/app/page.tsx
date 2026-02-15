"use client"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const router = useRouter()

  const pathname = usePathname()

  useEffect(() => {
    router.push("/home")
  }, [router, pathname])

  return null // Prevents any UI from rendering
}
