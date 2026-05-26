"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Edit, Trash2, PlusCircle } from "lucide-react";
import Link from "next/link";
import {
  useDeleteEventMutation,
  useGetEventsQuery,
} from "@/redux/features/events/events.api";
import toast from "react-hot-toast";

export default function ManageEventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<{ id: string; title: string } | null>(
    null,
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { data, isLoading, isFetching, isError } = useGetEventsQuery({
    search: searchQuery,
    limit: 100,
  });
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

  const handleDelete = async () => {
    if (!selectedEvent) {
      return;
    }

    try {
      await deleteEvent(selectedEvent.id).unwrap();
      toast.success("Event deleted");
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Failed to delete event");
    }

    setShowDeleteDialog(false);
    setSelectedEvent(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Events</h1>
          <p className="text-muted-foreground">Manage events using live API data</p>
        </div>
        <Link href="/staff/organiser/events/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {(isLoading || isFetching) && (
        <div className="py-20 text-center text-muted-foreground">Loading events...</div>
      )}

      {isError && (
        <div className="py-20 text-center text-red-600">Could not fetch events</div>
      )}

      {!isLoading && !isFetching && !isError && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total Seats</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data?.data ?? []).map((event) => {
              const eventDate = new Date(event.date);
              const status = eventDate > new Date() ? "upcoming" : "completed";

              return (
                <TableRow key={event.id}>
                  <TableCell>
                    <div className="font-medium">{event.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {event.description}
                    </div>
                  </TableCell>
                  <TableCell>{eventDate.toLocaleString()}</TableCell>
                  <TableCell>{event.totalSeats}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/staff/organiser/events/edit/${event.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedEvent({ id: event.id, title: event.title });
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              event and all associated bookings and attendee data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
