import useQueryParams from 'src/hooks/useQueryParams'
import PHistoryNav from '../Components/PHistoryNav/PHistoryNav'
import { purchaseStatus } from 'src/constants/Purchase'
import { useQuery } from '@tanstack/react-query'
import purchasesAPI from 'src/apis/purchases.api'
import { PurchaseListStatus } from 'src/types/purchases.type'
import { Link } from 'react-router-dom'
import { currencyFormat, generateNameId } from 'src/utils/utils'
import path from 'src/constants/Path'

export const PHistoryNavList = [
  { status: 'all', content: 'Tất cả' },
  { status: 'waitForConfirmation', content: 'Chờ xác nhận' },
  { status: 'waitForGetting', content: 'Chờ lấy hàng' },
  { status: 'delivering', content: 'Đang giao' },
  { status: 'delivered', content: 'Đã giao' },
  { status: 'cancelled', content: 'Đã hủy' }
] as const

function PurchasesHistory() {
  const queryParams: { status?: string } = useQueryParams()
  const status: number = Number(queryParams.status) || purchaseStatus.all

  const { data: purchasesData } = useQuery({
    queryKey: ['purchases', { status }],
    queryFn: () => purchasesAPI.getPurchase({ status: status as PurchaseListStatus })
  })

  console.log(purchasesData)

  return (
    <div>
      <div className='sticky top-0 flex rounded-t-sm shadow-sm'>
        {PHistoryNavList.map((item, index) => (
          <PHistoryNav navStatus={item.status} content={item.content} key={index} />
        ))}
      </div>
      <div className='py-8'>
        {purchasesData?.data.data.map((purchase) => (
          <Link
            className='my-3 flex rounded-sm border-black/20 p-4 shadow duration-200 hover:opacity-80'
            key={purchase._id}
            to={`${path.home}${purchase._id}${generateNameId(purchase.product.name, purchase.product._id)}`}
          >
            <div className='flex-shrink-0'>
              <img
                alt={purchase.product.name}
                src={purchase.product.image}
                className='h-24 w-24 rounded-sm object-cover'
              />
            </div>
            <div className='flex-grow px-6 pt-3'>
              <p>{purchase.product.name}</p>
              <p className='pt-2 text-gray-500'>x{purchase.buy_count}</p>
            </div>
            <div className='flex flex-shrink-0  flex-col items-end justify-between p-3'>
              <div className='flex'>
                <p className='text-gray-500 line-through'>{currencyFormat(purchase.price_before_discount)}</p>
                <p className='ml-2'>{currencyFormat(purchase.price)}</p>
              </div>
              <div className='flex items-center'>
                <p className='text-gray-500'>Thành tiền</p>
                <p className='ml-2 text-xl text-orangeshopee'>₫{currencyFormat(purchase.price * purchase.buy_count)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default PurchasesHistory
