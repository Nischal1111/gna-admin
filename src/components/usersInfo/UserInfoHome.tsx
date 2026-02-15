"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Loader } from "../loading/Loader"
import { Button } from "../ui/button"
import { Trash2, Plus, SortAsc, EyeIcon, Calendar, MapIcon } from "lucide-react"

import { CustomPagination } from "../utils/Pagination"
import { Switch } from "../ui/switch"

import { toast } from "sonner"
import HomeLoading from "../home/HomeLoading"
import { DeleteClient } from "./DeleteClient"

interface User {
  _id: string
  userName: string
  userEmail: string
  userPhone: string
  userAddress: string
  userCountry: string
  userCompany: string
}

const UsersInfoHome: React.FC = () => {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [updateLoading, setUpdateLoading] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(20)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [search, setSearch] = useState<string>("")
  const [sort, setSort] = useState<string>("-date")
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedUserToDelete, setSelectedUserToDelete] = useState<
    string | null
  >(null)
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false)

  // Fetch activities data with filters
  const getUsers = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/users/get`,
        {
          params: {
            page,
            limit,
            search,
            sort,
          },
        }
      )
      if (response.data.success) {
        setUsers(response.data.data)
        // setTotalPages(response.data.totalPages)
      }
    } catch (error) {
      console.log("Failed to fetch user data")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (activityId: string) => {
    setSelectedUserToDelete(activityId)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true)
      if (selectedUserToDelete) {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL_DEV}/users/delete/${selectedUserToDelete}`
        )
        if (response.data.success) {
          setDeleteLoading(false)
          toast.success(response.data.message)
          getUsers()
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
    const searchData = setTimeout(() => {
      getUsers()
    }, 1000)
    return () => clearTimeout(searchData)
  }, [search])

  useEffect(() => {
    getUsers()
  }, [page, limit, sort])

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Users Manager</h2>
          <Button
            onClick={() => router.push("/users-info/add-client")}
            className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={20} />
            Add New Client
          </Button>
        </div>
        <p className="text-gray-600">Manage your user details options</p>
      </div>

      {/* Filters Section  */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
            <option value="userName">Name: A - Z</option>
            <option value="-userName">Name: Z - A</option>
          </select>
        </div>

        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients by name..."
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
                Name
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-md font-semibold text-primary">
                      {user.userName ? user.userName : "-"}
                    </h3>
                  </div>
                </td>

                {/* email  */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      {user.userEmail ? user.userEmail : "-"}
                    </span>
                  </div>
                </td>
                {/* contact  */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      {user.userPhone ? user.userPhone : "-"}
                    </span>
                  </div>
                </td>
                {/* company  */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      {user.userCompany ? user.userCompany : "-"}
                    </span>
                  </div>
                </td>
                {/* address  */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      {user.userAddress ? user.userAddress : "-"},{" "}
                      <span className="text-primary font-semibold">
                        {user.userCountry ? user.userCountry : "-"}
                      </span>
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center space-x-3">
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteClick(user._id)}
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

      {!loading && users.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
          <p className="text-2xl text-gray-400 font-medium">No users found</p>
          <p className="text-gray-500 mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Pagination */}
      {users.length > 0 && (
        <div className="mt-6">
          <CustomPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}

      <DeleteClient
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        loading={deleteLoading}
        itemName={
          users.find((b) => b._id === selectedUserToDelete)?.userName || ""
        }
      />
    </div>
  )
}

export default UsersInfoHome
