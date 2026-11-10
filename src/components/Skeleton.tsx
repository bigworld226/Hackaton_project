interface SkeletonProps {
  lines?: number
}

export function Skeleton({ lines = 3 }: SkeletonProps) {
  const safeLines = Number.isFinite(lines)
    ? Math.floor(Math.min(Math.max(lines, 1), 8))
    : 3

  return (
    <div aria-label="Chargement" className="ui-skeleton" role="status">
      <span className="ui-sr-only">Chargement en cours</span>
      {Array.from({ length: safeLines }, (_, index) => (
        <span
          aria-hidden="true"
          className={`ui-skeleton-line${index === safeLines - 1 ? ' ui-skeleton-line--short' : ''}`}
          key={index}
        />
      ))}
    </div>
  )
}
