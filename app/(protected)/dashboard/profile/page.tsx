"use client";

import { useSelector } from "react-redux";
import { selectUser } from "@/services/auth/authSelector";
import ProtectedRoute from "@/services/auth/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const user = useSelector(selectUser);

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <span className="font-medium">Name:</span> {user?.name ?? "N/A"}
            </p>
            <p>
              <span className="font-medium">Email:</span> {user?.email ?? "N/A"}
            </p>
            <p>
              <span className="font-medium">Role:</span> {user?.role ?? "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
