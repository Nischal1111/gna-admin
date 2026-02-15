import React from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface FAQ {
  question: string
  answer: string
}

interface FAQChildProps {
  index: number
  faq: FAQ
  updateFAQ: (updatedFAQ: FAQ) => void
  removeFAQ: () => void
}

const FAQForm: React.FC<FAQChildProps> = ({
  index,
  faq,
  updateFAQ,
  removeFAQ,
}) => {
  const updateField = (key: "question" | "answer", value: string) => {
    updateFAQ({ ...faq, [key]: value })
  }

  return (
    <div className="mb-4  border p-2 rounded-md border-primary pb-4">
      <h2 className="text-lg font-bold ">FAQ {index + 1}</h2>
      <div className="flex flex-col ">
        <label className="text-md italic text-gray-500 mt-4">Question</label>
        <Input
          type="text"
          placeholder="Question"
          className="bg-white"
          value={faq.question}
          onChange={(e) => updateField("question", e.target.value)}
        />
        <label className="text-md italic text-gray-500 mt-4">Answer</label>
        <Input
          type="text"
          placeholder="Answer"
          className="bg-white"
          value={faq.answer}
          onChange={(e) => updateField("answer", e.target.value)}
        />
      </div>

      <Button
        type="button"
        onClick={removeFAQ}
        variant={"destructive"}
        className="mt-4"
      >
        <Trash2 size={18} className="mr-2" />
        Remove Question
      </Button>
    </div>
  )
}

export default FAQForm
