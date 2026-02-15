"use client"

import SingleBookingView from "@/components/bookings/SingleBookingView"
import { useParams } from "next/navigation"

const Page = () => {
  const params = useParams()
  const id = params.id as string

  return (
    <div className="w-full">
      <SingleBookingView id={id} />
    </div>
  )
}

export default Page
