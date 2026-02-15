import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2 } from "lucide-react"

interface ServicesProps {
  inclusives?: string[]
  exclusives?: string[]
  onUpdateInclusives: (newInclusives: string[]) => void
  onUpdateExclusives: (newExclusives: string[]) => void
}

const InclusiveExclusiveServicesForm: React.FC<ServicesProps> = ({
  inclusives = [],
  exclusives = [],
  onUpdateInclusives,
  onUpdateExclusives,
}) => {
  const handleAddInclusive = () => {
    onUpdateInclusives([...(Array.isArray(inclusives) ? inclusives : []), ""])
  }

  const handleRemoveInclusive = (index: number) => {
    if (!Array.isArray(inclusives)) {
      onUpdateInclusives([])
      return
    }

    const updated = [...inclusives]
    updated.splice(index, 1)
    onUpdateInclusives(updated)
  }

  const handleUpdateInclusive = (index: number, value: string) => {
    if (!Array.isArray(inclusives)) {
      const newList = []
      newList[index] = value
      onUpdateInclusives(newList)
      return
    }

    const updated = [...inclusives]
    updated[index] = value
    onUpdateInclusives(updated)
  }

  const handleAddExclusive = () => {
    onUpdateExclusives([...(Array.isArray(exclusives) ? exclusives : []), ""])
  }

  const handleRemoveExclusive = (index: number) => {
    if (!Array.isArray(exclusives)) {
      onUpdateExclusives([])
      return
    }

    const updated = [...exclusives]
    updated.splice(index, 1)
    onUpdateExclusives(updated)
  }

  const handleUpdateExclusive = (index: number, value: string) => {
    if (!Array.isArray(exclusives)) {
      const newList = []
      newList[index] = value
      onUpdateExclusives(newList)
      return
    }

    const updated = [...exclusives]
    updated[index] = value
    onUpdateExclusives(updated)
  }

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold mb-4 mt-5 text-primary">
        Services
      </h2>

      <div className="mb-4 border p-2 rounded-md border-primary">
        {/* Inclusives Section */}
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2 text-primary">Inclusive</h3>
          {Array.isArray(inclusives) &&
            inclusives.map((inclusive, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <Input
                  type="text"
                  placeholder="Add Inclusive Service"
                  value={inclusive || ""}
                  required
                  onChange={(e) => handleUpdateInclusive(index, e.target.value)}
                  className="flex-grow bg-white"
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleRemoveInclusive(index)}
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            ))}
          <Button
            type="button"
            onClick={handleAddInclusive}
            className="mt-2 text-white"
          >
            Add New Inclusive
          </Button>
        </div>

        {/* Exclusives Section */}
        <div>
          <h3 className="text-lg font-medium mb-2 text-primary">Exclusive</h3>
          {Array.isArray(exclusives) &&
            exclusives.map((exclusive, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <Input
                  type="text"
                  placeholder="Add Exclusive Service"
                  value={exclusive || ""}
                  required
                  onChange={(e) => handleUpdateExclusive(index, e.target.value)}
                  className="flex-grow bg-white"
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleRemoveExclusive(index)}
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            ))}
          <Button
            type="button"
            onClick={handleAddExclusive}
            className="mt-2 text-white"
          >
            Add New Exclusive
          </Button>
        </div>
      </div>
    </div>
  )
}

export default InclusiveExclusiveServicesForm
