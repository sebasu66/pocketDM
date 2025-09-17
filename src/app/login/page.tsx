
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginCard } from './LoginCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Logo } from '@/components/logo';

export default function LoginPageWrapper() {
  return (
    <div className="font-serif flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat p-4" style={{backgroundImage: "url('https://picsum.photos/1920/1080?grayscale&blur=5&random=1')"}} data-ai-hint="fantasy landscape">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div className="w-full max-w-lg z-10">
        <Suspense fallback={<LoginPageSkeleton />}>
          <LoginCard />
        </Suspense>
      </div>
    </div>
  );
}

function LoginPageSkeleton() {
    return (
        <Card className="bg-card/80 backdrop-blur-lg">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                <Logo className="w-16 h-16"/>
                </div>
                <CardTitle className="text-3xl font-medieval">Adventure Engine</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 pt-4">
                    <Skeleton className="h-4 w-3/4 mx-auto" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
        </Card>
    )
}
