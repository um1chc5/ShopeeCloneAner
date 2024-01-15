/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useContext, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import productApi from 'src/apis/productApi.api'
import { Product as ProductType, ProductListConfig } from 'src/types/product.type'
import ProductStar from '../ProductList/RisingStar/ProductStar'
import { currencyFormat, discountRate, getIdFromNameId, socialStyleNumberFm } from 'src/utils/utils'
import DOMPurify from 'dompurify'
import useQueryConfig from 'src/hooks/useQueryConfig'
import Product from '../ProductList/Product'
import QuantityController from 'src/components/QuantityController'
import purchasesAPI from 'src/apis/purchases.api'
import { toast } from 'react-toastify'
import { AppContext } from 'src/Context/App.context'
import { purchaseStatus } from 'src/constants/Purchase'
import path from 'src/constants/Path'

function ProductDetail() {
  const { isAuthenticated } = useContext(AppContext)
  const { nameId } = useParams()
  const { queryConfig } = useQueryConfig()
  const [quantity, setQuantity] = useState(1)
  const [currentImage, setCurrentImage] = useState(0)
  const [slideIndex, setSlideIndex] = useState(0)
  const imageRef = useRef<HTMLImageElement>(null)
  const id = getIdFromNameId(nameId as string)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data } = useQuery({
    queryKey: ['productDetail', id],
    queryFn: () => productApi.getProductDetail(id as string),
    onError: () => {
      navigate({ pathname: '/' })
    }
  })
  const product = data?.data.data

  const { data: AlternativeProducts } = useQuery({
    queryKey: ['alternative_products', queryConfig],
    queryFn: () => {
      return productApi.getProducts({ limit: 10, category: product?.category._id })
    },
    // Để giữ lại data trang cũ cho đến khi fetch dữ liệu xong xuôi, cắt bỏ bước data về undefined gây giật trang
    enabled: Boolean(product)
  })

  const addToCartMutation = useMutation({
    mutationFn: purchasesAPI.addToCart
  })

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng')
      return
    }
    addToCartMutation.mutate(
      { product_id: product?._id, buy_count: quantity },
      {
        onSuccess: (data) => {
          toast.success(data.data.message)
          queryClient.invalidateQueries({
            queryKey: ['purchases', { status: purchaseStatus.inCart }]
          })
        }
      }
    )
  }

  const handleQuantityChange = (value: number) => {
    setQuantity(value)
  }

  const handleSlideShift = (type: 'prev' | 'next', product: ProductType) => () => {
    if (type === 'prev' && slideIndex > 0) {
      setSlideIndex((prev) => prev - 1)
    }

    if (type === 'next' && slideIndex + 5 < product?.images.length - 2) {
      setSlideIndex((prev) => prev + 1)
    }
    return
  }

  const handleImageZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (imageRef.current) {
      const rect = event.currentTarget.getBoundingClientRect()
      const { naturalHeight, naturalWidth } = imageRef.current
      const { offsetX, offsetY } = event.nativeEvent
      const left = offsetX * (1 - naturalWidth / rect.width)
      const top = offsetY * (1 - naturalHeight / rect.height)
      imageRef.current.style.width = naturalWidth + 'px'
      imageRef.current.style.height = naturalHeight + 'px'
      imageRef.current.style.maxWidth = 'unset'
      imageRef.current.style.top = top + 'px'
      imageRef.current.style.left = left + 'px'
      console.log(naturalHeight / rect.height, naturalWidth / rect.width)
    }
  }

  const handleRemoveZoom = () => {
    imageRef.current?.removeAttribute('style')
  }

  const buyNow = () => {
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để mua sản phẩm')
      return
    }
    addToCartMutation.mutate(
      { product_id: product?._id, buy_count: quantity },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: ['purchases', { status: purchaseStatus.inCart }]
          })
          navigate(
            { pathname: path.cart },
            {
              state: {
                purchaseId: product?._id
              }
            }
          )
        }
      }
    )
  }

  return (
    product && (
      <div className='bg-gray-200 py-6'>
        <div className='container bg-white px-16 py-8'>
          <div className='grid grid-cols-12 gap-9'>
            <div className='col-span-5'>
              <div
                className='relative w-full overflow-hidden pt-[100%] shadow'
                onMouseMove={handleImageZoom}
                onMouseLeave={handleRemoveZoom}
              >
                <img
                  src={product?.images[currentImage]}
                  alt={product?.name}
                  ref={imageRef}
                  className='pointer-events-none absolute left-0 top-0 object-cover'
                />
              </div>
              <div className='relative mt-4 grid grid-cols-5 gap-1'>
                <button
                  onClick={handleSlideShift('prev', product)}
                  className='absolute left-0 top-1/2 z-10 flex h-9 w-8 -translate-y-1/2 items-center justify-center bg-black/20 text-white'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-5 w-5'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M15.75 19.5L8.25 12l7.5-7.5'
                    />
                  </svg>
                </button>
                <button
                  onClick={handleSlideShift('next', product)}
                  className='absolute right-0 top-1/2 z-10 flex h-9 w-8 -translate-y-1/2 items-center justify-center bg-black/20 text-white'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-5 w-5'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M8.25 4.5l7.5 7.5-7.5 7.5'
                    />
                  </svg>
                </button>
                {product?.images.slice(slideIndex, slideIndex + 5).map((img, index) => {
                  const isActive = slideIndex + index === currentImage
                  return (
                    <div className='relative w-full cursor-pointer pt-[100%]' key={img}>
                      <img
                        src={img}
                        alt={img}
                        onMouseOver={() => setCurrentImage(slideIndex + index)}
                        className='absolute left-0 top-0 h-full w-full object-cover'
                      />
                      {isActive && (
                        <div className='absolute inset-0 border-2 border-orangeshopee'></div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            <div className='col-span-7'>
              <h1 className='pt-3 text-2xl font-medium uppercase'>{product.name}</h1>
              <div className='mt-4 flex items-center'>
                <div className='flex items-center'>
                  <div className='mr-3 border-b border-b-orangeshopee text-orangeshopee'>
                    {product.rating}
                  </div>
                  <ProductStar
                    rating={product.rating}
                    activeClassname='fill-orangeshopee text-orangeshopee h-4 w-4'
                    nonActiveClassname='h-4 w-4 fill-current text-gray-300'
                  />
                </div>
                <div className='mx-4 h-4 w-[1px] bg-gray-300'></div>
                <div>
                  <span>{socialStyleNumberFm(product.sold)}</span>
                  <span className='ml-1 text-gray-500'>Đã bán</span>
                </div>
              </div>
              <div className='mt-8 flex items-center bg-gray-50 px-5 py-4'>
                <div className='text-xl text-gray-500 line-through'>
                  {currencyFormat(product.price_before_discount)}
                </div>
                <div className='ml-3 truncate text-3xl text-orangeshopee'>
                  {currencyFormat(product.price)}
                </div>
                <div className='ml-4 bg-orangeshopee p-1 px-2 text-sm font-semibold uppercase text-white'>
                  {discountRate(product.price_before_discount, product.price)}% giảm
                </div>
              </div>
              <div className='mt-8 flex items-center'>
                <div className='capitalize text-gray-500'>Số lượng</div>
                <QuantityController
                  max={product.quantity}
                  onIncrease={handleQuantityChange}
                  onDecrease={handleQuantityChange}
                  onType={handleQuantityChange}
                  value={quantity}
                />
                <div className='ml-6 text-sm text-gray-500'>{product.quantity} sản phẩm có sẵn</div>
              </div>
              <div className='mt-8 flex items-center'>
                <button
                  onClick={handleAddToCart}
                  className='flex h-12 items-center justify-center rounded-sm border border-orangeshopee bg-orangeshopee/10 px-5 capitalize text-orangeshopee shadow-sm hover:bg-orangeshopee/5'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='mr-2 h-5 w-5 fill-none stroke-orangeshopee'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
                    />
                  </svg>
                  Thêm vào giỏ hàng
                </button>
                <button
                  onClick={buyNow}
                  className='ml-4 flex h-12 min-w-[5rem] items-center justify-center rounded-sm bg-orangeshopee px-5 capitalize text-white outline-none hover:bg-orangeshopee/90'
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className='container mt-8'>
          <h2 className='mb-8 px-16 text-2xl uppercase text-slate-700'>Mô tả sản phẩm</h2>
          <div className='bg-white px-16 py-8'>
            <div
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }}
            ></div>
          </div>
        </div>
        <div className='container mt-8'>
          <h2 className='mb-8 px-16 text-2xl uppercase text-slate-700'>Có thể bạn cũng thích</h2>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6'>
            {AlternativeProducts?.data.data.products.map((product) => (
              <div className='col-span-1' key={product._id}>
                <Product product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  )
}

export default ProductDetail
