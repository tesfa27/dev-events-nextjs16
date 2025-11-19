"use client"
import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DeleteButton } from "./delete-button"
import { ViewButton } from "./view-button"

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
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-3 justify-end">
        <ViewButton slug={row.original.slug} />
        <Link href={`/admin/edit/${row.original.slug}`} className="text-primary hover:underline">
          Edit
        </Link>
        <DeleteButton slug={row.original.slug} title={row.original.title} />
      </div>
    ),
  },
]