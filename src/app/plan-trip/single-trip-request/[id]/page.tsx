"use client"
import ViewSinglePlanTripRequest from "@/components/planTrip/ViewSinglePlanTripRequest"
import { useParams } from "next/navigation"
import React from "react"

const page = () => {
  const id = useParams().id?.toString() || ""
  return (
    <div className="w-full">
      <ViewSinglePlanTripRequest requestId={id} />
    </div>
  )
}

export default page
