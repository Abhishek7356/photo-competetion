import { prisma } from "../../../lib/prisma";
import cloudinary from "../../../lib/cloudinary";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const file = formData.get("file") as File;
        const title = formData.get("title") as string;
        const name = formData.get("name") as string;
        const phone = formData.get("phone") as string;

        if (!file || !title || !name || !phone) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        // convert file → buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // upload to cloudinary
        const uploadResult: any = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream({ folder: "photo-contest" }, (error: any, result: any) => {
                    if (error) reject(error);
                    else resolve(result);
                })
                .end(buffer);
        });

        // save to DB
        const photo = await prisma.photo.create({
            data: {
                title,
                imageUrl: uploadResult.secure_url,
                participantName: name,
                participantPhone: phone,
            },
        });

        return NextResponse.json(photo);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Upload failed" },
            { status: 500 }
        );
    }
}