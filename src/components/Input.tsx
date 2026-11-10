import { Search } from 'lucide-react'
import { useId, type InputHTMLAttributes } from 'react'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  error?: string
  hint?: string
  label: string
  wrapperClassName?: string
}

export function Input({
  error,
  hint,
  id,
  label,
  type = 'text',
  wrapperClassName = '',
  ...props
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const descriptionId = `${inputId}-description`

  return (
    <div className={`ui-field${wrapperClassName ? ` ${wrapperClassName}` : ''}`}>
      <label className="ui-label" htmlFor={inputId}>
        {label}
      </label>
      <div className="ui-input-wrap">
        <input
          aria-describedby={error || hint ? descriptionId : undefined}
          aria-invalid={Boolean(error)}
          className="ui-input"
          id={inputId}
          type={type}
          {...props}
        />
        {type === 'search' && (
          <Search aria-hidden="true" className="ui-input-icon" size={20} />
        )}
      </div>
      {(error || hint) && (
        <p
          className={`ui-field-message${error ? ' ui-field-message--error' : ''}`}
          id={descriptionId}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  )
}
