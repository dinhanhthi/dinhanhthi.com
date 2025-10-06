type BlockYoutubeEmbedProps = {
  id: string
  width?: number
  height?: number
  title?: string
  className?: string
}

export default function YoutubeEmbed(props: BlockYoutubeEmbedProps) {
  return (
    <div className={props.className}>
      <iframe
        width={props.width || 853}
        height={props.height || 480}
        src={`https://www.youtube.com/embed/${props.id}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={props.title || 'A video from YouTube'}
        className="border-0"
      />
    </div>
  )
}
