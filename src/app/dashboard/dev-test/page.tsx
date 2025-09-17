
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { runCampaignSeedingTest } from "@/lib/firebase/narrative";
import { useToast } from "@/hooks/use-toast";
import { Beaker, Loader2 } from "lucide-react";
import { useI18n } from "@/context/i18n-context";

export default function DevTestPage() {
    const [isTesting, setIsTesting] = useState(false);
    const { toast } = useToast();
    const { t } = useI18n();

    const handleRunTest = async () => {
        setIsTesting(true);
        toast({
            title: "Running Test...",
            description: "The campaign seeding integrity test has started. Please check the AI Log page for results.",
        });
        try {
            await runCampaignSeedingTest();
            // The result is logged to the DB, so no success toast here is needed.
            // The user will check the log page.
        } catch (error) {
            console.error("Test execution failed:", error);
            toast({
                variant: "destructive",
                title: "Test Failed to Run",
                description: "An unexpected error occurred while trying to start the test.",
            });
        } finally {
            setIsTesting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Beaker />
                    Development & Testing
                </CardTitle>
                <CardDescription>
                    Use these tools to verify application integrity and run diagnostic tests.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <h3 className="font-bold">Campaign Seeding Integrity Test</h3>
                        <p className="text-sm text-muted-foreground">
                            This test simulates the creation of a new campaign and populates it with all the required map data (grid cells, locales, NPCs, hooks). It then verifies the data and cleans up after itself. The results are posted to the AI Log.
                        </p>
                    </div>
                    <Button onClick={handleRunTest} disabled={isTesting}>
                        {isTesting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Running...
                            </>
                        ) : (
                            "Run Seeding Test"
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
