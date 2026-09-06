export default function BubbleTitle({
  text,
  size = 'clamp(1.4rem, 4.2vw, 3.2rem)',
  font = "'ZCOOL QingKe HuangYou', 'Noto Sans TC', sans-serif",
}) {
  return (
    <h1
      style={{
        margin: 0,
        fontFamily: font,
        fontSize: size,
        lineHeight: 1.4,
        textAlign: 'center',
        color: 'var(--spray)',
        WebkitTextStroke: '1.6px var(--ink)',
        paintOrder: 'stroke fill',
        textShadow: '3px 4px 0 rgba(0,0,0,0.55)',
        textWrap: 'balance',
      }}
    >
      {text}
    </h1>
  )
}
