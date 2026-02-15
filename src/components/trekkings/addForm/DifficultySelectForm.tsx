import React from "react"

interface DifficultySelectProps {
  difficulty: string
  handleDifficultyChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

const DifficultySelect: React.FC<DifficultySelectProps> = ({
  difficulty,
  handleDifficultyChange,
}) => (
  <div className="mb-4">
    <h2 className="text-lg font-semibold text-primary">Difficulty</h2>
    <select
      id="difficulty"
      value={difficulty}
      required
      onChange={handleDifficultyChange}
      className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="" disabled>
        Select Difficulty
      </option>
      <option value="Easy">Easy</option>
      <option value="Moderate">Moderate</option>
      <option value="Difficult">Difficult</option>
    </select>
  </div>
)

export default DifficultySelect
