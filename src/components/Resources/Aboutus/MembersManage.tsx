import React, { useState, ChangeEvent, FormEvent, useEffect } from "react"
import {
  ArrowLeft,
  Plus,
  Search,
  X,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { get } from "http"

export interface MemberTypes {
  _id?: string
  fullName: string
  role: string
  image: File | string
  bio: string
  createdAt?: string
  updatedAt?: string
}

interface FormDataType extends Omit<MemberTypes, "image"> {
  _id?: string
  image: File | null
}

const MembersManage = () => {
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [getLoading, setGetLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const [formData, setFormData] = useState<FormDataType>({
    fullName: "",
    role: "",
    bio: "",
    image: null,
  })

  // Mock data for members (replace with actual data fetching)
  const [members, setMembers] = useState<MemberTypes[]>([])

  const handleGetMembers = async () => {
    try {
      setGetLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/resources/get-members`
      )
      const data = response.data
      if (data.success) {
        setMembers(data.members)
      } else {
        toast.error(data.message || "Failed to fetch members")
      }
    } catch (error) {
      toast.error("An error occurred while fetching members")
    } finally {
      setGetLoading(false)
    }
  }

  // Filter members based on search
  const filteredMembers = members.filter(
    (member) =>
      member.fullName.toLowerCase().includes(search.toLowerCase()) ||
      member.role.toLowerCase().includes(search.toLowerCase())
  )

  const handleAddNewClick = () => {
    setIsEditing(false)
    setFormData({
      fullName: "",
      role: "",
      bio: "",
      image: null,
    })
    setPreviewUrl(null)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      const file = files[0]
      setFormData((prev) => ({
        ...prev,
        image: file,
      }))

      // Create a preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEdit = (member: MemberTypes) => {
    setIsEditing(true)
    setFormData({
      _id: member._id,
      fullName: member.fullName,
      role: member.role,
      bio: member.bio,
      image: null,
    })
    setPreviewUrl(typeof member.image === "string" ? member.image : null)
    setShowForm(true)
  }

  const handleDelete = (memberId: string) => {
    if (confirm("Are you sure you want to delete this member?")) {
      setDeleteLoading(true)
      axios
        .delete(
          `${process.env.NEXT_PUBLIC_API_URL_DEV}/resources/delete-member/${memberId}`
        )
        .then((response) => {
          const data = response.data
          if (data.success) {
            toast.success(data.message || "Member deleted successfully")
            handleGetMembers()
          } else {
            toast.error(data.message || "Failed to delete member")
          }
        })
        .catch(() => {
          toast.error("An error occurred while deleting the member")
        })
        .finally(() => {
          setDeleteLoading(false)
        })
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    if (isEditing && formData._id) {
      try {
        setLoading(true)
        const response = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL_DEV}/resources/edit-member/${formData._id}`,
          {
            fullName: formData.fullName,
            role: formData.role,
            bio: formData.bio,
            image: formData.image,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        const data = response.data
        if (data.success) {
          toast.success(data.message || "Member updated successfully")
          handleGetMembers()
        } else {
          toast.error(data.message || "Failed to update member")
        }
      } catch (error) {
        toast.error("An error occurred while updating the member")
      } finally {
        setLoading(false)
        setShowForm(false)
      }
    } else {
      try {
        setLoading(true)
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL_DEV}/resources/add-member`,
          {
            fullName: formData.fullName,
            role: formData.role,
            bio: formData.bio,
            image: formData.image,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        const data = response.data
        if (data.success) {
          toast.success(data.message || "Member added successfully")
          handleGetMembers()
        } else {
          toast.error(data.message || "Failed to add member")
        }
      } catch (error) {
        toast.error("An error occurred while adding the member")
      } finally {
        setLoading(false)
        setShowForm(false)
      }
    }
  }

  useEffect(() => {
    handleGetMembers()
  }, [])

  return (
    <div className="container bg-gray-50 mx-auto p-4">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <h2 className="text-3xl font-bold text-gray-800">
              Members Manager
            </h2>
          </div>
          <button
            onClick={handleAddNewClick}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={20} />
            <span>Add New Member</span>
          </button>
        </div>
        <p className="text-gray-600">
          Manage your team members and their profiles
        </p>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-2 text-gray-400" size={20} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members by name or role..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-200 focus:border-blue-600 transition-all"
          />
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">
              {isEditing ? "Edit Member" : "Add New Member"}
            </h2>
            <button
              onClick={handleCloseForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Image
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  accept="image/*"
                />
                {previewUrl && (
                  <div className="flex-shrink-0">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-16 w-16 object-cover rounded-full"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    {isEditing ? "Updating..." : "Adding..."}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Plus size={16} />
                    {isEditing ? "Update Member" : "Add Member"}
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading Placeholder */}
      {getLoading && (
        <div className="flex justify-center py-10">
          <Loader2 size={30} className="animate-spin text-blue-600" />
        </div>
      )}

      {/* Members Grid */}
      {!getLoading && filteredMembers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <div
              key={member._id}
              className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200"
            >
              <div className="relative h-52">
                <img
                  src={
                    typeof member.image === "string"
                      ? member.image
                      : URL.createObjectURL(member.image)
                  }
                  alt={member.fullName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  >
                    <Pencil size={16} className="text-blue-700" />
                  </button>
                  <button
                    disabled={deleteLoading}
                    onClick={() =>
                      member._id ? handleDelete(member._id) : undefined
                    }
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg mb-1">{member.fullName}</h3>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
                  {member.role}
                </span>
                <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!getLoading && filteredMembers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-xl text-gray-600 mb-2">No members found</p>
          <p className="text-gray-500 mb-6">
            {search
              ? "Try adjusting your search"
              : "Add team members to get started"}
          </p>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default MembersManage
