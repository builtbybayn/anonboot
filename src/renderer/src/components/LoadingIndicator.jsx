const LoadingIndicator = ({ isLoading }) => {
  if (!isLoading) return null

  return (
    <div className="top-right-loader">
      <div className="spinner"></div>
    </div>
  )
}

export default LoadingIndicator
