"use client"
import axios from "axios"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"

interface TripType {
  _id: string
  title: string
  description: string
  image: string
}

interface TripTypeSelectProps {
  tripType: {
    id: string
    title: string
  }
  handleTripTypeChange: (event: { id: string; title: string }) => void
}

const TripTypeForm: React.FC<TripTypeSelectProps> = ({
  tripType,
  handleTripTypeChange,
}) => {
  const [tripTypes, setTripTypes] = useState<TripType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    const fetchTripTypes = async () => {
      setLoading(true)
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_DEV}/trips-and-tours/get`,
          {
            params: {
              select: "_id title",
            },
          }
        )

        const data = response.data
        setTripTypes(data.data)
        setError(null)
      } catch (err) {
        setError((err as Error).message || "Something went wrong.")
        setTripTypes([])
      } finally {
        setLoading(false)
      }
    }

    fetchTripTypes()
  }, [])

  const handlePageRedirect = () => {
    const confirmation = window.confirm(
      "Are you sure you want to leave this page? All unsaved data will be lost."
    )
    if (confirmation) {
      router.push("/tours/create-trips-and-tours")
    }
  }

  const onTripTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = tripTypes.find((type) => type.title === e.target.value)

    console.log(selectedType)
    if (selectedType) {
      handleTripTypeChange({
        id: selectedType._id,
        title: selectedType.title,
      })
    }
  }

  return (
    <div className="mb-4">
      <div className="flex items-center gap-4 mb-2">
        <h2 className="text-lg font-semibold text-primary">Trip Type</h2>
        <p> | </p>
        <div className="text-gray-500 italic">
          Add New Trip Type?{" "}
          <button
            onClick={handlePageRedirect}
            className="underline text-tourPrimary"
          >
            {" "}
            Create New
          </button>
        </div>
      </div>
      {loading ? (
        <p className="text-sm text-gray-500">Loading trip types...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <select
          id="tripType"
          value={tripType.title}
          onChange={onTripTypeChange}
          required
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            Select Trip Type
          </option>
          {tripTypes.map((type) => (
            <option key={type._id} value={type.title}>
              {type.title}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}

export default TripTypeForm
