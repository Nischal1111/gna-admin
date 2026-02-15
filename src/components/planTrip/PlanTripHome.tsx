"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Loader } from "../loading/Loader"
import { Button } from "../ui/button"
import {
  Trash2,
  Plus,
  Search,
  Filter,
  SortAsc,
  MapPin,
  Calendar,
} from "lucide-react"

import { CustomPagination } from "../utils/Pagination"
import { Switch } from "../ui/switch"

import { toast } from "sonner"
import { DeleteTripRequest } from "./DeleteTripRequest"
import HomeLoading from "../home/HomeLoading"

interface Trip {
  _id: string
  fullName: string
  destination: string
  duration: string
  status: string
  email: string
}

const PlanTripHome: React.FC = () => {
  const router = useRouter()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [updateLoading, setUpdateLoading] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(8)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [search, setSearch] = useState<string>("")
  const [sort, setSort] = useState<string>("-startDate")
  const [status, setStatus] = useState<string>("")
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedTripToDelete, setSelectedTripToDelete] = useState<
    string | null
  >(null)
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false)

  // Fetch trips data with filters
  const getTrips = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/plan-trip/get-trip-requests`,
        {
          params: {
            page,
            limit,
            search,
            sort,
            status,
          },
        }
      )
      if (response.data.success) {
        setTrips(response.data.data)
        setTotalPages(response.data.totalPages)
      }
    } catch (error) {
      console.log("Failed to fetch trip data")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (tripId: string) => {
    setSelectedTripToDelete(tripId)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true)
      if (selectedTripToDelete) {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL_DEV}/plan-trip/delete-request/${selectedTripToDelete}`
        )
        if (response.data.success) {
          setDeleteLoading(false)
          toast.success(response.data.message)
          getTrips()
        } else {
          setDeleteLoading(false)
          toast.error(response.data.message)
        }
      }
    } catch (error) {
      setDeleteLoading(false)
      toast.error("Failed to delete trip")
    } finally {
      setDeleteModalOpen(false)
    }
  }

  //debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      getTrips()
    }, 1000)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    getTrips()
  }, [page, limit, sort, status])

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Trip Planner</h2>
        </div>
        <p className="text-gray-600">
          Manage and organize your travel plans and itineraries
        </p>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="relative">
          <SortAsc className="absolute left-3 top-2 text-gray-400" size={20} />
          <select
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              setPage(1)
            }}
          >
            <option value="">Trip Status (All)</option>
            <option value="pending">Pending</option>
            <option value="viewed">Viewed</option>
          </select>
        </div>

        <div className="relative">
          <SortAsc className="absolute left-3 top-2 text-gray-400" size={20} />
          <select
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value)
              setPage(1)
            }}
          >
            <option value="">Sort by...</option>
            <option value="-createdAt">Newest First</option>
            <option value="createdAt">Oldest First</option>
            <option value="fullName">Name A-Z</option>
            <option value="-fullName">Name Z-A</option>
          </select>
        </div>

        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user name"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          <Search
            className="absolute right-3 top-2 cursor-pointer text-primary"
            size={20}
            onClick={() => getTrips()}
          />
        </div>
      </div>

      {/* Trips List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                User Details
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {trips.map((trip) => (
              <tr key={trip._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {trip.fullName}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <MapPin size={16} className="text-primary" />
                        {trip.destination}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                        <Calendar size={16} className="text-primary" />
                        {trip.duration}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-md ${
                        trip.status === "pending"
                          ? "text-orange-600"
                          : trip.status === "viewed"
                          ? "text-green-600"
                          : "text-blue-600"
                      } font-semibold `}
                    >
                      {trip.status}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center space-x-3">
                    <Button
                      onClick={() =>
                        router.push(
                          `/plan-trip/single-trip-request/${trip._id}`
                        )
                      }
                      className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg"
                    >
                      View Details
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteClick(trip._id)}
                      className="px-4 py-2 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Loading and Empty States */}
      {/* Loading and Empty States */}
      {loading && (
        <div className="flex justify-center mt-40">
          <HomeLoading />
        </div>
      )}

      {!loading && trips.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
          <p className="text-2xl text-gray-400 font-medium">No trips found</p>
          <p className="text-gray-500 mt-2">No any plan trip requests found.</p>
        </div>
      )}

      {/* Pagination */}
      {trips.length > 0 && (
        <div className="mt-6">
          <CustomPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}

      {/* Delete Modal */}
      <DeleteTripRequest
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        loading={deleteLoading}
        itemName={
          trips.find((t) => t._id === selectedTripToDelete)?.fullName || ""
        }
      />
    </div>
  )
}

export default PlanTripHome
