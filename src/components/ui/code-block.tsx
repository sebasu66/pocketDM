
"use client";

import * as React from "react";
import { Button } from "./button";
import { Check, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CodeBlockProps {
    content: string;
    lang?: string;
}

export function CodeBlock({ content, lang }: CodeBlockProps) {
    const { toast } = useToast();
    const [hasCopied, setHasCopied] = React.useState(false);

    const onCopy = () => {
        navigator.clipboard.writeText(content);
        setHasCopied(true);
        toast({ title: "Copied to clipboard!" });
    };

    React.useEffect(() => {
        if (hasCopied) {
            const timer = setTimeout(() => {
                setHasCopied(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [hasCopied]);

    return (
        <div className="relative">
            <pre className="p-4 bg-muted/50 rounded-md overflow-x-auto text-sm font-code text-white/80 border border-white/10">
                <code className={`language-${lang}`}>{content}</code>
            </pre>
            <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
                onClick={onCopy}
            >
                {hasCopied ? <Check size={16} /> : <Copy size={16} />}
            </Button>
        </div>
    );
}

