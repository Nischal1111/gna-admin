"use client"
import React, { useState } from "react"
import { ArrowLeft } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { Loader } from "../loading/Loader"
import { useRouter } from "next/navigation"
import { countries } from "./Contries"

const AddClient = () => {
  const [formUserData, setFormUserData] = useState({
    userName: "",
    userEmail: "",
    userPhone: "",
    userAddress: "",
    userCountry: "",
    userCompany: "",
  })
  const [country, setCountry] = useState("")

  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/users/add`,
        {
          userName: formUserData.userName,
          userEmail: formUserData.userEmail,
          userPhone: formUserData.userPhone,
          userAddress: formUserData.userAddress,
          userCountry: country.trim().toLowerCase(),
          userCompany: formUserData.userCompany,
        },
        {
          withCredentials: true,
        }
      )

      const data = response.data
      if (data.success) {
        toast.success(data.message || "User Created Successfully")
        router.push("/users-info")
      } else {
        toast.error(data.message || "Unable to Create User, Try Again")
      }
    } catch (error) {
      toast.error("Unable to Create User, Try Again")
      console.log("Error while creating user", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Add Client</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white rounded-lg shadow-sm border p-6"
      >
        <div className="grid md:grid-cols-2 gap-6">
          {/* name  */}
          <div className="space-y-2">
            <label
              htmlFor="userName"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formUserData.userName}
              required
              onChange={handleChange}
              placeholder="Enter user's name"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          {/* email  */}
          <div className="space-y-2">
            <label
              htmlFor="userEmail"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="userEmail"
              name="userEmail"
              value={formUserData.userEmail}
              onChange={handleChange}
              placeholder="Enter user's email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          {/* phone  */}
          <div className="space-y-2">
            <label
              htmlFor="userPhone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <input
              type="number"
              id="userPhone"
              name="userPhone"
              value={formUserData.userPhone}
              onChange={handleChange}
              placeholder="Enter user's phone number"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          {/* company  */}
          <div className="space-y-2">
            <label
              htmlFor="userCompany"
              className="block text-sm font-medium text-gray-700"
            >
              Company
            </label>
            <input
              type="text"
              id="userCompany"
              name="userCompany"
              value={formUserData.userCompany}
              onChange={handleChange}
              required
              placeholder="Enter user's company"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          {/* country  */}
          <div className=" items-center  space-y-2">
            <div>
              <label
                htmlFor="userAddress"
                className="block text-sm font-medium text-gray-700"
              >
                Select Country
              </label>

              <select
                id="userCountry"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="" disabled>
                  Select a country
                </option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <label
              htmlFor="userCountry"
              className="block text-lg font-semibold text-primary w-full "
            >
              {country}
            </label>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label
              htmlFor="userAddress"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <input
              type="text"
              id="userAddress"
              name="userAddress"
              value={formUserData.userAddress}
              onChange={handleChange}
              placeholder="Enter user's address"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {loading ? (
              <div className="flex gap-4">
                Adding... <Loader width="20px" height="20px" />
              </div>
            ) : (
              "Add Client"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddClient
