"use client";

import ProtectedRoute from "@/services/auth/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Basic account settings page is now available. Add additional preferences here.
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
