
import { cn } from "@/lib/utils";

interface BannerProps {
    title: string;
    orientation: 'vertical' | 'horizontal';
}

export function Banner({ title, orientation }: BannerProps) {
    if (orientation === 'vertical') {
        return (
            <div className="hidden md:flex items-center justify-center p-4 z-10 bg-leather-column drop-shadow-2xl">
                <h2 className="font-headline text-2xl text-foreground/80 [writing-mode:vertical-rl] rotate-180 uppercase tracking-widest">
                    {title}
                </h2>
            </div>
        );
    }

    return (
        <div className="md:hidden text-center mb-8 h-24 flex items-center justify-center bg-leather-column-rotated drop-shadow-2xl">
            <h2 className="font-headline text-2xl text-foreground/80 uppercase tracking-widest">
                {title}
            </h2>
        </div>
    );
}
