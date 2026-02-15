"use client"
import React, { useState, useEffect, useContext } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  ComposedChart,
} from "recharts"
import {
  Users,
  BookOpen,
  Calendar,
  MountainSnow,
  Compass,
  Heart,
  Activity,
  Mail,
  BarChart3,
  AlertTriangle,
  Sailboat,
  TicketsPlane,
  NotebookTextIcon,
} from "lucide-react"
import axios from "axios"
import Cookies from "js-cookie"
import {
  AdminDetailsContext,
  BookingContext,
  PlanTripContext,
  RequestsMailsContext,
} from "../utils/ContextProvider"
import HomeLoading from "./HomeLoading"
import { useSession } from "next-auth/react"

const AdminDashboard = () => {
  const [greet, setGreet] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<any>(null)

  const { adminInfo, setAdminInfo } = useContext(AdminDetailsContext)!
  const { setPendingQuoteData, setPendingCustomizeData } =
    useContext(RequestsMailsContext)!
  const { setPendingData } = useContext(PlanTripContext)!
  const { setPendingBookingData } = useContext(BookingContext)!

  const [monthlyCountsPlanTrip, setMonthlyCountsPlanTrip] = useState<any[]>([])
  const [monthlyCountsRequestMails, setMonthlyCountsRequestMails] = useState<
    any[]
  >([])

  const { data: session } = useSession()

  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/home/get-count-details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      )

      if (response.data.success) {
        const dashboardStats = response.data.data
        setStats(dashboardStats)
        setPendingData(dashboardStats.planTripCount.pending)
        setPendingQuoteData(dashboardStats.quoteAndCustomizeCount.quote.pending)
        setPendingCustomizeData(
          dashboardStats.quoteAndCustomizeCount.customize.pending
        )
        setMonthlyCountsPlanTrip(dashboardStats.monthlyCountsPlanTrip)
        setMonthlyCountsRequestMails(dashboardStats.monthlyCountsRequestMails)
        setPendingBookingData(dashboardStats?.booking?.pending || 0)
      } else {
        setError("Failed to fetch dashboard data")
      }
    } catch (error) {
      console.error("Dashboard data fetch error:", error)
      setError("An error occurred while fetching dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const token = Cookies.get("token")

  // const fetchAdminProfile = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.NEXT_PUBLIC_API_URL_DEV}/admin/profile`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     )

  //     if (response.data.success) {
  //       setAdminProfile(response.data.data)
  //       setAdminInfo(response.data.data)
  //     }
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  useEffect(() => {
    const currentHour = new Date().getHours()
    if (currentHour < 12) setGreet("Good Morning")
    else if (currentHour < 18) setGreet("Good Afternoon")
    else setGreet("Good Evening")
  }, [])

  useEffect(() => {
    const initializeDashboard = async () => {
      await fetchDashboardData()
      // await fetchAdminProfile()
    }

    initializeDashboard()
  }, [])

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-4 text-red-500" size={48} />
          <p className="text-xl text-red-700">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Transform monthly data for the chart
  const monthlyData =
    stats?.monthlyCountsRequestMails?.map((item: any) => ({
      month: new Date(item._id.year, item._id.month - 1).toLocaleString(
        "default",
        { month: "short" }
      ),
      planTrips: item.totalCount,
      quotes: item.quoteCount,
      customize: item.customizeCount,
    })) || []

  // State to hold selected year and filtered data
  const [selectedYear, setSelectedYear] = useState<number>(2024) // Set default year
  const [filteredPlanTripsData, setFilteredPlanTripsData] = useState<any[]>([])
  const [filteredRequestsData, setFilteredRequestsData] = useState<any[]>([])

  // Get unique years from the data (both plan trips and request mails)
  const years = [
    ...new Set([
      ...monthlyCountsPlanTrip.map((item) => item._id.year),
      ...monthlyCountsRequestMails.map((item) => item._id.year),
    ]),
  ]

  // Filter data based on selected year
  useEffect(() => {
    const filteredPlanTrips = monthlyCountsPlanTrip.filter(
      (item) => item._id.year === selectedYear
    )
    const filteredRequests = monthlyCountsRequestMails.filter(
      (item) => item._id.year === selectedYear
    )
    setFilteredPlanTripsData(filteredPlanTrips)
    setFilteredRequestsData(filteredRequests)
  }, [selectedYear, monthlyCountsPlanTrip, monthlyCountsRequestMails])

  // Merge both datasets (PlanTrip and Request Mails) for chart
  const mergedData = filteredPlanTripsData.map((planTripData, index) => {
    const requestMailData = filteredRequestsData.find(
      (requestData) => requestData._id.month === planTripData._id.month
    )

    return {
      month: planTripData._id.month,
      planTrips: planTripData.totalCount,
      quotes: requestMailData ? requestMailData.quoteCount : 0,
      customize: requestMailData ? requestMailData.customizeCount : 0,
    }
  })

  return (
    <>
      {loading ? (
        <HomeLoading />
      ) : (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {greet},{" "}
                <span className="text-primary text-3xl">
                  {session?.user?.name}
                </span>
              </h1>
              <p className="text-slate-600 mt-1">
                Here's what's happening today
              </p>
            </div>
            <div className="flex gap-4">
              <Card className="bg-white border-none shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Cients</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {stats?.usersCount || 0}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white border-none shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MountainSnow className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-blue-600 text-sm font-medium">
                    {stats?.trekking?.total > 0
                      ? Math.round(
                          (stats.trekking.active / stats.trekking.total) * 100
                        )
                      : 0}
                    % ({stats?.trekking?.active}) Active
                  </span>
                </div>
                <h3 className="text-lg font-medium text-slate-900">Trekking</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {stats?.trekking?.total || 0}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Compass className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-green-600 text-sm font-medium">
                    {stats?.tour?.total > 0
                      ? Math.round((stats.tour.active / stats.tour.total) * 100)
                      : 0}
                    % Active
                  </span>
                </div>
                <h3 className="text-lg font-medium text-slate-900">Tours</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {stats?.tour?.total || 0}
                </p>
              </CardContent>
            </Card>

            {/* wellness  */}

            <Card className="bg-white border-none shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TicketsPlane className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="text-purple-600 text-sm font-medium">
                    {stats?.wellness?.total > 0
                      ? Math.round(
                          (stats.wellness.active / stats.wellness.total) * 100
                        )
                      : 0}
                    % ({stats?.wellness.active}) Active
                  </span>
                </div>
                <h3 className="text-lg font-medium text-slate-900">Wellness</h3>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {stats?.wellness?.total || 0}
                </p>
              </CardContent>
            </Card>
            {/* activity count  */}
            <Card className="bg-white border-none shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Sailboat className="h-6 w-6 text-orange-600" />
                  </div>
                  <span className="text-orange-600 text-sm font-medium">
                    {stats?.activityCount?.total > 0
                      ? Math.round(
                          (stats.activityCount.active /
                            stats.activityCount.total) *
                            100
                        )
                      : 0}
                    % ({stats?.activityCount.active}) Active
                  </span>
                </div>
                <h3 className="text-lg font-medium text-slate-900">Activity</h3>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  {stats?.activityCount?.total || 0}
                </p>
              </CardContent>
            </Card>
            {/* blog  */}
            <Card className="bg-white border-none shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <BookOpen className="h-6 w-6 text-yellow-600" />
                  </div>
                  <span className="text-yellow-600 text-sm font-medium">
                    {stats?.blog?.total > 0
                      ? Math.round((stats.blog.active / stats.blog.total) * 100)
                      : 0}
                    % ({stats?.blog.active}) Active
                  </span>
                </div>
                <h3 className="text-lg font-medium text-slate-900">Blogs</h3>
                <p className="text-3xl font-bold text-yellow-600 mt-2">
                  {stats?.blog?.total || 0}
                </p>
              </CardContent>
            </Card>
            {/* booking  */}
            <Card className="bg-white border-none shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <NotebookTextIcon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-slate-900">Bookings</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {stats?.booking?.total || 0}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Request Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Trip Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Total</span>
                    <span className="font-semibold text-slate-900">
                      {stats?.planTripCount?.total || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Pending</span>
                    <span className="font-semibold text-yellow-600">
                      {stats?.planTripCount?.pending || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Completed</span>
                    <span className="font-semibold text-green-600">
                      {stats?.planTripCount?.mailed || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Conversion</span>
                    <span className="font-semibold text-blue-600">
                      {stats?.planTripCount?.total > 0
                        ? Math.round(
                            (stats.planTripCount.mailed /
                              stats.planTripCount.total) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="h-5 w-5 text-green-600" />
                  Quote Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Total</span>
                    <span className="font-semibold text-slate-900">
                      {stats?.quoteAndCustomizeCount?.quote?.total || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Pending</span>
                    <span className="font-semibold text-yellow-600">
                      {stats?.quoteAndCustomizeCount?.quote?.pending || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Completed</span>
                    <span className="font-semibold text-green-600">
                      {stats?.quoteAndCustomizeCount?.quote?.mailed || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Conversion</span>
                    <span className="font-semibold text-blue-600">
                      {stats?.quoteAndCustomizeCount?.quote?.total > 0
                        ? Math.round(
                            (stats.quoteAndCustomizeCount.quote.mailed /
                              stats.quoteAndCustomizeCount.quote.total) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  Customize Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Total</span>
                    <span className="font-semibold text-slate-900">
                      {stats?.quoteAndCustomizeCount?.customize?.total || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Pending</span>
                    <span className="font-semibold text-yellow-600">
                      {stats?.quoteAndCustomizeCount?.customize?.pending || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Completed</span>
                    <span className="font-semibold text-green-600">
                      {stats?.quoteAndCustomizeCount?.customize?.mailed || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Conversion</span>
                    <span className="font-semibold text-blue-600">
                      {stats?.quoteAndCustomizeCount?.customize?.total > 0
                        ? Math.round(
                            (stats.quoteAndCustomizeCount.customize.mailed /
                              stats.quoteAndCustomizeCount.customize.total) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trends Chart */}

          <Card className="bg-white border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-900">
                Monthly Request Analysis
              </CardTitle>
              {/* Year filter dropdown */}
              <div className="mt-2">
                <label
                  htmlFor="year-select"
                  className="text-sm font-medium text-gray-600"
                >
                  Select Year:
                </label>
                <select
                  id="year-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="ml-2 p-2 border rounded"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={mergedData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="planTrips" fill="#2563eb" name="Plan Trips" />
                  <Bar dataKey="quotes" fill="#16a34a" name="Quotes" />
                  <Bar dataKey="customize" fill="#9333ea" name="Customize" />
                  <Line
                    type="monotone"
                    dataKey="planTrips"
                    stroke="#1e40af"
                    name="Trend"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

export default AdminDashboard
