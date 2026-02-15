// DiscountInput.tsx
import React from "react"

interface DiscountInputProps {
  value: number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const DiscountInput: React.FC<DiscountInputProps> = ({ value, onChange }) => (
  <div className="mb-4">
    <h2 className="text-lg text-primary font-semibold ">Discount (in %)</h2>

    <div className=" rounded-md shadow-sm">
      <input
        type="number"
        id="discount"
        name="discount"
        value={value}
        required
        onChange={onChange}
        className="border border-gray-300 rounded-md p-2 pl-8 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter discount (in %)"
        min={0}
      />
    </div>
    <p className="text-sm text-gray-500 mt-1">
      Enter the discount in percentage.
    </p>
  </div>
)

export default DiscountInput
