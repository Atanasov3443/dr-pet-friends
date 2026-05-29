"use client"

import { SignInPage, Testimonial } from "@/components/ui/sign-in"
import { useRouter } from "next/navigation"

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

export default function SignInPageRoute() {
  const router = useRouter()

  return (
    <SignInPage
      heroImageSrc="https://images.unsplash.com/photo-1581888227599-779811939961?w=1200&h=900&fit=crop"
      testimonials={testimonials}
      onSignIn={(e) => {
        e.preventDefault()
        router.push("/")
      }}
      onGoogleSignIn={() => console.log("Google sign in")}
      onResetPassword={() => console.log("Reset password")}
      onCreateAccount={() => router.push("/register")}
    />
  )
}
