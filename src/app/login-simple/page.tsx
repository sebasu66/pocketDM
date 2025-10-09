"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useI18n } from "@/context/i18n-context";
import { getUserByEmail } from "@/lib/firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogIn } from "lucide-react";
import { Logo } from "@/components/logo";

export default function SimpleLoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setUser, setActiveRole, user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { locale } = useI18n();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        variant: "destructive",
        title: locale === 'es' ? "Email requerido" : "Email required",
        description: locale === 'es'
          ? "Por favor ingresa tu email"
          : "Please enter your email"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Development mode: Login with hardcoded password
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      const { auth } = await import("@/lib/firebase/config");

      await signInWithEmailAndPassword(auth, email.toLowerCase(), "12345678");

      toast({
        title: locale === 'es' ? "¡Bienvenido!" : "Welcome back!",
        description: locale === 'es'
          ? "Redirigiendo al panel..."
          : "Redirecting to dashboard..."
      });

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: locale === 'es' ? "Error de inicio de sesión" : "Login error",
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
        <div className="bg-card/90 backdrop-blur-lg rounded-lg p-8 shadow-2xl border border-foreground/20">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Logo className="w-20 h-20" />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <LogIn className="w-8 h-8 text-foreground/70" />
              <h1 className="text-4xl font-headline text-foreground/90">
                {locale === 'es' ? 'Iniciar Sesión' : 'Login'}
              </h1>
            </div>
            <p className="text-foreground/70 text-lg">
              Pocket DM
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
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
                className="w-full px-4 py-3 text-lg bg-black/30 border border-foreground/20 rounded focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                placeholder="tu@email.com"
                autoFocus
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 text-xl font-headline bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground rounded transition-colors flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {locale === 'es' ? 'Entrar' : 'Sign In'}
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

          {/* Registration Links */}
          <div className="mt-8 pt-6 border-t border-foreground/10">
            <p className="text-center text-sm text-foreground/60 mb-4">
              {locale === 'es' ? '¿No tienes cuenta?' : "Don't have an account?"}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/gm-register')}
                className="flex-1 py-3 px-4 text-center bg-amber-900/20 hover:bg-amber-900/30 border border-amber-700/30 rounded transition-colors"
              >
                <div className="text-sm font-medium text-amber-400">
                  {locale === 'es' ? 'Crear cuenta DM' : 'Create GM Account'}
                </div>
              </button>
              <button
                onClick={() => router.push('/player-register')}
                className="flex-1 py-3 px-4 text-center bg-blue-900/20 hover:bg-blue-900/30 border border-blue-700/30 rounded transition-colors"
              >
                <div className="text-sm font-medium text-blue-400">
                  {locale === 'es' ? 'Crear cuenta Jugador' : 'Create Player Account'}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
