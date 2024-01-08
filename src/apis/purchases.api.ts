import { PurchaseData, PurchaseListStatus } from 'src/types/purchases.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const purchasesAPI = {
  addToCart(body: { product_id?: string; buy_count: number }) {
    return http.post<SuccessResponse<PurchaseData>>('purchases/add-to-cart', body)
  },
  getPurchase(params: { status: PurchaseListStatus }) {
    return http.get<SuccessResponse<PurchaseData[]>>('purchases', {
      params: params
    })
  },
  buyProduct(body: { product_id?: string; buy_count: number }[]) {
    return http.post<SuccessResponse<PurchaseData[]>>('purchases/buy-products', body)
  },
  updatePurchase(body: { product_id?: string; buy_count: number }) {
    return http.put<SuccessResponse<PurchaseData>>('purchases/update-purchase', body)
  },
  deletePurchase(ids: string[]) {
    return http.delete<SuccessResponse<{ deleted_count: number }>>('purchases', {
      data: ids
    })
  }
}

export default purchasesAPI
