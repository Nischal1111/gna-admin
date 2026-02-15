"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Loader } from "../loading/Loader"
import { Button } from "../ui/button"
import { Trash2, Plus, Search, Filter, SortAsc } from "lucide-react"
import { DeleteWellness } from "./DeleteWellness"
import { CustomPagination } from "../utils/Pagination"
import { Switch } from "../ui/switch"
import { get } from "http"
import HomeLoading from "../home/HomeLoading"
import { toast } from "sonner"
import { count } from "console"

interface Wellness {
  _id: string
  name: string
  slug: string
  thumbnail: string
  location: string
  price: number
  country: string
  category: string
  isFeatured: boolean
  isPopular: boolean
  isActivated: boolean
  isNewItem: boolean
}

const WellnessHome: React.FC = () => {
  const router = useRouter()
  const [wellnessData, setWellnessData] = useState<Wellness[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [updateLoading, setUpdateLoading] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(8)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [search, setSearch] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [sort, setSort] = useState<string>("")
  const [visibility, setVisibility] = useState<string>("all")
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedWellnessToDelete, setSelectedWellnessToDelete] = useState<
    string | null
  >(null)

  // Fetch wellness data
  const getWellnessHandler = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/wellness/all-wellness`,
        {
          params: {
            page,
            limit,
            search,
            country: category,
            sort,
            visibility,
          },
        }
      )
      if (response.data.success) {
        setWellnessData(response.data.data)
        setTotalPages(response.data.totalPages || 1)
      }
    } catch (error) {
      console.log("Failed to fetch wellness data")
    } finally {
      setLoading(false)
    }
  }

  const handleSwitchChange = async (
    wellnessId: string,
    field: string,
    currentValue: boolean
  ) => {
    setUpdateLoading(wellnessId)
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/wellness/edit-wellness-visibility/${wellnessId}`,
        { [field]: !currentValue }
      )

      if (response.data.success) {
        setWellnessData((prevWellness) =>
          prevWellness.map((item) =>
            item._id === wellnessId ? { ...item, [field]: !currentValue } : item
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

  const handleDeleteClick = (wellnessId: string) => {
    setSelectedWellnessToDelete(wellnessId)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    try {
      if (selectedWellnessToDelete) {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL_DEV}/wellness/delete-wellness/${selectedWellnessToDelete}`
        )
        if (response.data.success) {
          toast.success(
            response.data.message || "Wellness deleted successfully"
          )
          getWellnessHandler()
        } else {
          toast.error(response.data.message || "Unable to delete Wellness")
        }
      }
    } catch (error) {
      toast.error("Failed to delete wellness")
      // console.log(error)
    } finally {
      setDeleteModalOpen(false)
    }
  }

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      getWellnessHandler()
    }, 1000)
    return () => clearTimeout(searchTimeout)
  }, [search])

  useEffect(() => {
    getWellnessHandler()
  }, [page, limit, category, sort, visibility])

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Wellness Manager</h2>
          <Button
            onClick={() => router.push("/wellness/add-wellness")}
            className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={20} />
            Add New Wellness
          </Button>
        </div>
        <p className="text-gray-600">
          Manage your wellness services and their visibility options
        </p>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="relative">
          <Filter className="absolute left-3 top-2 text-gray-400" size={20} />
          <select
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value)
              setPage(1)
            }}
          >
            <option value="">All Country</option>
            <option value="Nepal">Nepal</option>
            <option value="Bhutan">Bhutan</option>
            <option value="Tibet">Tibet</option>
          </select>
        </div>

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
            placeholder="Search wellness..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Wellness List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Wellness Details
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
            {wellnessData.map((wellness) => (
              <tr
                key={wellness._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={wellness.thumbnail}
                      alt={wellness.name}
                      className="h-24 w-32 object-cover rounded-lg shadow-sm"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {wellness.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {wellness.location}
                      </p>
                      <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-2">
                        {wellness.country}
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
                          checked={wellness.isNewItem}
                          disabled={updateLoading === wellness._id}
                          onCheckedChange={() =>
                            handleSwitchChange(
                              wellness._id,
                              "isNewItem",
                              wellness.isNewItem
                            )
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">
                          Popular
                        </span>
                        <Switch
                          checked={wellness.isPopular}
                          disabled={updateLoading === wellness._id}
                          onCheckedChange={() =>
                            handleSwitchChange(
                              wellness._id,
                              "isPopular",
                              wellness.isPopular
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
                          checked={wellness.isFeatured}
                          disabled={updateLoading === wellness._id}
                          onCheckedChange={() =>
                            handleSwitchChange(
                              wellness._id,
                              "isFeatured",
                              wellness.isFeatured
                            )
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-semibold ${
                            wellness.isActivated
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {wellness.isActivated ? "Activated" : "Not Activated"}
                        </span>
                        <Switch
                          checked={wellness.isActivated}
                          disabled={updateLoading === wellness._id}
                          onCheckedChange={() =>
                            handleSwitchChange(
                              wellness._id,
                              "isActivated",
                              wellness.isActivated
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
                        router.push(`/wellness/edit-wellness/${wellness.slug}`)
                      }
                      className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg"
                    >
                      View Details
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteClick(wellness._id)}
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

      {!loading && wellnessData.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
          <p className="text-2xl text-gray-400 font-medium">
            No wellness services found
          </p>
          <p className="text-gray-500 mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Pagination */}
      {wellnessData.length > 0 && (
        <div className="mt-6">
          <CustomPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}

      {/* Delete Modal */}
      <DeleteWellness
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        itemName={
          wellnessData.find((w) => w._id === selectedWellnessToDelete)?.name ||
          ""
        }
      />
    </div>
  )
}

export default WellnessHome
