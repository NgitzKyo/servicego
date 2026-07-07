export default function LoadingSpinner({ fullScreen }) {
  if (fullScreen) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }
  return <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent inline-block" />
}
