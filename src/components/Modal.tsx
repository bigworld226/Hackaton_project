import { X } from 'lucide-react'
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { Button } from './Button'

interface ModalProps {
  children: ReactNode
  onClose: () => void
  open: boolean
  title: string
}

export function Modal({ children, onClose, open, title }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      aria-labelledby={titleId}
      className="ui-modal"
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault()
          dialogRef.current?.close()
        }
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current.close()
      }}
      onClose={() => {
        if (open) onClose()
      }}
      ref={dialogRef}
    >
      <div className="ui-modal-heading">
        <h2 className="ui-modal-title" id={titleId}>
          {title}
        </h2>
        <button
          aria-label="Fermer"
          className="ui-icon-button"
          onClick={() => dialogRef.current?.close()}
          type="button"
        >
          <X aria-hidden="true" size={20} />
        </button>
      </div>
      <div className="ui-modal-content">{children}</div>
      <div className="ui-modal-actions">
        <Button onClick={onClose} variant="secondary">
          Annuler
        </Button>
        <Button onClick={onClose}>Continuer</Button>
      </div>
    </dialog>
  )
}
