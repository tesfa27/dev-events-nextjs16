"use client"
import { useState } from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon, CloudUpload, Paperclip } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from "@/components/ui/file-upload"
import { TagsInput } from "@/components/ui/tags-input"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import Image from "next/image"

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  overview: z.string().min(1, "Overview is required"),
  venue: z.string().min(1, "Venue is required"),
  location: z.string().min(1, "Location is required"),
  date: z.coerce.date(),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/, "Time must be in HH:MM format"),
  mode: z.string().min(1, "Mode is required"),
  audience: z.string().min(1, "Audience is required"),
  organizer: z.string().min(1, "Organizer is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  agenda: z.array(z.string()).min(1, "At least one agenda item is required")
});

export default function EditEventForm({ event }: { event: any }) {
  const [files, setFiles] = useState<File[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const parseTags = (tags: any) => {
    if (Array.isArray(tags)) {
      return tags.length === 1 && typeof tags[0] === 'string' && tags[0].startsWith('[') 
        ? JSON.parse(tags[0]) 
        : tags;
    }
    return [];
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: event.title || "",
      description: event.description || "",
      overview: event.overview || "",
      venue: event.venue || "",
      location: event.location || "",
      date: new Date(event.date),
      time: event.time || "",
      mode: event.mode || "",
      audience: event.audience || "",
      organizer: event.organizer || "",
      tags: parseTags(event.tags),
      agenda: parseTags(event.agenda)
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      
      const formData = new FormData();
      
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'date') {
          formData.append(key, (value as Date).toISOString().split('T')[0]);
        } else if (key === 'tags' || key === 'agenda') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as string);
        }
      });
      
      if (files && files.length > 0) {
        formData.append('image', files[0]);
      }

      const response = await fetch(`/api/events/${event.slug}`, {
        method: 'PATCH',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Event updated successfully!");
        router.push('/admin/dashboard');
      } else {
        toast.error(result.message || "Failed to update event");
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-3xl mx-auto px-8 py-10 border border-gray-800 bg-dark-200/20 rounded-xl drop-shadow-sm">
        
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem className="rounded-lg bg-dark-200/10">
            <FormLabel className="text-lg font-semibold mb-3 text-white">Event Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter Event Title" className="border-2 border-gray-800 bg-dark-200 py-8 px-4 text-base placeholder:text-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200" type="text" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="date" render={({ field }) => (
            <FormItem className="rounded-lg bg-dark-200/10">
              <FormLabel className="text-lg font-semibold mb-3 text-white">Event Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant={"outline"} className={cn("w-full pl-4 pr-4 text-left font-normal border-2 border-gray-800 bg-dark-200 py-8 text-base text-white hover:bg-dark-200 hover:text-white focus:ring-2 focus:ring-primary transition-all duration-200", !field.value && "text-muted-foreground")}>
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-dark-200 border-gray-800" align="start">
                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus className="bg-dark-200 text-white" />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )} />
          
          <FormField control={form.control} name="time" render={({ field }) => (
            <FormItem className="rounded-lg bg-dark-200/10">
              <FormLabel className="text-lg font-semibold mb-3 text-white">Event Time</FormLabel>
              <FormControl>
                <Input placeholder="HH:MM (e.g., 14:30)" className="border-2 border-gray-800 bg-dark-200 py-8 px-4 text-base placeholder:text-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="venue" render={({ field }) => (
            <FormItem className="rounded-lg bg-dark-200/10">
              <FormLabel className="text-lg font-semibold mb-3 text-white">Venue</FormLabel>
              <FormControl>
                <Input placeholder="Enter Event Venue" className="border-2 border-gray-800 bg-dark-200 py-8 px-4 text-base placeholder:text-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          
          <FormField control={form.control} name="location" render={({ field }) => (
            <FormItem className="rounded-lg bg-dark-200/10">
              <FormLabel className="text-lg font-semibold mb-3 text-white">Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter Event Location/Address" className="border-2 border-gray-800 bg-dark-200 py-8 px-4 text-base placeholder:text-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="mode" render={({ field }) => (
            <FormItem className="rounded-lg bg-dark-200/10">
              <FormLabel className="text-lg font-semibold mb-3 text-white">Event Mode</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="border-2 border-gray-800 bg-dark-200 py-8 px-4 text-base focus:ring-2 focus:ring-primary transition-all duration-200">
                    <SelectValue placeholder="Select Event Mode" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-dark-200 border-gray-800">
                  <SelectItem value="online" className="text-white hover:bg-dark-100">Online</SelectItem>
                  <SelectItem value="offline" className="text-white hover:bg-dark-100">Offline</SelectItem>
                  <SelectItem value="hybrid" className="text-white hover:bg-dark-100">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          
          <FormField control={form.control} name="audience" render={({ field }) => (
            <FormItem className="rounded-lg bg-dark-200/10">
              <FormLabel className="text-lg font-semibold mb-3 text-white">Target Audience</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Developers, Students, Professionals" className="border-2 border-gray-800 bg-dark-200 py-8 px-4 text-base placeholder:text-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        
        <FormField control={form.control} name="organizer" render={({ field }) => (
          <FormItem className="rounded-lg bg-dark-200/10">
            <FormLabel className="text-lg font-semibold mb-3 text-white">Organizer</FormLabel>
            <FormControl>
              <Input placeholder="Enter Organizer Name" className="border-2 border-gray-800 bg-dark-200 py-8 px-4 text-base placeholder:text-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200" type="text" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        
        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem className="rounded-lg bg-dark-200/10">
            <FormLabel className="text-lg font-semibold mb-3 text-white">Event Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Enter event description" className="resize-none border-2 border-gray-800 bg-dark-200 py-8 px-4 text-base placeholder:text-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 min-h-[120px]" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        
        <FormField control={form.control} name="overview" render={({ field }) => (
          <FormItem className="rounded-lg bg-dark-200/10">
            <FormLabel className="text-lg font-semibold mb-3 text-white">Event Overview</FormLabel>
            <FormControl>
              <Textarea placeholder="Enter event overview" className="resize-none border-2 border-gray-800 bg-dark-200 py-8 px-4 text-base placeholder:text-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 min-h-[120px]" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        
        <FormItem className="rounded-lg bg-dark-200/10">
          <FormLabel className="text-lg font-semibold mb-3 text-white">Event Image</FormLabel>
          {!files && event.image && (
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Current Image:</p>
              <Image src={event.image} alt="Current" width={200} height={100} className="rounded-lg object-cover" />
            </div>
          )}
          <FormControl>
            <FileUploader value={files} onValueChange={setFiles} dropzoneOptions={{ maxFiles: 1, maxSize: 1024 * 1024 * 4, multiple: false }} className="relative border-2 border-gray-800 bg-dark-200 rounded-lg transition-all duration-200 hover:border-primary">
              <FileInput id="fileInput" className="outline-dashed outline-1 outline-slate-500">
                <div className="flex items-center justify-center flex-col p-8 w-full">
                  <CloudUpload className='text-gray-500 w-10 h-10' />
                  <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload new image</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or GIF (Max 4MB)</p>
                </div>
              </FileInput>
              <FileUploaderContent>
                {files && files.length > 0 && (
                  <div className="space-y-2">
                    <img src={URL.createObjectURL(files[0])} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                    <FileUploaderItem index={0} onRemove={() => setFiles(null)}>
                      <Paperclip className="h-4 w-4 stroke-current" />
                      <span>{files[0].name}</span>
                    </FileUploaderItem>
                  </div>
                )}
              </FileUploaderContent>
            </FileUploader>
          </FormControl>
        </FormItem>
        
        <FormField control={form.control} name="tags" render={({ field }) => (
          <FormItem className="rounded-lg bg-dark-200/10">
            <FormLabel className="text-lg font-semibold mb-3 text-white">Event Tags</FormLabel>
            <FormControl>
              <TagsInput value={field.value} onValueChange={field.onChange} placeholder="Type and press Space, Enter, or comma to add tags" className="border-2 border-gray-800 bg-dark-200 py-8 px-4 text-base placeholder:text-gray-300 focus:ring-2 focus:ring-primary transition-all duration-200" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        
        <FormField control={form.control} name="agenda" render={({ field }) => (
          <FormItem className="rounded-lg bg-dark-200/10">
            <FormLabel className="text-lg font-semibold mb-3 text-white">Event Agenda</FormLabel>
            <FormControl>
              <TagsInput value={field.value} onValueChange={field.onChange} placeholder="Type and press Space, Enter, or comma to add agenda items" className="border-2 border-gray-800 bg-dark-200 py-8 px-4 text-base placeholder:text-gray-300 focus:ring-2 focus:ring-primary transition-all duration-200" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        
        <Button type="submit" disabled={isSubmitting} className="btn-primary text-lg text-black w-full py-8 mt-8 font-semibold transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
          {isSubmitting ? "Updating Event..." : "Update Event"}
        </Button>
      </form>
    </Form>
  )
}
