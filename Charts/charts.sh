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
CPU_FILE="$DATA_DIR/cpu_data.dat"
MEMORY_FILE="$DATA_DIR/memory_data.dat"
NETWORK_FILE="$DATA_DIR/network_data.dat"
TIME_FILE="$DATA_DIR/time_data.dat"

# Function to collect Docker stats and save to data files
collect_stats() {
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemPerc}}\t{{.NetIO}}" | grep "$CONTAINER_NAME" | awk -v time="$(date +'%H:%M:%S')" '{print $1, $2, $3, $4, time}' >> "$CPU_FILE"
}

# Function to generate a line chart from collected data
generate_chart() {
    python3 - << EOF
import matplotlib.pyplot as plt
from datetime import datetime

time_data = []
cpu_data = []
memory_data = []
network_data = []

with open("$CPU_FILE", "r") as f:
    for line in f:
        parts = line.strip().split("\t")
        if len(parts) >= 5:  # Ensure there are at least 5 elements in the list
            time_data.append(datetime.strptime(parts[4], "%H:%M:%S"))  # Convert to datetime
            cpu_data.append(float(parts[1][:-1]))  # Remove the % sign and convert to float
            memory_data.append(float(parts[2][:-1]))  # Remove the % sign and convert to float
            network_data.append(float(parts[3][:-1]))  # Remove the % sign and convert to float

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
}

# Main loop to collect data
for ((i = 1; i <= NUM_DATA_POINTS; i++)); do
    collect_stats
    sleep "$COLLECTION_INTERVAL"
done

# Generate the chart
generate_chart

# Clean up data files
rm -rf "$DATA_DIR"

echo "Chart generated as docker_stats_chart.png"