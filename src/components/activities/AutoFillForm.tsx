import React from "react"
import { Button } from "../ui/button"

import { MagnetIcon } from "lucide-react"

interface AutofillButtonProps {
  onAutofill: (data: any) => void
}

const autofillTestData = {
  title: "Hiking Adventure in the Swiss Alps",
  price: "250",
  country: "Switzerland",
  location: "Zermatt, Valais",
  groupSizeMin: "4",
  groupSizeMax: "12",
  seasons: {
    spring: false,
    summer: true,
    autumn: true,
    winter: false,
  },
  overview:
    "Embark on an unforgettable hiking journey through the breathtaking Swiss Alps. This guided tour offers stunning views of the Matterhorn, traversing picturesque mountain trails, alpine meadows, and charming Swiss villages. Suitable for intermediate hikers with a good level of fitness.",
  serviceIncludes: [
    "Professional mountain guide",
    "Transportation from Zermatt",
    "Lunch and trail snacks",
    "Basic hiking equipment rental",
    "First aid support",
  ],
  thingsToKnow: [
    "Moderate fitness level required",
    "Bring comfortable hiking boots",
    "Weather can change quickly in mountains",
    "Hiking poles recommended",
    "Passport required",
  ],
  FAQs: [
    {
      question: "What is the difficulty level of this hike?",
      answer:
        "This hike is rated as moderate. Participants should be comfortable walking 6-8 hours per day on uneven terrain with elevation changes.",
    },
    {
      question: "What should I pack?",
      answer:
        "Pack layers, waterproof jacket, hiking boots, sun protection, water bottle, and personal medication. We'll provide a detailed packing list upon booking.",
    },
    {
      question: "Are there age restrictions?",
      answer:
        "Participants should be between 16-65 years old and in good physical condition. Minors must be accompanied by an adult.",
    },
  ],
  thumbnail: null,
  gallery: [],
  isPopular: true,
  isActivated: true,
}

const AutofillButton: React.FC<AutofillButtonProps> = ({ onAutofill }) => {
  const handleAutofill = () => {
    onAutofill(autofillTestData)
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleAutofill}
      className="flex items-center gap-2"
    >
      <MagnetIcon size={16} /> Autofill Example
    </Button>
  )
}

export default AutofillButton
