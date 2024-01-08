import classNames from 'classnames'
import { Link, createSearchParams } from 'react-router-dom'
import path from 'src/constants/Path'
import { purchaseStatus } from 'src/constants/Purchase'
import useQueryParams from 'src/hooks/useQueryParams'
import { PHistoryNavList } from '../../PurchasesHistory/PurchasesHistory'

interface Props {
  navStatus: (typeof PHistoryNavList)[number]['status']
  content: string
}

function PHistoryNav({ navStatus, content }: Props) {
  const queryParams: { status?: string } = useQueryParams()
  const status: number = Number(queryParams.status) || purchaseStatus.all
  return (
    <Link
      to={{
        pathname: path.purchasesHistory,
        search: createSearchParams({
          status: String(purchaseStatus[navStatus])
        }).toString()
      }}
      className={classNames('flex flex-1 items-center justify-center border-b-[3px] bg-white py-4 text-center', {
        'border-b-orangeshopee text-orangeshopee': status === purchaseStatus[navStatus],
        'border-black/10 text-gray-900': status === purchaseStatus[navStatus]
      })}
    >
      {content}
    </Link>
  )
}

export default PHistoryNav
