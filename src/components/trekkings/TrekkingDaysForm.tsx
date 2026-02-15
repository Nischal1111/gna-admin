import React from "react"

interface TrekkingDaysInputProps {
  minDays: number
  maxDays: number
  handleMinDaysChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleMaxDaysChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const TrekkingDaysInput: React.FC<TrekkingDaysInputProps> = ({
  minDays,
  maxDays,
  handleMinDaysChange,
  handleMaxDaysChange,
}) => (
  <div className="">
    <h2 className="text-lg font-semibold mb-2  text-primary">Total Days</h2>

    <div className="flex gap-4">
      <div className="flex-1">
        <label
          htmlFor="minDays"
          className="block text-xs font-medium text-gray-600 mb-1"
        >
          Minimum Days
        </label>
        <input
          type="number"
          id="minDays"
          name="minDays"
          required
          value={minDays}
          onChange={handleMinDaysChange}
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Min days"
        />
      </div>
      <div className="flex-1">
        <label
          htmlFor="maxDays"
          className="block text-xs font-medium text-gray-600 mb-1"
        >
          Maximum Days
        </label>
        <input
          type="number"
          id="maxDays"
          name="maxDays"
          required
          value={maxDays}
          onChange={handleMaxDaysChange}
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Max days"
        />
      </div>
    </div>
  </div>
)

export default TrekkingDaysInput
