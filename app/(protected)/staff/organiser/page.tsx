// app/(protected)/staff/organiser/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Ticket,
  Users,
  DollarSign,
  Eye,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Link from "next/link";

// Mock data for charts
const revenueData = [
  { month: "Jan", revenue: 12000, tickets: 245 },
  { month: "Feb", revenue: 19000, tickets: 389 },
  { month: "Mar", revenue: 15000, tickets: 312 },
  { month: "Apr", revenue: 27000, tickets: 567 },
  { month: "May", revenue: 24000, tickets: 498 },
  { month: "Jun", revenue: 32000, tickets: 678 },
];

const categoryData = [
  { name: "Tech", value: 45, color: "#3b82f6" },
  { name: "Workshop", value: 25, color: "#10b981" },
  { name: "Conference", value: 20, color: "#f59e0b" },
  { name: "Networking", value: 10, color: "#ef4444" },
];

const recentEvents = [
  {
    id: 1,
    title: "Tech Summit 2024",
    date: "June 15, 2024",
    ticketsSold: 320,
    totalSeats: 500,
    revenue: 31680,
    status: "active",
  },
  {
    id: 2,
    title: "Web Development Workshop",
    date: "June 22, 2024",
    ticketsSold: 85,
    totalSeats: 100,
    revenue: 4165,
    status: "active",
  },
  {
    id: 3,
    title: "Design Conference",
    date: "July 10, 2024",
    ticketsSold: 150,
    totalSeats: 300,
    revenue: 11250,
    status: "upcoming",
  },
];

export default function OrganiserDashboard() {
  const [stats, setStats] = useState({
    totalEvents: 12,
    totalBookings: 2456,
    totalRevenue: 89450,
    totalAttendees: 1987,
    growth: 23,
  });

  const statsCards = [
    {
      title: "Total Events",
      value: stats.totalEvents,
      icon: Calendar,
      change: "+2",
      changeType: "increase",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: Ticket,
      change: "+15%",
      changeType: "increase",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: "+$12,450",
      changeType: "increase",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total Attendees",
      value: stats.totalAttendees,
      icon: Users,
      change: "+8%",
      changeType: "increase",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening with your events.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Preview Public View
          </Button>
          <Link href="/staff/organiser/events/create">
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.changeType === "increase" ? "text-green-600" : "text-red-600"}>
                  {stat.change}
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              Monthly revenue and ticket sales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    name="Revenue ($)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="tickets"
                    stroke="#10b981"
                    name="Tickets Sold"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Event Categories</CardTitle>
            <CardDescription>
              Distribution by event type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent! * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Events</CardTitle>
              <CardDescription>
                Your upcoming and active events
              </CardDescription>
            </div>
            <Link href="/staff/organiser/events">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{event.title}</h4>
                    <Badge variant={event.status === "active" ? "default" : "secondary"}>
                      {event.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span>Tickets: {event.ticketsSold}/{event.totalSeats}</span>
                    <span>Revenue: ${event.revenue.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/staff/organiser/events/edit/${event.id}`}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                  <Link href={`/staff/organiser/attendees?event=${event.id}`}>
                    <Button variant="outline" size="sm">View Attendees</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">3</div>
            <p className="text-sm text-muted-foreground mb-4">
              Events waiting for admin approval
            </p>
            <Button variant="outline" className="w-full">
              Review Now
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tech Summit</span>
                <span className="text-red-600">5 days left</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Workshop</span>
                <span className="text-yellow-600">12 days left</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              View Calendar
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Export</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Ticket className="mr-2 h-4 w-4" />
                Export Bookings (CSV)
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Export Attendees (Excel)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}