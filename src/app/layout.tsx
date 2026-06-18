import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { DevErrorGuard } from '@/shared/components/dev-error-guard'
import { ThemeProvider } from '@/shared/providers/theme-provider'
import './globals.css'

export const viewport: Viewport = {
  themeColor: '#FF9200',
  width: 'device-width',
  initialScale: 1,
  // Cho phép người dùng phóng to (a11y) — không khóa zoom.
}

export const metadata: Metadata = {
  title: 'SataRobo · Đồng hành cùng con',
  description:
    'Nền tảng giáo dục SataRobo giúp phụ huynh theo dõi việc học của con: kết quả, lịch học, nhận xét, học phí và hoạt động lớp.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Geist+Mono:wght@100..900&display=swap" rel="stylesheet" />
        {/* Áp dụng MÀU NHẤN đã lưu TRƯỚC khi hydrate (tránh nhấp nháy). Theme do next-themes tự xử lý. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
  var a=JSON.parse(localStorage.getItem('sata-appearance')||'null');
  if(!a||!a.accents)return;
  var role=localStorage.getItem('sata-active-role')||'parent';
  var d=document.documentElement;
  var c=a.accents[role];
  if(c){
    var m=c.replace('#','');
    var r=parseInt(m.slice(0,2),16),g=parseInt(m.slice(2,4),16),b=parseInt(m.slice(4,6),16);
    function L(v){v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)}
    var lum=0.2126*L(r)+0.7152*L(g)+0.0722*L(b);
    var ink=lum>0.42?'#241A2E':'#FFFFFF';
    var tint='rgba('+r+','+g+','+b+',0.12)';
    d.style.setProperty('--primary',c);
    d.style.setProperty('--sidebar-primary',c);
    d.style.setProperty('--ring',c);
    d.style.setProperty('--primary-foreground',ink);
    // Ghi đè biến gốc theo role để vượt qua cascade [data-mode]
    if(role==='student'){d.style.setProperty('--student',c);d.style.setProperty('--student-soft',tint);}
    else{d.style.setProperty('--parent',c);d.style.setProperty('--parent-soft',tint);}
    d.style.setProperty('--accent',c);
    d.style.setProperty('--accent-soft',tint);
    d.style.setProperty('--accent-foreground',ink);
  }
}catch(e){}})();`,
          }}
        />
      </head>
      <body className="bg-background font-sans antialiased">
        <ThemeProvider>
          <DevErrorGuard />
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ThemeProvider>
      </body>
    </html>
  )
}


