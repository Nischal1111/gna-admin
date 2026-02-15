"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Loader } from "../loading/Loader"
import { Button } from "../ui/button"
import {
  Trash2,
  Plus,
  TreePineIcon,
  Filter,
  SortAsc,
  MapPin,
} from "lucide-react"
import { DeleteTour } from "./DeleteTour"
import { CustomPagination } from "../utils/Pagination"
import { Switch } from "../ui/switch"
import { toast } from "sonner"
import HomeLoading from "../home/HomeLoading"

interface Tour {
  _id: string
  name: string
  slug: string
  thumbnail: string
  location: string
  price: number
  tripType: string
  category: string
  isPopular: boolean
  isFeatured: boolean
  isActivated: boolean
  isNewItem: boolean
}

const TourHome: React.FC = () => {
  const router = useRouter()
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [updateLoading, setUpdateLoading] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(8)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [search, setSearch] = useState<string>("")
  const [tripType, setTripType] = useState<string>("")
  const [region, setRegion] = useState<string>("")
  const [allRegions, setAllRegions] = useState<string[]>([])
  const [sort, setSort] = useState<string>("")
  const [visibility, setVisibility] = useState<string>("all")
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedTourToDelete, setSelectedTourToDelete] = useState<
    string | null
  >(null)

  const [allTripTypes, setAllTripTypes] = useState<
    [
      {
        _id: string
        title: string
      }
    ]
  >([
    {
      _id: "",
      title: "",
    },
  ])

  const [deleteLoading, setDeleteLoading] = useState<boolean>(false)

  // Fetch tours data with filters
  const getTours = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/tour/tours`,
        {
          params: {
            page,
            limit,
            search,
            tripType,
            sort,
            visibility,
            region,
          },
        }
      )
      if (response.data.success) {
        setTours(response.data.data)
        setTotalPages(response.data.totalPages)
      }
    } catch (error) {
      console.log("Failed to fetch tour data")
    } finally {
      setLoading(false)
    }
  }

  //get all tour regions
  // get trek locations
  const getTourLocation = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/tour/get-tour-regions`
      )
      if (response.data.success) {
        setAllRegions(response.data.data)
      }
    } catch (error) {
      console.log("Failed to fetch trek locations")
    }
  }

  //get trip types
  const getTripTypes = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/trips-and-tours/get?select=title`
      )
      if (response.data.success) {
        setAllTripTypes(response.data.data)
      }
    } catch (error) {
      console.log("Failed to fetch trip types")
    }
  }

  useEffect(() => {
    getTourLocation()
    getTripTypes()
  }, [])

  const handleSwitchChange = async (
    tourId: string,
    field: string,
    currentValue: boolean
  ) => {
    setUpdateLoading(tourId)
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/tour/edit-tour-visibility/${tourId}`,
        { [field]: !currentValue }
      )

      if (response.data.success) {
        setTours((prevTours) =>
          prevTours.map((tour) =>
            tour._id === tourId ? { ...tour, [field]: !currentValue } : tour
          )
        )
        console.log(`${field} status updated successfully`)
      }
    } catch (error) {
      console.log("Failed to update status")
    } finally {
      setUpdateLoading(null)
    }
  }

  const handleDeleteClick = (tourId: string) => {
    setSelectedTourToDelete(tourId)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true)
      if (selectedTourToDelete) {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL_DEV}/tour/delete-tour/${selectedTourToDelete}`
        )
        if (response.data.success) {
          toast.success(response.data.message)
          getTours()
        } else {
          toast.error(response.data.message)
        }
      }
    } catch (error) {
      toast.error("Failed to delete tour")
    } finally {
      setDeleteModalOpen(false)
    }
  }

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      getTours()
    }, 1000)
    return () => clearTimeout(searchTimeout)
  }, [search])

  useEffect(() => {
    getTours()
  }, [page, limit, tripType, sort, visibility, region])

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Tour Manager</h2>
          <div className="flex gap-4">
            <Button
              onClick={() => router.push("/tours/create-trips-and-tours")}
              className="bg-tourPrimary hover:bg-secondary text-white px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <TreePineIcon size={20} />
              Trips And Tours (category)
            </Button>
            <Button
              onClick={() => router.push("/tours/add-tour")}
              className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={20} />
              Add New Tour
            </Button>
          </div>
        </div>
        <p className="text-gray-600">
          Manage your tour packages and their visibility options
        </p>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="relative">
          <Filter className="absolute left-3 top-2 text-gray-400" size={20} />
          <select
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={tripType}
            onChange={(e) => {
              setTripType(e.target.value)
              setPage(1)
            }}
          >
            <option value="">All Trip Types</option>

            {allTripTypes.map((trip) => (
              <option key={trip._id} value={trip.title}>
                {trip.title}
              </option>
            ))}
          </select>
        </div>

        {/* visibility  */}
        <div className="relative">
          <SortAsc className="absolute left-3 top-2 text-gray-400" size={20} />
          <select
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={visibility}
            onChange={(e) => {
              setVisibility(e.target.value)
              setPage(1)
            }}
          >
            <option value="all">All</option>
            <option value="isNewItem">New</option>
            <option value="notNewItem" className="text-blue-600">
              Not New
            </option>
            <option value="isPopular">Popular</option>
            <option value="notPopular" className="text-blue-600">
              Not Popular
            </option>
            <option value="isFeatured">Featured</option>
            <option value="notFeatured" className="text-blue-600">
              Not Featured
            </option>
            <option value="isActivated">Activated</option>
            <option value="notActivated" className="text-red-600">
              Not Activated
            </option>
          </select>
        </div>

        {/* region  */}
        <div className="relative">
          <MapPin className="absolute left-3 top-2 text-gray-400" size={20} />
          <select
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={region}
            onChange={(e) => {
              setRegion(e.target.value)
              setPage(1)
            }}
          >
            <option value="">Regions</option>
            {allRegions.map((reg) => (
              <option key={reg} value={reg}>
                {reg}
              </option>
            ))}
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
            <option value="createdAt">Newest First</option>
            <option value="-createdAt">Oldest First</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="name">Name: A-Z</option>
            <option value="-name">Name: Z-A</option>
          </select>
        </div>

        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tours..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Tours List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Tour Details
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Visibility Options
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {tours.map((tour) => (
              <tr key={tour._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={tour.thumbnail}
                      alt={tour.name}
                      className="h-24 w-32 object-cover rounded-lg shadow-sm"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {tour.name}
                      </h3>
                      <p className="text-sm text-gray-500">{tour.location}</p>
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 mt-2">
                        {tour.tripType}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">
                          New
                        </span>
                        <Switch
                          checked={tour.isNewItem}
                          disabled={updateLoading === tour._id}
                          onCheckedChange={() =>
                            handleSwitchChange(
                              tour._id,
                              "isNewItem",
                              tour.isNewItem
                            )
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">
                          Popular
                        </span>
                        <Switch
                          checked={tour.isPopular}
                          disabled={updateLoading === tour._id}
                          onCheckedChange={() =>
                            handleSwitchChange(
                              tour._id,
                              "isPopular",
                              tour.isPopular
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">
                          Featured
                        </span>
                        <Switch
                          checked={tour.isFeatured}
                          disabled={updateLoading === tour._id}
                          onCheckedChange={() =>
                            handleSwitchChange(
                              tour._id,
                              "isFeatured",
                              tour.isFeatured
                            )
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-semibold ${
                            tour.isActivated ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {tour.isActivated ? "Activated" : "Not Activated"}
                        </span>
                        <Switch
                          checked={tour.isActivated}
                          disabled={updateLoading === tour._id}
                          onCheckedChange={() =>
                            handleSwitchChange(
                              tour._id,
                              "isActivated",
                              tour.isActivated
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center space-x-3">
                    <Button
                      onClick={() =>
                        router.push(`/tours/edit-tour/${tour.slug}`)
                      }
                      className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg"
                    >
                      View Details
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteClick(tour._id)}
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
      {loading && (
        <div className="flex justify-center  mt-40">
          <HomeLoading />
        </div>
      )}

      {!loading && tours.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
          <p className="text-2xl text-gray-400 font-medium">No tours found</p>
          <p className="text-gray-500 mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Pagination */}
      {tours.length > 0 && (
        <div className="mt-6">
          <CustomPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}

      {/* Delete Modal */}
      <DeleteTour
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        itemName={tours.find((t) => t._id === selectedTourToDelete)?.name || ""}
        deleteLoading={deleteLoading}
      />
    </div>
  )
}

export default TourHome
