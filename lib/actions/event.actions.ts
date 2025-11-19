'use server';

import Event from '@/database/event.model';
import connectDB from "@/lib/mongodb";
import { v2 as cloudinary } from 'cloudinary';
import { revalidatePath } from 'next/cache';

export const getSimilarEventsBySlug = async (slug: string) => {
    try {
        await connectDB();
        const event = await Event.findOne({ slug });

        return await Event.find({ _id: { $ne: event._id }, tags: { $in: event.tags } }).lean();
    } catch {
        return [];
    }
}

export const deleteEvent = async (slug: string) => {
    try {
        await connectDB();
        
        const event = await Event.findOne({ slug });
        if (!event) {
            return { success: false, message: 'Event not found' };
        }

        // Extract public_id from Cloudinary URL
        if (event.image) {
            const urlParts = event.image.split('/');
            const publicIdWithExt = urlParts.slice(-2).join('/');
            const publicId = publicIdWithExt.split('.')[0];
            
            try {
                await cloudinary.uploader.destroy(publicId);
            } catch (error) {
                console.error('Failed to delete image from Cloudinary:', error);
            }
        }

        await Event.deleteOne({ slug });
        revalidatePath('/admin/dashboard');
        
        return { success: true, message: 'Event deleted successfully' };
    } catch (error) {
        console.error('Delete event error:', error);
        return { success: false, message: 'Failed to delete event' };
    }
}