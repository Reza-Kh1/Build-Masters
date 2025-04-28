import type { MetadataRoute } from 'next'
const nameSite = process.env.NEXT_PUBLIC_NAME_SITE || ""
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'سایت مشاوره و اجرای ساختمان سازی',
    short_name: nameSite,
    description: `در این صفحه می‌توانید با پروژه‌های انجام شده توسط تیم ${nameSite} آشنا شوید. پروژه‌های ساختمانی ما شامل انواع خدمات ساخت و ساز، معماری و پیمانکاری می‌باشند.`,
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    dir:"rtl",
    lang:"fa",
    icons: [
      {
        src: '/pwa/48x48.webp',
        sizes: '48x48',
        type: 'image/webp',
      },
      {
        src: '/pwa/72x72.webp',
        sizes: '72x72',
        type: 'image/webp',
      },
      {
        src: '/pwa/96x96.webp',
        sizes: '96x96',
        type: 'image/webp',
      },
      {
        src: '/pwa/128x128.webp',
        sizes: '128x128',
        type: 'image/webp',
      },
      {
        src: '/pwa/144x144.webp',
        sizes: '144x144',
        type: 'image/webp',
      },
      {
        src: '/pwa/152x152.webp',
        sizes: '152x152',
        type: 'image/webp',
      },
      {
        src: '/pwa/192x192.webp',
        sizes: '192x192',
        type: 'image/webp',
      },
      {
        src: '/pwa/256x256.webp',
        sizes: '256x256',
        type: 'image/webp',
      },
      {
        src: '/pwa/384x384.webp',
        sizes: '384x384',
        type: 'image/webp',
      },
      {
        src: '/pwa/512x512.webp',
        sizes: '512x512',
        type: 'image/webp',
      },
    ],
  }
}