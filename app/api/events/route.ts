import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Event from "@/database/event.model";
import { EventCreateSchema } from "@/lib/schemas";
import { ZodError } from "zod";

// Guard Cloudinary import so an invalid CLOUDINARY_URL doesn't crash module evaluation
let cloudinary: typeof import('cloudinary').v2 | null = null;
try {
    if (process.env.CLOUDINARY_URL && process.env.CLOUDINARY_URL.startsWith('cloudinary://')) {
        // dynamic require so we can handle invalid env without throwing at import time
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        cloudinary = require('cloudinary').v2;
    } else {
        cloudinary = null;
        console.warn('Cloudinary not configured or CLOUDINARY_URL invalid; skipping Cloudinary initialization.');
    }
} catch (err) {
    console.error('Failed to initialize Cloudinary:', err);
    cloudinary = null;
}

interface ValidationError {
    field: string;
    message: string;
}

function formatZodErrors(error: ZodError): ValidationError[] {
    return error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
    }));
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const formData = await req.formData();

        // Extract fields from FormData
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const overview = formData.get('overview') as string;
        const venue = formData.get('venue') as string;
        const location = formData.get('location') as string;
        const date = formData.get('date') as string;
        const time = formData.get('time') as string;
        const mode = formData.get('mode') as string;
        const audience = formData.get('audience') as string;
        const organizer = formData.get('organizer') as string;
        const file = formData.get('image');

        // Validate required image file
        if (!file || !(file instanceof File)) {
            return NextResponse.json(
                { success: false, errors: [{ field: 'image', message: 'Image file is required' }] },
                { status: 400 }
            );
        }

        // Parse JSON fields
        let tagsData: string[] = [];
        let agendaData: string[] = [];

        try {
            const tagsRaw = formData.get('tags');
            const agendaRaw = formData.get('agenda');

            if (typeof tagsRaw === 'string') {
                tagsData = JSON.parse(tagsRaw);
            }
            if (typeof agendaRaw === 'string') {
                agendaData = JSON.parse(agendaRaw);
            }
        } catch (e) {
            return NextResponse.json(
                { success: false, errors: [{ field: 'format', message: 'Invalid JSON format for tags or agenda' }] },
                { status: 400 }
            );
        }

        // Validate all fields with Zod
        const eventData = {
            title,
            description,
            overview,
            venue,
            location,
            date,
            time,
            mode,
            audience,
            organizer,
            tags: tagsData,
            agenda: agendaData,
        };

        const validatedData = EventCreateSchema.parse(eventData);

        // Upload image to Cloudinary
        if (!cloudinary) {
            console.error('Cloudinary is not available; cannot upload image.');
            return NextResponse.json(
                { success: false, errors: [{ field: 'image', message: 'Image upload service not available' }] },
                { status: 503 }
            );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
            cloudinary!.uploader.upload_stream(
                { resource_type: 'image', folder: 'events' },
                (error: any, result: any) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            ).end(buffer);
        });

        // Create event in MongoDB
        const createdEvent = await Event.create({
            ...validatedData,
            image: uploadResult.secure_url,
        });

        return NextResponse.json(
            {
                success: true,
                event: createdEvent,
                slug: createdEvent.slug,
                message: 'Event created successfully',
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error in POST /api/events:', error);

        // Handle Zod validation errors
        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    errors: formatZodErrors(error),
                    message: 'Validation failed',
                },
                { status: 400 }
            );
        }

        // Handle other errors
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json(
            {
                success: false,
                errors: [{ field: 'general', message: errorMessage }],
                message: 'Event creation failed',
            },
            { status: 500 }
        );
    }
}


export async function GET(req: NextRequest) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const sort = searchParams.get('sort') || 'desc';
        
        const skip = (page - 1) * limit;
        const sortOrder = sort === 'desc' ? -1 : 1;
        
        const events = await Event.find()
            .sort({ createdAt: sortOrder })
            .skip(skip)
            .limit(limit);
        
        const total = await Event.countDocuments();
        
        return NextResponse.json({
            message: 'Events fetched successfully',
            events,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        }, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Failed to fetch events', error: e instanceof Error ? e.message : 'Unknown Error' }, { status: 500 });
    }
}



