'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Users, Clock } from 'lucide-react'

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  totalSeats: number
  bookedSeats: number
  price?: number
  image?: string
  status?: 'upcoming' | 'ongoing' | 'completed'
}

interface EventCardProps {
  event: Event
  onAction?: () => void
  actionLabel?: string
  showPrice?: boolean
  showStatus?: boolean
}

export function EventCard({
  event,
  onAction,
  actionLabel = 'Book Now',
  showPrice = true,
  showStatus = false,
}: EventCardProps) {
  const availableSeats = event.totalSeats - event.bookedSeats
  const isFull = availableSeats === 0
  const occupancyPercent = Math.round((event.bookedSeats / event.totalSeats) * 100)

  const statusColor = {
    upcoming: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    ongoing: 'bg-green-500/10 text-green-700 dark:text-green-400',
    completed: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
  }

  return (
    <Card className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image Section */}
      {event.image && (
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          <img
            src={event.image}
            alt={event.title}
            className="h-full w-full object-cover"
          />
          {showStatus && event.status && (
            <Badge className={`absolute right-2 top-2 ${statusColor[event.status]}`}>
              {event.status}
            </Badge>
          )}
        </div>
      )}

      <CardHeader>
        <div className="space-y-2">
          <CardTitle className="line-clamp-2">{event.title}</CardTitle>
          <CardDescription className="line-clamp-2">{event.description}</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* Event Details */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {event.date} at {event.time}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {event.bookedSeats} / {event.totalSeats} seats booked
            </span>
          </div>
        </div>

        {/* Capacity Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Capacity</span>
            <span className="font-semibold">{occupancyPercent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full ${
                occupancyPercent > 80 ? 'bg-destructive' : 'bg-chart-1'
              } transition-all`}
              style={{ width: `${occupancyPercent}%` }}
            />
          </div>
        </div>

        {/* Price */}
        {showPrice && event.price !== undefined && (
          <div className="text-lg font-bold text-primary">${event.price}</div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          onClick={onAction}
          disabled={isFull}
          className="w-full"
          variant={isFull ? 'secondary' : 'default'}
        >
          {isFull ? 'Event Full' : actionLabel}
        </Button>
      </CardFooter>
    </Card>
  )
}
