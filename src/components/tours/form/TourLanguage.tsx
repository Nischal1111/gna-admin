import React, { FC } from "react"

interface TourLanguageProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const TourLanguage: FC<TourLanguageProps> = ({ value, onChange }) => (
  <div className="mb-4">
    <h2 className="text-lg text-primary font-semibold ">Language</h2>
    <input
      type="text"
      id="name"
      name="tourLanguage"
      value={value}
      onChange={onChange}
      className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="eg. English, Spanish, etc."
      required
    />
  </div>
)

export default TourLanguage
