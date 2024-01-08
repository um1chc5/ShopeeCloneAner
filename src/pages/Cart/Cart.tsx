import { useMutation, useQuery } from '@tanstack/react-query'
import purchasesAPI from 'src/apis/purchases.api'
import { purchaseStatus } from 'src/constants/Purchase'
import { CartItemComponent } from './CartQuantity/CartItemComponent'
import { currencyFormat } from 'src/utils/utils'
import { useContext, useEffect } from 'react'
import { PurchaseData } from 'src/types/purchases.type'
import classNames from 'classnames'
import { toast } from 'react-toastify'
import { useLocation } from 'react-router-dom'
import { AppContext } from 'src/Context/App.context'

export interface CustomizedCartItem extends PurchaseData {
  checked: boolean
  disabled: boolean
}

interface LocationInterface {
  pathname: string
  search: string
  hash: string
  state: {
    purchaseId: string
  }
  key: string
}

function Cart() {
  const location = useLocation() as LocationInterface
  console.log(location)

  const {
    data: inCartData,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ['purchases', { status: purchaseStatus.inCart }],
    queryFn: () => purchasesAPI.getPurchase({ status: purchaseStatus.inCart })
  })

  const { setCustomizedCart, customizedCart } = useContext(AppContext)

  // const [customizedCart, setCustomizedCart] = useState([] as CustomizedCartItem[])
  console.log('render lại cart')

  useEffect(() => {
    console.log('render lại dữ liệu cart')
    if (inCartData && customizedCart)
      setCustomizedCart(
        inCartData?.data.data.map((item, index) => {
          const isBuyNowItem = item.product._id === location.state?.purchaseId
          return {
            ...item,
            checked: Boolean(customizedCart[index]?.checked) || isBuyNowItem,
            disabled: Boolean(customizedCart[index]?.disabled)
          }
        })
      )
  }, [inCartData])

  const isAllChecked = customizedCart && customizedCart.every((item) => item.checked)

  const totalMoneyCalc = (customizedCart: CustomizedCartItem[]) => {
    return customizedCart?.reduce((prev, curr) => {
      if (curr.checked) return prev + curr.buy_count * curr.price
      return prev
    }, 0)
  }

  const handleCheckAll = () => {
    setCustomizedCart((prev) => prev.map((item) => ({ ...item, checked: !isAllChecked })))
  }

  const buyPurchasesMutation = useMutation({
    mutationFn: purchasesAPI.buyProduct,
    onSuccess: () => {
      refetch()
    }
  })

  const handleBuySubmit = () => {
    const isAnyChecked = customizedCart.some((item) => item.checked)
    const body = customizedCart
      .filter((item) => item.checked)
      .map((item) => ({ product_id: item.product._id, buy_count: item.buy_count }))
    if (isAnyChecked)
      buyPurchasesMutation.mutate(body, {
        onSuccess: (data) => {
          toast.success(data.data.message)
        }
      })
  }

  return (
    customizedCart && (
      <div className=' bg-neutral-200 py-6'>
        <div className='container'>
          <div className='my-3 flex border border-yellow-500 bg-white px-5 py-4'>
            <img
              width={24}
              height={20}
              src='https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/d9e992985b18d96aab90969636ebfd0e.png'
              alt='fs-icon'
            />
            <p className='pl-2'>Nhấn vào mục Mã giảm giá ở cuối trang để hưởng miễn phí vận chuyển bạn nhé!</p>
          </div>
          <div className='my-3 flex rounded-sm bg-white px-8 py-5 shadow-sm'>
            <div className='flex w-5/12 items-center'>
              <input
                id='default-checkbox'
                type='checkbox'
                className='h-5 w-5 cursor-pointer rounded border-gray-300 bg-gray-100 text-blue-600 accent-orangeshopee'
                checked={isAllChecked}
                onChange={handleCheckAll}
              />
              <h3 className='pl-3'>Sản phẩm</h3>
            </div>
            <div className='flex w-7/12 text-center text-gray-500'>
              <h3 className='w-1/4'>Đơn giá</h3>
              <h3 className='w-1/4'>Số lượng</h3>
              <h3 className='w-1/4'>Số tiền</h3>
              <h3 className='w-1/4'>Thao tác</h3>
            </div>
          </div>
          {customizedCart.map((item) => (
            <CartItemComponent item={item} key={item._id} setCustomizedCart={setCustomizedCart} />
          ))}
          <div className='sticky bottom-0 my-3 mt-5 flex justify-between border bg-white px-8 py-5'>
            <div className='flex items-center'>
              <div className='flex items-center'>
                <input
                  id='default-checkbox'
                  type='checkbox'
                  className='h-5 w-5 cursor-pointer rounded border-gray-300 bg-gray-100 text-blue-600 accent-orangeshopee'
                  checked={isAllChecked}
                  onChange={handleCheckAll}
                />
                <button
                  className='cursor-pointer pl-5 duration-200 ease-in-out hover:text-orangeshopee'
                  onClick={handleCheckAll}
                >
                  Chọn Tất Cả ({customizedCart.filter((item) => item.checked).length})
                </button>
              </div>
              <h3 className='cursor-pointer pl-5 duration-200 ease-in-out hover:text-orangeshopee'>Xóa</h3>
            </div>
            <div className='flex items-center'>
              <h2>
                Tổng thanh toán
                <span>({customizedCart.filter((item) => item.checked).length} sản phẩm): </span>
                <span
                  className={classNames('text-2xl text-orangeshopee duration-100', {
                    'opacity-60': isFetching
                  })}
                >
                  ₫{currencyFormat(totalMoneyCalc(customizedCart))}
                </span>
              </h2>
              <button
                onClick={handleBuySubmit}
                className='ml-5 rounded bg-orangeshopee px-16 py-3 capitalize text-white outline-none hover:bg-opacity-90'
                disabled={buyPurchasesMutation.isLoading}
              >
                Mua Hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  )
}

export default Cart
