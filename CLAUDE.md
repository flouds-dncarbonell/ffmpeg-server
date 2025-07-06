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
docker build -t dncarbonell/ffmpeg-api:v0.01 .

# Run with docker-compose
docker-compose up -d

# Push to registry
docker push dncarbonell/ffmpeg-api:v0.01
```

## Port Configuration

The application runs on port 8765 (configured to avoid conflicts with common applications). This port is set in:
- server.js (fallback port)
- docker-compose.yml (container port mapping and environment)
- ref-docker-compose.txt (production deployment reference)

## API Endpoints

- `POST /convert`: Convert audio files (requires multipart/form-data with audio file, optional format and quality parameters)
- `POST /convert-base64`: Convert base64 audio data (requires JSON with data, mimeType, optional outputFormat and quality parameters)
- `GET /formats`: List supported formats and quality options
- `GET /health`: Health check endpoint
- `GET /`: API documentation page

## IMPORTANTE: Documentação
**SEMPRE** atualizar a página de documentação (`public/index.html`) quando adicionar novos endpoints ou modificar existentes. A documentação é acessada via GET / e deve refletir todas as funcionalidades da API.

## File Processing Flow

1. Files uploaded to `/uploads` directory via multer
2. ffmpeg processes files with specified format and quality
3. Converted files saved to `/temp` directory
4. Files downloaded then automatically cleaned up (input immediately, output after 5 seconds)

## Production Deployment

The `ref-docker-compose.txt` file contains the production Docker Compose configuration for deployment with Traefik reverse proxy, including:
- Docker Swarm mode configuration
- Resource limits and reservations
- Health checks
- Traefik labels for SSL termination and routing
- External volumes and networks