#!/bin/bash

npm run dev &  # Run pnpm dev in the background

# Check if the server started successfully
if [ $? -ne 0 ]; then
  echo "Failed to start the server."
  exit 1
fi

# Wait a few seconds to ensure the server starts
sleep 2
echo #
echo "Spinning up"
echo #

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
