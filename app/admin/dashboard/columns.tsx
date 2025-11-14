"use client"
import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export type EventItem = {
  title: string
  image: string
  location: string
  date: string
  time: string
  slug: string
}

export const columns: ColumnDef<EventItem>[] = [
  {
    accessorKey: "title",
    header: "Events",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Image
          src={row.original.image}
          alt={row.original.title}
          width={40}
          height={40}
          className="rounded-md object-cover"
        />
        <span className="font-medium">{row.original.title}</span>
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "time",
    header: "Time",
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex gap-3">
        <Button variant="link" className="text-primary ">Edit</Button>
        <Button variant="link" className="text-secondary">Delete</Button>
      </div>
    ),
  },
]