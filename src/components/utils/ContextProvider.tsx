"use client"
import React, {
  createContext,
  useState,
  ReactNode,
  FC,
  Dispatch,
  SetStateAction,
} from "react"

// Context Type
interface PlanTripContextType {
  pendingData: number
  setPendingData: Dispatch<SetStateAction<number>>
}
interface BookingContextType {
  pendingBookingData: number
  setPendingBookingData: Dispatch<SetStateAction<number>>
}

interface RequestsMailsType {
  pendingQuoteData: number
  pendingCustomizeData: number
  setPendingQuoteData: Dispatch<SetStateAction<number>>
  setPendingCustomizeData: Dispatch<SetStateAction<number>>
}

// Props for the Provider
interface PlanTripProviderProps {
  children: ReactNode
}
interface BookingProviderProps {
  children: ReactNode
}

// admin details
interface AdminDetails {
  adminInfo: {
    _id: string
    fullName: string
    email: string
    password: string
  }
  setAdminInfo: Dispatch<
    SetStateAction<{
      _id: string
      fullName: string
      email: string
      password: string
    }>
  >
}

// Create Context

export const PlanTripContext = createContext<PlanTripContextType | null>(null)
export const BookingContext = createContext<BookingContextType | null>(null)
export const RequestsMailsContext = createContext<RequestsMailsType | null>(
  null
)
export const AdminDetailsContext = createContext<AdminDetails | null>(null)

// first context
const PlanTripProvider: FC<PlanTripProviderProps> = ({ children }) => {
  const [pendingData, setPendingData] = useState<number>(0)

  return (
    <PlanTripContext.Provider value={{ pendingData, setPendingData }}>
      {children}
    </PlanTripContext.Provider>
  )
}

//booking context
const BookingProvider: FC<BookingProviderProps> = ({ children }) => {
  const [pendingBookingData, setPendingBookingData] = useState<number>(0)

  return (
    <BookingContext.Provider
      value={{ pendingBookingData, setPendingBookingData }}
    >
      {children}
    </BookingContext.Provider>
  )
}

//second context
const RequestsMailsProvider: FC<PlanTripProviderProps> = ({ children }) => {
  const [pendingQuoteData, setPendingQuoteData] = useState<number>(0)
  const [pendingCustomizeData, setPendingCustomizeData] = useState<number>(0)

  return (
    <RequestsMailsContext.Provider
      value={{
        pendingQuoteData,
        pendingCustomizeData,
        setPendingQuoteData,
        setPendingCustomizeData,
      }}
    >
      {children}
    </RequestsMailsContext.Provider>
  )
}

//third context
const AdminDetailsProvider: FC<PlanTripProviderProps> = ({ children }) => {
  const [adminInfo, setAdminInfo] = useState<{
    _id: string
    fullName: string
    email: string
    password: string
  }>({
    _id: "",
    fullName: "",
    email: "",
    password: "",
  })

  return (
    <AdminDetailsContext.Provider value={{ adminInfo, setAdminInfo }}>
      {children}
    </AdminDetailsContext.Provider>
  )
}

export {
  PlanTripProvider,
  RequestsMailsProvider,
  AdminDetailsProvider,
  BookingProvider,
}
