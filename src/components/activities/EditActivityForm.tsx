"use client"

import React, { useState, useRef, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Checkbox } from "../ui/checkbox"
import {
  Plus,
  Trash2,
  ImageIcon,
  Upload,
  Save,
  Loader2Icon,
} from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import { Separator } from "@radix-ui/react-separator"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"

import Cookies from "js-cookie"
import { FaArrowLeft } from "react-icons/fa6"
import NameInput from "../trekkings/addForm/NameInputForm"
import PriceInput from "../trekkings/addForm/PriceInputForm"
import CountrySelect from "../trekkings/addForm/CountrySelectForm"
import LocationInput from "../trekkings/addForm/LocationForm"
import GroupSizeInput from "../trekkings/addForm/GroupSizeForm"
import BestSeasonsSelect from "../trekkings/addForm/SeasonsForm"
import FAQForm from "../trekkings/addForm/FaqForm"
import ThumbnailInput from "../trekkings/addForm/ThumbnailForm"
import ImageUploadEdit from "../trekkings/addForm/ImageUploadEdit"

interface FAQ {
  question: string
  answer: string
}

const EditActivityForm: React.FC = () => {
  const router = useRouter()
  const thumbnailInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    price: "",
    country: "",
    location: "",
    groupSizeMin: "",
    groupSizeMax: "",
    seasons: {
      spring: false,
      summer: false,
      autumn: false,
      winter: false,
    },
    overview: "",
    serviceIncludes: [""],
    thingsToKnow: [""],
    FAQs: [{ question: "", answer: "" }],
    thumbnail: null as File | null,
    thumbnailPreview: null as string | null,
    gallery: [] as File[],
    galleryPreviews: [] as string[],
    imageToDelete: [] as string[],
    isPopular: false,
    isActivated: true,
  })

  const slug = useParams().slug as string
  const route = useRouter()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSeasonToggle = (season: keyof typeof formData.seasons) => {
    setFormData((prev) => ({
      ...prev,
      seasons: {
        ...prev.seasons,
        [season]: !prev.seasons[season],
      },
    }))
  }

  const handleArrayChange = (
    field: "serviceIncludes" | "thingsToKnow",
    index: number,
    value: string
  ) => {
    const newArray = [...formData[field]]
    newArray[index] = value
    setFormData((prev) => ({ ...prev, [field]: newArray }))
  }

  const addArrayItem = (field: "serviceIncludes" | "thingsToKnow") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }))
  }

  const removeArrayItem = (
    field: "serviceIncludes" | "thingsToKnow",
    index: number
  ) => {
    const newArray = formData[field].filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, [field]: newArray }))
  }

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          thumbnail: file,
          thumbnailPreview: reader.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles = Array.from(files)
      const newPreviews: string[] = []

      const readFiles = newFiles.map((file) => {
        return new Promise<void>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            newPreviews.push(reader.result as string)
            resolve()
          }
          reader.readAsDataURL(file)
        })
      })

      Promise.all(readFiles).then(() => {
        setFormData((prev) => ({
          ...prev,
          gallery: [...prev.gallery, ...newFiles],
          galleryPreviews: [...prev.galleryPreviews, ...newPreviews],
        }))
      })
    }
  }

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
      galleryPreviews: prev.galleryPreviews.filter((_, i) => i !== index),
    }))
  }

  // get form
  const handleGetActivityData = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/activities/get-activity-by-slug/${slug}?q=a`
      )
      if (response.data.success) {
        const tour = response.data.data
        setFormData({
          id: tour._id,
          title: tour.title,
          price: tour.price,
          country: tour.country,
          location: tour.location,
          groupSizeMin: tour.groupSize.min,
          groupSizeMax: tour.groupSize.max,
          seasons: {
            spring: tour.bestSeason.includes("spring"),
            summer: tour.bestSeason.includes("summer"),
            autumn: tour.bestSeason.includes("autumn"),
            winter: tour.bestSeason.includes("winter"),
          },
          overview: tour.overview,
          serviceIncludes: tour.serviceIncludes,
          thingsToKnow: tour.thingsToKnow,
          FAQs: tour.FAQs,
          thumbnail: null,
          thumbnailPreview: tour.thumbnail,
          gallery: [],
          galleryPreviews: tour.gallery,
          imageToDelete: [],
          isPopular: tour.isPopular,
          isActivated: tour.isActivated,
        })
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }
  //title change
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setFormData((prev) => ({
      ...prev,
      title: value,
    }))
  }
  //country change
  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target
    setFormData((prev) => ({
      ...prev,
      country: value,
    }))
  }
  //group size change
  // group size
  const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setFormData((prev) => ({
      ...prev,
      groupSizeMin: value,
    }))
  }
  const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setFormData((prev) => ({
      ...prev,
      groupSizeMax: value,
    }))
  }
  // faq
  const addFAQ = () => {
    setFormData((prev) => ({
      ...prev,
      FAQs: [...prev.FAQs, { question: "", answer: "" }],
    }))
  }
  const updateFAQ = (index: number, updatedFAQ: FAQ) => {
    const newFAQs = [...formData.FAQs]
    newFAQs[index] = updatedFAQ
    setFormData((prev) => ({
      ...prev,
      FAQs: newFAQs,
    }))
  }
  const removeFAQ = (index: number) => {
    const newFAQs = formData.FAQs.filter((_, i) => i !== index)
    setFormData((prev) => ({
      ...prev,
      FAQs: newFAQs,
    }))
  }

  // image delete
  const handleImageDelete = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((file) => file.name !== imageUrl),
      galleryPreviews: prev.galleryPreviews.filter(
        (preview) => preview !== imageUrl
      ),
    }))
    setFormData((prev) => ({
      ...prev,
      imageToDelete: [...prev.imageToDelete, imageUrl],
    }))
  }

  //submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all required fields
    const requiredFields = [
      "title",
      "price",
      "country",
      "location",
      "groupSizeMin",
      "groupSizeMax",
      "overview",
    ]

    const isValidSeason = Object.values(formData.seasons).some(
      (season) => season
    )
    if (!isValidSeason) {
      toast.error("Please select at least one season")
      return
    }

    const missingFields = requiredFields.filter((field) => {
      const value = formData[field as keyof typeof formData]
      return value === "" || value === "0"
    })

    // For edit, we might not need to require thumbnail if it already exists
    if (missingFields.length > 0) {
      toast.error("Please fill all required fields")
      return
    }

    const bestSeasons = Object.keys(formData.seasons).filter(
      (season) => formData.seasons[season as keyof typeof formData.seasons]
    )

    const formDataToSubmit = new FormData()
    formDataToSubmit.append("id", formData.id)
    formDataToSubmit.append("title", formData.title)
    formDataToSubmit.append("price", formData.price)
    formDataToSubmit.append("country", formData.country)
    formDataToSubmit.append("location", formData.location)
    formDataToSubmit.append("groupSizeMin", formData.groupSizeMin)
    formDataToSubmit.append("groupSizeMax", formData.groupSizeMax)
    formDataToSubmit.append("overview", formData.overview)
    formDataToSubmit.append("bestSeason", JSON.stringify(bestSeasons))
    formDataToSubmit.append(
      "serviceIncludes",
      JSON.stringify(formData.serviceIncludes)
    )
    formDataToSubmit.append(
      "thingsToKnow",
      JSON.stringify(formData.thingsToKnow)
    )
    formDataToSubmit.append("FAQs", JSON.stringify(formData.FAQs))

    // Only append files if they're new (instanceof File)
    if (formData.thumbnail instanceof File) {
      formDataToSubmit.append("thumbnail", formData.thumbnail)
    }

    // Append only new gallery images
    formData.gallery.forEach((file) => {
      if (file instanceof File) {
        formDataToSubmit.append("image", file)
      }
    })

    //delete images
    if (formData.imageToDelete && formData.imageToDelete.length > 0) {
      formDataToSubmit.append(
        "imageToDelete",
        JSON.stringify(formData.imageToDelete)
      )
    }

    try {
      setLoading(true)
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/activities/edit-activity`,
        formDataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          withCredentials: true,
        }
      )

      if (response.data.success) {
        toast.success(response.data.message || "Activity updated successfully")
        router.push("/activities")
      } else {
        toast.error(response.data.message || "Failed to update activity")
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update activity")
      console.error("Error updating activity:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (slug) {
      handleGetActivityData()
    }
  }, [slug])

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header section */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-800 text-white p-6 shadow-lg rounded-b-lg">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => route.back()}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-colors"
            >
              <FaArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold">
              Edit Activity{formData?.title && ` - ${formData.title}`}
            </h1>
          </div>
          <div>
            {formData.isActivated && (
              <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
            )}
            {formData.isPopular && (
              <Badge className="bg-yellow-500 hover:bg-yellow-600 ml-2">
                Popular
              </Badge>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Navigation progress indicator */}
        <div className="flex justify-between items-center mb-8 p-3 bg-white rounded-lg shadow-sm overflow-x-auto">
          <div className="flex space-x-4">
            {[
              "Basic Info",
              "Location & Group",
              "Seasons",
              "Content",
              "Images",
            ].map((step, index) => (
              <a
                key={index}
                href={`#section-${index + 1}`}
                className="px-4 py-2 text-sm font-medium rounded-md bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors whitespace-nowrap"
              >
                {step}
              </a>
            ))}
          </div>
        </div>

        {/* Basic Information Section */}
        <Card id="section-1" className="border-none shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-t-lg">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            <div className="grid md:grid-cols-3 gap-6">
              <NameInput value={formData.title} onChange={handleTitleChange} />
              <PriceInput
                value={Number(formData.price)}
                onChange={handleChange}
              />
              <CountrySelect
                country={formData.country}
                handleCountryChange={handleCountryChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Location & Group Details */}
        <Card id="section-2" className="border-none shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-t-lg">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Location & Group Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            <div className="grid md:grid-cols-2 gap-6">
              <LocationInput
                location={formData.location}
                handleLocationChange={handleChange}
              />
              <GroupSizeInput
                minGroupSize={Number(formData.groupSizeMin)}
                maxGroupSize={Number(formData.groupSizeMax)}
                handleMinChange={handleMinChange}
                handleMaxChange={handleMaxChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Seasons */}
        <Card id="section-3" className="border-none shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-t-lg">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Best Seasons
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.keys(formData.seasons).map((season) => (
                <div
                  key={season}
                  className={`flex items-center space-x-2 p-4 rounded-lg border-2 transition-all ${
                    formData.seasons[season as keyof typeof formData.seasons]
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <Checkbox
                    checked={
                      formData.seasons[season as keyof typeof formData.seasons]
                    }
                    onCheckedChange={() =>
                      handleSeasonToggle(
                        season as keyof typeof formData.seasons
                      )
                    }
                    className="data-[state=checked]:bg-teal-600 text-white"
                  />
                  <label className="text-sm font-medium capitalize">
                    {season}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Sections */}
        <Card id="section-4" className="border-none shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-t-lg">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Activity Content
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-white space-y-8">
            {/* Overview */}
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-3">
                Overview
              </h4>
              <Textarea
                name="overview"
                value={formData.overview}
                onChange={handleChange}
                placeholder="Provide a detailed overview of the activity..."
                className="min-h-32 border-gray-300 focus:ring-teal-500"
                required
              />
            </div>

            {/* Service Includes */}
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-3">
                Services Included
              </h4>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                {formData.serviceIncludes.map((service, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={service}
                      onChange={(e) =>
                        handleArrayChange(
                          "serviceIncludes",
                          index,
                          e.target.value
                        )
                      }
                      placeholder="Enter included service"
                      className="border-gray-300 bg-white focus:ring-teal-500"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeArrayItem("serviceIncludes", index)}
                      className="shrink-0"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem("serviceIncludes")}
                  className="w-full border-dashed bg-white hover:bg-teal-50 hover:border-teal-300"
                >
                  <Plus size={18} className="mr-2" /> Add Service
                </Button>
              </div>
            </div>

            {/* Things to Know */}
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-3">
                Things to Know
              </h4>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                {formData.thingsToKnow.map((thing, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={thing}
                      onChange={(e) =>
                        handleArrayChange("thingsToKnow", index, e.target.value)
                      }
                      placeholder="Enter important information"
                      className="border-gray-300 bg-white focus:ring-teal-500"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeArrayItem("thingsToKnow", index)}
                      className="shrink-0"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem("thingsToKnow")}
                  className="w-full border-dashed bg-white hover:bg-teal-50 hover:border-teal-300"
                >
                  <Plus size={18} className="mr-2" /> Add Information
                </Button>
              </div>
            </div>

            {/* FAQs */}
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-3">
                Frequently Asked Questions
              </h4>
              <div className="space-y-4 max-w-[600px]">
                {formData.FAQs.map((faq, index) => (
                  <FAQForm
                    key={index}
                    index={index}
                    faq={faq}
                    updateFAQ={(updatedFAQ) => updateFAQ(index, updatedFAQ)}
                    removeFAQ={() => removeFAQ(index)}
                  />
                ))}
                <Button
                  type="button"
                  onClick={addFAQ}
                  className="bg-teal-600 hover:bg-teal-700 text-white mt-4"
                >
                  <Plus size={18} className="mr-2" /> Add FAQ
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Image Uploads */}
        <Card id="section-5" className="border-none shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-t-lg">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Activity Images
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-white space-y-6">
            {/* Thumbnail Upload */}
            <ThumbnailInput
              preview={formData.thumbnailPreview}
              handleImageChange={handleThumbnailUpload}
            />

            <div className="mt-8">
              <ImageUploadEdit
                images={formData.gallery}
                previews={formData.galleryPreviews}
                handleImageChange={handleGalleryUpload}
                removeImage={removeGalleryImage}
                handleImageDelete={handleImageDelete}
              />
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          disabled={loading}
          onClick={handleSubmit}
          className="px-10 mb-20 py-6 text-white text-lg bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 rounded-lg flex items-center shadow-md"
        >
          {loading ? (
            <>
              <Loader2Icon className="animate-spin mr-2" size={20} />
              Updating...
            </>
          ) : (
            <>
              <Save size={20} className="mr-2" /> Save Changes
            </>
          )}
        </Button>
      </form>
    </div>
  )
}

export default EditActivityForm
