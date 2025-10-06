
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/context/i18n-context";

export default function ItemsPage() {
  const { t } = useI18n();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('itemsTitle')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>{t('itemsDescription')}</p>
      </CardContent>
    </Card>
  );
}

    