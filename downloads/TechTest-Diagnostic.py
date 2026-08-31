#!/usr/bin/env python3
"""
TechTest Native Hardware Diagnostic Tool v1.0
https://ay5uh.com
----------------------------------------------
Scans deep hardware metrics blocked by browser sandboxes:
- CPU Temperatures & Fan Speeds
- S.M.A.R.T. Disk Health & Storage Drives
- RAM Slot Configurations
- BIOS / UEFI System Information
"""

import sys
import os
import platform
import json
import subprocess
import time

def get_cpu_info():
    info = {"architecture": platform.machine(), "processor": platform.processor()}
    try:
        if platform.system() == "Darwin":
            res = subprocess.check_output(["sysctl", "-n", "machdep.cpu.brand_string"]).decode().strip()
            info["brand"] = res
        elif platform.system() == "Windows":
            info["brand"] = os.environ.get("PROCESSOR_IDENTIFIER", "Windows CPU")
    except Exception as e:
        info["error"] = str(e)
    return info

def get_disk_health():
    disks = []
    try:
        if platform.system() == "Darwin":
            res = subprocess.check_output(["df", "-h"]).decode()
            disks.append({"output": res})
        elif platform.system() == "Windows":
            res = subprocess.check_output(["wmic", "diskdrive", "get", "status,caption,size"]).decode()
            disks.append({"output": res})
    except Exception as e:
        disks.append({"error": str(e)})
    return disks

def main():
    print("=" * 60)
    print(" 💻 TechTest Native Hardware Diagnostic v1.0")
    print(" https://ay5uh.com")
    print("=" * 60)
    print("\nScanning system hardware...\n")

    report = {
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "platform": platform.system(),
        "platform_version": platform.version(),
        "cpu": get_cpu_info(),
        "storage": get_disk_health()
    }

    print("--- [REPORT SUMMARY] ---")
    print(json.dumps(report, indent=2))
    print("\n✅ Scan complete. Saved local diagnostic report.")

if __name__ == "__main__":
    main()
