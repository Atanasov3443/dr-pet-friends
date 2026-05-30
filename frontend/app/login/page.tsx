"use client"

import { SignInPage, Testimonial } from "@/components/ui/sign-in"
import { signIn, getSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

const testimonials: Testimonial[] = [
  {
    avatarSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    name: "Мария Петрова",
    handle: "@mariapets",
    text: "Намерих перфектния ветеринар за котката ми за минути. Невероятна платформа!",
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    name: "Иван Георгиев",
    handle: "@ivankucheto",
    text: "Лесно резервиране и много добри специалисти. Препоръчвам на всеки!",
  },
]

const oauthErrors: Record<string, string> = {
  OAuthAccountNotLinked: "Акаунтът вече съществува с имейл и парола. Влез по този начин.",
  OAuthSignin:           "Грешка при Google вход. Опитай отново.",
  Callback:              "Грешка при вход. Опитай отново.",
}

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const params   = useSearchParams()
  const urlError = params.get("error") ?? ""
  const callback = params.get("callbackUrl") ?? "/"
  const [error, setError] = useState(oauthErrors[urlError] ?? "")

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const form     = new FormData(e.currentTarget)
    const email    = form.get("email")    as string
    const password = form.get("password") as string

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError("Грешен имейл или парола. Опитай отново.")
    } else {
      if (callback && callback !== "/") {
        router.push(callback)
      } else {
        const sess = await getSession()
        const role = (sess?.user as any)?.role
        if      (role === "ADMIN")                       router.push("/admin")
        else if (role === "VET" || role === "CLINIC_ADMIN") router.push("/dashboard")
        else                                             router.push("/my")
      }
      router.refresh()
    }
  }

  return (
    <SignInPage
      heroImageSrc="https://images.unsplash.com/photo-1581888227599-779811939961?w=1200&h=900&fit=crop"
      testimonials={testimonials}
      onSignIn={handleSignIn}
      onGoogleSignIn={() => signIn("google", { callbackUrl: callback })}
      onResetPassword={() => {}}
      onCreateAccount={() => router.push("/register")}
      error={error}
      loading={loading}
    />
  )
}
