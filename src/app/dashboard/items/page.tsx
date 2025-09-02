import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ItemsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Item Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>This is where you will create and manage magical items, equipment, and other artifacts within your campaigns.</p>
      </CardContent>
    </Card>
  );
}
