// app/(protected)/staff/organiser/bookings/page.tsx
"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
  Download,
  Filter,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Ticket,
  DollarSign,
  User,
  Clock,
} from "lucide-react";
import Link from "next/link";

// Mock bookings data
const mockBookings = [
  {
    id: "BKG-001",
    eventId: "1",
    eventTitle: "Tech Summit 2024",
    eventDate: "2024-06-15",
    eventLocation: "San Francisco Convention Center",
    customerName: "John Smith",
    customerEmail: "john@example.com",
    customerPhone: "+1 234-567-8900",
    tickets: 2,
    totalAmount: 198,
    status: "confirmed",
    paymentStatus: "paid",
    bookingDate: "2024-05-01",
    seatNumbers: ["A-124", "A-125"],
  },
  {
    id: "BKG-002",
    eventId: "1",
    eventTitle: "Tech Summit 2024",
    eventDate: "2024-06-15",
    eventLocation: "San Francisco Convention Center",
    customerName: "Sarah Johnson",
    customerEmail: "sarah@example.com",
    customerPhone: "+1 234-567-8901",
    tickets: 1,
    totalAmount: 99,
    status: "confirmed",
    paymentStatus: "paid",
    bookingDate: "2024-05-02",
    seatNumbers: ["B-056"],
  },
  {
    id: "BKG-003",
    eventId: "2",
    eventTitle: "Web Development Workshop",
    eventDate: "2024-06-22",
    eventLocation: "Downtown Tech Hub",
    customerName: "Mike Brown",
    customerEmail: "mike@example.com",
    customerPhone: "+1 234-567-8902",
    tickets: 3,
    totalAmount: 147,
    status: "pending",
    paymentStatus: "pending",
    bookingDate: "2024-05-15",
    seatNumbers: [],
  },
  {
    id: "BKG-004",
    eventId: "3",
    eventTitle: "Design Conference 2024",
    eventDate: "2024-07-10",
    eventLocation: "Creative Arts Center",
    customerName: "Emily Davis",
    customerEmail: "emily@example.com",
    customerPhone: "+1 234-567-8903",
    tickets: 2,
    totalAmount: 150,
    status: "cancelled",
    paymentStatus: "refunded",
    bookingDate: "2024-05-20",
    seatNumbers: [],
  },
];

// Mock events for filter dropdown
const mockEvents = [
  { id: "1", title: "Tech Summit 2024" },
  { id: "2", title: "Web Development Workshop" },
  { id: "3", title: "Design Conference 2024" },
];

export default function OrganiserBookingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const filteredBookings = useMemo(() => {
    return mockBookings.filter((booking) => {
      const matchesSearch =
        booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.customerName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        booking.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesEvent =
        selectedEvent === "all" || booking.eventId === selectedEvent;
      const matchesStatus =
        statusFilter === "all" || booking.status === statusFilter;

      return matchesSearch && matchesEvent && matchesStatus;
    });
  }, [searchQuery, selectedEvent, statusFilter]);

  const stats = {
    total: mockBookings.length,
    confirmed: mockBookings.filter((b) => b.status === "confirmed").length,
    pending: mockBookings.filter((b) => b.status === "pending").length,
    cancelled: mockBookings.filter((b) => b.status === "cancelled").length,
    revenue: mockBookings
      .filter((b) => b.status === "confirmed")
      .reduce((sum, b) => sum + b.totalAmount, 0),
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "refunded":
        return <Badge className="bg-gray-100 text-gray-800">Refunded</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleStatusChange = () => {
    console.log(
      `Changing booking ${selectedBooking?.id} status to ${newStatus}`,
    );
    setShowStatusDialog(false);
    setSelectedBooking(null);
  };

  const handleSendEmail = (booking: any) => {
    console.log(`Sending email to ${booking.customerEmail}`);
    // Implement email sending logic
  };

  const exportBookings = () => {
    console.log("Exporting bookings to CSV");
    // Implement CSV export
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Bookings</h1>
          <p className="text-muted-foreground">
            Manage all event bookings and attendee information
          </p>
        </div>
        <Button onClick={exportBookings}>
          <Download className="mr-2 h-4 w-4" />
          Export Bookings
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Ticket className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.confirmed}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.cancelled}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">
                  ${stats.revenue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by booking ID, customer name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Events" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                {mockEvents.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Tickets</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>
                    <div>
                      <div>{booking.eventTitle}</div>
                      <div className="text-sm text-muted-foreground">
                        {booking.eventDate}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{booking.customerName}</div>
                      <div className="text-sm text-muted-foreground">
                        {booking.customerEmail}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{booking.tickets}</TableCell>
                  <TableCell>${booking.totalAmount}</TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell>
                    {getPaymentStatusBadge(booking.paymentStatus)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowDetailsDialog(true);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleSendEmail(booking)}
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download Ticket
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedBooking(booking);
                            setNewStatus(booking.status);
                            setShowStatusDialog(true);
                          }}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Update Status
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Booking Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>Complete booking information</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              {/* Booking Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold">Booking ID</label>
                  <p className="text-muted-foreground">{selectedBooking.id}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold">Booking Date</label>
                  <p className="text-muted-foreground">
                    {new Date(selectedBooking.bookingDate).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Event Info */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Event Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    {selectedBooking.eventTitle}
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    {selectedBooking.eventLocation}
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2" />
                    {selectedBooking.eventDate}
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Customer Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2" />
                    {selectedBooking.customerName}
                  </div>
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2" />
                    {selectedBooking.customerEmail}
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2" />
                    {selectedBooking.customerPhone}
                  </div>
                </div>
              </div>

              {/* Ticket Info */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Ticket Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Tickets:</span>
                    <span className="font-semibold">
                      {selectedBooking.tickets}
                    </span>
                  </div>
                  {selectedBooking.seatNumbers.length > 0 && (
                    <div className="flex justify-between">
                      <span>Seat Numbers:</span>
                      <span>{selectedBooking.seatNumbers.join(", ")}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-bold text-primary">
                      ${selectedBooking.totalAmount}
                    </span>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowDetailsDialog(false)}
                >
                  Close
                </Button>
                <Button onClick={() => handleSendEmail(selectedBooking)}>
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Customer
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Booking Status</DialogTitle>
            <DialogDescription>
              Change the status of this booking
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">New Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowStatusDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleStatusChange}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
