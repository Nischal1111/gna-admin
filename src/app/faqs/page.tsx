"use client"
import React, { useState, FormEvent, useEffect } from "react"
import {
  Plus,
  X,
  Pencil,
  Trash2,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

export interface FAQType {
  _id?: string
  question: string
  answer: string
  createdAt?: string
  updatedAt?: string
}

const page = () => {
  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [getLoading, setGetLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)

  const [formData, setFormData] = useState<FAQType>({
    question: "",
    answer: "",
  })

  const [faqs, setFaqs] = useState<FAQType[]>([])

  const handleAddNewClick = () => {
    setIsEditing(false)
    setFormData({
      question: "",
      answer: "",
    })
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

  const handleEdit = (faq: FAQType) => {
    setIsEditing(true)
    setFormData({
      _id: faq._id,
      question: faq.question,
      answer: faq.answer,
    })
    setShowForm(true)
  }

  const handleGetFAQs = async () => {
    try {
      setGetLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/resources/get-faqs`
      )
      const data = response.data
      if (data.success) {
        setFaqs(data.faqs)
      } else {
        toast.error(data.message || "Failed to fetch FAQs")
      }
    } catch (error) {
      toast.error("An error occurred while fetching FAQs")
    } finally {
      setGetLoading(false)
    }
  }

  const handleDelete = (faqId: string) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      setDeleteLoading(true)
      axios
        .delete(
          `${process.env.NEXT_PUBLIC_API_URL_DEV}/resources/delete-faq/${faqId}`
        )
        .then((response) => {
          const data = response.data
          if (data.success) {
            toast.success(data.message || "FAQ deleted successfully")
            handleGetFAQs()
          } else {
            toast.error(data.message || "Failed to delete FAQ")
          }
        })
        .catch(() => {
          toast.error("An error occurred while deleting the FAQ")
        })
        .finally(() => {
          setDeleteLoading(false)
        })
    }
  }

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    if (isEditing && formData._id) {
      try {
        const response = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL_DEV}/resources/edit-faq/${formData._id}`,
          {
            question: formData.question,
            answer: formData.answer,
          }
        )
        const data = response.data
        if (data.success) {
          toast.success(data.message || "FAQ updated successfully")
          handleGetFAQs()
        } else {
          toast.error(data.message || "Failed to update FAQ")
        }
      } catch (error) {
        toast.error("An error occurred while updating the FAQ")
      } finally {
        setLoading(false)
        setShowForm(false)
      }
    } else {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL_DEV}/resources/add-faq`,
          {
            question: formData.question,
            answer: formData.answer,
          }
        )
        const data = response.data
        if (data.success) {
          toast.success(data.message || "FAQ added successfully")
          handleGetFAQs()
        } else {
          toast.error(data.message || "Failed to add FAQ")
        }
      } catch (error) {
        toast.error("An error occurred while adding the FAQ")
      } finally {
        setLoading(false)
        setShowForm(false)
      }
    }
  }

  useEffect(() => {
    handleGetFAQs()
  }, [])

  return (
    <div className="container bg-gray-50 mx-auto p-4">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <h2 className="text-3xl font-bold text-gray-800">FAQs Manager</h2>
          </div>
          <button
            onClick={handleAddNewClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={20} />
            <span>Add New FAQ</span>
          </button>
        </div>
        <p className="text-gray-600">
          Manage frequently asked questions and their answers
        </p>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">
              {isEditing ? "Edit FAQ" : "Add New FAQ"}
            </h2>
            <button
              onClick={handleCloseForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question
              </label>
              <input
                type="text"
                name="question"
                value={formData.question}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-600"
                placeholder="Enter the question"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Answer
              </label>
              <textarea
                name="answer"
                value={formData.answer}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-600"
                placeholder="Enter the answer"
                required
              />
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
                    {isEditing ? "Update FAQ" : "Add FAQ"}
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

      {/* FAQs List */}
      {!getLoading && faqs.length > 0 && (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq._id}
              className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200"
            >
              <div
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                onClick={() => faq._id && toggleFAQ(faq._id)}
              >
                <h3 className="font-medium text-lg">{faq.question}</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(faq)
                    }}
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <Pencil size={16} className="text-blue-700" />
                  </button>
                  <button
                    disabled={deleteLoading}
                    onClick={(e) => {
                      e.stopPropagation()
                      faq._id && handleDelete(faq._id)
                    }}
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                  {expandedFAQ === faq._id ? (
                    <ChevronUp size={20} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-500" />
                  )}
                </div>
              </div>
              {expandedFAQ === faq._id && (
                <div className="p-4 pt-0 border-t border-gray-100">
                  <p className="text-gray-700 whitespace-pre-line">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!getLoading && faqs.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-xl text-gray-600 mb-2">No FAQs found</p>
          <p className="text-gray-500 mb-6">
            Add frequently asked questions to get started
          </p>
        </div>
      )}
    </div>
  )
}

export default page
