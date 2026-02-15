// TrekPdfForm.tsx
import Image from "next/image"
import React from "react"

interface ThumbnailInputProps {
  preview: string | null
  handlePdfChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  pdfFileSize: number | null
  maxFileSize: number
}

const TrekPdfForm: React.FC<ThumbnailInputProps> = ({
  preview,
  handlePdfChange,
  pdfFileSize,
  maxFileSize,
}) => (
  <div className="mb-4">
    <h2 className="text-lg text-primary font-semibold ">Trek Itenary Pdf</h2>
    <div className="flex gap-10">
      <div>
        <label
          htmlFor="thumbnail"
          className="block text-sm font-medium text-gray-700"
        >
          Upload a pdf{" "}
          <span className="text-gray-500">(max size {maxFileSize} mb)</span>
        </label>
        {pdfFileSize && (
          <p className="text-sm text-gray-600">
            File Size: {pdfFileSize.toFixed(2)} MB
          </p>
        )}
        <input
          type="file"
          id="trekPdf"
          accept="application/pdf"
          onChange={handlePdfChange}
          className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        {preview && (
          <div className="mt-4 flex items-center justify-center">
            <iframe
              src={preview}
              width="100%"
              height="500px"
              className="rounded-lg shadow-md border border-gray-200"
              title="PDF Preview"
            ></iframe>
          </div>
        )}
      </div>
    </div>
  </div>
)

export default TrekPdfForm
