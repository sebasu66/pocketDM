#!/bin/bash
# Start Firebase Emulators for local development

echo "========================================="
echo "FIREBASE EMULATORS - STARTING"
echo "========================================="
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found"
    echo ""
    echo "Install it with:"
    echo "  npm install -g firebase-tools"
    echo ""
    exit 1
fi

echo "✓ Firebase CLI found: $(firebase --version)"
echo ""

# Check if logged in
if ! firebase projects:list &> /dev/null; then
    echo "⚠️  Not logged in to Firebase"
    echo ""
    echo "Login with:"
    echo "  firebase login"
    echo ""
    exit 1
fi

echo "✓ Firebase authenticated"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found"
    echo ""
    echo "Creating .env.local from .env.example..."
    cp .env.example .env.local
    sed -i 's/NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false/NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true/' .env.local
    echo "✓ .env.local created with emulator enabled"
    echo ""
fi

# Start emulators
echo "========================================="
echo "STARTING EMULATORS"
echo "========================================="
echo ""
echo "Emulator UI: http://localhost:4000"
echo "Firestore:   localhost:8080"
echo "Auth:        localhost:9099"
echo ""
echo "Press Ctrl+C to stop"
echo ""

firebase emulators:start --import=./emulator-data --export-on-exit
