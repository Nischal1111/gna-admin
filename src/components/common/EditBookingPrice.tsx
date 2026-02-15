import axios from "axios"
import React, { useState, FC, useEffect } from "react"
import { toast } from "sonner"

interface BookingPriceDetails {
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

interface UpdateBookingPriceProps {
  adventureType: string
  adventureId: string
  bookingPriceDetails: BookingPriceDetails
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

const UpdateBookingPrice: FC<UpdateBookingPriceProps> = ({
  adventureType,
  adventureId,
  bookingPriceDetails,
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

  // Load booking price details when the component mounts or when bookingPriceDetails changes
  useEffect(() => {
    if (bookingPriceDetails) {
      setFormData({
        adventureType,
        adventureId,
        solo: bookingPriceDetails.solo || "",
        soloThreeStar: bookingPriceDetails.soloThreeStar || "",
        soloFourStar: bookingPriceDetails.soloFourStar || "",
        soloFiveStar: bookingPriceDetails.soloFiveStar || "",
        singleSupplementary: bookingPriceDetails.singleSupplementary || "",
        singleSupplementaryThreeStar:
          bookingPriceDetails.singleSupplementaryThreeStar || "",
        singleSupplementaryFourStar:
          bookingPriceDetails.singleSupplementaryFourStar || "",
        singleSupplementaryFiveStar:
          bookingPriceDetails.singleSupplementaryFiveStar || "",
        standardThreeStar: bookingPriceDetails.standardThreeStar || "",
        standardFourStar: bookingPriceDetails.standardFourStar || "",
        standardFiveStar: bookingPriceDetails.standardFiveStar || "",
      })
    } else {
      // If no booking price details are provided, fetch them
      fetchBookingPriceDetails()
    }
  }, [bookingPriceDetails, adventureType, adventureId])

  const fetchBookingPriceDetails = async () => {
    try {
      setStatus({ loading: true, success: false, error: null })

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/booking/get-single-booking-price/${adventureId}/${adventureType}`
      )

      const data = response.data

      if (data.success && data.bookingPrice) {
        const details = data.bookingPrice
        setFormData({
          adventureType,
          adventureId,
          solo: details.solo || "",
          soloThreeStar: details.soloThreeStar || "",
          soloFourStar: details.soloFourStar || "",
          soloFiveStar: details.soloFiveStar || "",
          singleSupplementary: details.singleSupplementary || "",
          singleSupplementaryThreeStar:
            details.singleSupplementaryThreeStar || "",
          singleSupplementaryFourStar:
            details.singleSupplementaryFourStar || "",
          singleSupplementaryFiveStar:
            details.singleSupplementaryFiveStar || "",
          standardThreeStar: details.standardThreeStar || "",
          standardFourStar: details.standardFourStar || "",
          standardFiveStar: details.standardFiveStar || "",
        })
      }

      setStatus({ loading: false, success: false, error: null })
    } catch (error) {
      setStatus({
        loading: false,
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch booking price details",
      })
      toast.error("Failed to fetch booking price details")
    }
  }

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
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/booking/update-booking-price`,
        formData
      )
      const data = response.data

      if (!data.success) {
        toast.error(data.message || "Failed to update booking price")
        throw new Error(data.message || "Failed to update booking price")
      }

      setStatus({ loading: false, success: true, error: null })
      toast.success(data.message || "Booking price updated successfully!")
    } catch (error) {
      setStatus({
        loading: false,
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      })
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      )
    }
  }

  return (
    <div className="max-w-2xl border border-primary mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Update Booking Price</h2>

      {status.success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Booking price updated successfully!
        </div>
      )}

      {status.error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          Error: {status.error}
        </div>
      )}

      {status.loading && !status.error ? (
        <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded">
          Loading...
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Solo n Section */}
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
          {/* Single supplimentary Accommodation Section */}
          <div className="mt-6 mb-6 border-t pt-4">
            <h3 className="text-xl font-semibold mb-4">
              Single Supplimentary Prices
            </h3>

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
                  Standard 4★ ($) *
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
              {status.loading ? "Updating..." : "Update Booking Price"}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default UpdateBookingPrice
