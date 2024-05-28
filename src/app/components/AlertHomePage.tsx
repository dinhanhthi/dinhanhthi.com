import AiOutlineAlert from '@notion-x/src/icons/AiOutlineAlert'
import cn from 'classnames'

import { containerWide } from '../lib/config'
import Container from './Container'

export default async function AlertHomePage() {
  return (
    <Container className={cn('px-4 sm:px-6', containerWide)}>
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-amber-100 p-6 rounded-xl shadow-md text-slate-800">
        <div>
          <AiOutlineAlert className="text-6xl sm:text-5xl" />
        </div>
        <div className="flex flex-col gap-3">
          <div>
            {' '}
            Math2IT vừa trải qua một đợt đại phẫu lớn và đang trong giai đoạn chuyển giao bài viết
            từ phiên bản cũ sang phiên bản mới. Trong thời gian chuyển giao, có thể nhiều bài viết
            chưa được cập nhật, bạn vui lòng chờ đợi!{' '}
            <strong>
              Khi thông báo này biến mất cũng có nghĩa là quá trình chuyển giao đã hoàn tất!
            </strong>{' '}
            Mong bạn thông cảm cho sự bất tiện này.
          </div>
          <div className="text-emerald-600">
            <span className="font-semibold">100%</span> bài viết cũ đã được chuyển giao.{' '}
            <span className="font-semibold">
              Đang trong giai đoạn rà soát và cập nhật nội dung!
            </span>
          </div>
        </div>
      </div>
    </Container>
  )
}
