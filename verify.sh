#!/bin/bash

# Ethara Application Test Verification Script

echo "🧪 Ethara Application Test Suite"
echo "=================================="

# Test backend structure
echo -e "\n✓ Checking backend structure..."
BACKEND_FILES=(
  "backend/src/server.js"
  "backend/src/models/User.js"
  "backend/src/models/Project.js"
  "backend/src/models/Task.js"
  "backend/src/controllers/authController.js"
  "backend/src/controllers/projectController.js"
  "backend/src/controllers/taskController.js"
  "backend/src/routes/auth.js"
  "backend/src/routes/projects.js"
  "backend/src/routes/tasks.js"
  "backend/src/middleware/auth.js"
  "backend/package.json"
)

for file in "${BACKEND_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ✗ $file - MISSING"
  fi
done

# Test frontend structure
echo -e "\n✓ Checking frontend structure..."
FRONTEND_FILES=(
  "frontend/src/main.jsx"
  "frontend/src/App.jsx"
  "frontend/src/pages/LoginPage.jsx"
  "frontend/src/pages/SignupPage.jsx"
  "frontend/src/pages/DashboardPage.jsx"
  "frontend/src/pages/ProjectsPage.jsx"
  "frontend/src/pages/ProjectDetailPage.jsx"
  "frontend/src/services/api.js"
  "frontend/src/services/AuthContext.jsx"
  "frontend/package.json"
  "frontend/vite.config.js"
  "frontend/index.html"
)

for file in "${FRONTEND_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ✗ $file - MISSING"
  fi
done

# Test configuration files
echo -e "\n✓ Checking configuration files..."
CONFIG_FILES=(
  "README.md"
  "QUICKSTART.md"
  "RAILWAY_DEPLOYMENT.md"
  "backend/.env.example"
  "backend/package.json"
  "frontend/.env.example"
  "frontend/package.json"
  ".gitignore"
)

for file in "${CONFIG_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ✗ $file - MISSING"
  fi
done

# Check dependencies
echo -e "\n✓ Checking dependencies..."

echo "  Backend dependencies:"
if [ -d "backend/node_modules" ]; then
  BACKEND_DEPS=$(ls backend/node_modules | wc -l)
  echo "    ✓ Installed ($BACKEND_DEPS packages)"
else
  echo "    ✗ Not installed"
fi

echo "  Frontend dependencies:"
if [ -d "frontend/node_modules" ]; then
  FRONTEND_DEPS=$(ls frontend/node_modules | wc -l)
  echo "    ✓ Installed ($FRONTEND_DEPS packages)"
else
  echo "    ✗ Not installed"
fi

echo -e "\n✅ Test verification complete!"
echo -e "\nNext steps:"
echo "1. Review README.md for API documentation"
echo "2. Follow QUICKSTART.md to start development"
echo "3. Check RAILWAY_DEPLOYMENT.md for deployment guide"
