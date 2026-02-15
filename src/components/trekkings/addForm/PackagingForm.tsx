import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2 } from "lucide-react"

interface PackagingProps {
  general?: string[]
  clothes?: string[]
  firstAid?: string[]
  otherEssentials?: string[]
  onUpdateGeneral: (newGeneral: string[]) => void
  onUpdateClothes: (newClothes: string[]) => void
  onUpdateFirstAid: (newFirstAid: string[]) => void
  onUpdateOtherEssentials: (newOtherEssentials: string[]) => void
}

const PackagingForm: React.FC<PackagingProps> = ({
  general = [],
  clothes = [],
  firstAid = [],
  otherEssentials = [],
  onUpdateGeneral,
  onUpdateClothes,
  onUpdateFirstAid,
  onUpdateOtherEssentials,
}) => {
  const handleAddItem = (
    list: string[],
    updater: (updatedList: string[]) => void
  ) => {
    updater([...(Array.isArray(list) ? list : []), ""])
  }

  const handleRemoveItem = (
    list: string[],
    updater: (updatedList: string[]) => void,
    index: number
  ) => {
    if (!Array.isArray(list)) {
      updater([])
      return
    }

    const updated = [...list]
    updated.splice(index, 1)
    updater(updated)
  }

  const handleUpdateItem = (
    list: string[],
    updater: (updatedList: string[]) => void,
    index: number,
    value: string
  ) => {
    if (!Array.isArray(list)) {
      const newList = []
      newList[index] = value
      updater(newList)
      return
    }

    const updated = [...list]
    updated[index] = value
    updater(updated)
  }

  const sections = [
    { title: "General", list: general || [], updater: onUpdateGeneral },
    { title: "Clothes", list: clothes || [], updater: onUpdateClothes },
    { title: "First Aid", list: firstAid || [], updater: onUpdateFirstAid },
    {
      title: "Other Essentials",
      list: otherEssentials || [],
      updater: onUpdateOtherEssentials,
    },
  ]

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-4">Packaging</h2>

      <div className="border p-2 rounded-md border-primary">
        {sections.map(({ title, list, updater }) => (
          <div key={title} className="mb-6">
            <h3 className="text-lg font-medium mb-2">{title}</h3>
            {Array.isArray(list) &&
              list.map((item, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Input
                    type="text"
                    placeholder={`Add ${title} Item`}
                    value={item || ""}
                    onChange={(e) =>
                      handleUpdateItem(list, updater, index, e.target.value)
                    }
                    className="flex-grow"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => handleRemoveItem(list, updater, index)}
                    className="flex-shrink-0"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              ))}
            <Button
              type="button"
              onClick={() => handleAddItem(list, updater)}
              className="mt-2 text-white"
            >
              Add New {title} Item
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PackagingForm
