
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/context/i18n-context";

export default function PlacesPage() {
  const { t } = useI18n();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('placesTitle')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>{t('placesDescription')}</p>
      </CardContent>
    </Card>
  );
}

    