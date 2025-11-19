import Link from 'next/link'
import { Suspense } from 'react'
import { columns, EventItem } from "./columns"
import { DataTable } from "./data-table"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventsTable = async ({ searchParams }: { searchParams: Promise<{ page?: string }> }) => {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;
  const limit = 10;

  const response = await fetch(`${BASE_URL}/api/events?page=${page}&limit=${limit}`, {
    cache: 'no-store'
  });
  const { events, pagination } = await response.json();

  return <DataTable columns={columns} data={events} pagination={pagination} />;
}

const DashboardPage = ({ searchParams }: { searchParams: Promise<{ page?: string }> }) => {
  return (
    <main>
      <div className='flex items-center justify-between mb-8'>
        <h1>Event Management</h1>
        <Link href="/admin/create">
          <button className="btn-primary text-lg">Add New Event</button>
        </Link>
      </div>
      <Suspense fallback={<div>Loading events...</div>}>
        <EventsTable searchParams={searchParams} />
      </Suspense>
    </main>
  )
}

export default DashboardPage
