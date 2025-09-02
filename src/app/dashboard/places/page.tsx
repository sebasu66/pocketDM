import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PlacesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Place Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>This is where you will create and manage cities, dungeons, and other locations within your world.</p>
      </CardContent>
    </Card>
  );
}
