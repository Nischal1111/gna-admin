import React from "react"

interface StartingEndingPointInputProps {
  startingPoint: string
  endingPoint: string
  handleStartingPointChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void
  handleEndingPointChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const StartingEndingPointInput: React.FC<StartingEndingPointInputProps> = ({
  startingPoint,
  endingPoint,
  handleStartingPointChange,
  handleEndingPointChange,
}) => (
  <div className="mb-6">
    <h2 className="text-lg text-primary font-semibold ">
      Starting & Ending Points
    </h2>
    <div className="mb-4">
      <label
        htmlFor="startingPoint"
        className="block text-sm font-medium text-gray-700"
      >
        Starting Point
      </label>
      <input
        type="text"
        id="startingPoint"
        name="startingPoint"
        required
        value={startingPoint}
        onChange={handleStartingPointChange}
        className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter starting point"
      />
    </div>

    <div>
      <label
        htmlFor="endingPoint"
        className="block text-sm font-medium text-gray-700"
      >
        Ending Point
      </label>
      <input
        type="text"
        id="endingPoint"
        name="endingPoint"
        required
        value={endingPoint}
        onChange={handleEndingPointChange}
        className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter ending point"
      />
    </div>
  </div>
)

export default StartingEndingPointInput
