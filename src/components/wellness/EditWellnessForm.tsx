"use client"

import React, { useState, useCallback, useEffect } from "react"

import Cookies from "js-cookie"
import { useParams, useRouter } from "next/navigation"

import { Button } from "../ui/button"

import axios from "axios"
import { FaArrowLeft } from "react-icons/fa6"
import { Loader } from "../loading/Loader"
import NameInput from "../trekkings/addForm/NameInputForm"
import PriceInput from "../trekkings/addForm/PriceInputForm"
import CountrySelect from "../trekkings/addForm/CountrySelectForm"
import ThumbnailInput from "../trekkings/addForm/ThumbnailForm"
import BestSeasonsSelect from "../trekkings/addForm/SeasonsForm"
import LocationInput from "../trekkings/addForm/LocationForm"
import MealSelect from "../trekkings/addForm/MealsForm"
import TrekkingDaysInput from "../trekkings/TrekkingDaysForm"
import GroupSizeInput from "../trekkings/addForm/GroupSizeForm"
import StartingEndingPointInput from "../trekkings/addForm/StartEndPointForm"
import Accommodation from "../trekkings/addForm/AccommodationForm"
import OverviewForm from "../trekkings/addForm/OverviewForm"
import NoteForm from "../trekkings/addForm/NoteForm"
import HighlightForm from "../trekkings/addForm/HighlightsForm"
import ItineraryForm from "../trekkings/addForm/ItineraryForm"
import FAQForm from "../trekkings/addForm/FaqForm"
import InclusiveExclusiveServicesForm from "../trekkings/addForm/ServicesForm"

import ImageUpload from "../trekkings/addForm/ImagesForm"
import VideoUpload from "../trekkings/addForm/VideoForm"
import TourLanguage from "../tours/form/TourLanguage"
import SuitableAge from "../tours/form/SuitableAge"
import ThingsToKnow from "../tours/form/ThingsToKnow"
import ArrivalLocation from "../tours/form/ArrivalLocation"
import ClothesType from "./form/ClothesType"
import MaxAltitude from "../tours/form/MaxAltitude"

import { FaEye } from "react-icons/fa6"
import { toast } from "sonner"
import ImageUploadEdit from "../trekkings/addForm/ImageUploadEdit"

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

const EditWellnessForm: React.FC = () => {
  const route = useRouter()
  // State management
  const [accommodations, setAccommodations] = useState<string[]>([""])
  const [thingsToKnow, setThingsToKnow] = useState<string[]>([""])
  const [name, setName] = useState("")
  const [maxAltitude, setMaxAltitude] = useState<number>(0)
  const [tourLanguage, setTourLanguage] = useState<string>("")
  const [suitableAge, setSuitableAge] = useState<string>("")
  const [price, setPrice] = useState<number>(0)
  const [thumbnail, setThumbnail] = useState<string | File>("")
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [country, setCountry] = useState("")
  const [minDays, setMinDays] = useState<number>(1)
  const [maxDays, setMaxDays] = useState<number>(1)
  const [clothesType, setClothesType] = useState<string>("")
  const [location, setLocation] = useState<string>("")
  const [arrivalLocation, setArrivalLocation] = useState<string>("")
  const [departureLocation, setDepartureLocation] = useState<string>("")
  const [tripType, setTripType] = useState<string>("")
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

  //note
  const [note, setNote] = useState<string>("")

  const [loading, setLoading] = useState(false)
  const [tourViews, setTourViews] = useState<number>(0)

  //slug
  const slugId = useParams()
  const slug = slugId.slug

  //for deleting
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([])
  const [thumbnailToDelete, setThumbnailToDelete] = useState(false)
  const [videoToDelete, setVideoToDelete] = useState(false)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)

  const [originalTrekData, setOriginalTrekData] = useState<{
    name: string
    price: number
    thumbnail: string
    clothesType: string
    maxAltitude: number
    tourLanguage: string
    suitableAge: string
    country: string
    days: { min: number; max: number }
    location: string
    difficulty: string
    groupSize: { min: number; max: number }
    meal: string
    bestSeason: string[]
    startingPoint: string
    endingPoint: string
    arrivalLocation: string
    departureLocation: string
    overview: string
    trekHighlights: Highlight[]
    itinerary: Itinerary[]
    servicesCostIncludes: string[]
    servicesCostExcludes: string[]

    faq: FAQ[]
    note: string
    images: string[]
    video: string
    accommodations: string[]
    thingsToKnow: string[]
  }>({
    name: "",
    price: 0,
    thumbnail: "",
    clothesType: "",
    maxAltitude: 0,
    tourLanguage: "",
    suitableAge: "",
    country: "",
    days: { min: 0, max: 0 },
    location: "",
    difficulty: "",
    groupSize: { min: 0, max: 0 },
    meal: "",
    startingPoint: "",
    endingPoint: "",
    arrivalLocation: "",
    departureLocation: "",
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

    faq: [{ question: "", answer: "" }],
    note: "",
    images: [],
    video: "",
    accommodations: [],
    thingsToKnow: [],
  })

  // Event handlers

  // name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }
  // max altitude
  const handleAltidueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxAltitude(Number(e.target.value))
  }
  // tour language
  const handleTourLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTourLanguage(e.target.value)
  }
  // suitable age
  const suitableAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSuitableAge(e.target.value)
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
  //things to know
  const handleThingsToKnowChange = (index: number, value: string) => {
    const updatedThingsToKnow = [...thingsToKnow]
    updatedThingsToKnow[index] = value
    setThingsToKnow(updatedThingsToKnow)
  }
  const handleAddThingsToKnow = () => {
    setThingsToKnow([...thingsToKnow, ""])
  }
  const handleRemoveThingsToKnow = (index: number) => {
    setThingsToKnow(thingsToKnow.filter((_, i) => i !== index))
  }
  // price
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(parseFloat(e.target.value))
  }

  const handleThumbnailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file && file instanceof File) {
      setThumbnailPreview(URL.createObjectURL(file))
      setThumbnail(file)
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
  // arrival location
  const handleArrivalLocationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setArrivalLocation(event.target.value)
  }
  const handleDepartureLocationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDepartureLocation(event.target.value)
  }
  // trip type
  const handleTripTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setTripType(event.target.value)
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
  // clothes type
  // clothes type
  const handleClothesTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setClothesType(event.target.value)
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

  const [wellnessId, setWellnessId] = useState<string>("")

  // get form
  const handleGetWellnessData = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/wellness/get-wellness/${slug}`
      )
      if (response.data.success) {
        setLoading(false)
        const trekData = response.data.data
        setOriginalTrekData(trekData)
        setWellnessId(trekData._id)
        setTourViews(trekData.viewsCount)
        setName(trekData.name)
        setPrice(trekData.price)
        setThumbnailPreview(trekData.thumbnail)
        setCountry(trekData.country)
        setClothesType(trekData.clothesType)
        setMinDays(trekData.days.min)
        setMaxDays(trekData.days.max)
        setMaxAltitude(trekData.maxAltitude)
        setTourLanguage(trekData.language)
        setSuitableAge(trekData.suitableAge)
        setLocation(trekData.location)
        setArrivalLocation(trekData.arrivalLocation)
        setDepartureLocation(trekData.departureLocation)
        setTripType(trekData.tripType)
        setMinGroupSize(trekData.groupSize.min)
        setMaxGroupSize(trekData.groupSize.max)
        setMeal(trekData.meal)
        setStartingPoint(trekData.startingPoint)
        setEndingPoint(trekData.endingPoint)
        setSelectedSeasons(trekData.bestSeason)
        setOverview(trekData.overview)
        setHighlights(trekData.highlights)
        setAccommodations(trekData.accommodation)
        setThingsToKnow(trekData.thingsToKnow)
        setItineraries(trekData.itinerary)
        setInclusives(trekData.servicesCostIncludes)
        setExclusives(trekData.servicesCostExcludes)
        setFaqs(trekData.faq)
        setNote(trekData.note)
        // setImages(trekData.images)
        setPreviews(trekData.images)
        setVideo(trekData.video)
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    handleGetWellnessData()
  }, [])

  // function
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData()

    // Add trek ID
    formData.append("wellnessId", wellnessId)

    // Add basic fields only if they've changed from original data
    if (name !== originalTrekData.name) {
      formData.append("name", name)
    }
    if (price !== originalTrekData.price) {
      formData.append("price", price.toString())
    }
    if (country !== originalTrekData.country) {
      formData.append("country", country)
    }
    if (location !== originalTrekData.location) {
      formData.append("location", location)
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
    if (arrivalLocation !== originalTrekData.arrivalLocation) {
      formData.append("arrivalLocation", arrivalLocation)
    }
    if (departureLocation !== originalTrekData.departureLocation) {
      formData.append("departureLocation", departureLocation)
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
    if (clothesType !== originalTrekData.clothesType) {
      formData.append("clothesType", clothesType)
    }
    if (maxAltitude !== originalTrekData.maxAltitude) {
      formData.append("maxAltitude", maxAltitude.toString())
    }
    if (tourLanguage !== originalTrekData.tourLanguage) {
      formData.append("language", tourLanguage)
    }
    if (suitableAge !== originalTrekData.suitableAge) {
      formData.append("suitableAge", suitableAge)
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
      formData.append("highlights", JSON.stringify(highlights))
    }
    if (
      JSON.stringify(thingsToKnow) !==
      JSON.stringify(originalTrekData.thingsToKnow)
    ) {
      formData.append("thingsToKnow", JSON.stringify(thingsToKnow))
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

    if (images.length > 0) {
      images.forEach((image, index) => {
        if (image instanceof File) {
          formData.append("images", image)
        }
      })
    }
    if (video !== originalTrekData.video) {
      formData.append("video", video)
    }

    try {
      setLoading(true)
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/wellness/edit-wellness`,
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
        toast.success(response.data.message || "Wellness Updated Successfully")
        setLoading(false)
        route.push("/wellness")
      } else {
        toast.error(
          response.data.message ||
            "Unable to Update Wellness, Please Try Again!"
        )
        setLoading(false)
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error occurred while updating the wellness.")
      setLoading(false)
    }
  }

  const handleImageDelete = (imageUrl: string) => {
    setImagesToDelete((prev) => [...prev, imageUrl])
    setPreviews((prev) => prev.filter((preview) => preview !== imageUrl))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="w-full mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-800 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => route.back()}
              className="hover:bg-teal-700 p-2 rounded-full transition-colors"
            >
              <FaArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold">
              Edit Wellness Experience - {name}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <p className="flex items-center space-x-2">
              <FaEye className="text-white" />
              <span>{tourViews} views</span>
            </p>
          </div>
        </div>

        <form
          typeof="multipart/form-data"
          onSubmit={handleSubmit}
          className="p-8 space-y-8"
        >
          {/* Basic Information Section */}
          <div className="bg-gray-100 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-teal-700 mb-6 border-b pb-3">
              Basic Wellness Information
            </h2>

            <div className="mb-6">
              <NameInput value={name} onChange={handleNameChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PriceInput value={price} onChange={handlePriceChange} />
              <CountrySelect
                country={country}
                handleCountryChange={handleCountryChange}
              />
              <MaxAltitude value={maxAltitude} onChange={handleAltidueChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <TourLanguage
                value={tourLanguage}
                onChange={handleTourLanguageChange}
              />
              <ClothesType
                value={clothesType}
                onChange={handleClothesTypeChange}
              />
              <SuitableAge value={suitableAge} onChange={suitableAgeChange} />
            </div>

            <div className="mt-6">
              <ThumbnailInput
                preview={thumbnailPreview}
                handleImageChange={handleThumbnailChange}
              />
            </div>
          </div>

          {/* Wellness Specifics Section */}
          <div className="bg-gray-100 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-teal-700 mb-6 border-b pb-3">
              Wellness Experience Details
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

            <div className="mt-6">
              <ArrivalLocation
                arrivalLocation={arrivalLocation}
                departureLocation={departureLocation}
                handleArrivalLocationChange={handleArrivalLocationChange}
                handleDepartureLocationChange={handleDepartureLocationChange}
              />
              <div className="mt-6">
                <StartingEndingPointInput
                  startingPoint={startingPoint}
                  endingPoint={endingPoint}
                  handleStartingPointChange={handleStartingPointChange}
                  handleEndingPointChange={handleEndingPointChange}
                />
              </div>
            </div>
          </div>

          {/* Accommodation and Description */}
          <div className="bg-gray-100 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-teal-700 mb-6 border-b pb-3">
              Accommodation & Description
            </h2>

            <Accommodation
              accommodations={accommodations}
              handleAccommodationChange={handleAccommodationChange}
              handleAddAccommodation={handleAddAccommodation}
              handleRemoveAccommodation={handleRemoveAccommodation}
            />

            <div className="mt-6">
              <OverviewForm value={overview} onChange={handleOverviewChange} />
            </div>

            <div className="mt-6">
              <NoteForm value={note} onChange={setNote} />
            </div>

            <div className="mt-6">
              <ThingsToKnow
                thingsToKnow={thingsToKnow}
                handleThingsToKnowChange={handleThingsToKnowChange}
                handleAddThingsToKnow={handleAddThingsToKnow}
                handleRemoveThingsToKnow={handleRemoveThingsToKnow}
              />
            </div>
          </div>

          {/* Highlights Section */}
          <div className="bg-gray-100 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h2 className="text-2xl font-semibold text-teal-700">
                Highlights
              </h2>
              <Button
                type="button"
                onClick={addHighlight}
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                Add Highlight
              </Button>
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
          </div>

          {/* Itineraries Section */}
          <div className="bg-gray-100 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h2 className="text-2xl font-semibold text-teal-700">
                Itineraries
              </h2>
              <Button
                type="button"
                onClick={addItinerary}
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                Add Itinerary
              </Button>
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
          </div>

          {/* FAQs Section */}
          <div className="bg-gray-100 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h2 className="text-2xl font-semibold text-teal-700">FAQs</h2>
              <Button
                type="button"
                onClick={addFAQ}
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                Add FAQ
              </Button>
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
          </div>

          {/* Services */}
          <InclusiveExclusiveServicesForm
            inclusives={inclusives}
            exclusives={exclusives}
            onUpdateInclusives={setInclusives}
            onUpdateExclusives={setExclusives}
          />

          {/* Media Upload Section */}
          <div className="bg-gray-100 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-teal-700 mb-6 border-b pb-3">
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
              className="w-full max-w-md px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-800 
              text-white font-bold rounded-lg shadow-lg hover:opacity-90 
              transition-all duration-300 focus:outline-none focus:ring-4 
              focus:ring-teal-300 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex justify-center items-center space-x-3">
                  <Loader height="24px" width="24px" />
                  <p>Updating Wellness Details...</p>
                </div>
              ) : (
                "Update Wellness Information"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditWellnessForm
