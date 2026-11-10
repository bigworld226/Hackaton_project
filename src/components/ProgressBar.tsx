import { useId } from 'react'

interface ProgressBarProps {
  label?: string
  max?: number
  value: number
}

export function ProgressBar({ label, max = 100, value }: ProgressBarProps) {
  const generatedId = useId()
  const labelId = `${generatedId}-label`
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100
  const safeValue = Number.isFinite(value)
    ? Math.min(Math.max(value, 0), safeMax)
    : 0
  const percentage = (safeValue / safeMax) * 100

  return (
    <div className="ui-progress-group">
      {label && (
        <div className="ui-progress-heading">
          <span className="ui-label" id={labelId}>
            {label}
          </span>
          <span className="ui-progress-value">{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        aria-labelledby={label ? labelId : undefined}
        aria-valuemax={safeMax}
        aria-valuemin={0}
        aria-valuenow={safeValue}
        className="ui-progress"
        role="progressbar"
      >
        <span className="ui-progress-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}
