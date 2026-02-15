import React from "react"

interface OverviewFormProps {
  value: string
  onChange: (newValue: string) => void
}

const OverviewForm: React.FC<OverviewFormProps> = ({ value, onChange }) => {
  return (
    <div className="mb-4">
      <h2 className="text-lg text-primary font-semibold mb-2 mt-5">Overview</h2>
      <textarea
        className="w-full p-2 border border-gray-300 rounded-md"
        placeholder="Enter overview details"
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

export default OverviewForm
