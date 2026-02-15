"use client"
import React, { useState } from "react"
import { Users, Globe, Info, ChevronRight, Building } from "lucide-react"
import MembersManage from "@/components/Resources/Aboutus/MembersManage"
import AffiliatesManage from "@/components/Resources/Aboutus/AffiliatesManage"

const page = () => {
  const [selectedCategory, setSelectedCategory] = useState("members")

  return (
    <div className="min-h-screen bg-gray-50 w-full p-8">
      {/* Header Section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">About Us</h1>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Our Members Card */}
        <div
          className={`${
            selectedCategory === "members" ? "bg-blue-50" : "bg-white"
          } rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all`}
          onClick={() => setSelectedCategory("members")}
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Users size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Our Members
                </h3>
                <p>Manage the members</p>
              </div>
            </div>
          </div>
        </div>
        {/* Affiliates Card */}
        <div
          className={`${
            selectedCategory === "affiliates" ? "bg-green-50" : "bg-white"
          } rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all`}
          onClick={() => setSelectedCategory("affiliates")}
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Globe size={24} className="text-green-600" />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Affiliates
                </h3>
                <p>National and Internationals</p>
              </div>
            </div>
          </div>
        </div>
        {/* Who Are We Card */}
        {/* <div
          className={`${
            selectedCategory === "whoarewe" ? "bg-purple-50" : "bg-white"
          } rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all`}
          onClick={() => setSelectedCategory("whoarewe")}
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Info size={24} className="text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Who are we?
                </h3>
                <p>Manage about us</p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
      {/* for components */}
      <div>
        {selectedCategory === "members" && (
          <>
            <MembersManage />
          </>
        )}
        {selectedCategory === "affiliates" && (
          <>
            <AffiliatesManage />
          </>
        )}
        {/* {selectedCategory === "whoarewe" && <h1>WHo are we</h1>} */}
      </div>
    </div>
  )
}

export default page
