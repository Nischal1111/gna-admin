"use client"
import React, { useEffect, useState } from "react"
import { Button } from "../ui/button"
import {
  MapPin,
  Calendar,
  Users,
  Star,
  Mail,
  Phone,
  Globe,
  Landmark,
  DollarSign,
  User,
  Mountain,
  Utensils,
  Send,
  ArrowLeft,
} from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import SingleMailSend from "./SingleMailSend"
import Link from "next/link"

interface RequestDetail {
  _id: string
  requestType: string
  itemType: string
  name: string
  email: string
  number: string
  message: string
  itemSlug: string
  itemName: string
  status: string
  createdAt: string
}

interface SingleRequestProps {
  requestId: string
}

const SingleRequest: React.FC<SingleRequestProps> = ({ requestId }) => {
  const [requestDetail, setRequestDetail] = useState<RequestDetail | null>(null)
  const [sendMail, setSendMail] = useState<number>(0)

  const router = useRouter()

  const getSingleRequest = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/quote-and-customize/get-single/${requestId}`
      )
      const data = response.data
      if (data.success) {
        setRequestDetail(data.data)
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to load request details")
    }
  }

  const handleChangeSendMail = (value: number) => {
    setSendMail((prev) => prev + 1)
  }

  const routeTypeHandler = (type: string) => {
    switch (type) {
      case "tour":
        return "tours"

      case "trekking":
        return "trekking"

      default:
        return "trekking"
    }
  }

  useEffect(() => {
    getSingleRequest()
  }, [requestId, sendMail])

  if (!requestDetail) return null

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container flex p-10">
        {/*  Header Section */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.back()}
                  className="hover:bg-blue-700/30 p-2 rounded-full transition-colors"
                >
                  <ArrowLeft size={28} />
                </button>
                <div>
                  <h1 className="text-3xl font-bold flex items-center gap-3">
                    <MapPin className="text-white" size={32} />
                    {requestDetail.itemName}{" "}
                    {requestDetail.requestType.charAt(0).toUpperCase() +
                      requestDetail.requestType.slice(1)}
                  </h1>
                  <p className="text-blue-100 mt-1">
                    Submitted on{" "}
                    {new Date(requestDetail.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                    requestDetail.status === "pending"
                      ? "bg-orange-600"
                      : requestDetail.status === "viewed"
                      ? "bg-green-600"
                      : "bg-blue-600"
                  }`}
                >
                  {requestDetail.status}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8">
            {/* Trip Details Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                  Request Details
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Users className="text-blue-600" />
                    <span>
                      <strong>Request Type:</strong> {requestDetail.requestType}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mountain className="text-blue-600" />
                    <span>
                      <strong>Item Type:</strong> {requestDetail.itemType}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Landmark className="text-blue-600" />
                    <span>
                      <strong>Item Name: </strong>
                      <Link
                        className="text-blue-600 underline"
                        target="_blank"
                        href={`${
                          process.env.NEXT_PUBLIC_USER_URL_PROD
                        }/${routeTypeHandler(requestDetail.itemType)}/${
                          requestDetail.itemSlug
                        }`}
                      >
                        {requestDetail.itemName}
                      </Link>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                  Personal Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <User className="text-blue-600" />
                    <span>
                      <strong>Full Name:</strong> {requestDetail.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail className="text-blue-600" />
                    <span>
                      <strong>Email:</strong> {requestDetail.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="text-blue-600" />
                    <span>
                      <strong>Phone:</strong> {requestDetail.number}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="mt-8 border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Additional Information
              </h2>
              <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <strong className="text-blue-800">Message:</strong>
                <p className="text-gray-700 mt-2">{requestDetail.message}</p>
              </div>
            </div>
          </div>
        </div>
        {/* form for mail  */}
        <SingleMailSend
          id={requestDetail._id}
          email={requestDetail.email}
          name={requestDetail.name}
          onChange={handleChangeSendMail}
        />
      </div>
    </div>
  )
}

export default SingleRequest
