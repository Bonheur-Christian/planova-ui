"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetEventByIdQuery,
  useUpdateEventMutation,
} from "@/redux/features/events/events.api";
import toast from "react-hot-toast";

const editSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().min(1, "Date is required"),
  totalSeats: z.coerce.number().min(1, "Seats must be at least 1"),
});

type EditFormValues = z.infer<typeof editSchema>;

export default function EditEventPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const eventId = String(params.id);

  const { data, isLoading, isFetching, isError } = useGetEventByIdQuery(eventId);
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
  });

  useEffect(() => {
    if (!data?.data) {
      return;
    }

    reset({
      title: data.data.title,
      description: data.data.description,
      date: new Date(data.data.date).toISOString().slice(0, 16),
      totalSeats: data.data.totalSeats,
    });
  }, [data?.data, reset]);

  const onSubmit = async (values: EditFormValues) => {
    try {
      await updateEvent({
        id: eventId,
        data: {
          title: values.title,
          description: values.description,
          date: new Date(values.date).toISOString(),
          totalSeats: values.totalSeats,
        },
      }).unwrap();

      toast.success("Event updated");
      router.push("/staff/organiser/events");
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Failed to update event");
    }
  };

  if (isLoading || isFetching) {
    return <div className="p-6 text-muted-foreground">Loading event...</div>;
  }

  if (isError || !data?.data) {
    return <div className="p-6 text-red-600">Could not load this event.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input {...register("title")} />
              {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea {...register("description")} />
              {errors.description && (
                <p className="text-red-600 text-sm">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Date & Time</label>
              <Input type="datetime-local" {...register("date")} />
              {errors.date && <p className="text-red-600 text-sm">{errors.date.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">Total Seats</label>
              <Input type="number" {...register("totalSeats")} />
              {errors.totalSeats && (
                <p className="text-red-600 text-sm">{errors.totalSeats.message}</p>
              )}
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
