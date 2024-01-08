import { createSearchParams, useNavigate } from 'react-router-dom'
import path from 'src/constants/Path'
import { QueryConfig } from 'src/pages/ProductList/ProductList'

function RisingStar({ queryConfig }: { queryConfig: QueryConfig }) {
  const navigate = useNavigate()

  const handleFilterStar = (ratingFilter: number) => () => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        rating_filter: ratingFilter.toString()
      }).toString()
    })
  }

  return (
    <div className='my-3'>
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <li className='list-none py-1 pl-2' key={index}>
            <div onClick={handleFilterStar(5 - index)} className='flex cursor-pointer items-center text-sm' aria-hidden='true' tabIndex={0} role='button'>
              {Array(5)
                .fill(0)
                .map((_, indexStar) => {
                  const stopColor1 = indexStar < 5 - index ? '#ffca11' : 'transparent'
                  const stopColor2 = indexStar < 5 - index ? '#ffad27' : 'transparent'
                  return (
                    <div key={indexStar}>
                      <svg viewBox='0 0 9.5 8' className='mr-1 h-4 w-4'>
                        <defs>
                          <linearGradient id={`rateStar${index}${indexStar}`} x1='50%' x2='50%' y1='0%' y2='100%'>
                            <stop offset={0} stopColor={stopColor1} />
                            <stop offset={1} stopColor={stopColor2} />
                          </linearGradient>
                          <polygon
                            id='ratingStar'
                            points='14.910357 6.35294118 12.4209136 7.66171903 12.896355 4.88968305 10.8823529 2.92651626 13.6656353 2.52208166 14.910357 0 16.1550787 2.52208166 18.9383611 2.92651626 16.924359 4.88968305 17.3998004 7.66171903'
                          />
                        </defs>
                        <g fill={`url(#rateStar${index}${indexStar})`} fillRule='evenodd' stroke='none' strokeWidth={1}>
                          <g transform='translate(-876 -1270)'>
                            <g transform='translate(155 992)'>
                              <g transform='translate(600 29)'>
                                <g transform='translate(10 239)'>
                                  <g transform='translate(101 10)'>
                                    <use stroke='#ffa727' strokeWidth='.5' xlinkHref='#ratingStar' />
                                  </g>
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </svg>
                    </div>
                  )
                })}
              {index !== 0 && <span>Trở lên</span>}
            </div>
          </li>
        ))}
    </div>
  )
}

export default RisingStar
