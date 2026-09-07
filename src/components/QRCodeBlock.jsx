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
        border: '1px solid #d8d8d8',
        boxShadow: '0 8px 24px rgba(0,0,0,0.28)',
      }}
    >
      <QRCodeSVG value={joinUrl} size={size} bgColor="#ffffff" fgColor="#000000" />
      <span style={{ color: '#201800', fontFamily: "'GenSenRounded', 'Noto Sans TC', sans-serif", fontSize: 12 }}>
        掃描加入互動
      </span>
    </div>
  )
}
