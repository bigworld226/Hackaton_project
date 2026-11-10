import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

export interface TabItem {
  label: string
  value: string
}

interface TabsProps {
  children?: ReactNode
  defaultValue?: string
  items: TabItem[]
  onValueChange?: (value: string) => void
  value?: string
}

export function Tabs({
  children,
  defaultValue,
  items,
  onValueChange,
  value,
}: TabsProps) {
  const { t } = useTranslation()
  const generatedId = useId()
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue ?? items[0]?.value ?? '',
  )
  const selectedValue = value ?? uncontrolledValue
  const activeTab = items.find((item) => item.value === selectedValue) ?? items[0]

  function selectTab(nextValue: string) {
    if (value === undefined) setUncontrolledValue(nextValue)
    onValueChange?.(nextValue)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (items.length === 0) return

    let nextIndex: number
    if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = items.length - 1
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      const direction = event.key === 'ArrowRight' ? 1 : -1
      nextIndex = (index + direction + items.length) % items.length
    } else {
      return
    }

    event.preventDefault()
    const nextTab = items[nextIndex]
    if (!nextTab) return

    selectTab(nextTab.value)
    tabRefs.current[nextIndex]?.focus()
  }

  if (items.length === 0) return null

  return (
    <div className="ui-tabs">
      <div aria-label={t('common.sections')} className="ui-tab-list" role="tablist">
        {items.map((item, index) => {
          const selected = item.value === activeTab?.value
          const tabId = `${generatedId}-tab-${index}`

          return (
            <button
              aria-controls={`${generatedId}-panel`}
              aria-selected={selected}
              className="ui-tab"
              id={tabId}
              key={item.value}
              onClick={() => selectTab(item.value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              ref={(element) => {
                tabRefs.current[index] = element
              }}
              role="tab"
              tabIndex={selected ? 0 : -1}
              type="button"
            >
              {item.label}
            </button>
          )
        })}
      </div>
      {children && activeTab && (
        <div
          aria-labelledby={`${generatedId}-tab-${items.indexOf(activeTab)}`}
          className="ui-tab-panel"
          id={`${generatedId}-panel`}
          role="tabpanel"
          tabIndex={0}
        >
          {children}
        </div>
      )}
    </div>
  )
}
