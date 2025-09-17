
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { runCampaignSeedingTest } from '@/lib/firebase/narrative';

export default function DevTestPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isTesting, setIsTesting] = useState(false);

    const handleRunTest = async () => {
        setIsTesting(true);
        toast({
            title: "Running Test",
            description: "Campaign seeding test is in progress. Check the console for detailed logs.",
        });

        try {
            await runCampaignSeedingTest();
            toast({
                title: "Test Complete",
                description: "Check the console for test results.",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Test Failed",
                description: "An error occurred during the test. Check the console for details.",
            });
        } finally {
            setIsTesting(false);
        }
    };

    if (user?.role !== 'master') {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Access Denied</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>You must be a Game Master to access this page.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="max-w-xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Development Test Panel</CardTitle>
                    <CardDescription>
                        Use these tools to run automated tests on core application features.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-semibold">Campaign Seeding Test</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                            This test will create a temporary campaign, populate it with all map data (locales, NPCs, hooks), verify the data structure, and then delete the campaign.
                        </p>
                        <Button onClick={handleRunTest} disabled={isTesting}>
                            {isTesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Run Seeding Test
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
