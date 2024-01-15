// Dùng omitBy để loại các query param undefined => giảm số state
// keepPreviousData
// useSearchParams (React Router Dom)
// Link to có thể nhận vào một object {pathname: ''}

import AsideFilter from './AsideFilter'
import SortProductList from './SortProductList'
import Product from './Product/Product'
import { useQuery } from '@tanstack/react-query'
import productApi from 'src/apis/productApi.api'
import Pagination from 'src/components/Pagination'
import { ProductListConfig } from 'src/types/product.type'
import categoryApi from 'src/apis/category.api'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { Helmet } from 'react-helmet-async'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

export default function ProductList() {
  const { queryConfig } = useQueryConfig()
  // const [page, setPage] = useState(1)
  const { data: productData } = useQuery({
    queryKey: ['product', queryConfig],
    queryFn: () => {
      return productApi.getProducts({ ...queryConfig, limit: 10 } as ProductListConfig)
    },
    // Để giữ lại data trang cũ cho đến khi fetch dữ liệu xong xuôi, cắt bỏ bước data về undefined gây giật trang
    keepPreviousData: true,
    staleTime: 3 * 60 * 60
  })

  const { data: categoryData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories()
    },
    keepPreviousData: true
  })
  // console.log(data)
  return (
    <div className='bg-gray-200 py-6'>
      <Helmet>
        <title>Trang Chủ | Shopee</title>
        <meta name='description' content='Trang chủ dự án Shopee' />
      </Helmet>
      <div className='container'>
        <div className='grid grid-cols-12 gap-6'>
          <div className='col-span-3'>
            <AsideFilter categories={categoryData?.data.data || []} queryConfig={queryConfig} />
          </div>
          {productData && (
            <div className='col-span-9'>
              <SortProductList queryConfig={queryConfig} pageSize={productData.data.data.pagination.page_size} />
              <div className='mt-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {productData.data.data.products.map((product) => (
                  <div className='col-span-1' key={product._id}>
                    <Product product={product} />
                  </div>
                ))}
              </div>
              <Pagination queryConfig={queryConfig} pageSize={productData.data.data.pagination.page_size} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
