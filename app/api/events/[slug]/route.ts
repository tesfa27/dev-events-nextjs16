import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { Event } from "@/database";
import { v2 as cloudinary } from 'cloudinary';

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    await connectDB();

    const { slug } = await params;

    // Validate slug parameter
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      return NextResponse.json(
        { message: 'Valid slug parameter is required' },
        { status: 400 }
      );
    }

    // Find event by slug
    const event = await Event.findOne({ slug: slug.trim() });

    if (!event) {
      return NextResponse.json(
        { message: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Event fetched successfully', event },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { 
        message: 'Failed to fetch event', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    await connectDB();
    const { slug } = await params;

    const event = await Event.findOne({ slug });
    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    const formData = await req.formData();
    const updates: any = {};

    // Process form fields
    for (const [key, value] of formData.entries()) {
      if (key !== 'image' && value) {
        if (key === 'tags' || key === 'agenda') {
          updates[key] = JSON.parse(value as string);
        } else {
          updates[key] = value;
        }
      }
    }

    // Handle image upload if provided
    const file = formData.get('image');
    if (file && file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: 'image', folder: 'events' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      // Delete old image from Cloudinary
      if (event.image) {
        const urlParts = event.image.split('/');
        const publicIdWithExt = urlParts.slice(-2).join('/');
        const publicId = publicIdWithExt.split('.')[0];
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (error) {
          console.error('Failed to delete old image:', error);
        }
      }

      updates.image = (uploadResult as { secure_url: string }).secure_url;
    }

    const updatedEvent = await Event.findOneAndUpdate(
      { slug },
      { $set: updates },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      { message: 'Event updated successfully', event: updatedEvent },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update event error:', error);
    return NextResponse.json(
      { message: 'Failed to update event', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}