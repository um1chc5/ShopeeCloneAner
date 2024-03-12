/* eslint-disable prettier/prettier */
import { Link } from 'react-router-dom'
import path from 'src/constants/Path'
import { Product as ProductType } from 'src/types/product.type'
import { currencyFormat, generateNameId, socialStyleNumberFm } from 'src/utils/utils'
import ProductStar from '../RisingStar/ProductStar'

interface Props {
  product: ProductType
}

function Product({ product }: Props) {
  return (
    <Link to={`${path.home}${product._id}${generateNameId(product.name, product._id)}`}>
      <div className='m-1 overflow-hidden rounded-sm bg-white hover:translate-y-[-0.04rem] hover:shadow-md'>
        <div className='w-ful relative pt-[100%]'>
          <img
            alt={product.name}
            // style={{ objectFit: 'contain' }}
            src={product.image}
            className='absolute left-0 top-0 h-full w-full object-cover'
          />
        </div>
        <div className='px-2 pb-4 pt-3'>
          <div className='h-[1.75rem] overflow-hidden'>
            <div className='line-clamp-2 text-xs'>{product.name}</div>
          </div>
          <div className='mt-3 flex items-center'>
            <div className='mr-1 truncate text-xs text-gray-400 line-through'>
              {currencyFormat(product.price_before_discount)}
            </div>
            <div className='truncate font-semibold text-orangeshopee'>
              {currencyFormat(product.price)}
            </div>
          </div>
          <div className='mt-3 flex items-center'>
            <ProductStar rating={product.rating} />
            <div className='ml-4 text-xs'>
              <span className='mr-1'>Đã bán</span>
              <span>{socialStyleNumberFm(product.sold)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Product
