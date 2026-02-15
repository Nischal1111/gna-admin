import axios from "axios"
import React, { useState, FC } from "react"
import { toast } from "sonner"

interface AddBookingPriceProps {
  adventureType: string
  adventureId: string
}

interface FormData {
  adventureType: string
  adventureId: string
  solo: string
  soloThreeStar: string
  soloFourStar: string
  soloFiveStar: string

  singleSupplementary: string
  singleSupplementaryThreeStar: string
  singleSupplementaryFourStar: string
  singleSupplementaryFiveStar: string
  standardThreeStar: string
  standardFourStar: string
  standardFiveStar: string
}

interface StatusState {
  loading: boolean
  success: boolean
  error: string | null
}

const AddBookingPrice: FC<AddBookingPriceProps> = ({
  adventureType,
  adventureId,
}) => {
  const [formData, setFormData] = useState<FormData>({
    adventureType,
    adventureId,

    solo: "",
    soloThreeStar: "",
    soloFourStar: "",
    soloFiveStar: "",
    singleSupplementary: "",
    singleSupplementaryThreeStar: "",
    singleSupplementaryFourStar: "",
    singleSupplementaryFiveStar: "",
    standardThreeStar: "",
    standardFourStar: "",
    standardFiveStar: "",
  })

  const [status, setStatus] = useState<StatusState>({
    loading: false,
    success: false,
    error: null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus({ loading: true, success: false, error: null })

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/booking/add-booking-price`,
        formData
      )
      const data = response.data

      if (!data.success) {
        toast.error(data.message || "Failed to add booking price")
        throw new Error(data.message || "Failed to add booking price")
      }

      setStatus({ loading: false, success: true, error: null })
      toast.success(data.message || "Booking price added successfully!")
      setFormData({
        adventureType,
        adventureId,
        solo: "",
        soloThreeStar: "",
        soloFourStar: "",
        soloFiveStar: "",
        singleSupplementary: "",
        singleSupplementaryThreeStar: "",
        singleSupplementaryFourStar: "",
        singleSupplementaryFiveStar: "",
        standardThreeStar: "",
        standardFourStar: "",
        standardFiveStar: "",
      })
    } catch (error) {
      setStatus({
        loading: false,
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      })
    }
  }

  return (
    <div className="w-[500px] border border-primary mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add Booking Price</h2>

      {status.success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Booking price added successfully!
        </div>
      )}

      {status.error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          Error: {status.error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Solo Accommodation Section */}
        <div className="mt-6 mb-6 border-t pt-4">
          <h3 className="text-xl font-semibold mb-4">Solo Prices</h3>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="solo">
              Solo Price ($) *
            </label>
            <input
              type="number"
              id="solo"
              name="solo"
              value={formData.solo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="mb-4">
              <label
                className="block text-gray-700 mb-2"
                htmlFor="soloThreeStar"
              >
                Solo 3★ ($) *
              </label>
              <input
                type="number"
                id="soloThreeStar"
                name="soloThreeStar"
                value={formData.soloThreeStar}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 mb-2"
                htmlFor="soloFourStar"
              >
                Solo 4★ ($) *
              </label>
              <input
                type="number"
                id="soloFourStar"
                name="soloFourStar"
                value={formData.soloFourStar}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 mb-2"
                htmlFor="soloFiveStar"
              >
                Solo 5★ ($) *
              </label>
              <input
                type="number"
                id="soloFiveStar"
                name="soloFiveStar"
                value={formData.soloFiveStar}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>
        {/*Single Supplementary Section */}
        <div className="mt-6 mb-6 border-t pt-4">
          <h3 className="text-xl font-semibold mb-4">
            Single Supplementary Prices
          </h3>
          {/* <div className="mb-4">
            <label
              className="block text-gray-700 mb-2"
              htmlFor="singleSupplementary"
            >
              Single Supplementary
            </label>
            <input
              type="number"
              id="singleSupplementary"
              name="singleSupplementary"
              value={formData.singleSupplementary}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div> */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="mb-4">
              <label
                className="block text-gray-700 mb-2"
                htmlFor="singleSupplementaryThreeStar"
              >
                Single Supplementary 3★ ($) *
              </label>
              <input
                type="number"
                id="singleSupplementaryThreeStar"
                name="singleSupplementaryThreeStar"
                value={formData.singleSupplementaryThreeStar}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 mb-2"
                htmlFor="singleSupplementaryFourStar"
              >
                Single Supplementary 4★ ($) *
              </label>
              <input
                type="number"
                id="singleSupplementaryFourStar"
                name="singleSupplementaryFourStar"
                value={formData.singleSupplementaryFourStar}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 mb-2"
                htmlFor="singleSupplementaryFiveStar"
              >
                Single Supplementary 5★ ($) *
              </label>
              <input
                type="number"
                id="singleSupplementaryFiveStar"
                name="singleSupplementaryFiveStar"
                value={formData.singleSupplementaryFiveStar}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Standard Accommodation Section */}
        <div className="mt-6 mb-6 border-t pt-4">
          <h3 className="text-xl font-semibold mb-4">
            Standard Accommodation Prices
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="mb-4">
              <label
                className="block text-gray-700 mb-2"
                htmlFor="standardThreeStar"
              >
                Standard 3★ ($) *
              </label>
              <input
                type="number"
                id="standardThreeStar"
                name="standardThreeStar"
                value={formData.standardThreeStar}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 mb-2"
                htmlFor="standardFourStar"
              >
                Standard 4★ ($) *
              </label>
              <input
                type="number"
                id="standardFourStar"
                name="standardFourStar"
                value={formData.standardFourStar}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 mb-2"
                htmlFor="standardFiveStar"
              >
                Standard 5★ ($) *
              </label>
              <input
                type="number"
                id="standardFiveStar"
                name="standardFiveStar"
                value={formData.standardFiveStar}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-blue-300"
            disabled={status.loading}
          >
            {status.loading ? "Adding..." : "Add Booking Price"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddBookingPrice
