# Redis Installation Guide

## Windows Installation

### Method 1: Using Docker (Recommended)
```bash
# Install Docker Desktop first
# Then run Redis in Docker
docker run -d -p 6379:6379 --name redis-server redis:latest

# To stop
docker stop redis-server

# To start again
docker start redis-server
```

### Method 2: Using WSL (Windows Subsystem for Linux)
```bash
# Open WSL terminal
sudo apt update
sudo apt install redis-server

# Start Redis
sudo service redis-server start

# Check status
redis-cli ping
# Should return: PONG
```

### Method 3: Using Windows Binary
```bash
# Download Redis for Windows from:
# https://github.com/microsoftarchive/redis/releases

# Extract and run
cd redis-folder
redis-server.exe
```

## Test Redis Connection
```bash
# Test if Redis is running
redis-cli ping
# Should return: PONG

# Test with specific host/port
redis-cli -h localhost -p 6379 ping
```

## Alternative: Redis Cloud (Free tier)
1. Go to https://redis.io/try-free/
2. Create free account
3. Get connection string
4. Update .env file with cloud Redis URL
```
