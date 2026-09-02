FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install build deps
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY server/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy the application code
COPY server /app/server
COPY server/src /app/server/src

# Create uploads dir
RUN mkdir -p /app/uploads

ENV PYTHONUNBUFFERED=1

# Expose port
EXPOSE 8000

# Start the app
CMD ["uvicorn", "server.src.main:app", "--host", "0.0.0.0", "--port", "8000"]
