import React from "react"

interface AccommodationProps {
  accommodations: string[]
  handleAccommodationChange: (index: number, value: string) => void
  handleAddAccommodation: () => void
  handleRemoveAccommodation: (index: number) => void
}

const Accommodation: React.FC<AccommodationProps> = ({
  accommodations,
  handleAccommodationChange,
  handleAddAccommodation,
  handleRemoveAccommodation,
}) => (
  <div>
    <h2 className="text-lg font-semibold mb-2 text-primary">Accommodations</h2>
    {accommodations.map((accommodation, index) => (
      <div key={index} className="flex items-center gap-2 mb-2">
        <input
          type="text"
          value={accommodation}
          onChange={(e) => handleAccommodationChange(index, e.target.value)}
          className="border border-gray-300 p-2 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={`Accommodation ${index + 1}`}
          required
        />
        <button
          type="button"
          onClick={() => handleRemoveAccommodation(index)}
          className="text-red-600 hover:text-red-800 font-semibold"
        >
          Remove
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={handleAddAccommodation}
      className="text-green-600 hover:text-green-800 font-semibold mt-2"
    >
      + Add New
    </button>
  </div>
)

export default Accommodation
