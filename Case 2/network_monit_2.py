import matplotlib.pyplot as plt
import time
import docker

# Function to get CPU usage percentage for a specific container
def get_container_cpu_usage(container_id):
    try:
        container = client.containers.get(container_id)
        stats = container.stats(stream=False)
        cpu_stats = stats['cpu_stats']
        precpu_stats = stats['precpu_stats']
        cpu_delta = cpu_stats['cpu_usage']['total_usage'] - precpu_stats['cpu_usage']['total_usage']
        system_delta = cpu_stats['system_cpu_usage'] - precpu_stats['system_cpu_usage']
        cpu_percentage = round((cpu_delta / system_delta) * 100.0, 2)
        return cpu_percentage
    except Exception as e:
        print(f"Error getting CPU usage for container {container_id}: {e}")
        return None

# Function to get memory usage percentage for a specific container
def get_container_memory_usage(container_id):
    try:
        container = client.containers.get(container_id)
        stats = container.stats(stream=False)
        memory_stats = stats['memory_stats']
        memory_usage = memory_stats['usage'] / (1024 * 1024)  # Convert to MB
        memory_limit = memory_stats['limit'] / (1024 * 1024)  # Convert to MB
        memory_percentage = round((memory_usage / memory_limit) * 100.0, 2)
        return memory_percentage
    except Exception as e:
        print(f"Error getting memory usage for container {container_id}: {e}")
        return None

# Function to get network usage for a specific container
def get_container_network_usage(container_id):
    try:
        container = client.containers.get(container_id)
        stats = container.stats(stream=False)
        network_stats = stats['networks']
        rx_bytes = sum(network['rx_bytes'] for network in network_stats.values())
        tx_bytes = sum(network['tx_bytes'] for network in network_stats.values())
        return rx_bytes, tx_bytes
    except Exception as e:
        print(f"Error getting network usage for container {container_id}: {e}")
        return None

# Docker client
client = docker.from_env()

# Initialize lists to store data for plotting
time_data = []
cpu_data = []  # CPU usage for all containers
memory_data = []  # Memory usage for all containers
rx_bytes_data = []  # Network rx_bytes for all containers
tx_bytes_data = []  # Network tx_bytes for all containers

# Specify the containers and their names or IDs
container_info = {
    "edge_broker": "Edge Broker",
    # "edge_iot_smart_dev": "IoT Dev Sim",
    # "edge_subscriber": "Edge Subscriber",
    "edge_data_manager": "Edge Data Manager",
}

# Set the monitoring duration in seconds
monitoring_duration = 300

# Monitor the containers for the specified duration
start_time = time.time()

# Create a single chart for each resource
fig, (ax1, ax2, ax3, ax4) = plt.subplots(4, 1, figsize=(10, 12), sharex=True)
ax1.set_ylabel('Usage (%)')
ax2.set_ylabel('Memory Usage (%)')
ax3.set_ylabel('Network rx_bytes')
ax4.set_ylabel('Network tx_bytes')

# Plot data for each container
for container_id, container_name in container_info.items():
    cpu_data_container = []
    memory_data_container = []
    rx_bytes_container = []
    tx_bytes_container = []

    while time.time() - start_time <= monitoring_duration:
        # cpu_percentage = get_container_cpu_usage(container_id)
        # memory_percentage = get_container_memory_usage(container_id)
        network_percentage = get_container_network_usage(container_id)

        if (
            # cpu_percentage is not None
            # and memory_percentage is not None
            # and 
            network_percentage is not None
        ):
            time_data.append(time.time() - start_time)
            # cpu_data_container.append(cpu_percentage)
            # memory_data_container.append(memory_percentage)
            rx_bytes_container.append(network_percentage[0])  # Network rx_bytes
            tx_bytes_container.append(network_percentage[1])  # Network tx_bytes

        time.sleep(3)  # Shorter sleep duration to update readings faster

    # Update the charts for each resource
    # ax1.plot(time_data, cpu_data_container, label=container_name)
    # ax2.plot(time_data, memory_data_container, label=container_name)
    ax3.plot(time_data, rx_bytes_container, label=f"{container_name} (rx_bytes)")
    ax4.plot(time_data, tx_bytes_container, label=f"{container_name} (tx_bytes)")

# Set titles and legends for the charts
# ax1.set_title('Real-time CPU Usage for Containers')
# ax1.legend(loc='upper left')
# ax2.set_title('Real-time Memory Usage for Containers')
# ax2.legend(loc='upper left')
ax3.set_title('Real-time Network rx_bytes for Containers')
ax3.legend(loc='upper left')
ax4.set_title('Real-time Network tx_bytes for Containers')
ax4.legend(loc='upper left')

# Display the final charts
fig.tight_layout()
plt.show()

# Cleanup
client.close()
