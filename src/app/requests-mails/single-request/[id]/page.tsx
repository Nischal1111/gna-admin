"use client"
import SingleRequest from "@/components/RequestMail/SingleRequest"
import { useParams } from "next/navigation"
import React from "react"

const page = () => {
  const params = useParams()
  const id = params?.id?.toString() || ""
  console.log(id)
  return (
    <div className="w-full">
      <SingleRequest requestId={id} />
      {/* <h1>Hello tazi</h1> */}
    </div>
  )
}

export default page
