"use client"
import { useRouter } from "next/navigation"

export function ViewButton({ slug }: { slug: string }) {
  const router = useRouter()

  const handleView = () => {
    router.push(`/event/${slug}`)
  }

  return (
    <button onClick={handleView} className="text-blue-400 hover:underline">
      View
    </button>
  )
}
