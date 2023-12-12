import json
import matplotlib.pyplot as plt

# Load data from the JSON file
with open('out.json', 'r') as file:
    data = [json.loads(line) for line in file]

# Extract the relevant data for each field
fields = ["BlockIO", "CPUPerc", "MemPerc", "NetIO"]
timestamps = range(len(data))

# plt.title(field + " over Time")

# Create line charts for each field
for field in fields:
    values = [float(item[field].split()[0]) for item in data]

    plt.figure(figsize=(12, 6))
    plt.plot(timestamps, values, marker='o', linestyle='-', color='b')
    plt.title(field + " over Time")
    plt.xlabel("Time")
    plt.ylabel(field)
    plt.grid(True)
    plt.show()