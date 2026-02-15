"use client"

import React, { useState, useCallback } from "react"

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
import { useRouter } from "next/navigation"

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
import { Loader } from "../loading/Loader"
import TrekPdfForm from "./addForm/TrekPdfForm"
import DiscountInput from "./addForm/DiscountInput"
import RouteMapImageForm from "./addForm/RouteMapImageFrom"
import { toast } from "sonner"

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

const AddTrekForm: React.FC = () => {
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
  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  // Handler function for season changes
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

  // function
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData()

    formData.append("name", name)
    formData.append("price", price.toString())
    formData.append("discount", discount.toString())
    formData.append("thumbnail", thumbnail as File)
    formData.append("routemapimage", routeMapImage as File)
    formData.append("trekPdf", trekPdf as File)
    formData.append("country", country)
    formData.append("location", location)
    formData.append("difficulty", difficulty)
    formData.append("minDays", minDays.toString())
    formData.append("maxDays", maxDays.toString())
    formData.append("groupSizeMin", minGroupSize.toString())
    formData.append("groupSizeMax", maxGroupSize.toString())
    formData.append("startingPoint", startingPoint)
    formData.append("endingPoint", endingPoint)
    formData.append("accommodation", JSON.stringify(accommodations))
    formData.append("meal", meal)
    formData.append("bestSeason", JSON.stringify(selectedSeasons))
    formData.append("overview", overview)
    formData.append("trekHighlights", JSON.stringify(highlights))
    formData.append("itinerary", JSON.stringify(itineraries))
    formData.append("servicesCostIncludes", JSON.stringify(inclusives))
    formData.append("servicesCostExcludes", JSON.stringify(exclusives))
    formData.append(
      "packingList",
      JSON.stringify({ general, clothes, firstAid, otherEssentials })
    )
    formData.append("faq", JSON.stringify(faqs))
    formData.append("note", note)

    previews.forEach(
      (_, index) => formData.append("images", images[index]) // Attach image files
    )

    if (video) {
      formData.append("video", video) // Attach video file
    }

    try {
      setLoading(true)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/trekking/add-trek`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      if (response.data.success) {
        toast.success(response.data.message || "Trek added successfully!")

        setLoading(false)
        route.push("/trekkings")
      } else {
        toast.error(response.data.message || "Failed to add trek.")
        setLoading(false)
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-full mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-primary text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => route.back()}
              className="hover:bg-blue-700 p-2 rounded-full transition-colors"
            >
              <FaArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold">Add New Trek</h1>
          </div>
        </div>

        <form
          typeof="multipart/form-data"
          onSubmit={handleSubmit}
          className="p-8 space-y-8"
        >
          {/* Form Sections with Progressive Disclosure */}
          <div className="bg-gray-100 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-blue-700 mb-6 border-b pb-3">
              Part 1: Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Name */}
              <div className="md:col-span-2">
                <NameInput value={name} onChange={handleNameChange} />
              </div>

              {/* Pricing, Country, Difficulty */}
              <div className="grid grid-cols-1 gap-4">
                <PriceInput value={price} onChange={handlePriceChange} />
                <DiscountInput
                  value={discount}
                  onChange={handleDiscountChange}
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

            {/* Thumbnail */}
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

            {/* trek pdf */}
            {/* <div className="mt-6">
              <TrekPdfForm
                preview={trekPdfPreview}
                handlePdfChange={handlePdfChange}
                pdfFileSize={pdfFileSize}
                maxFileSize={maxSizeMB}
              />
            </div> */}
          </div>

          {/* Seasonal and Location Details */}
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

          {/* Starting Points and Accommodation */}
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

          {/* Overview and Notes */}
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
            {highlights.map((highlight, index) => (
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
            {itineraries.map((itinerary, index) => (
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

          {/* Services */}
          <InclusiveExclusiveServicesForm
            inclusives={inclusives}
            exclusives={exclusives}
            onUpdateInclusives={setInclusives}
            onUpdateExclusives={setExclusives}
          />

          {/* Packaging */}
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
            <ImageUpload
              images={images}
              previews={previews}
              handleImageChange={handleImageChange}
              removeImage={removeImage}
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
                  <p>Uploading Trek Details...</p>
                </div>
              ) : (
                "Submit Trek Information"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddTrekForm
