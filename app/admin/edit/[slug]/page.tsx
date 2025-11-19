import EditEventForm from "@/components/edit-event-form"
import { Suspense } from "react"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface EditEventPageProps {
  params: Promise<{ slug: string }>
}

async function EditEventContent({ params }: EditEventPageProps) {
  const { slug } = await params;
  
  const response = await fetch(`${BASE_URL}/api/events/${slug}`, {
    cache: 'no-store'
  });
  
  if (!response.ok) {
    return <div>Event not found</div>;
  }
  
  const { event } = await response.json();
  
  return <EditEventForm event={event} />;
}

export default function EditEventPage({ params }: EditEventPageProps) {
  return (
    <main>
      <h1 className="mb-8">Edit Event</h1>
      <Suspense fallback={<div>Loading event...</div>}>
        <EditEventContent params={params} />
      </Suspense>
    </main>
  )
}
