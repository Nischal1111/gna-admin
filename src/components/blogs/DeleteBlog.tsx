import React, { useState } from "react"
import { Button } from "../ui/button"
import { X } from "lucide-react"

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirmDelete: () => void
  itemName?: string
  loading?: boolean
}

export const DeleteBlog: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirmDelete,
  itemName = "item",
  loading = false,
}) => {
  const [confirmText, setConfirmText] = useState("")
  const isConfirmValid = confirmText.toLowerCase() === "confirm"

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-red-600">
          Confirm Deletion
        </h2>

        <p className="mb-4 text-gray-600">
          You are about to delete <strong>{itemName}</strong>. This action{" "}
          <br />
          cannot be undone.
          <br />
          Type <strong>CONFIRM</strong> to proceed.
        </p>

        <input
          type="text"
          placeholder="Type 'CONFIRM' to proceed"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
        />

        <div className="flex justify-between space-x-4">
          <Button variant="outline" onClick={onClose} className="w-full">
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirmDelete}
            disabled={loading || !isConfirmValid}
            className="w-full"
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  )
}
