import React from "react"

interface ThingsToKnowProps {
  thingsToKnow: string[]
  handleThingsToKnowChange: (index: number, value: string) => void
  handleAddThingsToKnow: () => void
  handleRemoveThingsToKnow: (index: number) => void
}

const ThingsToKnow: React.FC<ThingsToKnowProps> = ({
  thingsToKnow,
  handleThingsToKnowChange,
  handleAddThingsToKnow,
  handleRemoveThingsToKnow,
}) => (
  <div className="mt-5">
    <h2 className="text-lg font-semibold mb-2 text-primary">Things To Know</h2>
    {thingsToKnow.map((things, index) => (
      <div key={index} className="flex items-center gap-2 mb-2">
        <input
          type="text"
          value={things}
          required
          onChange={(e) => handleThingsToKnowChange(index, e.target.value)}
          className="border border-gray-300 p-2 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={`Things to know  ${index + 1}`}
        />
        <button
          type="button"
          onClick={() => handleRemoveThingsToKnow(index)}
          className="text-red-600 hover:text-red-800 font-semibold"
        >
          Remove
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={handleAddThingsToKnow}
      className="text-green-600 hover:text-green-800 font-semibold mt-2"
    >
      + Add New
    </button>
  </div>
)

export default ThingsToKnow
