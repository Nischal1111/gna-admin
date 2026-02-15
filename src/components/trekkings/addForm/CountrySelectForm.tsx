// CountrySelect.tsx
import React from "react"

interface CountrySelectProps {
  country: string
  handleCountryChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  country,
  handleCountryChange,
}) => (
  <div className="mb-4">
    <h2 className="text-lg font-semibold text-primary">Country</h2>
    <select
      id="country"
      required
      value={country}
      onChange={handleCountryChange}
      className="w-full p-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="" disabled>
        Select Country
      </option>
      <option value="Nepal">Nepal</option>
      <option value="Tibet">Tibet</option>
      <option value="Bhutan">Bhutan</option>
    </select>
  </div>
)

export default CountrySelect
