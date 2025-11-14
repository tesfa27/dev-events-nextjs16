import Link from 'next/link'
import { columns, EventItem } from "./columns"
import { DataTable } from "./data-table"
import events from '@/lib/constants'

const DashboardPage = () => {
  return (
    <main>
    <div className='flex items-center justify-between mb-8'>
        <h1>Event Management</h1>
       <Link href="/admin/create">
        <button className="btn-primary text-lg">Add New Event</button>
      </Link>
    </div>
      <DataTable columns={columns} data={events} />
    </main>
  )
}

export default DashboardPage
