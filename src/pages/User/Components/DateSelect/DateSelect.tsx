import { range } from 'lodash'
import { useEffect, useState } from 'react'

interface Props {
  errorMessage: string | undefined
  value: Date | undefined
  onChange: (value: Date) => void
}

function DateSelect({ errorMessage, value, onChange }: Props) {
  const [date, setDate] = useState({
    date: value?.getDate() || 1,
    month: value?.getMonth() || 0,
    year: value?.getFullYear() || 1990
  })

  useEffect(() => {
    onChange(new Date(date.year, date.month, date.date))
  }, [date, onChange])

  const handleDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const name = event.target.name
    const inputValue = event.target.value
    const currentDate = {
      date: value?.getDate() || date.date,
      month: value?.getMonth() || date.month,
      year: value?.getFullYear() || date.year
    }
    setDate({
      ...currentDate,
      [name]: inputValue
    })
    onChange(new Date(date.year, date.month, date.date))
  }

  // console.log(date, value)

  return (
    value && (
      <div className='basis-3/4 translate-y-3'>
        <div className='flex gap-2'>
          <select
            onChange={handleDateChange}
            name='date'
            value={value.getDate()}
            className='basis-1/3 rounded border border-gray-200 py-2 text-center outline-none duration-200 ease-in-out hover:border-orangeshopee'
          >
            <option disabled>Ngày</option>
            {range(1, 32).map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            onChange={handleDateChange}
            name='month'
            value={value.getMonth()}
            className='basis-1/3 rounded border border-gray-200 py-2 text-center outline-none duration-200 ease-in-out hover:border-orangeshopee'
          >
            <option disabled>Tháng</option>
            {range(0, 11).map((item) => (
              <option value={item} key={item}>
                {item + 1}
              </option>
            ))}
          </select>
          <select
            onChange={handleDateChange}
            name='year'
            value={value.getFullYear()}
            className='basis-1/3 rounded border border-gray-200 py-2 text-center outline-none duration-200 ease-in-out hover:border-orangeshopee'
          >
            <option disabled>Năm</option>
            {range(1990, 2024).map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className='mt-1 min-h-[1.25rem] text-sm text-red-600'>{errorMessage}</div>
      </div>
    )
  )
}

export default DateSelect
