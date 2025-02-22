// Fix for route.js file in /src/app/api/user/upload-image/route.js
import fs from 'fs';
import path from 'path';
import { mkdir } from 'fs/promises';

export async function POST(req) {

  try {
    // Get the filename from headers
    const filename = req.headers.get('x-filename') || 'default.jpg';
    
    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public/user');
    await mkdir(uploadDir, { recursive: true });
    
    // Get file data as arrayBuffer and convert to Buffer
    const fileData = Buffer.from(await req.arrayBuffer());
    const filePath = path.join(uploadDir, filename);
    
    // Write file to disk (will create new or overwrite existing)
    fs.writeFileSync(filePath, fileData);
    
    return new Response(JSON.stringify({ message: 'File uploaded successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('File save error:', error);
    return new Response(JSON.stringify({ message: `File save error: ${error.message}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
