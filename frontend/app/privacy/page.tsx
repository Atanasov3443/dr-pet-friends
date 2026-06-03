import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container max-w-3xl mx-auto px-4 py-24">
        <h1 className="font-display font-black text-4xl text-gray-900 mb-2">Политика за поверителност</h1>
        <p className="text-gray-400 text-sm mb-8">Последна актуализация: Юни 2026</p>

        <div className="bg-white rounded-3xl border border-gray-100 p-8 space-y-6 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="font-bold text-gray-900 text-lg mb-3">1. Събиране на данни</h2>
            <p>Dr. Pet Friend събира следните лични данни при регистрация и използване на платформата: ime, имейл адрес, телефонен номер, информация за домашни любимци и история на ветеринарни прегледи.</p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-lg mb-3">2. Използване на данните</h2>
            <p>Данните се използват за: предоставяне на услугите на платформата, изпращане на потвърждения и напомняния за часове, обработка на плащания чрез Stripe, подобряване на качеството на услугите.</p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-lg mb-3">3. Бисквитки (Cookies)</h2>
            <p>Използваме бисквитки за поддържане на потребителски сесии и аналитика. Можете да откажете бисквитките чрез банера при зареждане на сайта.</p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-lg mb-3">4. Съхранение и защита</h2>
            <p>Данните се съхраняват на защитени сървъри (Render/PostgreSQL) с криптиране. Паролите се хешират с bcrypt и никога не се съхраняват в четим вид.</p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-lg mb-3">5. Вашите права</h2>
            <p>Имате право да поискате достъп, коригиране или изтриване на личните си данни. За заявки се свържете с нас на: <a href="mailto:info@drpetfriends.bg" className="text-[#1083BD] hover:underline">info@drpetfriends.bg</a></p>
          </section>

          <section>
            <h2 className="font-bold text-gray-900 text-lg mb-3">6. Трети страни</h2>
            <p>Данните за плащания се обработват от Stripe Inc. Имейлите се изпращат чрез Resend. Не продаваме лични данни на трети страни.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}
