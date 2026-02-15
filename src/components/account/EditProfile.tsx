"use client"
import React, { useState, useEffect } from "react"
import {
  User,
  Shield,
  Lock,
  LockKeyhole,
  FileText,
  RefreshCw,
  EyeOff,
  Eye,
} from "lucide-react"
import axios, { AxiosError } from "axios"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { toast } from "sonner"

// Type definitions
interface SecurityQuestion {
  question: string
  answer: string
}

interface ProfileData {
  fullName: string

  phoneNumber: string | null
}

interface PasswordUpdateData {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
}

const EditProfile: React.FC = () => {
  const router = useRouter()
  const [hideSecurityAnswers, setHideSecurityAnswers] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  // Password visibility states
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Form states
  const [fullName, setFullName] = useState<string>("")
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null)

  const [passwordData, setPasswordData] = useState<PasswordUpdateData>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const token = Cookies.get("token")

  // Fetch profile data
  const fetchProfileData = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get<ApiResponse<ProfileData>>(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/admin/profile?s=a`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.success && response.data.data) {
        setFullName(response.data.data.fullName)
        setPhoneNumber(response.data.data.phoneNumber)
      }
    } catch (error) {
      const err = error as AxiosError<ApiResponse<null>>
      toast.error(err.response?.data?.message || "Failed to fetch profile data")
    } finally {
      setIsLoading(false)
    }
  }

  // Update profile data
  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      console.log(fullName, phoneNumber, "dft")

      setIsLoading(true)
      const response = await axios.patch<ApiResponse<ProfileData>>(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/admin/update`,
        {
          fullName,
          phoneNumber,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.success) {
        toast.success(response.data.message || "Profile updated successfully")
        await fetchProfileData() // Refresh data
      }
    } catch (error) {
      const err = error as AxiosError<ApiResponse<null>>
      toast.error(
        err.response?.data?.message || "Failed to update profile data"
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Update password
  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    try {
      setIsUpdatingPassword(true)
      const response = await axios.patch<ApiResponse<null>>(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/admin/update-password`,
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.success) {
        toast.success(response.data.message || "Password updated successfully")
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      }
    } catch (error) {
      const err = error as AxiosError<ApiResponse<null>>
      toast.error(err.response?.data?.message || "Failed to update password")
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const togglePasswordVisibility = (field: "old" | "new" | "confirm") => {
    switch (field) {
      case "old":
        setShowOldPassword(!showOldPassword)
        break
      case "new":
        setShowNewPassword(!showNewPassword)
        break
      case "confirm":
        setShowConfirmPassword(!showConfirmPassword)
        break
    }
  }

  useEffect(() => {
    if (!token) {
      router.push("/login")
      return
    }

    fetchProfileData()
  }, [token, router])

  return (
    <div className="w-full bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-primary text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
              <User className="w-16 h-16 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{fullName}</h1>
              <p className="text-blue-200">admin</p>
            </div>
          </div>
          <Button variant="secondary" onClick={() => router.back()}>
            Back
          </Button>
        </div>

        {/* Profile Forms */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <form onSubmit={updateProfile}>
              <h2 className="text-xl font-semibold mb-4 border-b pb-2 flex items-center">
                <User className="mr-2 text-gray-600" />
                Personal Information
              </h2>
              <div className="space-y-4">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    value={fullName}
                    required
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    value={phoneNumber || ""}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <Button
                  className="text-white"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Profile"}
                </Button>
              </div>
            </form>

            {/* Password Update Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 text-primary" />
                  Account Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={updatePassword} className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="flex items-center">
                        <LockKeyhole className="mr-2" />
                        Old Password
                      </Label>
                      <div className="relative">
                        <Input
                          type={showOldPassword ? "text" : "password"}
                          value={passwordData.oldPassword}
                          required
                          onChange={(e) =>
                            setPasswordData((prev) => ({
                              ...prev,
                              oldPassword: e.target.value,
                            }))
                          }
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => togglePasswordVisibility("old")}
                        >
                          {showOldPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="flex items-center">
                        <LockKeyhole className="mr-2" />
                        New Password
                      </Label>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          required
                          onChange={(e) =>
                            setPasswordData((prev) => ({
                              ...prev,
                              newPassword: e.target.value,
                            }))
                          }
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => togglePasswordVisibility("new")}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="flex items-center">
                        <LockKeyhole className="mr-2" />
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          required
                          onChange={(e) =>
                            setPasswordData((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }))
                          }
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => togglePasswordVisibility("confirm")}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full text-white "
                    disabled={isUpdatingPassword}
                  >
                    {isUpdatingPassword ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProfile
