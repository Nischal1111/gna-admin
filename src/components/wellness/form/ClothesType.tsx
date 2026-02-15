import React, { FC } from "react"

interface ClothesTypeProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const ClothesType: FC<ClothesTypeProps> = ({ value, onChange }) => (
  <div className="mb-4">
    <h2 className="text-lg text-primary font-semibold ">Clothes Type</h2>
    <input
      type="text"
      id="name"
      name="clothesType"
      value={value}
      onChange={onChange}
      className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="eg. Regular, Casual etc."
      required
    />
  </div>
)

export default ClothesType
