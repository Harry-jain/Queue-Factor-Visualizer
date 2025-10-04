# 🚀 Queue Factor Visualizer - Launcher Scripts

## Overview

This project includes comprehensive auto-launcher scripts for all major operating systems, designed to automatically set up and run the Queue Factor Visualizer with minimal user intervention.

## 📁 Available Launchers

### 🪟 **Windows (run.cmd)**
- **File**: `run.cmd`
- **Usage**: Double-click or run from command prompt
- **Features**: 
  - Automatic Node.js and npm detection
  - Dependency installation and updates
  - Port conflict resolution
  - Browser auto-launch
  - Command-line arguments support

### 🐧 **Linux/macOS (run.sh)**
- **File**: `run.sh`
- **Usage**: `./run.sh` or `bash run.sh`
- **Features**:
  - Cross-platform compatibility
  - Color-coded output
  - Advanced port detection
  - Multiple browser support
  - Signal handling and cleanup

### 💻 **PowerShell (run.ps1)**
- **File**: `run.ps1`
- **Usage**: `.\run.ps1` or `powershell -File run.ps1`
- **Features**:
  - Enhanced error handling
  - Process management
  - Verbose output options
  - Cross-platform PowerShell support

---

## 🎯 **Quick Start**

### **Windows Users**
```cmd
# Simple launch
run.cmd

# Custom port
run.cmd -p 3000

# Skip browser auto-open
run.cmd --skip-browser

# Verbose output
run.cmd -v
```

### **Linux/macOS Users**
```bash
# Make executable (first time only)
chmod +x run.sh

# Simple launch
./run.sh

# Custom port
./run.sh -p 3000

# Skip browser auto-open
./run.sh --skip-browser

# Verbose output
./run.sh -v
```

### **PowerShell Users**
```powershell
# Simple launch
.\run.ps1

# Custom port
.\run.ps1 -Port 3000

# Skip browser auto-open
.\run.ps1 -SkipBrowser

# Verbose output
.\run.ps1 -Verbose
```

---

## 🔧 **Command Line Options**

All launchers support the following options:

| Option | Description | Example |
|--------|-------------|---------|
| `-p, --port PORT` | Set custom port number | `-p 3000` |
| `--skip-browser` | Don't open browser automatically | `--skip-browser` |
| `-v, --verbose` | Enable verbose output | `-v` |
| `-h, --help` | Show help message | `-h` |

---

## 🛠️ **Prerequisites**

### **Required Software**
- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **Modern Web Browser** (Chrome, Firefox, Safari, Edge)

### **Installation Links**
- **Node.js**: https://nodejs.org/
- **Git**: https://git-scm.com/

### **Platform-Specific Notes**

#### **Windows**
- Ensure Node.js is added to PATH during installation
- PowerShell execution policy may need adjustment
- Windows Defender might need to allow the scripts

#### **Linux**
- Use package manager: `sudo apt install nodejs npm` (Ubuntu/Debian)
- Or: `sudo yum install nodejs npm` (CentOS/RHEL)
- Make sure scripts are executable: `chmod +x run.sh`

#### **macOS**
- Use Homebrew: `brew install node`
- Or download from official Node.js website
- Ensure scripts are executable: `chmod +x run.sh`

---

## 🎮 **Features**

### **🚀 Automatic Setup**
- **Dependency Detection**: Automatically checks for Node.js and npm
- **Package Installation**: Installs/updates all required dependencies
- **File Verification**: Ensures all project files are present
- **Port Management**: Automatically finds available ports

### **🌐 Browser Integration**
- **Auto-Launch**: Opens application in default browser
- **Multi-Browser Support**: Works with Chrome, Firefox, Safari, Edge
- **Skip Option**: Can disable auto-browser opening
- **URL Display**: Shows the local server URL

### **⚙️ Advanced Features**
- **Port Conflict Resolution**: Automatically finds alternative ports
- **Process Management**: Proper cleanup on exit
- **Error Handling**: Comprehensive error messages and solutions
- **Verbose Mode**: Detailed output for debugging
- **Cross-Platform**: Works on Windows, Linux, and macOS

### **🎨 User Experience**
- **Color-Coded Output**: Easy to read status messages
- **Progress Indicators**: Step-by-step setup progress
- **Help System**: Built-in help and usage information
- **Error Recovery**: Suggestions for common issues

---

## 🔍 **Troubleshooting**

### **Common Issues**

#### **"Node.js not found"**
```bash
# Windows
# Download and install from https://nodejs.org/
# Make sure to check "Add to PATH" during installation

# Linux
sudo apt install nodejs npm  # Ubuntu/Debian
sudo yum install nodejs npm  # CentOS/RHEL

# macOS
brew install node
```

#### **"Port already in use"**
- The launcher automatically finds alternative ports
- Or specify a custom port: `-p 3000`

#### **"Permission denied" (Linux/macOS)**
```bash
chmod +x run.sh
```

#### **"Execution policy" (Windows PowerShell)**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### **Debug Mode**
Use verbose mode to see detailed output:
```bash
# Linux/macOS
./run.sh -v

# Windows
run.cmd -v

# PowerShell
.\run.ps1 -Verbose
```

---

## 📊 **Performance**

### **Startup Time**
- **First Run**: ~30-60 seconds (includes dependency installation)
- **Subsequent Runs**: ~5-10 seconds
- **Dependency Updates**: ~10-30 seconds

### **Resource Usage**
- **Memory**: ~50-100MB (Node.js + dependencies)
- **CPU**: Minimal during idle, moderate during startup
- **Network**: Only during initial dependency installation

---

## 🔒 **Security**

### **Local Development Only**
- All launchers run locally on your machine
- No external data transmission
- No internet connection required after setup
- All dependencies are from official npm registry

### **File Permissions**
- Scripts only read/write to project directory
- No system-level changes
- No administrator privileges required

---

## 🎓 **Educational Use**

### **Classroom Integration**
- **One-Click Setup**: Students can launch with minimal technical knowledge
- **Cross-Platform**: Works on any student's computer
- **Offline Capable**: Runs without internet after initial setup
- **Educational Focus**: Designed specifically for learning environments

### **Instructor Benefits**
- **Consistent Environment**: Same setup process for all students
- **Reduced Support**: Automatic dependency management
- **Quick Deployment**: Fast setup for classroom use
- **Reliable Operation**: Robust error handling and recovery

---

## 🚀 **Advanced Usage**

### **Custom Configuration**
```bash
# Custom port with verbose output
./run.sh -p 8080 -v

# Skip browser and run in background
./run.sh --skip-browser

# Help and options
./run.sh --help
```

### **Integration with IDEs**
- **VS Code**: Add to tasks.json for one-click launch
- **WebStorm**: Configure as external tool
- **Sublime Text**: Add to build system

### **CI/CD Integration**
```yaml
# GitHub Actions example
- name: Setup Node.js
  uses: actions/setup-node@v3
  with:
    node-version: '18'

- name: Install dependencies
  run: npm install

- name: Start application
  run: ./run.sh --skip-browser
```

---

## 📝 **Development Notes**

### **Script Architecture**
- **Modular Design**: Each script is self-contained
- **Error Handling**: Comprehensive error checking and recovery
- **Cross-Platform**: Consistent behavior across operating systems
- **Maintainable**: Easy to update and extend

### **Future Enhancements**
- **Docker Support**: Containerized deployment options
- **Cloud Integration**: Remote development support
- **Advanced Monitoring**: Performance and usage analytics
- **Plugin System**: Extensible functionality

---

## 👨‍💻 **Credits**

**Developed by Harsh Jain (B54)**

- **Lead Developer**: Complete application architecture and implementation
- **Launcher Scripts**: Cross-platform auto-launcher system
- **Documentation**: Comprehensive user guides and technical documentation
- **Educational Design**: Optimized for learning environments

---

## 📞 **Support**

### **Getting Help**
1. **Check this documentation** for common solutions
2. **Use verbose mode** (`-v`) for detailed output
3. **Check prerequisites** are properly installed
4. **Review error messages** for specific guidance

### **Reporting Issues**
- Include your operating system and version
- Provide the full error message
- Mention which launcher script you're using
- Include verbose output if available

---

*© 2024 Harsh Jain (B54) & College Research Project. All rights reserved. Confidential and proprietary.*
