import React from "react"

interface GroupSizeInputProps {
  minGroupSize: number
  maxGroupSize: number
  handleMinChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleMaxChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const GroupSizeInput: React.FC<GroupSizeInputProps> = ({
  minGroupSize,
  maxGroupSize,
  handleMinChange,
  handleMaxChange,
}) => (
  <div className="">
    <h2 className="text-lg font-semibold text-primary">Group Size</h2>
    <div className="flex gap-4">
      <div className="flex-1">
        <label
          htmlFor="minGroupSize"
          className="block text-xs font-medium text-gray-600"
        >
          Minimum
        </label>
        <input
          type="number"
          id="minGroupSize"
          name="minGroupSize"
          required
          value={minGroupSize}
          onChange={handleMinChange}
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Min"
        />
      </div>
      <div className="flex-1">
        <label
          htmlFor="maxGroupSize"
          className="block text-xs font-medium text-gray-600"
        >
          Maximum
        </label>
        <input
          type="number"
          id="maxGroupSize"
          name="maxGroupSize"
          required
          value={maxGroupSize}
          onChange={handleMaxChange}
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Max"
        />
      </div>
    </div>
  </div>
)

export default GroupSizeInput
