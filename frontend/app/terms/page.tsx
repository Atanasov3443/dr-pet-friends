import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container max-w-3xl mx-auto px-4 py-24">
        <h1 className="font-display font-black text-4xl text-gray-900 mb-2">Условия за ползване</h1>
        <p className="text-gray-400 text-sm mb-8">Последна актуализация: Юни 2026</p>

        <div className="bg-white rounded-3xl border border-gray-100 p-8 space-y-6 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="font-bold text-gray-900 text-lg mb-3">1. Приемане на условията</h2>
            <p>С използването на платформата Dr. Pet Friend вие приемате настоящите Условия за ползване. Ако не сте съгласни, моля не използвайте платформата.</p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-lg mb-3">2. Описание на услугата</h2>
            <p>Dr. Pet Friend е платформа, свързваща собственици на домашни любимци с ветеринарни специалисти. Платформата предоставя: търсене на ветеринари, онлайн резервации, управление на здравна история на любимци и онлайн консултации.</p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-lg mb-3">3. Регистрация и акаунт</h2>
            <p>За ползване на услугите е необходима регистрация. Вие сте отговорни за поверителността на данните за достъп до акаунта си. При подозрение за неоторизиран достъп незабавно ни уведомете.</p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-lg mb-3">4. Плащания и резервации</h2>
            <p><strong>На място:</strong> Плащането се извършва директно при ветеринара по време на прегледа.</p>
            <p className="mt-2"><strong>Онлайн консултации:</strong> Плащането се извършва предварително чрез Stripe. При отказ повече от 24 часа преди консултацията, средствата се възстановяват автоматично. При отказ по-малко от 24 часа — без връщане на средства.</p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-lg mb-3">5. Отговорности</h2>
            <p>Dr. Pet Friend е посредник между клиенти и ветеринари. Платформата не носи отговорност за качеството на ветеринарните услуги. Ветеринарите са независими специалисти.</p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-lg mb-3">6. Забранено съдържание</h2>
            <p>Забранено е: публикуването на неверни отзиви, злоупотреба с системата за резервации, опити за достъп до чужди акаунти.</p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-lg mb-3">7. Контакт</h2>
            <p>За въпроси: <a href="mailto:info@drpetfriends.bg" className="text-[#1083BD] hover:underline">info@drpetfriends.bg</a></p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}
