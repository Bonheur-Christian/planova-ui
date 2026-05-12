"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Toaster, toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Simplified schema matching your Event model
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  date: z.date({
    required_error: "Event date is required",
  }),
  totalSeats: z
    .number({
      required_error: "Total seats are required",
      invalid_type_error: "Total seats must be a number",
    })
    .min(1, "Must have at least 1 seat"),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateEventPage() {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode:"onSubmit",  
    reValidateMode:"onSubmit",  
    defaultValues: {
      title: "",
      description: "",
      totalSeats: 0,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: FormValues) => {
    try {
      // Format the date to ISO string for the backend
      const eventData = {
        title: values.title,
        description: values.description,
        date: values.date.toISOString(),
        totalSeats: values.totalSeats,
      };

      console.log("Submitting event:", eventData);

      // Make API call to your backend
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      toast.success("Event created successfully");
      router.push("/staff/organiser/events");
      router.refresh();
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="p-6 lg:p-8">
        <div className="mx-auto max-w-4xl space-y-12">
          {/* HEADER */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Event</h1>
            <p className="text-muted-foreground mt-1">
              Create a new event for your organization
            </p>
          </div>

          {/* FORM */}
          <Form {...form}>
            <form
              id="create-event-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Event Information</CardTitle>
                  <CardDescription>
                    Enter the basic details for your event
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Title Field */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Tech Conference 2026"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A clear, descriptive title for your event
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description Field */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={12}
                            placeholder="Describe your event in detail..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide all relevant information about the event
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Date Field */}
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Event Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-1/3 py-6 justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Select the date when the event will take place
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Total Seats Field */}
                  <FormField
                    control={form.control}
                    name="totalSeats"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Seats</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="100"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Maximum number of attendees for this event
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </form>
          </Form>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
              className="py-5 rounded-lg px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="create-event-form"
              disabled={isSubmitting}
              className="py-5 rounded-lg px-6"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Event
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
