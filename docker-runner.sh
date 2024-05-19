#!/bin/bash

echo "Starting the backend server"

# Start the first process
cd /app/backend || exit
npm run dev &


echo "Starting the frontend server"

# Start the second process
cd /app/frontend || exit
ws --spa index.html --port 8000 --rewrite '/api/(.*) -> http://localhost:3000/$1' &

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?