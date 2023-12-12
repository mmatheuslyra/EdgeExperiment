import matplotlib.pyplot as plt

# Sample data (replace this with your actual data)
data = [
    {"BlockIO": "9.46 / 20.5", "CPUPerc": "0.00%", "Container": "993839f0d931", "ID": "993839f0d931",
     "MemPerc": "1.93%", "MemUsage": "76.09 / 3.844", "Name": "edge_data_manager", "NetIO": "3.98 / 2.11", "PIDs": "31"},
    # Add more data entries here...
]

# Extract and split "NetIO" values into input and output
netio_input = [float(entry["NetIO"].split(" / ")[0]) for entry in data]
netio_output = [float(entry["NetIO"].split(" / ")[1]) for entry in data]

# Create a bar chart for NetIO
container_names = [entry["Name"] for entry in data]

plt.figure(figsize=(12, 6))
plt.bar(container_names, netio_input, label='Input', color='skyblue', alpha=0.7)
plt.bar(container_names, netio_output, label='Output', color='lightcoral', alpha=0.7, bottom=netio_input)

plt.xlabel('Containers')
plt.ylabel('NetIO')
plt.title('NetIO Input and Output for Containers')
plt.xticks(rotation=45, ha='right')
plt.legend()

plt.tight_layout()
plt.show()