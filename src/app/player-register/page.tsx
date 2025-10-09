"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useI18n } from "@/context/i18n-context";
import { signInAnonymously } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useToast } from "@/hooks/use-toast";
import { User as UserIcon, Loader2, AlertCircle } from "lucide-react";
import { Logo } from "@/components/logo";

export default function PlayerRegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [campaignCode, setCampaignCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setupSession, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { locale } = useI18n();

  // Auto-fill campaign code from URL parameter
  useEffect(() => {
    const code = searchParams.get('code') || searchParams.get('secretCode');
    if (code) {
      setCampaignCode(code);
    }
  }, [searchParams]);

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

    if (!campaignCode) {
      toast({
        variant: "destructive",
        title: locale === 'es' ? "Código de campaña requerido" : "Campaign code required",
        description: locale === 'es'
          ? "Necesitas un código de invitación para unirte a una campaña"
          : "You need an invitation code to join a campaign"
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
        role: { isGm: false, isPlayer: true },
        campaignSecret: campaignCode
      });

      toast({
        title: locale === 'es' ? "¡Bienvenido, Aventurero!" : "Welcome, Adventurer!",
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
        <div className="bg-card/90 backdrop-blur-lg rounded-lg p-8 shadow-2xl border border-blue-700/30">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Logo className="w-20 h-20" />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <UserIcon className="w-8 h-8 text-blue-400" />
              <h1 className="text-4xl font-headline text-blue-400">
                {locale === 'es' ? 'Jugador' : 'Player'}
              </h1>
            </div>
            <p className="text-foreground/70 text-lg">
              {locale === 'es'
                ? 'Únete a la aventura'
                : 'Join the adventure'}
            </p>
          </div>

          {/* Campaign Code Notice */}
          {!campaignCode && (
            <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-700/30 rounded flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground/80">
                {locale === 'es'
                  ? 'Necesitas un código de invitación de tu Maestro del Juego'
                  : 'You need an invitation code from your Game Master'}
              </p>
            </div>
          )}

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
                className="w-full px-4 py-3 text-lg bg-black/30 border border-foreground/20 rounded focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-foreground"
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
                className="w-full px-4 py-3 text-lg bg-black/30 border border-foreground/20 rounded focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-foreground"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="code"
                className="block text-lg font-medium text-foreground/90 mb-2"
              >
                {locale === 'es' ? 'Código de Invitación' : 'Invitation Code'}
              </label>
              <input
                id="code"
                type="text"
                value={campaignCode}
                onChange={(e) => setCampaignCode(e.target.value)}
                className="w-full px-4 py-3 text-lg bg-black/30 border border-foreground/20 rounded focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-foreground font-mono"
                placeholder="ABC123"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 text-xl font-headline bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded transition-colors flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {locale === 'es' ? 'Unirse' : 'Join Campaign'}
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
