"use client"
import AddBlogForm from "@/components/blogs/AddBlogForm"
import React from "react"

const page = () => {
  const handleSubmit = (data: any) => {
    // Handle form submission logic here
  }

  return (
    <div className="w-full">
      <AddBlogForm onSubmit={handleSubmit} />
    </div>
  )
}

export default page
