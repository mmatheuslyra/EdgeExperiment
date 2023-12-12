import subprocess
import multiprocessing
import time

# Define the Docker Compose build command
docker_compose_build_command = 'docker-compose build'

# Define the Docker Compose up command
docker_compose_up_command = 'docker-compose up -d'

# Define the watch command to run docker stats and append the output to a file
watch_command = 'watch -n 3 \'docker stats --no-stream --format "{{ json . }}" >> output.json\''

# Function to build the emulator containers
def build_emulator():
    # Execute the Docker Compose build command
    try:
        subprocess.call(docker_compose_build_command, shell=True)
    except Exception as e:
        print("Error while running 'docker-compose up -d': " + str(e))

# Function to start the emulator containers
def start_emulator():
    # Execute the Docker Compose up command
    try:
        subprocess.call(docker_compose_up_command, shell=True)
    except Exception as e:
        print("Error while running 'docker-compose up -d': " + str(e))

def watch_emulator():
    # Execute the watch command using subprocess
    try:
        subprocess.call(watch_command, shell=True)
    except KeyboardInterrupt:
        print("Watch command terminated by the user")

# Function to stop the emulator containers
def stop_emulator():
    try:
        subprocess.call('docker-compose down', shell=True)
        print("Containers stopped.")
    except Exception as e:
        print(f"Error: {str(e)}")

# Function to start realtime charts from the emulator containers readings
def chart_general_emulator():
    try:
        subprocess.call('python3 monit_general.py', shell=True)
    except Exception as e:
        print(f"Error: {str(e)}")

# Function to start realtime charts from the emulator containers readings
def chart_emulator():
    try:
        subprocess.call('python3 network_monit_1.py', shell=True)
    except Exception as e:
        print(f"Error: {str(e)}")

# Function to start realtime charts from the emulator containers readings
def chart_emulator_splited():
    try:
        subprocess.call('python3 network_monit_2.py', shell=True)
    except Exception as e:
        print(f"Error: {str(e)}")

# Function to generate CPU load
def generate_cpu_load(duration):
    end_time = time.time() + duration
    while time.time() < end_time:
        # Perform some CPU-bound computation
        result = 0
        for _ in range(10**6):
            result += 1

# Function to start CPU load generator
def start_cpu_load_generator():
    try:
        num_processes = int(input("Number of processes: "))
        load_duration = int(input("Duration in seconds: "))
    except ValueError:
        print("Invalid input.")

    try:
        # num_processes = 4  # You can adjust the number of processes
        # load_duration = 60  # Duration in seconds

        print("Starting CPU load generator...")

        with multiprocessing.Pool(processes=num_processes) as pool:
            # Use pool.map to pass a single argument to the function
            pool.map(generate_cpu_load, [load_duration] * num_processes)

        print(f"CPU load generation completed for {load_duration} seconds.")
    except Exception as e:
        print(f"Error: {str(e)}")

def estimate_mips(cpu_utilization_percentage):
    import multiprocessing

    # Replace these values with your actual processor specifications
    clock_speed_ghz = 3.0  # Replace with your processor's clock speed in GHz
    num_cores = multiprocessing.cpu_count()  # Number of CPU cores

    # Assume a certain number of instructions per cycle (IPC)
    # This value might vary based on the architecture; a common estimate is 4.
    instructions_per_cycle = 4

    # Calculate MIPS based on CPU utilization percentage
    mips_value = (clock_speed_ghz * 1e9) * num_cores * instructions_per_cycle * (cpu_utilization_percentage / 100) / 1_000_000

    return mips_value

def mips():
    # Get the informed CPU utilization percentage from the user
    cpu_utilization_percentage = float(input("Enter the informed CPU utilization percentage: "))

    # Validate that the percentage is in the valid range [0, 100]
    if 0 <= cpu_utilization_percentage <= 100:
        estimated_mips = estimate_mips(cpu_utilization_percentage)
        print(f"Estimated MIPS for your machine at {cpu_utilization_percentage}% CPU utilization: {estimated_mips:.2f}")
    else:
        print("Error: CPU utilization percentage should be in the range [0, 100].")


if __name__ == '__main__':
    while True:
        # Main menu
        print("\n\n")
        print("------------------------------------------------------------------------------------------------")
        print("Emulator Control Menu:")
        print("1. Build Emulator - Build all docker containers")
        print("2. Start Emulator - Start all containers in the background")
        print("3. Watch Emulator - Start monitoring resource consumption")
        print("4. Stop Emulator - Kill all the emulator docker containers")
        print("5. Chart General Emulator - Start realtime charts from resource consumption in the machine")
        print("6. Chart Emulator Network I/O - Start realtime charts from resource consumption in the machine")
        print("7. Chart Emulator Network I/O Splited - Start realtime charts from the emulator containers readings")
        print("8. CPU Load Generator (Run in a different terminal)")
        print("9. Estimated MIPS for your machine (docker shares)")
        print("11. Exit")
        print("------------------------------------------------------------------------------------------------")

        try:
            choice = int(input("Enter your choice: "))
        except ValueError:
            print("Invalid input. Please enter a number (1, 2, or 3).")
            continue

        if choice == 1:
            build_emulator()
        if choice == 2:
            start_emulator()
        if choice == 3:
            watch_emulator()
        elif choice == 4:
            stop_emulator()
        elif choice == 5:
            chart_general_emulator()
        elif choice == 6:
            chart_emulator()
        elif choice == 7:
            chart_emulator_splited()
        elif choice == 8:
            start_cpu_load_generator()
        elif choice == 9:
            mips()
        elif choice == 11:
            break
        else:
            print("Invalid choice. Please enter a valid option (1, 2, or 3).")
