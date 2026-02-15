import { CheckSquare, Square } from "lucide-react"

export interface User {
  _id: string // Adjust the properties based on your user object structure
  userName: string
  userEmail: string
  userAddress: string
  userCountry: string
  // Add other properties as needed
}

interface UserCardProps {
  user: User
  isSelected: boolean
  onToggle: () => void // Adjust the type if onToggle takes parameters
}

const UserCard: React.FC<UserCardProps> = ({ user, isSelected, onToggle }) => (
  <div
    className={`flex items-center p-3 hover:bg-gray-50 rounded cursor-pointer
        ${isSelected ? "bg-blue-50" : ""}`}
    onClick={onToggle}
  >
    {isSelected ? (
      <CheckSquare className="w-5 h-5 text-blue-600 mr-3" />
    ) : (
      <Square className="w-5 h-5 text-gray-400 mr-3" />
    )}
    <div>
      <p className="font-semibold">{user.userName}</p>
      <p className="text-sm text-gray-500">{user.userEmail}</p>
      <p className="text-xs text-gray-400">
        {user.userAddress}, {user.userCountry}
      </p>
    </div>
  </div>
)

export default UserCard
