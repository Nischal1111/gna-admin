import React, { useState, ChangeEvent, FormEvent, useEffect } from "react"
import { Plus, X, Pencil, Trash2, Loader2, Globe, Flag } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

export interface AffiliateTypes {
  _id?: string
  name: string
  type: "national" | "international"
  logo: File | string
  createdAt?: string
  updatedAt?: string
}

interface FormDataType extends Omit<AffiliateTypes, "logo"> {
  _id?: string
  logo: File | null
}

const AffiliatesManage = () => {
  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [getLoading, setGetLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    type: "national",
    logo: null,
  })

  // Mock data for affiliates (replace with actual data fetching)
  const [affiliates, setAffiliates] = useState<AffiliateTypes[]>([])

  const handleAddNewClick = () => {
    setIsEditing(false)
    setFormData({
      name: "",
      type: "national",
      logo: null,
    })
    setPreviewUrl(null)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      // Check if file is PNG
      if (file.type !== "image/png") {
        alert("Please select only PNG images")
        return
      }

      setFormData((prev) => ({
        ...prev,
        logo: file,
      }))

      // Create a preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEdit = (affiliate: AffiliateTypes) => {
    setIsEditing(true)
    setFormData({
      _id: affiliate._id,
      name: affiliate.name,
      type: affiliate.type,
      logo: null,
    })
    setPreviewUrl(typeof affiliate.logo === "string" ? affiliate.logo : null)
    setShowForm(true)
  }

  const handleGetAffiliates = async () => {
    try {
      setGetLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/resources/get-affiliates`
      )
      const data = response.data
      if (data.success) {
        setAffiliates(data.affiliates)
      } else {
        toast.error(data.message || "Failed to fetch affiliates")
      }
    } catch (error) {
      toast.error("An error occurred while fetching affiliates")
    } finally {
      setGetLoading(false)
    }
  }

  const handleDelete = (affiliateId: string) => {
    if (confirm("Are you sure you want to delete this member?")) {
      setDeleteLoading(true)
      axios
        .delete(
          `${process.env.NEXT_PUBLIC_API_URL_DEV}/resources/delete-affiliate/${affiliateId}`
        )
        .then((response) => {
          const data = response.data
          if (data.success) {
            toast.success(data.message || "Affiliate deleted successfully")
            handleGetAffiliates()
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
          `${process.env.NEXT_PUBLIC_API_URL_DEV}/resources/edit-affiliate/${formData._id}`,
          {
            name: formData.name,
            type: formData.type,
            image: formData.logo,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        const data = response.data
        if (data.success) {
          toast.success(data.message || "Affiliate updated successfully")
          handleGetAffiliates()
        } else {
          toast.error(data.message || "Failed to update Affiliate")
        }
      } catch (error) {
        toast.error("An error occurred while updating the Affiliate")
      } finally {
        setLoading(false)
        setShowForm(false)
      }
    } else {
      try {
        setLoading(true)
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL_DEV}/resources/add-affiliate`,
          {
            name: formData.name,
            type: formData.type,
            image: formData.logo,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        const data = response.data
        if (data.success) {
          toast.success(data.message || "Affiliate added successfully")
          handleGetAffiliates()
        } else {
          toast.error(data.message || "Failed to add Affiliate")
        }
      } catch (error) {
        toast.error("An error occurred while adding the Affiliate")
      } finally {
        setLoading(false)
        setShowForm(false)
      }
    }
  }

  useEffect(() => {
    handleGetAffiliates()
  }, [])

  return (
    <div className="container bg-gray-50 mx-auto p-4">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <h2 className="text-3xl font-bold text-gray-800">
              Affiliates Manager
            </h2>
          </div>
          <button
            onClick={handleAddNewClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={20} />
            <span>Add New Affiliate</span>
          </button>
        </div>
        <p className="text-gray-600">
          Manage your affiliate partners and their information
        </p>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">
              {isEditing ? "Edit Affiliate" : "Add New Affiliate"}
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
                  Affiliate Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Affiliate Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-600"
                  required
                >
                  <option value="national">National</option>
                  <option value="international">International</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo (PNG only)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  name="logo"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  accept="image/png"
                  required={!isEditing}
                />
                {previewUrl && (
                  <div className="flex-shrink-0">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-16 w-16 object-contain bg-gray-100 p-1 rounded-md"
                    />
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Only PNG format is accepted
              </p>
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
                    {isEditing ? "Update Affiliate" : "Add Affiliate"}
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

      {/* Affiliates Grid */}
      {!getLoading && affiliates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {affiliates.map((affiliate) => (
            <div
              key={affiliate._id}
              className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200"
            >
              <div className="relative h-40 flex items-center justify-center bg-gray-50 p-4">
                <img
                  src={
                    typeof affiliate.logo === "string"
                      ? affiliate.logo
                      : URL.createObjectURL(affiliate.logo)
                  }
                  alt={affiliate.name}
                  className="max-h-full max-w-full object-contain"
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(affiliate)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  >
                    <Pencil size={16} className="text-blue-700" />
                  </button>
                  <button
                    disabled={deleteLoading}
                    onClick={() =>
                      affiliate._id ? handleDelete(affiliate._id) : undefined
                    }
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg mb-1">{affiliate.name}</h3>
                <span
                  className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                    affiliate.type === "international"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {affiliate.type === "international" ? (
                    <>
                      <Globe size={12} />
                      International
                    </>
                  ) : (
                    <>
                      <Flag size={12} />
                      National
                    </>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!getLoading && affiliates.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-xl text-gray-600 mb-2">No affiliates found</p>
          <p className="text-gray-500 mb-6">
            Add affiliate partners to get started
          </p>
        </div>
      )}
    </div>
  )
}

export default AffiliatesManage
