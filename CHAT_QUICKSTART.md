# Chat Feature - Quick Start

## What You Need to Do

Since you've already enabled Firebase Realtime Database in the Firebase Console, you just need to **deploy the security rules**:

```bash
cd /mnt/e/pocketDM/pocketDM
firebase deploy --only database
```

That's it! The chat will work immediately after deploying the rules.

## What This Does

- Deploys security rules to protect your chat data
- Ensures only authenticated users can read/write messages
- Validates message format and prevents abuse
- Enforces 500 character limit

## Verify It Worked

1. Go to Firebase Console → Realtime Database → Rules
2. You should see the rules from `database.rules.json`
3. The rules tab should show "Published" status

## How to Use the Chat

- Click the chat icon (💬) in the bottom right of the dashboard or playerview
- Type a message and press Send
- Messages appear instantly for all users in the same campaign
- Red badge shows unread message count

## If Something Goes Wrong

See **CHAT_DEPLOYMENT.md** for detailed troubleshooting and configuration.
