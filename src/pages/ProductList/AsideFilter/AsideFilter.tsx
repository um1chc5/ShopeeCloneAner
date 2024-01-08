import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import Button from 'src/components/Button'
// import Input from 'src/components/Input'
import { Category } from './../../../types/category.type'
import { QueryConfig } from '../ProductList'
import classNames from 'classnames'
import path from 'src/constants/Path'
import InputNumber from 'src/components/InputNumber/InputNumber'
import { useForm, Controller } from 'react-hook-form'
import { Schema, schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { NoUndefinedType } from 'src/types/utils.type'
import RisingStar from '../RisingStar'
import { omit } from 'lodash'
import { ObjectSchema } from 'yup'

interface Props {
  categories: Category[]
  queryConfig: QueryConfig
}

type FormData = NoUndefinedType<Pick<Schema, 'price_min' | 'price_max'>>

export default function AsideFilter({ categories, queryConfig }: Props) {
  const { category } = queryConfig

  // Dùng pick() trong yup
  const priceSchema = schema.pick(['price_min', 'price_max'])

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: { price_min: '', price_max: '' },
    resolver: yupResolver(priceSchema as ObjectSchema<FormData>),
    shouldFocusError: false
  })

  const navigate = useNavigate()

  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({ ...queryConfig, price_max: data.price_max, price_min: data.price_min }).toString()
    })
    console.log(data)
  })

  const handleRemoveAll = () =>
    navigate({
      pathname: path.home,
      search: createSearchParams(omit(queryConfig, ['price-max', 'price-mix', 'rating_filter', 'category'])).toString()
    })
  // console.log(categories)
  // console.log(category)
  return (
    <div className='py-4'>
      <Link
        to={path.home}
        className={classNames('font-semibold', {
          'text-orangeshopee ': !category
        })}
      >
        <svg viewBox='0 0 12 10' className='mr-2 inline-block h-4 w-3 fill-current'>
          <g fillRule='evenodd' stroke='none' strokeWidth={1}>
            <g transform='translate(-373 -208)'>
              <g transform='translate(155 191)'>
                <g transform='translate(218 17)'>
                  <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                </g>
              </g>
            </g>
          </g>
        </svg>
        Tất cả danh mục
      </Link>
      <div className='my-4 h-[1px] bg-gray-300'></div>
      <div>
        <ul>
          {categories.map((categoryItem, index) => (
            <li className='py-2 pl-2' key={index}>
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    category: categoryItem._id
                  }).toString()
                }}
                className={classNames('relative px-2', {
                  'font-semibold text-orangeshopee ': category === categoryItem._id
                })}
              >
                {category === categoryItem._id && (
                  <svg viewBox='0 0 4 7' className='absolute left-[-10px] top-1 inline-block h-2 w-2 fill-orangeshopee'>
                    <polygon points='4 3.5 0 0 0 7'></polygon>
                  </svg>
                )}
                {categoryItem.name}
              </Link>
            </li>
          ))}

          {/* <li className='py-2 pl-2'>
            <Link to={''} className='relative px-2'>
              Thời trang nam
            </Link>
          </li> */}
        </ul>
        <Link to={''} className='mt-4 flex items-center font-bold uppercase'>
          <svg
            enableBackground='new 0 0 15 15'
            viewBox='0 0 15 15'
            x={0}
            y={0}
            className='mr-1 h-4 w-3 fill-current stroke-current'
          >
            <g>
              <polyline
                fill='none'
                points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeMiterlimit={10}
              />
            </g>
          </svg>
          BỘ LỌC TÌM KIẾM
        </Link>
      </div>
      <div className='my-4 h-[1px] bg-gray-300'></div>
      <div className='my-5'>
        <div>Khoảng giá</div>
        <form className='mt-2' onSubmit={onSubmit}>
          <div className='item-start flex'>
            <Controller
              control={control}
              name='price_min'
              render={({ field }) => (
                <InputNumber
                  className='grow'
                  placeholder='Từ'
                  classNameError='hidden'
                  classNameInput='w-full rounded-sm border border-gray-300 p-1 outline-none focus:border-gray-500 focus:shadow-sm'
                  {...field}
                  onChange={(event) => {
                    field.onChange(event)
                    trigger('price_max')
                  }}
                />
              )}
            />
            <div className='mx-2 mt-2 shrink-0 text-gray-400'>-</div>
            <Controller
              control={control}
              name='price_max'
              render={({ field }) => (
                <InputNumber
                  className='grow'
                  placeholder='Đến'
                  classNameError='hidden'
                  classNameInput='w-full rounded-sm border border-gray-300 p-1 outline-none focus:border-gray-500 focus:shadow-sm'
                  {...field}
                  onChange={(event) => {
                    field.onChange(event)
                    trigger('price_min')
                  }}
                />
              )}
            />
          </div>
          <div className='mt-1 min-h-[1.25rem] text-center text-sm text-red-600'>{errors.price_min?.message}</div>
          <Button className='flex w-full justify-center bg-orangeshopee p-2 text-sm uppercase text-white hover:bg-orangeshopee/80'>
            Áp dụng
          </Button>
        </form>
      </div>
      <div className='my-4 h-[1px] bg-gray-300'></div>
      <div className='text-sm'>Đánh giá</div>
      <RisingStar queryConfig={queryConfig} />
      <div className='my-4 h-[1px] bg-gray-300'></div>
      <Button
        className='w-full bg-orangeshopee p-2 text-sm uppercase text-white hover:bg-orangeshopee/80'
        onClick={handleRemoveAll}
      >
        Xóa tất cả
      </Button>
    </div>
  )
}
