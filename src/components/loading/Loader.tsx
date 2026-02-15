import "./Loader.css"

interface LoaderProps {
  height?: string
  width?: string
}

export const Loader: React.FC<LoaderProps> = ({
  height = "50px",
  width = "50px",
}) => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="loader" style={{ height: height, width: width }}></div>
    </div>
  )
}
