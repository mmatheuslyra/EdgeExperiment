
#FIXME: Ajustar o plot de rede que não ta certo. Verificar se não ta usando exatamente a mesma leitura pra plotar os dois (input e output)
# AO Que PARECE PELOS LOGS ESTA CERTO. AJUSTAR ESCALAS e tentar com mais edge_dev_Sim

import psutil
import matplotlib.pyplot as plt
import time
import docker
import faulthandler; faulthandler.enable();
import matplotlib
matplotlib.use('TkAgg')  # Use the TkAgg backend


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
        rx_bytes = 0
        tx_bytes = 0
        for network in network_stats.values():
            rx_bytes += network['rx_bytes']
            tx_bytes += network['tx_bytes']
        return (rx_bytes, tx_bytes)
    except Exception as e:
        print(f"Error getting network usage for container {container_id}: {e}")
        return (0, 0)

# Docker client
client = docker.from_env()

# Initialize lists to store data for plotting
time_data = []
cpu_data_broker = []  # CPU usage for edge_broker
memory_data_broker = []  # Memory usage for edge_broker
network_data_broker = []  # Network usage for edge_broker
cpu_data_iot = []  # CPU usage for edge_iot_smart_dev
memory_data_iot = []  # Memory usage for edge_iot_smart_dev
network_data_iot = []  # Network usage for edge_iot_smart_dev
cpu_data_subscriber = []  # CPU usage for edge_subscriber
memory_data_subscriber = []  # Memory usage for edge_subscriber
network_data_subscriber = []  # Network usage for edge_subscriber
cpu_data_data_manager = []  # CPU usage for edge_data_manager
memory_data_data_manager = []  # Memory usage for edge_data_manager
network_data_data_manager = []  # Network usage for edge_data_manager

# Set the monitoring duration in seconds
monitoring_duration = 300

# Monitor the containers for the specified duration
start_time = time.time()
container_id_broker = "edge_broker"  # Specify the edge_broker container name or ID
container_id_iot = "edge_iot_smart_dev"  # Specify the edge_iot_smart_dev container name or ID
container_id_subscriber = "edge_subscriber"  # Specify the edge_subscriber container name or ID
container_id_data_manager = "edge_data_manager"  # Specify the edge_data_manager container name or ID

# Create a 2x2 grid of subplots with a rectangular aspect ratio
fig, axes = plt.subplots(2, 2, figsize=(14, 8))
ax1, ax2, ax3, ax4 = axes[0, 0], axes[0, 1], axes[1, 0], axes[1, 1]

ax1.set_ylabel('Usage (%)')
ax2.set_ylabel('Usage (%)')
ax3.set_ylabel('Network Input (Bytes)')
ax4.set_ylabel('Network Output (Bytes)')
ax4.set_xlabel('Time (s)')

while time.time() - start_time <= monitoring_duration:
    cpu_percentage_broker = get_container_cpu_usage(container_id_broker)
    memory_percentage_broker = get_container_memory_usage(container_id_broker)
    rx_broker, tx_broker = get_container_network_usage(container_id_broker)
    network_usage_broker = (rx_broker, tx_broker)
    cpu_percentage_iot = get_container_cpu_usage(container_id_iot)
    memory_percentage_iot = get_container_memory_usage(container_id_iot)
    rx_iot, tx_iot = get_container_network_usage(container_id_iot)
    network_usage_iot = (rx_iot, tx_iot)
    cpu_percentage_subscriber = get_container_cpu_usage(container_id_subscriber)
    memory_percentage_subscriber = get_container_memory_usage(container_id_subscriber)
    rx_subscriber, tx_subscriber = get_container_network_usage(container_id_subscriber)
    network_usage_subscriber = (rx_subscriber, tx_subscriber)
    cpu_percentage_data_manager = get_container_cpu_usage(container_id_data_manager)
    memory_percentage_data_manager = get_container_memory_usage(container_id_data_manager)
    rx_data_manager, tx_data_manager = get_container_network_usage(container_id_data_manager)
    network_usage_data_manager = (rx_data_manager, tx_data_manager)

    if (
        cpu_percentage_broker is not None
        and memory_percentage_broker is not None
        and cpu_percentage_iot is not None
        and memory_percentage_iot is not None
        and cpu_percentage_subscriber is not None
        and memory_percentage_subscriber is not None
        and cpu_percentage_data_manager is not None
        and memory_percentage_data_manager is not None
    ):
        time_data.append(time.time() - start_time)
        cpu_data_broker.append(cpu_percentage_broker)
        memory_data_broker.append(memory_percentage_broker)
        network_data_broker.append(network_usage_broker)
        cpu_data_iot.append(cpu_percentage_iot)
        memory_data_iot.append(memory_percentage_iot)
        network_data_iot.append(network_usage_iot)
        cpu_data_subscriber.append(cpu_percentage_subscriber)
        memory_data_subscriber.append(memory_percentage_subscriber)
        network_data_subscriber.append(network_usage_subscriber)
        cpu_data_data_manager.append(cpu_percentage_data_manager)
        memory_data_data_manager.append(memory_percentage_data_manager)
        network_data_data_manager.append(network_usage_data_manager)

        # Update the CPU usage chart for each container
        ax1.clear()
        ax1.plot(time_data, cpu_data_broker, label='Edge Broker (%)', color='tab:blue')
        ax1.plot(time_data, cpu_data_iot, label='IoT Dev Sim (%)', linestyle='dashed', color='tab:orange')
        ax1.plot(time_data, cpu_data_subscriber, label='Edge Subscriber (%)', linestyle='dotted', color='tab:green')
        ax1.plot(time_data, cpu_data_data_manager, label='Edge Data Manager (%)', linestyle='dashdot', color='tab:red')
        ax1.set_title('Real-time CPU Usage for Containers')
        ax1.legend(loc='upper left')

        # Update the memory usage chart for each container
        ax2.clear()
        ax2.plot(time_data, memory_data_broker, label='Edge Broker (%)', color='tab:blue')
        ax2.plot(time_data, memory_data_iot, label='IoT Dev Sim (%)', linestyle='dashed', color='tab:orange')
        ax2.plot(time_data, memory_data_subscriber, label='Edge Subscriber (%)', linestyle='dotted', color='tab:green')
        ax2.plot(time_data, memory_data_data_manager, label='Edge Data Manager (%)', linestyle='dashdot', color='tab:red')
        ax2.set_ylabel('Memory Usage (%)')
        ax2.set_title('Real-time Memory Usage for Containers')
        ax2.legend(loc='upper left')

        # Update the network input chart for each container
        ax3.clear()
        ax3.plot(time_data, [rx[0] for rx in network_data_broker], label='Edge Broker (Rx)', color='tab:blue')
        ax3.plot(time_data, [rx[0] for rx in network_data_iot], label='IoT Dev Sim (Rx)', linestyle='dashed', color='tab:orange')
        ax3.plot(time_data, [rx[0] for rx in network_data_subscriber], label='Edge Subscriber (Rx)', linestyle='dotted', color='tab:green')
        ax3.plot(time_data, [rx[0] for rx in network_data_data_manager], label='Edge Data Manager (Rx)', linestyle='dashdot', color='tab:red')
        ax3.set_title('Real-time Network Input (Rx) for Containers')
        ax3.legend(loc='upper left')

        # Update the network output chart for each container
        ax4.clear()
        ax4.plot(time_data, [tx[1] for tx in network_data_broker], label='Edge Broker (Tx)', color='tab:blue')
        ax4.plot(time_data, [tx[1] for tx in network_data_iot], label='IoT Dev Sim (Tx)', linestyle='dashed', color='tab:orange')
        ax4.plot(time_data, [tx[1] for tx in network_data_subscriber], label='Edge Subscriber (Tx)', linestyle='dotted', color='tab:green')
        ax4.plot(time_data, [tx[1] for tx in network_data_data_manager], label='Edge Data Manager (Tx)', linestyle='dashdot', color='tab:red')
        ax4.set_title('Real-time Network Output (Tx) for Containers')
        ax4.legend(loc='upper left')

        fig.tight_layout()
        plt.pause(0.01)  # Short pause to update the chart faster

    time.sleep(0.01)  # Shorter sleep duration to update readings faster

# Cleanup
client.close()

# Display the final charts
plt.show()
