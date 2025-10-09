"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useI18n } from "@/context/i18n-context";
import { createUserWithEmailAndPassword, signInAnonymously } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useToast } from "@/hooks/use-toast";
import { Crown, Loader2 } from "lucide-react";
import { Logo } from "@/components/logo";

export default function GMRegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setupSession, user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { t, locale } = useI18n();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !username) {
      toast({
        variant: "destructive",
        title: locale === 'es' ? "Campos requeridos" : "Required fields",
        description: locale === 'es'
          ? "Por favor completa todos los campos"
          : "Please fill in all fields"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Development mode: Create email/password auth with hardcoded password
      const { createUserWithEmailAndPassword } = await import("firebase/auth");
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.toLowerCase(),
        "12345678" // Hardcoded dev password
      );

      await setupSession(userCredential.user, {
        name: username,
        role: { isGm: true, isPlayer: false }
      });

      toast({
        title: locale === 'es' ? "¡Bienvenido, Maestro del Juego!" : "Welcome, Game Master!",
        description: locale === 'es'
          ? "Tu cuenta ha sido creada"
          : "Your account has been created"
      });

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: locale === 'es' ? "Error de registro" : "Registration error",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{backgroundImage: "url('https://picsum.photos/1920/1080?grayscale&blur=5&random=1')"}}
      data-ai-hint="fantasy landscape"
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      <div className="w-full max-w-md z-10">
        <div className="bg-card/90 backdrop-blur-lg rounded-lg p-8 shadow-2xl border border-amber-700/30">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Logo className="w-20 h-20" />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="w-8 h-8 text-amber-400" />
              <h1 className="text-4xl font-headline text-amber-400">
                {locale === 'es' ? 'Maestro del Juego' : 'Game Master'}
              </h1>
            </div>
            <p className="text-foreground/70 text-lg">
              {locale === 'es'
                ? 'Crea tu cuenta de DM'
                : 'Create your DM account'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-lg font-medium text-foreground/90 mb-2"
              >
                {locale === 'es' ? 'Nombre de Usuario' : 'Username'}
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 text-lg bg-black/30 border border-foreground/20 rounded focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-foreground"
                placeholder={locale === 'es' ? 'Tu nombre' : 'Your name'}
                autoFocus
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-lg font-medium text-foreground/90 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-lg bg-black/30 border border-foreground/20 rounded focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-foreground"
                placeholder="tu@email.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 text-xl font-headline bg-amber-600 hover:bg-amber-700 disabled:bg-amber-600/50 text-white rounded transition-colors flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {locale === 'es' ? 'Crear Cuenta' : 'Create Account'}
            </button>
          </form>

          {/* Footer Note */}
          <div className="mt-6 text-center text-sm text-foreground/50">
            <p>
              {locale === 'es'
                ? 'Modo desarrollo: sin contraseña requerida'
                : 'Dev mode: no password required'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
