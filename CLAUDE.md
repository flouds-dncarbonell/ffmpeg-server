# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Audio Converter API built with Node.js and Express that uses ffmpeg for audio file conversion. The application runs on port 8765 and provides RESTful endpoints for converting audio files between different formats (MP3, WAV, FLAC, OGG, M4A, AAC).

## Key Architecture

- **server.js**: Main Express server with all API endpoints and ffmpeg integration
- **uploads/**: Temporary storage for incoming audio files
- **temp/**: Temporary storage for converted output files
- **public/index.html**: Built-in API documentation served at root endpoint

The application uses `fluent-ffmpeg` to interface with ffmpeg, `multer` for file uploads, and includes automatic cleanup of temporary files after processing.

## Development Commands

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Install dependencies
npm install
```

## Docker Operations

```bash
# Build Docker image
docker build -t dncarbonell/ffmpeg-api:v0.1.4 .

# Run with docker-compose
docker-compose up -d

# Push to registry
docker push dncarbonell/ffmpeg-api:v0.1.4
```

## Port Configuration

The application runs on port 8765 (configured to avoid conflicts with common applications). This port is set in:
- server.js (fallback port)
- docker-compose.yml (container port mapping and environment)
- ref-docker-compose.txt (production deployment reference)

## API Endpoints

- `POST /convert`: Convert audio files via upload (multipart/form-data with audio file, optional format, quality, filename)
- `POST /convert-base64`: Convert base64 audio data (JSON with data, mimeType, optional outputFormat, quality, filename)
- `POST /convert-url`: Convert audio from URL (JSON with url, optional outputFormat, quality, filename)
- `GET /formats`: List supported formats and quality options
- `GET /health`: Health check endpoint
- `GET /`: API documentation page

## New Features (v0.1.4)

### Custom Filename Support
All conversion endpoints now support an optional `filename` parameter:
- If provided, the output file will use this name (without extension)
- If not provided, a random cryptographic filename is generated
- Files can be overwritten as the API is not intended for permanent storage

### URL-based Conversion
New endpoint `/convert-url` allows converting audio files directly from URLs:
- Downloads the file from the provided URL
- Converts to the specified format
- Supports all same parameters as other endpoints

### Enhanced File Management
- **24-hour retention**: Files are automatically cleaned up after 24 hours instead of 5 seconds
- **Automatic cleanup**: Background process runs every hour to remove old files
- **Directory safety**: Ensures all required directories exist with proper permissions

## IMPORTANTE: Documentação
**SEMPRE** atualizar a página de documentação (`public/index.html`) quando adicionar novos endpoints ou modificar existentes. A documentação é acessada via GET / e deve refletir todas as funcionalidades da API.

## File Processing Flow

1. Files uploaded to `/uploads` directory via multer, base64 decoded, or downloaded from URL
2. ffmpeg processes files with specified format and quality
3. Converted files saved to `/temp` directory with custom or random filename
4. Files downloaded, input files cleaned immediately, output files cleaned after 24 hours by background process

## Production Deployment

The `ref-docker-compose.txt` file contains the production Docker Compose configuration for deployment with Traefik reverse proxy, including:
- Docker Swarm mode configuration
- Resource limits and reservations
- Health checks
- Traefik labels for SSL termination and routing
- External volumes and networks

## Project References

For complete project information, refer to these files:
- **README.md**: Complete project documentation, features, and usage examples
- **VERSIONING.md**: Version history and deployment commands
- **ref-docker-compose.txt**: Production deployment configuration
- **public/index.html**: Interactive API documentation (accessible via GET /)

## Dependencies

- **express**: Web framework
- **multer**: File upload handling
- **fluent-ffmpeg**: FFmpeg interface
- **cors**: Cross-origin resource sharing
- **fs-extra**: Enhanced file system operations
- **axios**: HTTP client for URL downloads
- **crypto**: Random filename generation (built-in Node.js module)