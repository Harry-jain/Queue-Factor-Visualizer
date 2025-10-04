#!/bin/bash

# ========================================
# Queue Factor Visualizer - Auto Launcher
# Developed by Harsh Jain (B54)
# ========================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Default port
PORT=8000
SKIP_BROWSER=false
VERBOSE=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -p|--port)
            PORT="$2"
            shift 2
            ;;
        --skip-browser)
            SKIP_BROWSER=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  -p, --port PORT        Set the port number (default: 8000)"
            echo "  --skip-browser        Don't open browser automatically"
            echo "  -v, --verbose         Enable verbose output"
            echo "  -h, --help           Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option $1"
            exit 1
            ;;
    esac
done

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    case $status in
        "INFO")
            echo -e "${BLUE}[INFO]${NC} $message"
            ;;
        "SUCCESS")
            echo -e "${GREEN}[SUCCESS]${NC} $message"
            ;;
        "WARNING")
            echo -e "${YELLOW}[WARNING]${NC} $message"
            ;;
        "ERROR")
            echo -e "${RED}[ERROR]${NC} $message"
            ;;
        "HEADER")
            echo -e "${CYAN}$message${NC}"
            ;;
    esac
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to get version of a command
get_version() {
    local cmd=$1
    local version_flag=${2:---version}
    $cmd $version_flag 2>/dev/null | head -n1 | sed 's/^[^0-9]*//' | head -n1
}

# Function to check if port is available
check_port() {
    local port=$1
    if command_exists lsof; then
        lsof -i :$port >/dev/null 2>&1
    elif command_exists netstat; then
        netstat -an | grep -q ":$port "
    else
        # Fallback: try to bind to the port
        timeout 1 bash -c "echo >/dev/tcp/localhost/$port" 2>/dev/null
    fi
    return $?
}

# Function to find available port
find_available_port() {
    local start_port=$1
    local port=$start_port
    
    while check_port $port; do
        port=$((port + 1))
        if [ $port -gt $((start_port + 100)) ]; then
            print_status "ERROR" "No available ports found in range $start_port-$((start_port + 100))"
            exit 1
        fi
    done
    
    echo $port
}

# Function to open browser
open_browser() {
    local url=$1
    
    if [ "$SKIP_BROWSER" = true ]; then
        print_status "INFO" "Browser opening skipped (--skip-browser flag)"
        return
    fi
    
    print_status "INFO" "Opening browser to $url"
    
    # Try different methods to open browser
    if command_exists xdg-open; then
        xdg-open "$url" &
    elif command_exists open; then
        open "$url" &
    elif command_exists firefox; then
        firefox "$url" &
    elif command_exists google-chrome; then
        google-chrome "$url" &
    elif command_exists chromium-browser; then
        chromium-browser "$url" &
    else
        print_status "WARNING" "Could not find a browser to open automatically"
        print_status "INFO" "Please open $url manually in your browser"
    fi
}

# Function to cleanup on exit
cleanup() {
    print_status "INFO" "Cleaning up..."
    if [ ! -z "$SERVER_PID" ]; then
        kill $SERVER_PID 2>/dev/null
    fi
    print_status "INFO" "Thank you for using Queue Factor Visualizer!"
    print_status "INFO" "Developed by Harsh Jain (B54)"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Clear screen and show header
clear
echo ""
print_status "HEADER" "========================================"
print_status "HEADER" " Queue Factor Visualizer - Auto Launcher"
print_status "HEADER" " Developed by Harsh Jain (B54)"
print_status "HEADER" "========================================"
echo ""

# Ensure we're in the correct directory
cd "$(dirname "$0")"

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    print_status "ERROR" "package.json not found. Please run this script from the project root directory."
    exit 1
fi

print_status "INFO" "Starting Queue Factor Visualizer setup..."
echo ""

# ========================================
# Check for Node.js and npm
# ========================================
print_status "INFO" "[1/6] Checking Node.js installation..."

if ! command_exists node; then
    print_status "ERROR" "Node.js is not installed or not in PATH."
    print_status "INFO" "Please install Node.js from https://nodejs.org/"
    print_status "INFO" "Or use your package manager:"
    print_status "INFO" "  Ubuntu/Debian: sudo apt install nodejs npm"
    print_status "INFO" "  CentOS/RHEL: sudo yum install nodejs npm"
    print_status "INFO" "  macOS: brew install node"
    exit 1
fi

NODE_VERSION=$(get_version node)
print_status "SUCCESS" "Node.js found: $NODE_VERSION"

if ! command_exists npm; then
    print_status "ERROR" "npm is not installed or not in PATH."
    print_status "INFO" "npm should come with Node.js installation."
    exit 1
fi

NPM_VERSION=$(get_version npm)
print_status "SUCCESS" "npm found: $NPM_VERSION"

echo ""

# ========================================
# Check for Python (for HTTP server fallback)
# ========================================
print_status "INFO" "[2/6] Checking Python installation..."

if command_exists python3; then
    PYTHON_VERSION=$(get_version python3)
    print_status "SUCCESS" "Python3 found: $PYTHON_VERSION"
    USE_PYTHON=true
elif command_exists python; then
    PYTHON_VERSION=$(get_version python)
    print_status "SUCCESS" "Python found: $PYTHON_VERSION"
    USE_PYTHON=true
else
    print_status "WARNING" "Python not found. Will use Node.js HTTP server instead."
    USE_PYTHON=false
fi

echo ""

# ========================================
# Install dependencies
# ========================================
print_status "INFO" "[3/6] Installing/updating dependencies..."

if [ ! -d "node_modules" ]; then
    print_status "INFO" "Installing dependencies for the first time..."
    if [ "$VERBOSE" = true ]; then
        npm install
    else
        npm install --silent
    fi
    
    if [ $? -ne 0 ]; then
        print_status "ERROR" "Failed to install dependencies."
        print_status "INFO" "Please check your internet connection and try again."
        exit 1
    fi
    print_status "SUCCESS" "Dependencies installed successfully!"
else
    print_status "INFO" "Dependencies already installed. Checking for updates..."
    if [ "$VERBOSE" = true ]; then
        npm install
    else
        npm install --silent
    fi
    
    if [ $? -ne 0 ]; then
        print_status "WARNING" "Some dependencies may not be up to date, but continuing..."
    else
        print_status "SUCCESS" "Dependencies updated successfully!"
    fi
fi

echo ""

# ========================================
# Check for required files
# ========================================
print_status "INFO" "[4/6] Verifying project files..."

REQUIRED_FILES=("index.html" "App.tsx" "components")
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -e "$file" ]; then
        print_status "ERROR" "$file not found!"
        exit 1
    fi
done

print_status "SUCCESS" "All required files found!"
echo ""

# ========================================
# Choose server method
# ========================================
print_status "INFO" "[5/6] Setting up local server..."

# Try to use http-server (Node.js) first
if command_exists npx; then
    if npx http-server --version >/dev/null 2>&1; then
        print_status "SUCCESS" "http-server is ready!"
    else
        print_status "INFO" "Installing http-server..."
        if [ "$VERBOSE" = true ]; then
            npm install -g http-server
        else
            npm install -g http-server --silent
        fi
        
        if [ $? -ne 0 ]; then
            print_status "WARNING" "Failed to install http-server globally. Trying local installation..."
            if ! npx http-server --version >/dev/null 2>&1; then
                print_status "ERROR" "Cannot install http-server. Please check your internet connection."
                exit 1
            fi
        fi
        print_status "SUCCESS" "http-server is ready!"
    fi
else
    print_status "ERROR" "npx not found. Please ensure npm is properly installed."
    exit 1
fi

echo ""

# ========================================
# Launch application
# ========================================
print_status "INFO" "[6/6] Launching Queue Factor Visualizer..."
echo ""

# Check if port is available and find alternative if needed
if check_port $PORT; then
    print_status "WARNING" "Port $PORT is already in use. Finding alternative port..."
    PORT=$(find_available_port $PORT)
    print_status "INFO" "Using port $PORT instead"
fi

print_status "INFO" "Starting server on port $PORT..."
print_status "INFO" "Application will open in your default browser automatically."
echo ""

print_status "HEADER" "========================================"
print_status "HEADER" " Queue Factor Visualizer is starting..."
print_status "HEADER" " URL: http://localhost:$PORT"
print_status "HEADER" " Press Ctrl+C to stop the server"
print_status "HEADER" "========================================"
echo ""

# Start the server and open browser
open_browser "http://localhost:$PORT"

# Start the HTTP server in background
if [ "$VERBOSE" = true ]; then
    npx http-server -p $PORT --cors &
else
    npx http-server -p $PORT --cors --silent &
fi

SERVER_PID=$!

# Wait for server to start
sleep 2

# Check if server is running
if ! kill -0 $SERVER_PID 2>/dev/null; then
    print_status "ERROR" "Failed to start the server."
    print_status "INFO" "Please try running the command manually: npx http-server -p $PORT --cors"
    exit 1
fi

print_status "SUCCESS" "Server started successfully on port $PORT!"
print_status "INFO" "Server PID: $SERVER_PID"

# Wait for user to stop the server
wait $SERVER_PID

# Cleanup will be handled by the trap