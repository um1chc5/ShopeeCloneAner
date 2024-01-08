import {
  FloatingFocusManager,
  useDismiss,
  useFloating,
  useInteractions,
  useClick,
  useRole,
  shift
} from '@floating-ui/react'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  children: React.ReactNode
  renderPopover: React.ReactNode
  className?: string
  initialOpen?: boolean
  transformOrigin?: string
}

export default function Popover({ children, className, renderPopover, initialOpen, transformOrigin }: Props) {
  const [isOpen, setIsOpen] = useState(initialOpen || false)

  const { x, y, strategy, refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [shift()],
    placement: 'bottom-end'
  })

  const showPopover = () => {
    setIsOpen(true)
  }

  const hidePopover = () => {
    setIsOpen(false)
  }

  const click = useClick(context)
  const dismiss = useDismiss(context)
  const role = useRole(context)

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role])

  return (
    <div
      className={className}
      ref={refs.setReference}
      {...getReferenceProps()}
      onMouseEnter={showPopover}
      onMouseLeave={hidePopover}
    >
      {children}
      <AnimatePresence>
        {isOpen && (
          <FloatingFocusManager context={context} modal={false}>
            <motion.div
              ref={refs.setFloating}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: 'max-content',
                transformOrigin: transformOrigin,
                zIndex: 50
              }}
              {...getFloatingProps()}
              initial={{ opacity: 0, transform: 'scale(0)' }}
              animate={{ opacity: 1, transform: 'scale(1)' }}
              exit={{ opacity: 0, transform: 'scale(0)' }}
              transition={{ duration: 0.2 }}
            >
              {renderPopover}
            </motion.div>
          </FloatingFocusManager>
        )}
      </AnimatePresence>
    </div>
  )
}

Popover.defaultProps = {
  transformOrigin: 'top'
}
