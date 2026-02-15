"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Loader } from "../loading/Loader"
import { Button } from "../ui/button"
import { Trash2, Plus, MapIcon, Filter, SortAsc } from "lucide-react"
import { DeleteTrek } from "./DeleteTrek"
import { CustomPagination } from "../utils/Pagination"
import { Switch } from "../ui/switch"
import { get } from "http"
import HomeLoading from "../home/HomeLoading"
import { toast } from "sonner"
// import { toast } from "sonner"

interface Trekking {
  _id: string
  name: string
  slug: string
  thumbnail: string
  location: string
  difficulty: string
  price: number
  days: {
    min: number
    max: number
  }
  groupSize: {
    min: number
    max: number
  }
  isFeatured: boolean
  isPopular: boolean
  isActivated: boolean
  isNewItem: boolean
}

const TrekkingHome: React.FC = () => {
  const router = useRouter()
  const [trekking, setTrekking] = useState<Trekking[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [updateLoading, setUpdateLoading] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(8)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [search, setSearch] = useState<string>("")
  const [difficulty, setDifficulty] = useState<string>("")
  const [sort, setSort] = useState<string>("")
  const [visibility, setVisibility] = useState<string>("all")
  const [allLocations, setAllLocations] = useState<string[]>([])
  const [location, setLocation] = useState<string>("")
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedTrekToDelete, setSelectedTrekToDelete] = useState<
    string | null
  >(null)

  // Fetch trekking data
  const getTrekking = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/trekking/treks`,
        {
          params: {
            page,
            limit,
            search,
            difficulty,
            sort,
            visibility,
            location,
          },
          withCredentials: true,
        }
      )
      if (response.data.success) {
        setTrekking(response.data.data)
        setTotalPages(response.data.totalPages)
      }
    } catch (error) {
      // toast.error("Failed to fetch trekking data")
      console.log("Failed to fetch trekking data")
    } finally {
      setLoading(false)
    }
  }

  // get trek locations
  const getTrekLocations = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/trekking/get-trek-location`
      )
      if (response.data.success) {
        setAllLocations(response.data.data)
      }
    } catch (error) {
      console.log("Failed to fetch trek locations")
    }
  }

  const handleSwitchChange = async (
    trekId: string,
    field: string,
    currentValue: boolean
  ) => {
    setUpdateLoading(trekId)
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/trekking/edit-trek-visibility/${trekId}`,
        { [field]: !currentValue }
      )

      if (response.data.success) {
        setTrekking((prevTrekking) =>
          prevTrekking.map((trek) =>
            trek._id === trekId ? { ...trek, [field]: !currentValue } : trek
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

  const handleDeleteClick = (trekId: string) => {
    setSelectedTrekToDelete(trekId)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    try {
      if (selectedTrekToDelete) {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL_DEV}/trekking/delete-trek/${selectedTrekToDelete}`
        )
        if (response.data.success) {
          toast.success(response.data.message || "Trek deleted successfully")
          getTrekking()
        } else {
          toast.error(response.data.message || "Failed to delete trek")
        }
      }
    } catch (error) {
      toast.error("Failed to delete trek")
    } finally {
      setDeleteModalOpen(false)
    }
  }

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      getTrekking()
    }, 1000)
    return () => clearTimeout(searchTimeout)
  }, [search])

  useEffect(() => {
    getTrekLocations()
  }, [])

  useEffect(() => {
    getTrekking()
  }, [page, limit, difficulty, sort, visibility, location])

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Trekking Manager</h2>
          <Button
            onClick={() => router.push("/trekkings/add-trek")}
            className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={20} />
            Add New Trek
          </Button>
        </div>
        <p className="text-gray-600">
          Manage your trekking packages and their visibility options
        </p>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="relative">
          <Filter className="absolute left-3 top-2 text-gray-400" size={20} />
          <select
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value)
              setPage(1)
            }}
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Moderate">Moderate</option>
            <option value="Difficult">Difficult</option>
          </select>
        </div>
        {/* sort visibility  */}
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
        {/* sort  */}
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

        {/* location  */}
        <div className="relative">
          <MapIcon className="absolute left-3 top-2 text-gray-400" size={20} />
          <select
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value)
              setPage(1)
            }}
          >
            <option value="">Location</option>
            {allLocations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search treks..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Trekking List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Trek Details
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
            {trekking.map((trek) => (
              <tr key={trek._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={trek.thumbnail}
                      alt={trek.name}
                      className="h-24 w-32 object-cover rounded-lg shadow-sm"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {trek.name}
                      </h3>
                      <p className="text-sm text-gray-500">{trek.location}</p>
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${
                          trek.difficulty === "Easy"
                            ? "bg-green-100 text-green-800"
                            : trek.difficulty === "Moderate"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        } mt-2`}
                      >
                        {trek.difficulty}
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
                          checked={trek.isNewItem}
                          disabled={updateLoading === trek._id}
                          onCheckedChange={() =>
                            handleSwitchChange(
                              trek._id,
                              "isNewItem",
                              trek.isNewItem
                            )
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">
                          Popular
                        </span>
                        <Switch
                          checked={trek.isPopular}
                          disabled={updateLoading === trek._id}
                          onCheckedChange={() =>
                            handleSwitchChange(
                              trek._id,
                              "isPopular",
                              trek.isPopular
                            )
                          }
                        />
                      </div>
                    </div>
                    {/* featured  */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">
                          Featured
                        </span>
                        <Switch
                          checked={trek.isFeatured}
                          disabled={updateLoading === trek._id}
                          onCheckedChange={() =>
                            handleSwitchChange(
                              trek._id,
                              "isFeatured",
                              trek.isFeatured
                            )
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-semibold ${
                            trek.isActivated ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {trek.isActivated ? "Activated" : "Not Activated"}
                        </span>
                        <Switch
                          checked={trek.isActivated}
                          disabled={updateLoading === trek._id}
                          onCheckedChange={() =>
                            handleSwitchChange(
                              trek._id,
                              "isActivated",
                              trek.isActivated
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
                        router.push(`/trekkings/edit-trek/${trek.slug}`)
                      }
                      className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg"
                    >
                      View Details
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteClick(trek._id)}
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
        <div className="flex justify-center mt-40">
          <HomeLoading />
        </div>
      )}

      {!loading && trekking.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
          <p className="text-2xl text-gray-400 font-medium">
            No trekkings found
          </p>
          <p className="text-gray-500 mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Pagination */}
      {trekking.length > 0 && (
        <div className="mt-6">
          <CustomPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}

      {/* Delete Modal */}
      <DeleteTrek
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        itemName={
          trekking.find((t) => t._id === selectedTrekToDelete)?.name || ""
        }
      />
    </div>
  )
}

export default TrekkingHome
