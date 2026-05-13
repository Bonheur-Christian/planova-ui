"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast, Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Controller } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

// Simplified schema matching your Event model
const formSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is too short"),
  date: z.date({
    required_error: "Date is required",
  }),
  totalSeats: z.coerce.number().min(1, "Seats must be at least 1"),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateEventPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      title: "",
      description: "",
      totalSeats: 0,
      date: new Date(),
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);

      console.log(values);

      // Example API call
      // await fetch("/api/events", {
      //   method: "POST",
      //   body: JSON.stringify(values),
      // });

      toast.success("Event created successfully");

      router.push("/staff/organiser/events");
    } catch (err) {
      toast.error("Failed to create event");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="max-w-2xl mx-auto p-6 space-y-6 border border-gray-300 flex-1 mt-20 rounded-lg">
        <h1 className="text-2xl font-bold">Create Event</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              className="w-full border p-2 rounded"
              {...register("title")}
              placeholder="Event title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              className="w-full border p-2 rounded"
              rows={4}
              {...register("description")}
              placeholder="Event description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* DATE */}
          {/* <div>
            <label className="block text-sm font-medium">
              Date
            </label>
            <input
              type="date"
              className="w-full border p-2 rounded"
              onChange={(e) =>
                setValue("date", new Date(e.target.value))
              }
            />
            {errors.date && (
              <p className="text-red-500 text-sm">
                {errors.date.message}
              </p>
            )}
          </div> */}

          <Controller
            control={control}
            name="date"
            render={({ field }) => (
              <div className="space-y-2">
                <label className="text-sm font-medium">Event Date</label>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal py-5"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />

                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                      
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                    />
                  </PopoverContent>
                </Popover>

                {errors.date && (
                  <p className="text-sm text-red-500">{errors.date.message}</p>
                )}
              </div>
            )}
          />

          {/* SEATS */}
          <div>
            <label className="block text-sm font-medium">Total Seats</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              {...register("totalSeats", { valueAsNumber: true })}
              placeholder="100"
            />
            {errors.totalSeats && (
              <p className="text-red-500 text-sm">
                {errors.totalSeats.message}
              </p>
            )}
          </div>

          {/* SUBMIT */}
          <Button disabled={isLoading} className=" rounded-lg p-5 ">
            {isLoading ? "Creating..." : "Create Event"}
          </Button>
        </form>
      </div>
    </>
  );
}
