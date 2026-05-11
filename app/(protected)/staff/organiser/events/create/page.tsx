// app/(protected)/staff/organiser/events/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  CalendarIcon,
  Upload,
  X,
  Plus,
  Loader2,
  ImagePlus,
} from "lucide-react";

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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const formSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(20, "Description is too short"),
  category: z.string().min(1, "Select a category"),
  date: z.date(),
  time: z.string().min(1, "Select time"),

  isVirtual: z.boolean(),

  location: z.string().optional(),
  venue: z.string().optional(),
  streamLink: z.string().optional(),

  totalSeats: z.string().min(1, "Seats required"),
  price: z.string().min(1, "Price required"),

  earlyBirdPrice: z.string().optional(),
  earlyBirdDeadline: z.date().optional(),

  refundPolicy: z.string().optional(),

  contactEmail: z.string().email("Invalid email"),
  contactPhone: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const categories = [
  "Conference",
  "Workshop",
  "Seminar",
  "Networking",
  "Concert",
  "Festival",
  "Sports",
  "Other",
];

export default function CreateEventPage() {
  const router = useRouter();

  const [currentTab, setCurrentTab] = useState("basic");
  const [images, setImages] = useState<File[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      date: new Date(),
      time: "",
      isVirtual: false,
      location: "",
      venue: "",
      streamLink: "",
      totalSeats: "",
      price: "",
      earlyBirdPrice: "",
      refundPolicy: "",
      contactEmail: "",
      contactPhone: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const isVirtual = form.watch("isVirtual");

  const addTag = () => {
    if (!currentTag.trim()) return;

    if (!tags.includes(currentTag.trim())) {
      setTags((prev) => [...prev, currentTag.trim()]);
    }

    setCurrentTag("");
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: FormValues) => {
    try {
      console.log({
        ...values,
        tags,
        images,
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));

     toast.success("Event created successfully");

      router.push("/staff/organiser/events");
    } catch {
      toast.error("Failed to create event");
    }
  };

  return (
    <>
    <Toaster position="top-right" />
        <div className="p-6 lg:p-8">
          <div className="mx-auto max-w-6xl space-y-6">
            {/* HEADER */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Create Event
                </h1>
                <p className="text-muted-foreground mt-1">
                  Publish and manage your event professionally.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="create-event-form"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Publish Event
                </Button>
              </div>
            </div>
            {/* FORM */}
            <Form {...form}>
              <form
                id="create-event-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <Tabs
                  value={currentTab}
                  onValueChange={setCurrentTab}
                  className="space-y-6"
                >
                  <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                    <TabsTrigger value="basic">
                      Basic Info
                    </TabsTrigger>
                    <TabsTrigger value="details">
                      Details
                    </TabsTrigger>
                    <TabsTrigger value="tickets">
                      Tickets
                    </TabsTrigger>
                    <TabsTrigger value="media">
                      Media
                    </TabsTrigger>
                  </TabsList>
                  {/* BASIC */}
                  <TabsContent value="basic">
                    <Card className="rounded-2xl">
                      <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>
                          Main information visible to attendees.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Event Title
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Tech Summit 2026"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Category
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {categories.map((category) => (
                                      <SelectItem
                                        key={category}
                                        value={category}
                                      >
                                        {category}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Description
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  rows={6}
                                  placeholder="Describe your event..."
                                  className="resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Explain what attendees should expect.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid gap-6 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>
                                  Event Date
                                </FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        className={cn(
                                          "justify-start text-left font-normal",
                                          !field.value &&
                                            "text-muted-foreground"
                                        )}
                                      >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value ? (
                                          format(field.value, "PPP")
                                        ) : (
                                          <span>
                                            Pick a date
                                          </span>
                                        )}
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="time"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Event Time
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="time"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="isVirtual"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-xl border p-4">
                              <div className="space-y-1">
                                <FormLabel>
                                  Virtual Event
                                </FormLabel>
                                <FormDescription>
                                  Enable if this event is online.
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={
                                    field.onChange
                                  }
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        {isVirtual ? (
                          <FormField
                            control={form.control}
                            name="streamLink"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Stream Link
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="https://meet.google.com/..."
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ) : (
                          <div className="grid gap-6 md:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="location"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Location
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Amsterdam, Netherlands"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="venue"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Venue
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="RAI Convention Center"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                        {/* TAGS */}
                        <div className="space-y-3">
                          <FormLabel>Tags</FormLabel>
                          <div className="flex gap-2">
                            <Input
                              value={currentTag}
                              placeholder="Technology"
                              onChange={(e) =>
                                setCurrentTag(
                                  e.target.value
                                )
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addTag();
                                }
                              }}
                            />
                            <Button
                              type="button"
                              onClick={addTag}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="gap-1 px-3 py-1"
                              >
                                {tag}
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeTag(tag)
                                  }
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  {/* DETAILS */}
                  <TabsContent value="details">
                    <Card className="rounded-2xl">
                      <CardHeader>
                        <CardTitle>
                          Contact & Policies
                        </CardTitle>
                        <CardDescription>
                          Help attendees reach you easily.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="contactEmail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Contact Email
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="events@company.com"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="contactPhone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Contact Phone
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="+31 000 000 000"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="refundPolicy"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Refund Policy
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  rows={5}
                                  placeholder="Refund terms..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  {/* TICKETS */}
                  <TabsContent value="tickets">
                    <Card className="rounded-2xl">
                      <CardHeader>
                        <CardTitle>
                          Tickets & Pricing
                        </CardTitle>
                        <CardDescription>
                          Configure ticket availability and
                          pricing.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="totalSeats"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Total Seats
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="200"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Ticket Price
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="49.99"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="rounded-2xl border p-6 space-y-6">
                          <div>
                            <h3 className="font-semibold">
                              Early Bird Pricing
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Optional discounted pricing.
                            </p>
                          </div>
                          <div className="grid gap-6 md:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="earlyBirdPrice"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Early Bird Price
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="29.99"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="earlyBirdDeadline"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>
                                    Deadline
                                  </FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant="outline"
                                          className="justify-start text-left font-normal"
                                        >
                                          <CalendarIcon className="mr-2 h-4 w-4" />
                                          {field.value
                                            ? format(
                                                field.value,
                                                "PPP"
                                              )
                                            : "Pick a date"}
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                      <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={
                                          field.onChange
                                        }
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  {/* MEDIA */}
                  <TabsContent value="media">
                    <Card className="rounded-2xl">
                      <CardHeader>
                        <CardTitle>
                          Media Uploads
                        </CardTitle>
                        <CardDescription>
                          Upload banners and promotional
                          images.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="border-2 border-dashed rounded-2xl p-10 text-center">
                          <input
                            id="image-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                          <label
                            htmlFor="image-upload"
                            className="cursor-pointer flex flex-col items-center"
                          >
                            <ImagePlus className="h-10 w-10 text-muted-foreground mb-3" />
                            <p className="font-medium">
                              Upload Event Images
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              PNG, JPG or JPEG up to 10MB
                            </p>
                          </label>
                        </div>
                        {images.length > 0 && (
                          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            {images.map((image, index) => (
                              <div
                                key={index}
                                className="relative overflow-hidden rounded-xl border group"
                              >
                                <img
                                  src={URL.createObjectURL(
                                    image
                                  )}
                                  alt={image.name}
                                  className="h-36 w-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeImage(index)
                                  }
                                  className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white opacity-0 transition group-hover:opacity-100"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </form>
            </Form>
          </div>
        </div>
    </>
  );
}