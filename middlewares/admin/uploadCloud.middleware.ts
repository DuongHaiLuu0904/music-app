import { Request, Response, NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";
import streamifler from 'streamifier'
import dotenv from 'dotenv'
dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
})

let streamUpload = (buffer: any) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream({ resource_type: 'auto'}, (error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    })

    streamifler.createReadStream(buffer).pipe(stream);
  })
}

const uploadToCloudinary = async (buffer: any) => {
  let result = await streamUpload(buffer)
  return (result as { url: string })['url']
}

export const uploadSingle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req['file']) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }
    const result = await uploadToCloudinary(req['file'].buffer);
    req.body[req['file'].fieldname] = result; 
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Upload to cloudinary failed' });
  }
}

export const uploadFields = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req['files']) {
    next();
    return;
  }
  
  const files = req['files'] as { [fieldname: string]: Express.Multer.File[] };
  
  for(const key in files) {
    req.body[key] = []
    
    const array = files[key];
    for(const file of array) {
      try {
        const result = await uploadToCloudinary(file.buffer);
        req.body[key].push(result); 
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Upload to cloudinary failed' });
      }
    }
  }
  next();
}