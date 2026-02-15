// ImageUpload.tsx
import Image from "next/image"
import React from "react"

interface ImageUploadProps {
  images: (string | File)[]
  previews: string[]
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  removeImage: (index: number) => void
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  previews,
  handleImageChange,
  removeImage,
}) => (
  <div>
    <h2 className="text-lg font-semibold text-primary mb-2 mt-3">
      Upload Images (up to 4)
    </h2>
    <input
      type="file"
      accept="image/*"
      multiple
      onChange={handleImageChange}
      disabled={images.length >= 3}
      className="mb-4 border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <div className="flex flex-wrap gap-4 mt-4">
      {previews.map((preview, index) => (
        <div key={preview} className="relative w-44 h-44 rounded-md ">
          <Image
            src={preview}
            alt={`Preview ${index + 1}`}
            width={1000}
            height={1000}
            style={{ objectFit: "cover" }}
            className="rounded-md h-full w-full"
          />
          <button
            type="button"
            onClick={() => removeImage(index)}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold cursor-pointer hover:bg-red-600"
          >
            ×
          </button>
        </div>
      ))}
    </div>
    {images.length >= 10 && (
      <p className="text-red-500 mt-2">You can only upload up to 10 images.</p>
    )}
  </div>
)

export default ImageUpload
