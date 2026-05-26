"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetUsersQuery, useUpdateUserRoleMutation } from "@/redux/features/users/users.api";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isFetching, isError } = useGetUsersQuery({ search, limit: 100 });
  const [updateRole, { isLoading: isUpdating }] = useUpdateUserRoleMutation();

  const handleUpdateRole = async (
    id: string,
    role: "ADMIN" | "USER" | "ORGANIZER",
  ) => {
    try {
      await updateRole({ id, role }).unwrap();
      toast.success("Role updated");
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Failed to update role");
    }
  };

  return (
    <div className="space-y-4">
      <div className="max-w-md">
        <Input
          placeholder="Search users by name/email"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {(isLoading || isFetching) && (
        <div className="text-muted-foreground">Loading users...</div>
      )}

      {isError && <div className="text-red-600">Could not load users.</div>}

      {!isLoading && !isFetching && !isError && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data?.data ?? []).map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center">
                    <Select
                      defaultValue={user.role}
                      disabled={isUpdating}
                      onValueChange={(role) =>
                        handleUpdateRole(user.id, role as "ADMIN" | "USER" | "ORGANIZER")
                      }
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER">USER</SelectItem>
                        <SelectItem value="ORGANIZER">ORGANIZER</SelectItem>
                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
