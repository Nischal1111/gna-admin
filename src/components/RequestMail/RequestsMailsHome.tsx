"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Loader } from "../loading/Loader"
import { Button } from "../ui/button"
import { Trash2, Plus, SortAsc, MapPin, Calendar, Mail } from "lucide-react"

import { CustomPagination } from "../utils/Pagination"
import { toast } from "sonner"
import Link from "next/link"
import HomeLoading from "../home/HomeLoading"
import { DeleteRequestMail } from "./DeleteRequestMail"
import { get } from "http"

interface RequestMail {
  _id: string
  name: string
  email: string
  type: "plan" | "quote" | "customize"
  status: string
  createdAt: string
  itemType: string
}

interface tabsType {
  key: string
  label: string
  count: number
}

interface Counts {
  quotePending: number
  customizePending: number
}

const RequestsMailsHome: React.FC = () => {
  const router = useRouter()
  const [requests, setRequests] = useState<RequestMail[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(8)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [sort, setSort] = useState<string>("-createdAt")
  const [activeTab, setActiveTab] = useState<string>("quote")
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedRequestToDelete, setSelectedRequestToDelete] = useState<
    string | null
  >(null)
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false)

  const [counts, setCounts] = useState<Counts>({
    quotePending: 0,
    customizePending: 0,
  })

  // Fetch counts
  const getCounts = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/quote-and-customize/get-counts`
      )

      if (response.data.success) {
        setCounts(response.data.data)
      }
    } catch (error) {
      console.log("Failed to fetch counts")
    }
  }

  // Fetch requests data with filters
  const getRequests = async () => {
    try {
      setLoading(true)

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/quote-and-customize/get`,
        {
          params: {
            page,
            limit,
            requestType: activeTab,
            sort,
          },
        }
      )

      if (response.data.success) {
        setRequests(response.data.data)
        // setTotalPages(response.data.totalPages)
      }
    } catch (error) {
      console.log("Failed to fetch request data")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (requestId: string) => {
    setSelectedRequestToDelete(requestId)
    setDeleteModalOpen(true)
  }

  useEffect(() => {
    getCounts()
  }, [activeTab])

  useEffect(() => {
    getRequests()
  }, [page, limit, sort, activeTab])

  const tabs = [
    { key: "quote", label: "Quote", count: counts.quotePending as number },
    {
      key: "customize",
      label: "Customize",
      count: counts.customizePending as number,
    },
  ]

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true)
      if (selectedRequestToDelete) {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL_DEV}/quote-and-customize/delete/${selectedRequestToDelete}`
        )
        if (response.data.success) {
          setDeleteLoading(false)
          toast.success(response.data.message)
          getRequests()
        } else {
          setDeleteLoading(false)
          toast.error(response.data.message)
        }
      }
    } catch (error) {
      setDeleteLoading(false)
      toast.error("Failed to delete blog")
    } finally {
      setDeleteModalOpen(false)
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Requests Management
          </h2>
          <Link href="/requests-mails/bulk-mailing">
            <Button className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg flex items-center gap-2">
              <Mail size={20} />
              Send Bulk Mail
            </Button>
          </Link>
        </div>
        <p className="text-gray-600">
          Manage and track incoming requests from users
        </p>
      </div>

      {/* Tabs Section */}
      <div className="mb-6 flex space-x-4">
        {tabs.map((tab) => (
          <div key={tab.key} className="relative p-2">
            <button
              onClick={() => setActiveTab(tab.key)}
              className={` px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.key
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab.label}
            </button>
            {tab?.count > 0 && (
              <p className="absolute flex top-0 right-0 bg-orange-500 text-white p-1 h-6 w-6 rounded-full justify-center items-center">
                {tab.count}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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
      </div>

      {/* Requests List */}
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
            {requests.map((request) => (
              <tr
                key={request._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.name}
                      </h3>
                      <div className="flex items-center gap-2 text-white text-sm">
                        <span
                          className={`text-md ${
                            request.itemType === "trekking"
                              ? "bg-green-600"
                              : request.itemType === "tour"
                              ? "bg-orange-600"
                              : "bg-green-600"
                          } font-semibold p-1 rounded-xl`}
                        >
                          {request.itemType}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                        <Calendar size={16} className="text-primary" />
                        {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-md ${
                        request.status === "pending"
                          ? "text-orange-600"
                          : request.status === "mailed"
                          ? "text-blue-600"
                          : "text-green-600"
                      } font-semibold `}
                    >
                      {request.status}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center space-x-3">
                    <Button
                      onClick={() =>
                        router.push(
                          `/requests-mails/single-request/${request._id}`
                        )
                      }
                      className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg"
                    >
                      View Details
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteClick(request._id)}
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

      {!loading && requests.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
          <p className="text-2xl text-gray-400 font-medium">
            No requests found
          </p>
          <p className="text-gray-500 mt-2">
            No requests for the selected type.
          </p>
        </div>
      )}

      {/* Delete Modal */}
      <DeleteRequestMail
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        loading={deleteLoading}
        itemName={
          requests.find((b) => b._id === selectedRequestToDelete)?.name || ""
        }
      />

      {/* Pagination */}
      {requests.length > 0 && (
        <div className="mt-6">
          <CustomPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}
    </div>
  )
}

export default RequestsMailsHome
