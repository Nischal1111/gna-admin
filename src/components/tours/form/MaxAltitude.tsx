import React, { FC } from "react"

interface MaxAltitudeProps {
  value: number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const MaxAltitude: FC<MaxAltitudeProps> = ({ value, onChange }) => (
  <div className="mb-4">
    <h2 className="text-lg text-primary font-semibold ">
      Max Altitude <span className="text-gray-500">(in meter)</span>
    </h2>
    <input
      type="text"
      id="name"
      name="maxAltitude"
      value={value}
      onChange={onChange}
      className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Max Altitude (meter)"
      required
    />
  </div>
)

export default MaxAltitude
