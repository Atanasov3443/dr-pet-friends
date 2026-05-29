"use client"

import Link from "next/link"
import { Logo } from "@/components/logo"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { Sticker, PawSticker } from "@/components/sticker"

const footerLinks = {
  services: [
    { label: "Общ преглед", href: "/specialnosti/obsh-pregled" },
    { label: "Ваксинации", href: "/specialnosti/vaksinacii" },
    { label: "Хирургия", href: "/specialnosti/hirurgiya" },
    { label: "Спешни случаи", href: "/speshni" },
    { label: "Офталмология", href: "/specialnosti/oftalmologia" },
    { label: "Кардиология", href: "/specialnosti/kardiologia" },
  ],
  company: [
    { label: "За нас", href: "/za-nas" },
    { label: "Как работи", href: "/kak-raboti" },
    { label: "За клиники", href: "/za-kliniki" },
    { label: "Контакти", href: "/kontakti" },
    { label: "Блог", href: "/blog" },
    { label: "Кариери", href: "/kariery" },
  ],
  legal: [
    { label: "Условия за ползване", href: "/usloviya" },
    { label: "Поверителност", href: "/poveritelnost" },
    { label: "Бисквитки", href: "/biskvitki" },
  ],
}

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "Youtube" },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Big Dr. Friend text section */}
      <div className="bg-[#1083BD] py-20 relative" style={{
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" viewBox="0 0 90 90"><g transform="rotate(-35 45 45)" opacity="0.07"><rect x="40" y="16" width="10" height="58" rx="5" fill="white"/><circle cx="33" cy="22" r="12" fill="white"/><circle cx="57" cy="22" r="12" fill="white"/><circle cx="33" cy="68" r="12" fill="white"/><circle cx="57" cy="68" r="12" fill="white"/></g></svg>')}}")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '90px 90px',
      }}>

{/* Background stickers and decorations */}
        <div className="absolute top-10 left-[5%] hidden lg:block">
          <Sticker text="WOOF" color="orange" rotation={-8} size="lg" />
        </div>
        <div className="absolute top-20 right-[10%] hidden lg:block">
          <PawSticker color="lime" icon="bone" rotation={15} />
        </div>
        <div className="absolute bottom-10 left-[15%] hidden lg:block">
          <PawSticker color="pink" icon="heart" rotation={-5} />
        </div>
        <div className="absolute bottom-20 right-[5%] hidden lg:block">
          <Sticker text="GOOOOOD DOGGY" color="green" rotation={10} size="md" />
        </div>

        <div className="container relative z-10">
          {/* Big Typography */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-4 md:gap-6 lg:gap-8">
              <svg viewBox="0 0 100 100" fill="currentColor" className="text-white w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 shrink-0" aria-hidden>
                <circle cx="28" cy="22" r="12" />
                <circle cx="50" cy="14" r="12" />
                <circle cx="72" cy="22" r="12" />
                <ellipse cx="13" cy="43" rx="10" ry="13" transform="rotate(-20 13 43)" />
                <ellipse cx="87" cy="43" rx="10" ry="13" transform="rotate(20 87 43)" />
                <path d="M18 63 C8 83 20 99 36 99 C44 99 48 93 50 91 C52 93 56 99 64 99 C80 99 92 83 82 63 C74 47 62 41 50 41 C38 41 26 47 18 63Z" />
              </svg>
              <h2 className="font-display font-black text-7xl md:text-8xl lg:text-[150px] text-white leading-none tracking-tight">
                Dr. Pet Friend
              </h2>
            </div>
            <p className="text-white/70 text-xl mt-4">
              Вашият домашен любимец е наш приятел!
            </p>
          </div>

        </div>
      </div>

      {/* Main Footer Links */}
      <div className="bg-[#071C30] text-white">
        <div className="container py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Logo />
              <p className="mt-4 text-white/80 max-w-sm">
                Вашата ветеринарна платформа. Свързваме собственици на домашни любимци 
                с най-добрите ветеринарни специалисти в България.
              </p>
              
              {/* Contact Info */}
              <div className="mt-6 space-y-3">
                <a href="mailto:info@drpetfriends.bg" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                  info@drpetfriends.bg
                </a>
                <a href="tel:+359888123456" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                  +359 888 123 456
                </a>
                <div className="flex items-center gap-3 text-white/80">
                  <MapPin className="w-5 h-5" />
                  София, България
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4 mt-6">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center
                        hover:bg-[#EF3988] transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-display font-bold text-lg mb-4">Услуги</h4>
              <ul className="space-y-3">
                {footerLinks.services.map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.href}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-display font-bold text-lg mb-4">Компания</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.href}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-display font-bold text-lg mb-4">Правна информация</h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.href}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="container py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-white/60 text-sm">
                © {new Date().getFullYear()} Dr. Pet Friend. Всички права запазени.
              </p>
              <p className="text-white/60 text-sm flex items-center gap-2">
                Създадено с <span className="text-[#EF3988]">♥</span> за домашните любимци
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
