import { InputHTMLAttributes, forwardRef } from 'react'

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
  // name: string
}

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputRef(
  {
    errorMessage,
    className,
    onChange,
    placeholder,
    classNameInput = 'w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm',
    classNameError = 'mt-1 min-h-[1.25rem] text-sm text-red-600',
    value
  },
  ref
) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if ((/^\d/.test(value) || value === '') && onChange) {
      onChange(event)
    }
  }
  return (
    <div className={className}>
      <input className={classNameInput} onChange={handleChange} placeholder={placeholder} ref={ref} value={value} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
})

export default InputNumber
