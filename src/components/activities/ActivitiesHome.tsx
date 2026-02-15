"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Loader } from "../loading/Loader"
import { Button } from "../ui/button"
import { Trash2, Plus, SortAsc, EyeIcon, Calendar, MapIcon } from "lucide-react"

import { CustomPagination } from "../utils/Pagination"
import { Switch } from "../ui/switch"
import { DeleteActivity } from "./DeleteActivities"
import { toast } from "sonner"
import HomeLoading from "../home/HomeLoading"

import Cookies from "js-cookie"

interface Activity {
  _id: string
  title: string
  slug: string
  thumbnail: string
  isPopular: boolean
  isActivated: boolean
  viewsCount: number
  country: string
  location: string
  price: number
}

const ActivitiesHome: React.FC = () => {
  const router = useRouter()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [updateLoading, setUpdateLoading] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(8)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [search, setSearch] = useState<string>("")
  const [sort, setSort] = useState<string>("-createdAt")
  const [visibility, setVisibility] = useState<string>("all")
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedActivityToDelete, setSelectedActivityToDelete] = useState<
    string | null
  >(null)
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false)
  const [token, setToken] = useState<string | null>(null)

  // Fetch activities data with filters
  const getActivities = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/activities/get-activities`,
        {
          params: {
            page,
            limit,
            search,
            sort,
            visibility,
          },
        }
      )
      if (response.data.success) {
        setActivities(response.data.data)
        // setTotalPages(response.data.totalPages)
      }
    } catch (error) {
      console.log("Failed to fetch activity data")
    } finally {
      setLoading(false)
    }
  }

  const handleSwitchChange = async (
    activityId: string,
    field: string,
    currentValue: boolean
  ) => {
    setUpdateLoading(activityId)
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/activities/edit-activity-visibility/${activityId}`,

        { [field]: !currentValue }
      )

      if (response.data.success) {
        setActivities((prevActivities) =>
          prevActivities.map((activity) =>
            activity._id === activityId
              ? { ...activity, [field]: !currentValue }
              : activity
          )
        )
      }
    } catch (error) {
      console.log("Failed to update status")
    } finally {
      setUpdateLoading(null)
    }
  }

  const handleDeleteClick = (activityId: string) => {
    setSelectedActivityToDelete(activityId)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true)
      if (selectedActivityToDelete) {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL_DEV}/activities/delete-activity/${selectedActivityToDelete}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        )
        if (response.data.success) {
          setDeleteLoading(false)
          toast.success(response.data.message)
          getActivities()
        } else {
          setDeleteLoading(false)
          toast.error(response.data.message)
        }
      }
    } catch (error) {
      setDeleteLoading(false)
      toast.error("Failed to delete activity")
    } finally {
      setDeleteModalOpen(false)
    }
  }

  useEffect(() => {
    const token = Cookies.get("token") || null
    setToken(token)
  }, [])

  useEffect(() => {
    const searchData = setTimeout(() => {
      getActivities()
    }, 1000)
    return () => clearTimeout(searchData)
  }, [search])

  useEffect(() => {
    getActivities()
  }, [page, limit, sort, visibility])

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Activity Manager</h2>
          <Button
            onClick={() => router.push("/activities/create-activity")}
            className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={20} />
            Add New Activity
          </Button>
        </div>
        <p className="text-gray-600">
          Manage your activities and their visibility options
        </p>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
            <option value="all">Visibility (All)</option>
            <option value="isPopular">Popular</option>
            <option value="isActivated">Active</option>
            <option value="notPopular">Not Popular</option>
            <option value="notActivated">Not Active</option>
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
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="viewsCount">Views: Low to High</option>
            <option value="-viewsCount">Views: High to Low</option>
          </select>
        </div>

        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search activities by title..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Activities List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Activity Details
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
            {activities.map((activity) => (
              <tr
                key={activity._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={activity.thumbnail}
                      alt={activity.title}
                      className="h-24 w-32 object-cover rounded-lg shadow-sm"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <MapIcon size={16} />
                        {activity.location}, {activity.country}
                      </p>
                      <div className="flex gap-2 items-center ">
                        <span className="text-primary text-md font-semibold">
                          ${activity.price}
                        </span>
                        <span>|</span>

                        <span className="flex gap-4 items-center text-primary text-md">
                          <EyeIcon size={16} /> {activity.viewsCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Popular
                    </span>
                    <Switch
                      checked={activity.isPopular}
                      disabled={updateLoading === activity._id}
                      onCheckedChange={() =>
                        handleSwitchChange(
                          activity._id,
                          "isPopular",
                          activity.isPopular
                        )
                      }
                    />
                  </div>
                  {/* for active  */}
                  <div className="flex items-center justify-between mt-4">
                    <span
                      className={`text-sm font-semibold ${
                        activity.isActivated ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {activity.isActivated ? "Activated" : "Not Activated"}
                    </span>
                    <Switch
                      checked={activity.isActivated}
                      disabled={updateLoading === activity._id}
                      onCheckedChange={() =>
                        handleSwitchChange(
                          activity._id,
                          "isActivated",
                          activity.isActivated
                        )
                      }
                    />
                  </div>
                </td>

                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center space-x-3">
                    <Button
                      onClick={() =>
                        router.push(
                          `/activities/edit-activity/${activity.slug}`
                        )
                      }
                      className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg"
                    >
                      View Details
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteClick(activity._id)}
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

      {!loading && activities.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
          <p className="text-2xl text-gray-400 font-medium">
            No activities found
          </p>
          <p className="text-gray-500 mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Pagination */}
      {activities.length > 0 && (
        <div className="mt-6">
          <CustomPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}

      {/* Delete Modal */}
      <DeleteActivity
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        loading={deleteLoading}
        activityName={
          activities.find(
            (activity) => activity._id === selectedActivityToDelete
          )?.title || ""
        }
      />
    </div>
  )
}

export default ActivitiesHome
