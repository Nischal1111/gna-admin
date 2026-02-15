import React from "react"

interface NoteFormProps {
  value: string
  onChange: (newNote: string) => void
}

const NoteForm: React.FC<NoteFormProps> = ({ value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg text-primary font-semibold mb-4">Note</h2>
      <span className="text-sm text-gray-500">
        Add any additional notes here
      </span>
      <textarea
        className="w-full border p-2 rounded-md border-primary"
        value={value}
        onChange={handleChange}
      />
    </div>
  )
}

export default NoteForm
