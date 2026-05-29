"use client"

import { SignInPage, Testimonial } from "@/components/ui/sign-in"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
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

export default function LoginPage() {
  const router = useRouter()
  const [error, setError]     = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const form  = new FormData(e.currentTarget)
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
      router.push("/")
      router.refresh()
    }
  }

  return (
    <SignInPage
      heroImageSrc="https://images.unsplash.com/photo-1581888227599-779811939961?w=1200&h=900&fit=crop"
      testimonials={testimonials}
      onSignIn={handleSignIn}
      onGoogleSignIn={() => signIn("google", { callbackUrl: "/" })}
      onResetPassword={() => {}}
      onCreateAccount={() => router.push("/register")}
      error={error}
      loading={loading}
    />
  )
}
