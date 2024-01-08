import { sortBy, order as orderConstants } from 'src/constants/Product'
import { QueryConfig } from '../ProductList'
import classNames from 'classnames'
import { ProductListConfig } from 'src/types/product.type'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import path from 'src/constants/Path'
import { omit } from 'lodash'

interface Props {
  queryConfig: QueryConfig
  // page: number
  pageSize: number
}

export default function SortProductList({ queryConfig, pageSize }: Props) {
  const { sort_by = sortBy.createdAt, order } = queryConfig
  const navigate = useNavigate()
  const page = Number(queryConfig.page)

  const isActiveSortBy = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    return sort_by === sortByValue
  }

  // Hàm handle này dùng navigate và createSearchParams để set lại params của url => thay đổi trang
  const handleSort = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => () => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        sort_by: sortByValue
      }).toString()
    })
  }

  const hanldePriceOrder = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value)
    const { value } = event.target
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit({
          ...queryConfig,
          order: value
        })
      ).toString()
    })
  }

  return (
    <div className='bg-gray-300/40 px-3 py-4'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex flex-wrap items-center gap-2'>
          <div>Sắp xếp theo</div>
          <button
            className={classNames('h-8  px-4 text-center text-sm capitalize', {
              'bg-orangeshopee text-white hover:bg-orangeshopee/90': isActiveSortBy(sortBy.view),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.view)
            })}
            onClick={handleSort(sortBy.view)}
          >
            Phổ biến
          </button>
          <button
            className={classNames('h-8  px-4 text-center text-sm capitalize', {
              'bg-orangeshopee text-white hover:bg-orangeshopee/90': isActiveSortBy(sortBy.createdAt),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.createdAt)
            })}
            onClick={handleSort(sortBy.createdAt)}
          >
            Mới nhất
          </button>
          <button
            className={classNames('h-8  px-4 text-center text-sm capitalize', {
              'bg-orangeshopee text-white hover:bg-orangeshopee/90': isActiveSortBy(sortBy.sold),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.sold)
            })}
            onClick={handleSort(sortBy.sold)}
          >
            bán chạy
          </button>
          <select
            className='h-8 bg-white px-4 capitalize text-black hover:cursor-pointer hover:bg-slate-100 focus:outline-none'
            value={order || ''}
            onChange={hanldePriceOrder}
          >
            <option value='' disabled>
              Giá
            </option>
            <option value={orderConstants.asc} className='hover:cursor-pointer'>
              Giá: Thấp đến cao
            </option>
            <option value={orderConstants.desc} className='hover:cursor-pointer'>
              Giá: Cao đến thấp
            </option>
          </select>
        </div>
        <div className='flex items-center'>
          <div>
            <span className='text-orangeshopee'>{page}</span>
            <span>/ </span>
            <span className=''>{pageSize}</span>
          </div>
          <div className='ml-2 flex'>
            <Link
              to={{
                pathname: path.home,
                search: createSearchParams({
                  ...queryConfig,
                  page: page !== 1 ? (page - 1).toString() : page.toString()
                }).toString()
              }}
              className={classNames('flex h-8 items-center rounded-bl-sm bg-white px-3 hover:bg-slate-100', {
                'cursor-not-allowed bg-white/60': page === 1
              })}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='h-3 w-3'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
              </svg>
            </Link>

            <Link
              to={{
                pathname: path.home,
                search: createSearchParams({
                  ...queryConfig,
                  page: page !== pageSize ? (page + 1).toString() : page.toString()
                }).toString()
              }}
              className={classNames('flex h-8 items-center rounded-br-sm bg-white px-3 hover:bg-slate-100', {
                'cursor-not-allowed bg-white/60': page === pageSize
              })}
            >
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='h-3 w-3'>
                <path
                  fillRule='evenodd'
                  d='M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z'
                  clipRule='evenodd'
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
