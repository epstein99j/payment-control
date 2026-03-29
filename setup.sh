#!/bin/bash

# Payment Control Module - Setup & Deploy Script
# ================================================

set -e

echo "🚀 Payment Control Module - Setup & Deploy"
echo "==========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first:"
    echo "   https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo ""
    echo "📦 Installing Firebase CLI..."
    npm install -g firebase-tools
fi

echo "✅ Firebase CLI detected"
echo ""

# Install dependencies
echo "📦 Installing project dependencies..."
npm install

# Build the project
echo ""
echo "🔨 Building the project..."
npm run build

echo ""
echo "✅ Build complete! Output in ./dist"
echo ""

# Check if user is logged into Firebase
echo "🔐 Checking Firebase authentication..."
if ! firebase projects:list &> /dev/null; then
    echo ""
    echo "You need to log into Firebase. Opening browser..."
    firebase login
fi

echo ""
echo "=========================================="
echo "📋 NEXT STEPS:"
echo "=========================================="
echo ""
echo "1. Create a Firebase project (if you haven't):"
echo "   firebase projects:create payment-control-app"
echo ""
echo "2. Set your project ID:"
echo "   firebase use payment-control-app"
echo ""
echo "3. Deploy:"
echo "   firebase deploy"
echo ""
echo "Or run the quick deploy:"
echo "   npm run deploy"
echo ""
echo "=========================================="
