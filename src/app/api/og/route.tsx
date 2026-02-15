import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const title = searchParams.get('title') || '👋 Hello'
  const description = searchParams.get('description')

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
      }}
    >
      <div
        tw="flex h-full w-full flex-col justify-center px-36 py-6"
        style={{
          backgroundImage: 'linear-gradient(to bottom, rgb(40, 42, 54), rgb(50, 53, 65))'
        }}
      >
        <div tw="text-amber-200 text-4xl italic">dinhanhthi.com</div>
        <h2
          style={{
            backgroundClip: 'text',
            backgroundImage: 'linear-gradient(to right, rgb(255, 136, 195), rgb(167, 139, 250))',
            fontWeight: 'bold'
          }}
          tw="text-7xl text-transparent"
        >
          {title}
        </h2>
        {!!description && !!description?.length && (
          <div tw="text-4xl font-normal text-white leading-tight">{description}</div>
        )}
      </div>
    </div>,
    {
      width: 1200,
      height: 630
    }
  )
}
