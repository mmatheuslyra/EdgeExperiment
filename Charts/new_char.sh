#!/bin/bash

# Define the container name or ID for which you want to collect stats
CONTAINER_NAME="edge_broker"

# Directory to store the data files
DATA_DIR="docker_stats_data"

# Create the data directory if it doesn't exist
mkdir -p "$DATA_DIR"

# Interval between data collection (in seconds)
COLLECTION_INTERVAL=2

# Number of data points to collect
NUM_DATA_POINTS=2

# Initialize data files
DATA_FILE="$DATA_DIR/data.dat"
TIME_FILE="$DATA_DIR/time_data.dat"

# Function to collect Docker stats and save to data files
collect_stats() {
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemPerc}}\t{{.NetIO}}" | grep "$CONTAINER_NAME" | awk -v time="$(date +'%H:%M:%S')" '{print $2, $3, $4, time}' >> "$DATA_FILE"
}

# Main loop to collect data
for ((i = 1; i <= NUM_DATA_POINTS; i++)); do
    collect_stats
    sleep "$COLLECTION_INTERVAL"
done

# Generate the chart using Python
python3 <<EOF
import matplotlib.pyplot as plt
from datetime import datetime

time_data = []
cpu_data = []
memory_data = []
network_data = []

with open("$DATA_FILE", "r") as f:
    for line in f:
        parts = line.strip().split("\t")
        if len(parts) >= 4:  # Ensure there are at least 4 elements in the list
            time_data.append(datetime.strptime(parts[3], "%H:%M:%S"))  # Convert to datetime
            cpu_data.append(float(parts[0][:-1]))  # Remove the % sign and convert to float
            memory_data.append(float(parts[1][:-1]))  # Remove the % sign and convert to float
            net_io = parts[2].split()
            network_data.append(float(net_io[0].strip("MB")))  # Remove "MB" and convert to float

plt.figure(figsize=(10, 6))
plt.plot(time_data, cpu_data, label="CPU Usage")
plt.plot(time_data, memory_data, label="Memory Usage")
plt.plot(time_data, network_data, label="Network Usage")
plt.xlabel("Time")
plt.ylabel("Usage (%)")
plt.title("Docker Container Stats")
plt.xticks(rotation=45)
plt.legend()
plt.tight_layout()
plt.savefig("docker_stats_chart.png")
EOF

# Clean up data files
rm -rf "$DATA_DIR"

echo "Chart generated as docker_stats_chart.png"