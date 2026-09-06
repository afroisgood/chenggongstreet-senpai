import { QRCodeSVG } from 'qrcode.react'

export default function QRCodeBlock({ size = 120 }) {
  const joinUrl = `${window.location.origin}${import.meta.env.BASE_URL}#/join`
  return (
    <div
      style={{
        background: '#fff',
        padding: 12,
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        borderRadius: 18,
        border: '3px solid #000',
        boxShadow: '4px 4px 0 var(--spray)',
      }}
    >
      <QRCodeSVG value={joinUrl} size={size} bgColor="#ffffff" fgColor="#000000" />
      <span style={{ color: '#201800', fontFamily: "'GenSenRounded', 'Noto Sans TC', sans-serif", fontSize: 12 }}>
        掃描加入互動
      </span>
    </div>
  )
}
