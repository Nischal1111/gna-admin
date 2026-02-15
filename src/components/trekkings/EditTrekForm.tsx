"use client"

import React, { useState, useCallback, useEffect } from "react"

import CountrySelect from "./addForm/CountrySelectForm"
import DifficultySelect from "./addForm/DifficultySelectForm"
import Accommodation from "./addForm/AccommodationForm"
import MealSelect from "./addForm/MealsForm"
import BestSeasonsSelect from "./addForm/SeasonsForm"
import ImageUpload from "./addForm/ImagesForm"
import VideoUpload from "./addForm/VideoForm"

import NameInput from "./addForm/NameInputForm"
import PriceInput from "./addForm/PriceInputForm"
import ThumbnailInput from "./addForm/ThumbnailForm"
import TrekkingDaysInput from "./TrekkingDaysForm"
import LocationInput from "./addForm/LocationForm"
import GroupSizeInput from "./addForm/GroupSizeForm"
import StartingEndingPointInput from "./addForm/StartEndPointForm"
import FAQList from "./addForm/FaqForm"
import { nanoid } from "nanoid"
import { useParams, useRouter } from "next/navigation"

import { Button } from "../ui/button"
import HighlightForm from "./addForm/HighlightsForm"
import ItineraryForm from "./addForm/ItineraryForm"
import FAQForm from "./addForm/FaqForm"
import OverviewForm from "./addForm/OverviewForm"
import InclusiveExclusiveServicesForm from "./addForm/ServicesForm"
import PackagingForm from "./addForm/PackagingForm"
import NoteForm from "./addForm/NoteForm"
import axios from "axios"
import { FaArrowLeft } from "react-icons/fa6"
import { FaEye } from "react-icons/fa6"
import { Loader } from "../loading/Loader"
import TrekPdfForm from "./addForm/TrekPdfForm"
import { toast } from "sonner"
import ImageUploadEdit from "./addForm/ImageUploadEdit"
import RouteMapImageForm from "./addForm/RouteMapImageFrom"

import Cookies from "js-cookie"
import DiscountInput from "./addForm/DiscountInput"
import AddBookingPrice from "../common/AddBookingPrice"
import UpdateBookingPrice from "../common/EditBookingPrice"
import { PenBoxIcon, Trash2Icon, XIcon } from "lucide-react"

interface FAQ {
  question: string
  answer: string
}
type FAQField = "question" | "answer"

interface Highlight {
  content: string
  links: { text: string; url: string }[]
}

interface Link {
  text: string
  url: string
}

interface Itinerary {
  day: number
  title: string
  details: string
  accommodations: string
  meals: string
  links: Link[]
}

interface Itinerary {
  day: number
  title: string
  details: string
  links: Link[]
}

import { BookingPriceInterface } from "../utils/types"

const EditTrekForm: React.FC = () => {
  const route = useRouter()
  // State management
  const [accommodations, setAccommodations] = useState<string[]>([""])
  const [name, setName] = useState("")
  const [price, setPrice] = useState<number>(0)
  const [discount, setDiscount] = useState<number>(0)
  const [thumbnail, setThumbnail] = useState<string | File>("")
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [routeMapImage, setRouteMapImage] = useState<string | File>("")
  const [routeMapImagePreview, setRouteMapImagePreview] = useState<
    string | null
  >(null)
  const [trekPdf, setTrekPdf] = useState<string | File>("")
  const [trekPdfPreview, setTrekPdfPreview] = useState<string | null>(null)
  const [pdfFileSize, setPdfFileSize] = useState<number | null>(null)
  const maxSizeMB = 5 // Maximum allowed size in MB
  const [country, setCountry] = useState("")
  const [minDays, setMinDays] = useState<number>(1)
  const [maxDays, setMaxDays] = useState<number>(1)
  const [location, setLocation] = useState<string>("")
  const [difficulty, setDifficulty] = useState<string>("")
  const [minGroupSize, setMinGroupSize] = useState<number>(0)
  const [maxGroupSize, setMaxGroupSize] = useState<number>(0)
  const [meal, setMeal] = useState<string>("")
  const [startingPoint, setStartingPoint] = useState<string>("")
  const [endingPoint, setEndingPoint] = useState<string>("")
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([])
  const [images, setImages] = useState<(string | File)[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [video, setVideo] = useState<string>("")

  const [faqs, setFaqs] = useState<FAQ[]>([{ question: "", answer: "" }])
  const [highlights, setHighlights] = useState<Highlight[]>([
    { content: "", links: [{ text: "", url: "" }] },
  ])
  const [itineraries, setItineraries] = useState<Itinerary[]>([
    {
      day: 1,
      title: "",
      details: "",
      accommodations: "",
      meals: "",
      links: [{ text: "", url: "" }],
    },
  ])
  const [overview, setOverview] = useState("")
  // services
  const [inclusives, setInclusives] = useState<string[]>([])
  const [exclusives, setExclusives] = useState<string[]>([])
  // packaging
  const [general, setGeneral] = useState<string[]>([])
  const [clothes, setClothes] = useState<string[]>([])
  const [firstAid, setFirstAid] = useState<string[]>([])
  const [otherEssentials, setOtherEssentials] = useState<string[]>([])
  //note
  const [note, setNote] = useState<string>("")

  const [loading, setLoading] = useState(false)
  const [views, setViews] = useState(0)

  //for deleting
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([])
  const [thumbnailToDelete, setThumbnailToDelete] = useState(false)
  const [videoToDelete, setVideoToDelete] = useState(false)

  const [addBookingPriceOpen, setAddBookingPriceOpen] = useState<boolean>(false)
  const [editBookingPriceOpen, setEditBookingPriceOpen] =
    useState<boolean>(false)

  const slugId = useParams()
  const slug = slugId.slug

  const [bookingPriceData, setBookingPriceData] =
    useState<BookingPriceInterface>({
      _id: "",
      adventureId: "",
      adventureType: "",
      solo: "",
      soloThreeStar: "",
      soloFourStar: "",
      soloFiveStar: "",
      singleSupplementary: "",
      singleSupplementaryThreeStar: "",
      singleSupplementaryFourStar: "",
      singleSupplementaryFiveStar: "",
      standardThreeStar: "",
      standardFourStar: "",
      standardFiveStar: "",
    })
  const [availableBookingPrice, setAvailableBookingPrice] =
    useState<boolean>(false)

  const [originalTrekData, setOriginalTrekData] = useState<{
    name: string
    price: number
    discount: number
    thumbnail: string
    routeMapImage: string
    trekPdf: string
    country: string
    days: { min: number; max: number }
    location: string
    difficulty: string
    groupSize: { min: number; max: number }
    meal: string
    bestSeason: string[]
    startingPoint: string
    endingPoint: string
    overview: string
    trekHighlights: Highlight[]
    itinerary: Itinerary[]
    servicesCostIncludes: string[]
    servicesCostExcludes: string[]
    packingList: {
      general: string[]
      clothes: string[]
      firstAid: string[]
      otherEssentials: string[]
    }
    faq: FAQ[]
    note: string
    images: string[]
    video: string
    accommodations: string[]
  }>({
    name: "",
    price: 0,
    discount: 0,
    thumbnail: "",
    routeMapImage: "",
    trekPdf: "",
    country: "",
    days: { min: 0, max: 0 },
    location: "",
    difficulty: "",
    groupSize: { min: 0, max: 0 },
    meal: "",
    startingPoint: "",
    endingPoint: "",
    bestSeason: [],
    overview: "",
    trekHighlights: [{ content: "", links: [{ text: "", url: "" }] }],
    itinerary: [
      {
        day: 0,
        title: "",
        details: "",
        accommodations: "",
        meals: "",
        links: [{ text: "", url: "" }],
      },
    ],
    servicesCostIncludes: [],
    servicesCostExcludes: [],
    packingList: {
      general: [],
      clothes: [],
      firstAid: [],
      otherEssentials: [],
    },
    faq: [{ question: "", answer: "" }],
    note: "",
    images: [],
    video: "",
    accommodations: [],
  })

  // Event handlers

  // name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }
  // accomodation
  const handleAccommodationChange = (index: number, value: string) => {
    const updatedAccommodations = [...accommodations]
    updatedAccommodations[index] = value
    setAccommodations(updatedAccommodations)
  }
  const handleAddAccommodation = () => {
    setAccommodations([...accommodations, ""])
  }
  const handleRemoveAccommodation = (index: number) => {
    setAccommodations(accommodations.filter((_, i) => i !== index))
  }
  // price
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(parseFloat(e.target.value))
  }
  const handleDisountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiscount(parseFloat(e.target.value))
  }
  // thumbnail
  const handleThumbnailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      setThumbnailPreview(URL.createObjectURL(file))
      setThumbnail(file)
    }
  }
  // route map image
  const handleRouteMapImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      setRouteMapImagePreview(URL.createObjectURL(file))
      setRouteMapImage(file)
    }
  }

  // country
  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCountry(event.target.value)
  }
  // trekking days
  const handleMinDaysChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinDays(Number(event.target.value))
  }
  const handleMaxDaysChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxDays(Number(event.target.value))
  }
  // location
  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value)
  }
  //video
  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideo(event.target.value)
  }
  // difficulty
  const handleDifficultyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDifficulty(event.target.value)
  }
  // group size
  const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinGroupSize(Number(event.target.value))
  }
  const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxGroupSize(Number(event.target.value))
  }
  // meal
  const handleMealChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMeal(event.target.value)
  }
  // starting & ending point
  const handleStartingPointChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStartingPoint(event.target.value)
  }
  const handleEndingPointChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEndingPoint(event.target.value)
  }
  // best seasons
  const handleSeasonChange = (season: string) => {
    setSelectedSeasons(
      (prev) =>
        prev.includes(season)
          ? prev.filter((s) => s !== season) // Remove if already selected
          : [...prev, season] // Add if not selected
    )
  }
  // images
  const handleImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (files) {
        const newFiles = Array.from(files)
        const allowedFiles = newFiles.slice(0, Math.max(0, 10 - images.length))

        const newPreviews = allowedFiles.map((file) =>
          URL.createObjectURL(file)
        )

        setImages((prevImages) => [...prevImages, ...allowedFiles]) // Store File objects
        setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]) // Store preview URLs
      }
    },
    [images]
  )

  const removeImage = useCallback((index: number) => {
    setImages((prevImages) => {
      const newImages = [...prevImages]
      newImages.splice(index, 1)
      return newImages
    })
    setPreviews((prevPreviews) => {
      const newPreviews = [...prevPreviews]
      URL.revokeObjectURL(newPreviews[index]) // Clean up the URL object
      newPreviews.splice(index, 1)
      return newPreviews
    })
  }, [])
  React.useEffect(() => {
    // Clean up URLs when component unmounts
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview))
    }
  }, [])

  // faq
  const addFAQ = () => {
    setFaqs([...faqs, { question: "", answer: "" }])
  }
  const updateFAQ = (index: number, updatedFAQ: FAQ) => {
    const newFaqs = [...faqs]
    newFaqs[index] = updatedFAQ
    setFaqs(newFaqs)
  }
  const removeFAQ = (index: number) => {
    const newFaqs = [...faqs]
    newFaqs.splice(index, 1)
    setFaqs(newFaqs)
  }
  // highlights
  const addHighlight = () => {
    setHighlights([
      ...highlights,
      { content: "", links: [{ text: "", url: "" }] },
    ])
  }
  const updateHighlights = (index: number, updatedHighlight: Highlight) => {
    const newHighlights = [...highlights]
    newHighlights[index] = updatedHighlight
    setHighlights(newHighlights)
  }
  const removeHighlight = (index: number) => {
    const newHighlights = [...highlights]
    newHighlights.splice(index, 1)
    setHighlights(newHighlights)
  }
  // itineraries
  const addItinerary = () => {
    setItineraries([
      ...itineraries,
      {
        day: itineraries.length + 1,
        title: "",
        details: "",
        accommodations: "",
        meals: "",
        links: [{ text: "", url: "" }],
      },
    ])
  }
  const updateItineraries = (index: number, updatedItinerary: Itinerary) => {
    const newItineraries = [...itineraries]
    newItineraries[index] = updatedItinerary
    setItineraries(newItineraries)
  }
  const removeItinerary = (index: number) => {
    const newItineraries = [...itineraries]
    newItineraries.splice(index, 1)

    // Recalculate days after removing
    const recalculatedItineraries = newItineraries.map((itinerary, i) => ({
      ...itinerary,
      day: i + 1,
    }))
    setItineraries(recalculatedItineraries)
  }

  // overview
  const handleOverviewChange = (newValue: string) => {
    setOverview(newValue)
  }

  const [trekId, setTrekId] = useState("")

  //getting the data of trekking
  const handleGetTrekData = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/trekking/get-trek/${slug}`
      )

      if (response.data.success) {
        setLoading(false)
        const trekData = response.data.data

        setOriginalTrekData(trekData)
        setTrekId(trekData._id)
        setName(trekData.name)
        setViews(trekData.viewsCount)

        setPrice(trekData.price)
        setDiscount(trekData.discount)
        setThumbnailPreview(trekData.thumbnail)
        setRouteMapImagePreview(trekData.routeMapImage)
        setAccommodations(trekData.accommodation)
        setCountry(trekData.country)
        setMinDays(trekData.days.min)
        setMaxDays(trekData.days.max)
        setLocation(trekData.location)
        setDifficulty(trekData.difficulty)
        setMinGroupSize(trekData.groupSize.min)
        setMaxGroupSize(trekData.groupSize.max)
        setMeal(trekData.meal)
        setStartingPoint(trekData.startingPoint)
        setEndingPoint(trekData.endingPoint)
        setSelectedSeasons(trekData.bestSeason)
        setOverview(trekData.overview)
        setHighlights(trekData.trekHighlights)
        setItineraries(trekData.itinerary)
        setInclusives(trekData.servicesCostIncludes)
        setExclusives(trekData.servicesCostExcludes)
        setGeneral(trekData.packingList.general)
        setClothes(trekData.packingList.clothes)
        setFirstAid(trekData.packingList.firstAid)
        setOtherEssentials(trekData.packingList.otherEssentials)
        setFaqs(trekData.faq)
        setNote(trekData.note)
        if (trekData.images && trekData.images.length > 0) {
          // setImages(trekData.images) // Initialize images with strings (URLs)
          setPreviews(trekData.images) // Initialize previews with the same URLs
        }
        setVideo(trekData.video)
      }
      //  for booking price details
      if (response.data.bookingDetails !== null) {
        setBookingPriceData(response.data.bookingDetails)
        setAvailableBookingPrice(true)
      } else {
        setAvailableBookingPrice(false)
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    handleGetTrekData()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData()

    // Add trek ID
    formData.append("trekId", trekId)

    // Add basic fields only if they've changed from original data
    if (name !== originalTrekData.name) {
      formData.append("name", name)
    }
    if (price !== originalTrekData.price) {
      formData.append("price", price.toString())
    }
    if (discount !== originalTrekData.discount) {
      formData.append("discount", discount.toString())
    }
    if (country !== originalTrekData.country) {
      formData.append("country", country)
    }
    if (location !== originalTrekData.location) {
      formData.append("location", location)
    }
    if (difficulty !== originalTrekData.difficulty) {
      formData.append("difficulty", difficulty)
    }
    if (minDays !== originalTrekData.days.min) {
      formData.append("minDays", minDays.toString())
    }
    if (maxDays !== originalTrekData.days.max) {
      formData.append("maxDays", maxDays.toString())
    }
    if (minGroupSize !== originalTrekData.groupSize.min) {
      formData.append("groupSizeMin", minGroupSize.toString())
    }
    if (maxGroupSize !== originalTrekData.groupSize.max) {
      formData.append("groupSizeMax", maxGroupSize.toString())
    }
    if (startingPoint !== originalTrekData.startingPoint) {
      formData.append("startingPoint", startingPoint)
    }
    if (endingPoint !== originalTrekData.endingPoint) {
      formData.append("endingPoint", endingPoint)
    }
    if (meal !== originalTrekData.meal) {
      formData.append("meal", meal)
    }
    if (overview !== originalTrekData.overview) {
      formData.append("overview", overview)
    }
    if (note !== originalTrekData.note) {
      formData.append("note", note)
    }

    // Handle complex JSON fields
    if (
      JSON.stringify(accommodations) !==
      JSON.stringify(originalTrekData.accommodations)
    ) {
      formData.append("accommodation", JSON.stringify(accommodations))
    }
    if (
      JSON.stringify(selectedSeasons) !==
      JSON.stringify(originalTrekData.bestSeason)
    ) {
      formData.append("bestSeason", JSON.stringify(selectedSeasons))
    }
    if (
      JSON.stringify(highlights) !==
      JSON.stringify(originalTrekData.trekHighlights)
    ) {
      formData.append("trekHighlights", JSON.stringify(highlights))
    }
    if (
      JSON.stringify(itineraries) !== JSON.stringify(originalTrekData.itinerary)
    ) {
      formData.append("itinerary", JSON.stringify(itineraries))
    }
    if (
      JSON.stringify(inclusives) !==
      JSON.stringify(originalTrekData.servicesCostIncludes)
    ) {
      formData.append("servicesCostIncludes", JSON.stringify(inclusives))
    }
    if (
      JSON.stringify(exclusives) !==
      JSON.stringify(originalTrekData.servicesCostExcludes)
    ) {
      formData.append("servicesCostExcludes", JSON.stringify(exclusives))
    }

    // Handle packing list
    const newPackingList = { general, clothes, firstAid, otherEssentials }
    if (
      JSON.stringify(newPackingList) !==
      JSON.stringify(originalTrekData.packingList)
    ) {
      formData.append("packingList", JSON.stringify(newPackingList))
    }

    // Handle FAQs
    if (JSON.stringify(faqs) !== JSON.stringify(originalTrekData.faq)) {
      formData.append("faq", JSON.stringify(faqs))
    }

    // Handle file deletions
    if (imagesToDelete.length > 0) {
      formData.append("imagesToDelete", JSON.stringify(imagesToDelete))
    }
    if (thumbnailToDelete) {
      formData.append("thumbnailToDelete", "true")
    }
    if (videoToDelete) {
      formData.append("videoToDelete", "true")
    }

    // Handle new file uploads
    if (thumbnail instanceof File) {
      formData.append("thumbnail", thumbnail)
    }
    if (routeMapImage instanceof File) {
      formData.append("routemapimage", routeMapImage)
    }
    if (trekPdf instanceof File) {
      formData.append("trekPdf", trekPdf)
    }
    if (images.length > 0) {
      images.forEach((image, index) => {
        if (image instanceof File) {
          formData.append("images", image)
        }
      })
    }
    if (video) {
      formData.append("video", video)
    }

    try {
      setLoading(true)
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/trekking/edit-trek`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          withCredentials: true,
        }
      )

      if (response.data.success) {
        toast.success(response.data.message || "Trek Updated Successfully")
        setLoading(false)
        route.push("/trekkings")
      } else {
        toast.error(
          response.data.message || "Unable to Update Trek, Please Try Again!"
        )
        setLoading(false)
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error occurred while updating the trek.")
      setLoading(false)
    }
  }

  //  helper functions for handling image deletions
  // const handleImageDelete = (imageUrl: string) => {
  //   setImagesToDelete((prev) => [...prev, imageUrl])
  //   setPreviews((prev) => prev.filter((preview) => preview !== imageUrl))
  // }
  const handleImageDelete = (imageUrl: string) => {
    setImagesToDelete((prev) => [...prev, imageUrl])
    setPreviews((prev) => prev.filter((preview) => preview !== imageUrl))
    setImages((prev) => prev.filter((image) => image !== imageUrl)) // Keep images array in sync
  }

  const handleAddBookingPrice = () => {
    setAddBookingPriceOpen(!addBookingPriceOpen)
  }
  const handleEditBookingPrice = () => {
    setEditBookingPriceOpen(!editBookingPriceOpen)
  }
  const handleDeleteBookingPrice = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete the booking price?"
    )
    if (!confirmDelete) return
    try {
      setLoading(true)
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/booking/delete-booking-price/${bookingPriceData?._id}`
      )

      if (response.data.success) {
        toast.success(response.data.message || "Booking Price Removed")
        setLoading(false)
        setAvailableBookingPrice(false)
      } else {
        toast.error(
          response.data.message ||
            "Unable to Delete Booking Price, Please Try Again!"
        )
        setLoading(false)
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error occurred while deleting the booking price.")
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-gray-50 p-8">
      <div className="max-w-full mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-primary text-white p-6 flex items-center justify-between">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => route.back()}
                className="hover:bg-blue-700 p-2 rounded-full transition-colors"
              >
                <FaArrowLeft size={24} />
              </button>
              <h1 className="text-3xl font-bold">Edit Trek - {name}</h1>
              <div className="flex gap-2 mr-4 items-center">
                <FaEye />
                <span>{views} views</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              {availableBookingPrice ? (
                <>
                  <Button
                    type="button"
                    onClick={handleEditBookingPrice}
                    className="bg-blue-700 hover:bg-blue-800"
                  >
                    <PenBoxIcon className="w-6 h-6" />
                    Edit Booking Price
                  </Button>
                  {/* delete  */}
                  <Button
                    type="button"
                    onClick={() => handleDeleteBookingPrice()}
                    className="bg-red-700 hover:bg-red-800"
                  >
                    <Trash2Icon className="w-6 h-6" /> Delete Price
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  onClick={handleAddBookingPrice}
                  className="bg-green-700 hover:bg-green-800"
                >
                  {addBookingPriceOpen ? (
                    <>
                      <XIcon className="w-6 h-6" /> Close Booking Price
                    </>
                  ) : (
                    <>
                      <PenBoxIcon className="w-6 h-6" /> Add Booking Price
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* for add booking price component */}
        {!availableBookingPrice && addBookingPriceOpen && (
          <div className="absolute top-36 left-1/2 z-100 ">
            <AddBookingPrice adventureType="Trekking" adventureId={trekId} />
          </div>
        )}
        {/* for edit booking price component */}
        {availableBookingPrice && editBookingPriceOpen && (
          <div className="absolute top-36 left-2/3 z-100 ">
            <UpdateBookingPrice
              adventureType="Trekking"
              adventureId={trekId}
              bookingPriceDetails={bookingPriceData}
            />
          </div>
        )}

        {/* Main Content */}

        <form
          typeof="multipart/form-data"
          onSubmit={handleSubmit}
          className="p-8 space-y-8"
        >
          {/* Basic Information Section */}
          <div className="bg-gray-100 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-blue-700 mb-6 border-b pb-3">
              Part 1: Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <NameInput value={name} onChange={handleNameChange} />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <PriceInput value={price} onChange={handlePriceChange} />
                <DiscountInput
                  value={discount}
                  onChange={handleDisountChange}
                />

                <CountrySelect
                  country={country}
                  handleCountryChange={handleCountryChange}
                />
                <DifficultySelect
                  difficulty={difficulty}
                  handleDifficultyChange={handleDifficultyChange}
                />
              </div>
            </div>

            <div className="flex gap-20 mt-6">
              <ThumbnailInput
                preview={thumbnailPreview}
                handleImageChange={handleThumbnailChange}
              />
              <RouteMapImageForm
                preview={routeMapImagePreview}
                handleImageChange={handleRouteMapImageChange}
              />
            </div>
          </div>

          {/* Trek Details Section */}
          <div className="bg-gray-100 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-blue-700 mb-6 border-b pb-3">
              Trek Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <BestSeasonsSelect
                selectedSeasons={selectedSeasons}
                handleSeasonChange={handleSeasonChange}
              />
              <LocationInput
                location={location}
                handleLocationChange={handleLocationChange}
              />
              <MealSelect meal={meal} handleMealChange={handleMealChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <TrekkingDaysInput
                minDays={minDays}
                maxDays={maxDays}
                handleMinDaysChange={handleMinDaysChange}
                handleMaxDaysChange={handleMaxDaysChange}
              />
              <GroupSizeInput
                minGroupSize={minGroupSize}
                maxGroupSize={maxGroupSize}
                handleMinChange={handleMinChange}
                handleMaxChange={handleMaxChange}
              />
            </div>
          </div>

          {/* Route and Accommodation Section */}
          <div className="bg-gray-100 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-blue-700 mb-6 border-b pb-3">
              Route and Accommodation
            </h2>
            <StartingEndingPointInput
              startingPoint={startingPoint}
              endingPoint={endingPoint}
              handleStartingPointChange={handleStartingPointChange}
              handleEndingPointChange={handleEndingPointChange}
            />
            <div className="mt-6">
              <Accommodation
                accommodations={accommodations}
                handleAccommodationChange={handleAccommodationChange}
                handleAddAccommodation={handleAddAccommodation}
                handleRemoveAccommodation={handleRemoveAccommodation}
              />
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-gray-100 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-blue-700 mb-6 border-b pb-3">
              Description
            </h2>
            <OverviewForm value={overview} onChange={handleOverviewChange} />
            <div className="mt-6">
              <NoteForm value={note} onChange={setNote} />
            </div>
          </div>

          {/* Highlights Section */}
          <div className="bg-gray-100 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h2 className="text-2xl font-semibold text-blue-700">
                Highlights
              </h2>
            </div>
            {highlights &&
              highlights.map((highlight, index) => (
                <HighlightForm
                  key={index}
                  index={index}
                  highlight={highlight}
                  updateHighlight={(updatedHighlight) =>
                    updateHighlights(index, updatedHighlight)
                  }
                  removeHighlight={() => removeHighlight(index)}
                />
              ))}
            <Button
              type="button"
              onClick={addHighlight}
              className="bg-blue-500 hover:bg-blue-600 text-white mt-4"
            >
              Add Highlight
            </Button>
          </div>

          {/* Itineraries Section */}
          <div className="bg-gray-100 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h2 className="text-2xl font-semibold text-blue-700">
                Itineraries
              </h2>
            </div>
            {itineraries &&
              itineraries.map((itinerary, index) => (
                <ItineraryForm
                  key={index}
                  index={index}
                  itinerary={itinerary}
                  updateItinerary={(updatedItinerary) =>
                    updateItineraries(index, updatedItinerary)
                  }
                  removeItinerary={() => removeItinerary(index)}
                />
              ))}
            <Button
              type="button"
              onClick={addItinerary}
              className="bg-blue-500 hover:bg-blue-600 text-white mt-4"
            >
              Add Itinerary
            </Button>
          </div>

          {/* FAQs Section */}
          <div className="bg-gray-100 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h2 className="text-2xl font-semibold text-blue-700">FAQs</h2>
            </div>
            {faqs.map((faq, index) => (
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
              className="bg-blue-500 hover:bg-blue-600 text-white mt-4"
            >
              Add FAQ
            </Button>
          </div>

          {/* Services Section */}
          <InclusiveExclusiveServicesForm
            inclusives={inclusives}
            exclusives={exclusives}
            onUpdateInclusives={setInclusives}
            onUpdateExclusives={setExclusives}
          />

          {/* Packaging Section */}
          <PackagingForm
            general={general}
            clothes={clothes}
            firstAid={firstAid}
            otherEssentials={otherEssentials}
            onUpdateGeneral={setGeneral}
            onUpdateClothes={setClothes}
            onUpdateFirstAid={setFirstAid}
            onUpdateOtherEssentials={setOtherEssentials}
          />

          {/* Media Upload Section */}
          <div className="bg-gray-100 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-blue-700 mb-6 border-b pb-3">
              Media Upload
            </h2>
            <ImageUploadEdit
              images={images}
              previews={previews}
              handleImageChange={handleImageChange}
              removeImage={removeImage}
              handleImageDelete={handleImageDelete}
            />
            <div className="mt-6">
              <VideoUpload
                video={video}
                handleVideoChange={handleVideoChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-12">
            <button
              type="submit"
              disabled={loading}
              className="w-full max-w-md px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 
              text-white font-bold rounded-lg shadow-lg hover:opacity-90 
              transition-all duration-300 focus:outline-none focus:ring-4 
              focus:ring-blue-300 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex justify-center items-center space-x-3">
                  <Loader height="24px" width="24px" />
                  <p>Updating Trek Details...</p>
                </div>
              ) : (
                "Update Trek Information"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditTrekForm
