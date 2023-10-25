import subprocess

#to run this script use "python3 run.py"

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
        subprocess.call('python3 network_monit_2.py', shell=True)
    except Exception as e:
        print(f"Error: {str(e)}")

while True:
    # Main menu
    print("Emulator Control Menu:")
    print("1. Build Emulator - Build all docker containers")
    print("2. Start Emulator - Start all containers in background")
    print("3. Watch Emulator - Star monitoring resurce consumption")
    print("4. Stop Emulator - kill all the emulator docker containers")
    print("5. Chart General Emulator - start realtime charts from resource consumption in the machine")
    print("6. Chart Emulator - start realtime charts from the emulator containers readings")
    print("7. Exit")

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
        break
    else:
        print("Invalid choice. Please enter a valid option (1, 2, or 3).")
