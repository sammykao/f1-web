# Spotify API Setup Instructions

This guide will help you set up your Spotify API credentials and obtain a refresh token for the website's Spotify integration.

## 1. Create a Spotify Developer Application

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create App"
4. Fill in the application details:
   - App name: (e.g., "My Portfolio Website")
   - App description: (e.g., "Personal website displaying my Spotify listening history")
   - Redirect URI: `https://miahall.vercel.app`
   - Website: Your website URL (optional)
5. Accept the terms and conditions
6. Click "Create"

## 2. Get Client ID and Client Secret

1. Once your app is created, you'll be taken to the app's dashboard
2. Note down your **Client ID**
3. Click "View client secret" and note down your **Client Secret**
4. Add these to your `.env.local` file:
   ```
   SPOTIFY_CLIENT_ID=your_client_id_here
   SPOTIFY_CLIENT_SECRET=your_client_secret_here
   ```

## 3. Configure App Settings

1. In your app's dashboard, click "Edit Settings"
2. Under "Redirect URIs", add: `https://miahall.vercel.app`
3. Save the changes

## 4. Get Authorization Code

1. Replace YOUR_CLIENT_ID in this URL:
   ```
   https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=https://miahall.vercel.app&scope=user-read-recently-played%20user-top-read
   ```
2. Open the URL in your browser
3. Log in with your Spotify account and authorize the application
4. You'll be redirected to your redirect URI with a code parameter
5. Copy the code from the URL (everything after `code=`)
   - The code will be very long (around 170 characters)
   - Make sure you copy the ENTIRE code, not cutting off any characters
   - The code can only be used once and expires quickly

## 5. Get Refresh Token

1. Open PowerShell (since you're on Windows)

2. Create the base64 string:
   ```powershell
   [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes("your_client_id:your_client_secret"))
   ```
   - Replace the entire string inside GetBytes() with your actual client_id:client_secret
   - Include the colon : between them
   - Do NOT include any quotes or spaces
   - Example format: `abc123:xyz789` (but with your actual credentials)

3. Make the token request:
   ```powershell
   $headers = @{
       "Content-Type" = "application/x-www-form-urlencoded"
       "Authorization" = "Basic YOUR_BASE64_STRING"
   }
   
   $body = "grant_type=authorization_code&code=YOUR_AUTH_CODE&redirect_uri=https://miahall.vercel.app"
   
   Invoke-RestMethod -Uri "https://accounts.spotify.com/api/token" -Method Post -Headers $headers -Body $body
   ```
   
   Replace:
   - `YOUR_BASE64_STRING` with the output from step 2
   - `YOUR_AUTH_CODE` with the code from step 4

4. From the response, copy the `refresh_token` value
5. Add it to your `.env.local` file:
   ```
   SPOTIFY_REFRESH_TOKEN=your_refresh_token_here
   ```

## Troubleshooting "Invalid Client" Error

If you get an "invalid client" error, it's usually because of one of these issues:

1. **Incorrect Base64 Encoding**
   - The base64 string should be created from `client_id:client_secret`
   - Common mistakes:
     - Including quotes: ❌ `"client_id:client_secret"` 
     - Including spaces: ❌ `client_id : client_secret`
     - Missing colon: ❌ `client_idclient_secret`
     - Correct format: ✅ `client_id:client_secret`

2. **Wrong Credentials**
   - Double-check your client ID and secret in the Spotify Dashboard
   - Make sure you're copying the entire secret
   - The client secret should be about 32 characters long
   - Try clicking "View Client Secret" again to verify

3. **Authorization Header Format**
   - The header should be exactly: `Authorization: Basic YOUR_BASE64_STRING`
   - Common mistakes:
     - Missing the word "Basic"
     - Extra spaces
     - Line breaks in the base64 string

4. **Still Not Working?**
   - Reset your client secret in the Spotify Dashboard
   - Get a fresh authorization code (the old one might have expired)
   - Try the process in a new PowerShell window
   - Make sure you're using the correct redirect URI everywhere

## Notes

- The refresh token doesn't expire unless you explicitly revoke access
- Keep your client ID, client secret, and refresh token secure
- If you need to generate a new refresh token, repeat steps 4 and 5
- Make sure your `.env.local` file is in your `.gitignore` to keep your credentials secure

## Troubleshooting

If you get errors:
1. Make sure all credentials in `.env.local` are correct
2. Verify the redirect URI matches exactly in both the app settings and authorization URL
3. Check that you've granted all required scopes (`user-read-recently-played` and `user-top-read`)
4. Try generating a new refresh token if the current one isn't working 