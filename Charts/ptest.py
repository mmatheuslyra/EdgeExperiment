import matplotlib.pyplot as plt

data = [
    {"BlockIO": "9.46 / 20.5", "CPUPerc": "0.00%", "Container": "993839f0d931", "ID": "993839f0d931",
     "MemPerc": "1.93%", "MemUsage": "76.09 / 3.844", "Name": "edge_data_manager", "NetIO": "3.98 / 2.11", "PIDs": "31"},
    # Add the remaining data entries here...
]

# Extract "CPUPerc" and "MemPerc" values
# cpu_perc = [float(entry["CPUPerc"].strip("%")) for entry in data]
# mem_perc = [float(entry["MemPerc"].strip("%")) for entry in data]
netio_perc = [float(entry["NetIO"].split(" / ")[0]) for entry in data]
netio_perc = [float(entry["NetIO"].split(" / ")[1]) for entry in data]

# Create a figure with two subplots (one for "CPUPerc" and one for "MemPerc")
fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True, figsize=(10, 6))

# Plot "CPUPerc" data
# ax1.bar(range(len(data)), cpu_perc, color='skyblue')
# ax1.set_ylabel('CPU Percentage')
# ax1.set_title('CPU Percentage for Containers')

# # Plot "MemPerc" data
# ax2.bar(range(len(data)), mem_perc, color='lightcoral')
# ax2.set_xlabel('Containers')
# ax2.set_ylabel('Memory Percentage')
# ax2.set_title('Memory Percentage for Containers')

# Plot "MemPerc" data
ax2.bar(range(len(data)), netio_perc, color='lightcoral')
ax2.set_xlabel('Containers')
ax2.set_ylabel('NetIO Percentage')
ax2.set_title('NetIO Percentage for Containers')


# Set x-axis labels to container names
container_names = [entry["Name"] for entry in data]
plt.xticks(range(len(data)), container_names, rotation=45, ha="right")

# Adjust subplot spacing
plt.tight_layout()

# Show the plot
plt.show()