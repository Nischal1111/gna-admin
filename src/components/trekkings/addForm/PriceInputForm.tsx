// PriceInput.tsx
import React from "react"

interface PriceInputProps {
  value: number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const PriceInput: React.FC<PriceInputProps> = ({ value, onChange }) => (
  <div className="mb-4">
    <h2 className="text-lg text-primary font-semibold ">Price (in $)</h2>

    <div className=" rounded-md shadow-sm">
      <input
        type="number"
        id="price"
        name="price"
        value={value}
        required
        onChange={onChange}
        className="border border-gray-300 rounded-md p-2 pl-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter price"
        min={0}
      />
    </div>
    <p className="text-sm text-gray-500 mt-1">Enter the price in Dollor(US).</p>
  </div>
)

export default PriceInput
