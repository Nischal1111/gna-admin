// ThumbnailInput.tsx
import Image from "next/image"
import React from "react"

interface ThumbnailInputProps {
  preview: string | null
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const ThumbnailInput: React.FC<ThumbnailInputProps> = ({
  preview,
  handleImageChange,
}) => (
  <div className="mb-4">
    <h2 className="text-lg text-primary font-semibold ">Thumbnail</h2>
    <div className="flex flex-col gap-10">
      <div>
        <label
          htmlFor="thumbnail"
          className="block text-sm font-medium text-gray-700"
        >
          Upload a thumbnail
        </label>
        <input
          type="file"
          id="thumbnail"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        {!preview && (
          <p className="italic text-gray-500">No preview available.</p>
        )}
        {preview && (
          <div className="mt-4 flex items-center justify-center">
            <Image
              src={preview}
              alt="Image preview"
              width={200}
              height={200}
              className="rounded-lg shadow-md border border-gray-200"
            />
          </div>
        )}
      </div>
    </div>
  </div>
)

export default ThumbnailInput
