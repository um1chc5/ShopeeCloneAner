import { useMutation, useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import purchasesAPI from 'src/apis/purchases.api'
import QuantityController from 'src/components/QuantityController'
import path from 'src/constants/Path'
import { purchaseStatus } from 'src/constants/Purchase'
import { currencyFormat, generateNameId } from 'src/utils/utils'
import { CustomizedCartItem } from '../Cart'

interface Props {
  item: CustomizedCartItem
  setCustomizedCart: React.Dispatch<React.SetStateAction<CustomizedCartItem[]>>
}

function CartQuantity({ item, setCustomizedCart }: Props) {
  const [quantity, setQuantity] = useState(item.buy_count)
  const queryClient = useQueryClient()

  // console.log(item.product.name, quantity, item.buy_count)

  const quantityMutation = useMutation({
    mutationFn: purchasesAPI.updatePurchase
  })

  const deleteMutation = useMutation({
    mutationKey: ['quantity', item.buy_count],
    mutationFn: purchasesAPI.deletePurchase
  })

  const handleQuantityChange = (value: number) => {
    if (value !== quantity) {
      setQuantity(value)
      console.log('1. set lại quality')
      quantityMutation.mutate(
        {
          product_id: item.product._id,
          buy_count: value
        },
        {
          onSuccess: () => {
            // toast.success(data.data.message)
            console.log('2. invalidate lại purchases')
            queryClient.invalidateQueries({ queryKey: ['purchases', { status: purchaseStatus.inCart }] })
          }
        }
      )
    }
  }

  const handleDeletePurchase = () => {
    deleteMutation.mutate([item._id], {
      onSuccess: (data) => {
        if (data.data.message !== 'Xoá 0 đơn thành công') toast.success(data.data.message)
        queryClient.invalidateQueries({ queryKey: ['purchases', { status: purchaseStatus.inCart }] })
      }
    })
  }

  const handleItemCheck = () => {
    setCustomizedCart((prev) =>
      prev.map((currItem) => {
        if (currItem.product._id === item.product._id) {
          // console.log(currItem.checked)
          return { ...currItem, checked: !currItem.checked }
        }
        return currItem
      })
    )
  }

  return (
    <div className='my-3 flex rounded-sm bg-white px-8 py-5 shadow-sm' key={item.product._id}>
      <div className='flex w-5/12 items-center'>
        <input
          id='default-checkbox'
          type='checkbox'
          className='h-5 w-5 cursor-pointer rounded border-gray-300 bg-gray-100 text-blue-600 accent-orangeshopee'
          onChange={handleItemCheck}
          checked={Boolean(item.checked)}
        />
        <Link
          className='flex w-2/3 items-center duration-200 hover:opacity-80'
          to={`${path.home}${item._id}${generateNameId(item.product.name, item.product._id)}`}
        >
          <div className='relative ml-3 w-1/3 pt-[33.3%]'>
            <img
              alt={item.product.name}
              src={item.product.image}
              className='absolute left-0 top-0 h-full object-cover'
            />
          </div>
          <h3 className='line-clamp-2 w-2/3 pl-5'>{item.product.name}</h3>
        </Link>
      </div>
      <div className='flex w-7/12 items-center text-center'>
        <h3 className='flex w-1/4 justify-center'>
          <div className='text-gray-500 line-through'>{currencyFormat(item.price_before_discount)}</div>
          <div className='ml-3 truncate'>{currencyFormat(item.price)}</div>
        </h3>
        <h3 className='flex w-1/4 justify-center'>
          <QuantityController
            max={item.product.quantity}
            onIncrease={handleQuantityChange}
            onDecrease={handleQuantityChange}
            onType={handleQuantityChange}
            value={quantity}
            classNameWrapper={quantityMutation.isLoading ? 'cursor-not-allowed opacity-50' : ''}
          />
        </h3>
        <h3 className='w-1/4 justify-center font-medium text-orangeshopee'>{currencyFormat(quantity * item.price)}</h3>
        <button
          className={classNames(
            'w-1/4 cursor-pointer justify-center duration-200 ease-in-out hover:text-orangeshopee',
            {
              'cursor-not-allowed opacity-50': deleteMutation.status === 'loading'
            }
          )}
          onClick={handleDeletePurchase}
        >
          Xóa
        </button>
      </div>
    </div>
  )
}

export const CartItemComponent = React.memo(CartQuantity, (prev, next) => {
  // console.log(prev, next)
  return prev.item.checked === next.item.checked
})
