# Chat Feature Deployment Guide

## Prerequisites
- Firebase Realtime Database enabled in Firebase Console ✅ (You've done this)

## Required Steps

### 1. Deploy Realtime Database Security Rules

You need to deploy the security rules to Firebase to secure your chat data.

```bash
cd /mnt/e/pocketDM/pocketDM
firebase deploy --only database
```

**What these rules do:**
- Allow only authenticated users to read/write messages
- Ensure users can only write messages with their own `userId` (prevents impersonation)
- Validate message structure (required fields)
- Enforce 500 character limit on messages
- Ensure `campaignId` matches the path
- Require server timestamp (prevents time manipulation)

### 2. Verify Database URL in Firebase Config

The database URL is already configured in `src/lib/firebase/config.ts`:
```typescript
databaseURL: "https://lore-weaver-rt9pc-default-rtdb.firebaseio.com"
```

This should match your Firebase project. If it doesn't:
1. Go to Firebase Console → Realtime Database
2. Copy the database URL (shown at the top)
3. Update the `databaseURL` in `config.ts`

### 3. Test Locally (Optional)

If you want to test with the Firebase Emulator:

```bash
# Start emulators
firebase emulators:start

# In .env.local, add:
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true

# Run dev server
npm run dev
```

The Realtime Database emulator runs on port 9000.

### 4. Deploy to Production

After deploying the rules, just deploy your Next.js app as usual:

```bash
npm run build
# Then deploy to your hosting (Firebase Hosting, Vercel, etc.)
```

## How It Works

### Data Structure
```
/campaigns
  /{campaignId}
    /messages
      /{messageId}
        - campaignId: string
        - userId: string
        - userName: string
        - characterName: string | null
        - text: string (max 500 chars)
        - timestamp: number (server timestamp)
```

### Security
- Users can only send messages with their own authenticated `userId`
- Messages are scoped to campaigns
- All messages require authentication
- Character limit enforced at both client and database level

### Performance
- Uses Firebase Realtime Database for instant message delivery (faster than Firestore)
- Fetches last 100 messages by default (configurable)
- Real-time listeners automatically update all connected clients
- Unread count only fetches last 50 messages for efficiency

## Verification

After deploying the rules, verify they're active:

1. Go to Firebase Console → Realtime Database → Rules
2. You should see the rules from `database.rules.json`
3. The rules should show as "Published"

## Troubleshooting

### "Permission Denied" errors
- Ensure Firebase Auth is working (users are logged in)
- Verify rules are deployed: `firebase deploy --only database`
- Check that `auth.uid` matches the `userId` in messages

### Messages not appearing in real-time
- Check browser console for WebSocket connection errors
- Verify database URL is correct in `config.ts`
- Ensure users are in the same campaign

### Unread count not working
- Check localStorage is enabled in browser
- Verify timestamps are being set correctly
- Check that `userId` matches current user

## Optional: Index Configuration

For better performance with large message histories, you can add an index:

In Firebase Console → Realtime Database → Indexes, add:
```json
{
  "rules": {
    "campaigns": {
      "$campaignId": {
        "messages": {
          ".indexOn": ["timestamp"]
        }
      }
    }
  }
}
```

This is automatically handled by the `orderByChild('timestamp')` query, but Firebase may suggest creating an index for better performance.
