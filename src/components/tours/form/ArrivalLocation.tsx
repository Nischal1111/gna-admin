import React from "react"

interface ArrivalLocationProps {
  arrivalLocation: string
  departureLocation: string
  handleArrivalLocationChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void
  handleDepartureLocationChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void
}

const ArrivalLocation: React.FC<ArrivalLocationProps> = ({
  arrivalLocation,
  departureLocation,
  handleArrivalLocationChange,
  handleDepartureLocationChange,
}) => (
  <div className="flex items-center justify-between mb-4">
    <div>
      <h2 className="text-lg font-semibold text-primary">Arrival Location</h2>
      <input
        type="text"
        id="location"
        name="location"
        value={arrivalLocation}
        onChange={handleArrivalLocationChange}
        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter Arrival Location"
        required
      />
    </div>
    <div>
      {/* departure location  */}
      <h2 className="text-lg font-semibold text-primary ">
        Departure Location
      </h2>
      <input
        type="text"
        id="dlocation"
        name="dlocation"
        value={departureLocation}
        onChange={handleDepartureLocationChange}
        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter Departure Location"
        required
      />
    </div>
  </div>
)

export default ArrivalLocation
