import React, { FC } from "react"

interface SuitableAgeProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const SuitableAge: FC<SuitableAgeProps> = ({ value, onChange }) => (
  <div className="mb-4">
    <h2 className="text-lg text-primary font-semibold ">Suitable Age</h2>
    <input
      type="text"
      id="name"
      name="suitableAge"
      value={value}
      onChange={onChange}
      className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="eg. +16 (for 16 years and above)"
      required
    />
  </div>
)

export default SuitableAge
