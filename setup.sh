#!/bin/bash

# Function to mimic a loading bar
loading_bar() {
    bar="###############################################################"
    barlength=${#bar}
    echo -n "["
    for ((i = 0 ; i <= $barlength ; i++)); do
        echo -n "#"
        sleep 0.05  # Adjust speed here
    done
    echo "]"
}

# Function to show loading bar with text
loading_with_text() {
    text="$1"
    echo -n "$text"
    loading_bar
    echo # New line after loading bar
}

echo
echo "Installing packages..."
loading_with_text "Progress: "
npm install

# Run tests
echo "Seeding default data..."
loading_with_text "Seeding data: "
sleep 2
echo "Syncing with remote Data Source"
npm run dev

sleep 2
echo
echo "You can now access the store and admin area."
echo

# Open localhost:3000 in the default browser
# For macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
  open http://localhost:5173
# For Linux
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  xdg-open http://localhost:5173
# For Windows (Git Bash)
elif [[ "$OSTYPE" == "msys" ]]; then
  start http://localhost:5173
else
  echo "Unsupported OS"
fi
