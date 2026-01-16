"""
Port utility functions to help resolve port conflicts.
"""

import subprocess
import sys
import os
import signal

def find_process_using_port(port: int) -> list:
    """Find processes using a specific port."""
    try:
        if os.name == 'nt':  # Windows
            cmd = f'netstat -ano | findstr :{port}'
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
            lines = result.stdout.strip().split('\n')
            processes = []
            for line in lines:
                if f':{port}' in line and 'LISTENING' in line:
                    parts = line.split()
                    if len(parts) >= 5:
                        pid = parts[-1]
                        processes.append(pid)
            return processes
        else:  # Unix/Linux/Mac
            cmd = f'lsof -ti :{port}'
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
            pids = result.stdout.strip().split('\n')
            return [pid for pid in pids if pid]
    except Exception as e:
        print(f"Error finding process: {e}")
        return []

def kill_process(pid: str) -> bool:
    """Kill a process by PID."""
    try:
        if os.name == 'nt':  # Windows
            subprocess.run(f'taskkill /PID {pid} /F', shell=True, check=True)
        else:  # Unix/Linux/Mac
            os.kill(int(pid), signal.SIGTERM)
        return True
    except Exception as e:
        print(f"Error killing process {pid}: {e}")
        return False

def free_port(port: int) -> bool:
    """Free a port by killing processes using it."""
    processes = find_process_using_port(port)
    if not processes:
        print(f"Port {port} is already free.")
        return True
    
    print(f"Found {len(processes)} process(es) using port {port}:")
    for pid in processes:
        print(f"  PID: {pid}")
    
    response = input("Do you want to kill these processes? (y/n): ")
    if response.lower() == 'y':
        for pid in processes:
            if kill_process(pid):
                print(f"Killed process {pid}")
            else:
                print(f"Failed to kill process {pid}")
        return True
    else:
        print("Port not freed.")
        return False

def check_port_availability(port: int) -> bool:
    """Check if a port is available."""
    processes = find_process_using_port(port)
    return len(processes) == 0

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python port_utils.py <port>")
        print("Example: python port_utils.py 8000")
        sys.exit(1)
    
    port = int(sys.argv[1])
    print(f"Checking port {port}...")
    
    if check_port_availability(port):
        print(f"Port {port} is available.")
    else:
        print(f"Port {port} is in use.")
        free_port(port) 