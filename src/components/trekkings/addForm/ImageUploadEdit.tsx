// // ImageUploadEdit.tsx
// import Image from "next/image"
// import React from "react"

// interface ImageUploadProps {
//   images: (string | File)[]
//   previews: string[]
//   handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void
//   removeImage: (index: number) => void
//   handleImageDelete: (preview: string) => void
// }

// const ImageUploadEdit: React.FC<ImageUploadProps> = ({
//   images,
//   previews,
//   handleImageChange,
//   removeImage,
//   handleImageDelete,
// }) => (
//   <div>
//     <h2 className="text-lg font-semibold text-primary mb-2 mt-3">
//       Upload Images (up to 4)
//     </h2>
//     <input
//       type="file"
//       accept="image/*"
//       multiple
//       onChange={handleImageChange}
//       disabled={images.length >= 10}
//       className="mb-4 border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//     />
//     <div className="flex flex-wrap gap-4 mt-4">
//       {previews.map((preview, index) => (
//         <div key={preview} className="relative w-44 h-44 rounded-md ">
//           <Image
//             src={preview}
//             alt={`Preview ${index + 1}`}
//             width={1000}
//             height={1000}
//             style={{ objectFit: "cover" }}
//             className="rounded-md h-full w-full"
//           />
//           <button
//             type="button"
//             // onClick={() => removeImage(index)}
//             onClick={() => handleImageDelete(preview)}
//             className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold cursor-pointer hover:bg-red-600"
//           >
//             ×
//           </button>
//         </div>
//       ))}
//     </div>
//     {images.length >= 4 && (
//       <p className="text-red-500 mt-2">You can only upload up to 4 images.</p>
//     )}
//   </div>
// )

// export default ImageUploadEdit

import Image from "next/image"
import React, { useState } from "react"

interface ImageUploadProps {
  images: (string | File)[]
  previews: string[]
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  removeImage: (index: number) => void
  handleImageDelete: (preview: string) => void
  maxImages?: number
  maxSizeInMB?: number
}

const ImageUploadEdit: React.FC<ImageUploadProps> = ({
  images,
  previews,
  handleImageChange,
  removeImage,
  handleImageDelete,
  maxImages = 3,
  maxSizeInMB = 5,
}) => {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Enhanced image change handler with validation
  const validateAndChangeImage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setError(null)
    setIsLoading(true)

    try {
      const files = event.target.files
      if (!files || files.length === 0) {
        setIsLoading(false)
        return
      }

      // Check if adding these files would exceed the limit
      if (images.length + files.length > maxImages) {
        setError(`You can only upload up to ${maxImages + 1} images in total.`)
        setIsLoading(false)
        return
      }

      // Validate file types explicitly
      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Validate file type
        if (!file.type.startsWith("image/")) {
          setError(`File "${file.name}" is not an image.`)
          setIsLoading(false)
          return
        }

        // Validate file size
        if (file.size > maxSizeInMB * 1024 * 1024) {
          setError(
            `File "${file.name}" exceeds the maximum size of ${maxSizeInMB}MB.`
          )
          setIsLoading(false)
          return
        }
      }

      // If all validations pass, call the original handler
      handleImageChange(event)
    } catch (err) {
      setError("An error occurred while processing your images.")
      console.error("Image upload error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="image-upload-container">
      <h2 className="text-lg font-semibold text-primary mb-2 mt-3">
        Upload Images (up to {maxImages})
      </h2>

      <div className="flex flex-col gap-2">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={validateAndChangeImage}
          disabled={images.length > maxImages || isLoading}
          className="mb-2 border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {isLoading && (
          <div className="text-blue-500 mb-2">Loading images...</div>
        )}

        {error && <div className="text-red-500 mb-2">{error}</div>}

        {images.length > maxImages && (
          <p className="text-amber-500 mb-2">
            Maximum number of images reached.
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-4 mt-4">
        {previews &&
          previews.map((preview, index) => (
            <div
              key={`${preview}-${index}`}
              className="relative w-44 h-44 rounded-md overflow-hidden"
            >
              <Image
                src={preview}
                alt={`Preview ${index + 1}`}
                width={1000}
                height={1000}
                style={{ objectFit: "cover" }}
                className="rounded-md h-full w-full"
                onError={() => setError(`Failed to load image #${index + 1}`)}
              />
              <button
                type="button"
                onClick={() => handleImageDelete(preview)}
                aria-label="Remove image"
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold cursor-pointer hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          ))}
      </div>

      {previews.length === 0 && (
        <p className="text-gray-500 mt-2">No images uploaded yet.</p>
      )}
    </div>
  )
}

export default ImageUploadEdit
