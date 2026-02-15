import React from "react"

interface VideoInputPros {
  video: string
  handleVideoChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const VideoUpload: React.FC<VideoInputPros> = ({
  video,
  handleVideoChange,
}) => (
  <div className="mb-4">
    <h2 className="text-lg font-semibold text-primary">
      Video (URL) (optional)
    </h2>
    <input
      type="text"
      id="video"
      name="video"
      value={video}
      onChange={handleVideoChange}
      className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Youtube video URL eg. https://www.youtube.com/watch?v=video"
    />
  </div>
)

export default VideoUpload
