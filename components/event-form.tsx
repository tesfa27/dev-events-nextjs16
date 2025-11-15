"use client"
import {
  useState
} from "react"
import {
  toast
} from "sonner"
import {
  useForm
} from "react-hook-form"
import {
  zodResolver
} from "@hookform/resolvers/zod"
import {
  z
} from "zod"
import {
  cn
} from "@/lib/utils"
import {
  Button
} from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Input
} from "@/components/ui/input"
import {
  format
} from "date-fns"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import {
  Calendar
} from "@/components/ui/calendar"
import {
  Calendar as CalendarIcon
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  CloudUpload,
  Paperclip
} from "lucide-react"
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem
} from "@/components/ui/file-upload"
import {
  TagsInput
} from "@/components/ui/tags-input"
import {
  Textarea
} from "@/components/ui/textarea"

const formSchema = z.object({
  event_title: z.string().min(1).optional(),
  event_date: z.coerce.date().optional(),
  location: z.string().min(1).optional(),
  event_type: z.string().optional(),
  event_image: z.string().optional(),
  tags: z.array(z.string()).min(1, {
    error: "Please select at least one item"
  }).optional(),
  event_description: z.string().optional()
});

export default function EventForm() {

  const [files, setFiles] = useState < File[] | null > (null);

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  };
  const form = useForm < z.infer < typeof formSchema >> ({
    resolver: zodResolver(formSchema),
    defaultValues: {
      "tags": ["test"],
      "event_date": new Date()
    },
  })

  function onSubmit(values: z.infer < typeof formSchema > ) {
    try {
      console.log(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 ">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-3xl mx-auto px-8 py-10 border border-gray-800 bg-dark-200/20 rounded-xl drop-shadow-sm">
        
        <FormField
          control={form.control}
          name="event_title"
          render={({ field }) => (
            <FormItem className="rounded-lg bg-dark-200/10">
              <FormLabel className="text-lg font-semibold mb-3 text-white">Event Title</FormLabel>
              <FormControl>
                <Input 
                placeholder="Enter Event Title"
                className="border-2 border-gray-800 bg-dark-200 py-8 px-4 text-base placeholder:text-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                
                type="text"
                {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        
      <FormField
      control={form.control}
      name="event_date"
      render={({ field }) => (
        <FormItem className="rounded-lg bg-dark-200/10">
          <FormLabel className="text-lg font-semibold mb-3 text-white">Event Date</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-4 pr-4 text-left font-normal border-2 border-gray-800 bg-dark-200 py-8 text-base text-white hover:bg-dark-200 hover:text-white focus:ring-2 focus:ring-primary transition-all duration-200",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-dark-200 border-gray-800" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                initialFocus
                className="bg-dark-200 text-white"
              />
            </PopoverContent>
          </Popover>
       
          <FormMessage />
        </FormItem>
      )}
    />
        
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className=" rounded-lg bg-dark-200/10">
              <FormLabel className="text-lg font-semibold mb-3 text-white">Location</FormLabel>
              <FormControl>
                <Input 
                placeholder="Enter Event Venue"
                className="border-2 border-gray-800 bg-dark-200 py-8 px-4 text-base placeholder:text-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                type="text"
                {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="event_type"
          render={({ field }) => (
            <FormItem className=" rounded-lg bg-dark-200/10">
              <FormLabel className="text-lg font-semibold mb-3 text-white">Event Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-2 border-gray-800 bg-dark-200 py-8 px-4 text-base focus:ring-2 focus:ring-primary transition-all duration-200">
                    <SelectValue placeholder="Select Event Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-dark-200 border-gray-800">
                  <SelectItem value="m@example.com" className="text-white hover:bg-dark-100">m@example.com</SelectItem>
                  <SelectItem value="m@google.com" className="text-white hover:bg-dark-100">m@google.com</SelectItem>
                  <SelectItem value="m@support.com" className="text-white hover:bg-dark-100">m@support.com</SelectItem>
                </SelectContent>
              </Select>
                
              <FormMessage />
            </FormItem>
          )}
        />
        
            <FormField
              control={form.control}
              name="event_image"
              render={({ field }) => (
                <FormItem className=" rounded-lg bg-dark-200/10">
                  <FormLabel className="text-lg font-semibold mb-3 text-white">Event Image</FormLabel>
                  <FormControl>
                    <FileUploader
                      value={files}
                      onValueChange={setFiles}
                      dropzoneOptions={dropZoneConfig}
                      className="relative border-2 border-gray-800 bg-dark-200 rounded-lg  transition-all duration-200 hover:border-primary"
                    >
                      <FileInput
                        id="fileInput"
                        className="outline-dashed outline-1 outline-slate-500"
                      >
                        <div className="flex items-center justify-center flex-col p-8 w-full ">
                          <CloudUpload className='text-gray-500 w-10 h-10' />
                          <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Click to upload</span>
                            &nbsp; or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            SVG, PNG, JPG or GIF
                          </p>
                        </div>
                      </FileInput>
                      <FileUploaderContent>
                        {files &&
                          files.length > 0 &&
                          files.map((file, i) => (
                            <FileUploaderItem key={i} index={i}>
                              <Paperclip className="h-4 w-4 stroke-current" />
                              <span>{file.name}</span>
                            </FileUploaderItem>
                          ))}
                      </FileUploaderContent>
                    </FileUploader>
                  </FormControl>
                  
                  <FormMessage />
                </FormItem>
              )}
            />
        
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className=" rounded-lg bg-dark-200/10">
              <FormLabel className="text-lg font-semibold mb-3 text-white">Enter Tags</FormLabel>
              <FormControl>
                <TagsInput
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Enter your tags"
                  className="border-2 border-gray-800 bg-dark-200 py-8 px-4 text-base placeholder:text-gray-300 focus:ring-2 focus:ring-primary transition-all duration-200"
                />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="event_description"
          render={({ field }) => (
            <FormItem className=" rounded-lg bg-dark-200/10">
              <FormLabel className="text-lg font-semibold mb-3 text-white">Event Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter event description"
                  className="resize-none border-2 border-gray-800 bg-dark-200 py-8 px-4 text-base placeholder:text-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 min-h-[120px]"
                  {...field}
                />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="btn-primary text-lg text-black w-full py-8 mt-8 font-semibold transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-primary focus:ring-offset-2">Create Event</Button>
      </form>
    </Form>
  )
}