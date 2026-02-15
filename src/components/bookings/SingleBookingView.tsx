"use client"
import React, { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card"

import {
  AlertTriangle,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Package,
  Clock,
  Tag,
  DollarSign,
  CheckIcon,
  User2Icon,
  ArrowLeftIcon,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import MailSendForm from "../planTrip/MailSendForm"
import BookingMailSend from "./BookingMailSend"

interface Booking {
  _id: string
  status: string
  fullName: string
  email: string
  phone: string
  address: string
  adventureType: string
  adventureName: string
  adventureSlug: string
  bookingDate: string
  createdAt: string
  extraServices?: string
  soloStandard?: string
  totalPrice: number
  updatedAt?: string
}

interface SingleBookingViewProps {
  id: string
}

const SingleBookingView: React.FC<SingleBookingViewProps> = ({ id }) => {
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  const [sendMail, setSendMail] = useState<number>(0)

  const handleChangeSendMail = (value: number) => {
    setSendMail((prev) => prev + 1)
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200"

      default:
        return "bg-green-100 text-green-800 border-green-200"
    }
  }

  const handleGetBookingRequest = async (id: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/booking/view/${id}`
      )
      const data = response.data
      if (data.success) {
        setBooking(data.data)
      }
    } catch (error) {
      console.error("Error fetching booking:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleGetBookingRequest(id)
  }, [id])

  if (loading) {
    return (
      <Card className="max-w-3xl mx-auto shadow-md">
        <CardHeader className="border-b pb-4">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Skeleton className="h-5 w-40 mb-4" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
            <div>
              <Skeleton className="h-5 w-40 mb-4" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4 pt-4 border-t">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </CardFooter>
      </Card>
    )
  }

  if (!booking) {
    return (
      <Card className="max-w-3xl mx-auto shadow-md p-6 text-center">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Booking Not Found
          </h2>
          <p className="text-gray-600 mt-2">
            The booking you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </Card>
    )
  }
  const giveRouteName = (data: string) => {
    switch (data) {
      case "trek":
        return "trekking"
      case "tour":
        return "tours"
      case "activity":
        return "activities"
      case "wellness":
        return "wellness"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className=" flex gap-4 items-center text-3xl font-bold mb-6">
          <ArrowLeftIcon className="h-8 w-8" onClick={() => router.back()} />
          Booking Details
        </h1>

        <Card className="shadow-lg overflow-hidden">
          <CardHeader
            className={`border-b ${
              booking.status === "accepted"
                ? "bg-emerald-50"
                : booking.status === "rejected"
                ? "bg-red-50"
                : "bg-amber-50"
            }`}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <CardTitle className="text-2xl font-bold">
                  Booking #{booking._id.substring(0, 8)}
                </CardTitle>
                <CardDescription className="mt-1 text-base">
                  Created {formatDate(booking.createdAt)}
                </CardDescription>
              </div>
              <Badge
                className={`text-sm font-medium px-4 py-1.5 rounded-md border ${getStatusColor(
                  booking.status
                )}`}
              >
                {booking.status.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-8 pb-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-100">
                    Customer Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500">
                        <User2Icon className="h-5 w-5" />
                      </span>
                      <span className="font-medium text-lg">
                        {booking.fullName}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500">
                        <Mail className="h-5 w-5" />
                      </span>
                      <span className="text-base">{booking.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500">
                        <Phone className="h-5 w-5" />
                      </span>
                      <span className="text-base">{booking.phone}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-gray-500 mt-1">
                        <MapPin className="h-5 w-5" />
                      </span>
                      <span className="text-base">{booking.address}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-100">
                    Services & Pricing
                  </h3>
                  <div className="space-y-4">
                    {booking.extraServices && (
                      <div className="flex items-start gap-3">
                        <span className="text-gray-500 mt-1">
                          <Package className="h-5 w-5" />
                        </span>
                        <div>
                          <span className="font-medium text-base">
                            Extra Services:
                          </span>
                          <p className="text-gray-600 mt-1">
                            {booking.extraServices}
                          </p>
                        </div>
                      </div>
                    )}
                    {booking.soloStandard && (
                      <div className="flex items-start gap-3">
                        <span className="text-gray-500 mt-1">
                          <Tag className="h-5 w-5" />
                        </span>
                        <div>
                          <span className="font-medium text-base">
                            Solo Standard:
                          </span>
                          <p className="text-gray-600 mt-1">
                            {booking.soloStandard}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 mt-6 pt-3 border-t">
                      <span className="text-gray-500">
                        <DollarSign className="h-6 w-6" />
                      </span>
                      <span className="text-2xl font-bold text-gray-900">
                        ${booking.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-100">
                    Adventure Details
                  </h3>
                  <div className="space-y-5 bg-gray-50 p-5 rounded-lg">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Type</span>
                      <span className="font-medium text-lg">
                        {booking.adventureType}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Name</span>
                      <span className="font-medium text-lg">
                        {booking.adventureName}{" "}
                        <Link
                          href={`${
                            process.env.NEXT_PUBLIC_USER_URL_PROD
                          }/${giveRouteName(
                            booking.adventureType.toLowerCase()
                          )}/${booking.adventureSlug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline ml-4"
                        >
                          View Details
                        </Link>
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-200">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <div>
                        <span className="text-sm text-gray-500">
                          Adventure Date
                        </span>
                        <p className="font-medium text-lg">
                          {formatDate(booking.bookingDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <div className="flex items-center gap-2 p-6 text-gray-500 italic">
            <Clock className="h-5 w-5" />
            <span className="text-base">
              This booking was {booking.status} on{" "}
              {formatDate(booking.updatedAt || booking.createdAt)}
            </span>
          </div>
        </Card>
      </div>

      {/* form for mail  */}
      <BookingMailSend
        id={booking._id}
        email={booking.email}
        name={booking.fullName}
        onChange={handleChangeSendMail}
      />
    </div>
  )
}

export default SingleBookingView
