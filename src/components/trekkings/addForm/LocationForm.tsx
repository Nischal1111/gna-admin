import React from "react"

interface LocationInputProps {
  location: string
  handleLocationChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const LocationInput: React.FC<LocationInputProps> = ({
  location,
  handleLocationChange,
}) => (
  <div className="mb-4">
    <h2 className="text-lg font-semibold text-primary">Location</h2>
    <input
      type="text"
      id="location"
      name="location"
      required
      value={location}
      onChange={handleLocationChange}
      className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Enter the location"
    />
  </div>
)

export default LocationInput
