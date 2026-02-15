import React from "react"
import Image from "next/image"

const HomeLoading = () => {
  return (
    <div className="flex items-center justify-center h-full w-full  relative">
      {/* Spinner */}
      <div className="absolute animate-spin rounded-full border-t-4 border-primary border-solid border-opacity-75 h-[150px] w-[150px]"></div>

      {/* Logo */}
      <div className="z-10 flex items-center justify-center">
        <Image src="/going.png" alt="Logo" width={"100"} height={"100"} />
      </div>
    </div>
  )
}

export default HomeLoading
