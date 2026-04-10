# Voice Assistant Troubleshooting Guide

## Issue: Voice Assistant Not Working on Another Laptop

### Quick Checklist

- [ ] Browser supports Web Speech API (Chrome/Edge recommended)
- [ ] Microphone permission granted
- [ ] Accessing via localhost or HTTPS
- [ ] Microphone hardware working
- [ ] No browser extensions blocking microphone

---

## Solution Steps

### 1. Check Browser Compatibility

**Recommended Browsers:**

- ✅ Google Chrome (Best support)
- ✅ Microsoft Edge (Best support)
- ⚠️ Safari (Limited support)
- ❌ Firefox (Not recommended - limited support)

**How to Check:**
Open browser console (F12) and type:

```javascript
console.log(
  "SpeechRecognition" in window || "webkitSpeechRecognition" in window,
);
```

If it returns `true`, the browser supports it.

---

### 2. Grant Microphone Permission

#### Chrome/Edge:

1. Click the microphone icon in the address bar (left side)
2. Select "Always allow http://localhost:3000 to access your microphone"
3. Click "Done"
4. Refresh the page (F5)

#### If No Prompt Appears:

1. Go to `chrome://settings/content/microphone`
2. Check if localhost is in the "Block" list
3. Remove it from block list
4. Add to "Allow" list if needed
5. Refresh the page

---

### 3. Check URL Access Method

**✅ CORRECT Ways:**

- `http://localhost:3000`
- `http://127.0.0.1:3000`
- `https://yourdomain.com` (if deployed)

**❌ INCORRECT Ways:**

- `http://192.168.x.x:3000` (IP address without HTTPS)
- `http://your-computer-name:3000`

**Why?** Web Speech API requires secure context (HTTPS) except for localhost.

**Solution for IP Access:**
If you need to access via IP address, you must use HTTPS:

1. Generate SSL certificate
2. Configure React to use HTTPS
3. Or use localhost/127.0.0.1 instead

---

### 4. Verify Microphone Hardware

#### Windows:

1. Right-click speaker icon in taskbar
2. Select "Sound settings"
3. Go to "Input" section
4. Test your microphone
5. Ensure it's not muted
6. Check volume level (should be 80-100%)

#### Test Microphone:

1. Open Windows Voice Recorder app
2. Try recording
3. If it works there, issue is browser-related

---

### 5. Check Browser Microphone Settings

#### Chrome Settings:

1. Open Chrome
2. Go to `chrome://settings/content/microphone`
3. Ensure "Sites can ask to use your microphone" is ON
4. Check "Allowed" list - localhost should be there
5. Check "Blocked" list - remove localhost if present
6. Select correct microphone from dropdown

---

### 6. Clear Browser Cache & Permissions

Sometimes old permissions cause issues:

1. Open Chrome Settings
2. Go to Privacy and Security > Site Settings
3. Click "View permissions and data stored across sites"
4. Search for "localhost"
5. Click trash icon to clear all data
6. Restart browser
7. Visit app again and grant permission fresh

---

### 7. Disable Browser Extensions

Some extensions block microphone access:

1. Open Chrome
2. Go to `chrome://extensions`
3. Disable all extensions temporarily
4. Test voice assistant
5. If it works, enable extensions one by one to find culprit

---

### 8. Check Antivirus/Firewall

Some security software blocks microphone:

1. Check antivirus settings
2. Look for "Microphone Protection" or "Privacy Protection"
3. Add Chrome/Edge to allowed apps
4. Temporarily disable to test

---

### 9. Update Browser

Ensure browser is up to date:

1. Chrome: `chrome://settings/help`
2. Edge: `edge://settings/help`
3. Update if available
4. Restart browser

---

### 10. Test with Simple Code

Create a test HTML file to verify Web Speech API:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Mic Test</title>
  </head>
  <body>
    <button onclick="startListening()">Start Listening</button>
    <p id="result"></p>

    <script>
      function startListening() {
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
          alert("Speech Recognition not supported in this browser");
          return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          document.getElementById("result").textContent = transcript;
        };

        recognition.onerror = (event) => {
          alert("Error: " + event.error);
        };

        recognition.start();
      }
    </script>
  </body>
</html>
```

Save as `mic-test.html` and open in browser. If this doesn't work, it's a system/browser issue, not your app.

---

## Common Error Messages

### "not-allowed"

- **Cause:** Microphone permission denied
- **Solution:** Grant permission in browser settings

### "no-speech"

- **Cause:** No speech detected
- **Solution:** Check microphone volume, speak louder

### "audio-capture"

- **Cause:** Microphone not available
- **Solution:** Check if another app is using microphone

### "network"

- **Cause:** Network issue (Speech API uses Google servers)
- **Solution:** Check internet connection

### "not-supported"

- **Cause:** Browser doesn't support Web Speech API
- **Solution:** Use Chrome or Edge

---

## For Development Team

### Add Error Handling in VoiceAssistant.jsx

Add this to help users understand issues:

```javascript
recognition.onerror = (event) => {
  console.error("Speech recognition error:", event.error);

  let errorMessage = "";
  switch (event.error) {
    case "not-allowed":
      errorMessage =
        "Microphone permission denied. Please allow microphone access in browser settings.";
      break;
    case "no-speech":
      errorMessage = "No speech detected. Please try again.";
      break;
    case "audio-capture":
      errorMessage =
        "Microphone not available. Check if another app is using it.";
      break;
    case "network":
      errorMessage = "Network error. Check your internet connection.";
      break;
    default:
      errorMessage = `Error: ${event.error}`;
  }

  setFeedback(errorMessage);
  setIsListening(false);
};
```

---

## Quick Fix Commands

### Check if running on localhost:

```bash
# In browser console
console.log(window.location.hostname);
// Should show: "localhost" or "127.0.0.1"
```

### Check microphone permission:

```bash
# In browser console
navigator.permissions.query({name: 'microphone'}).then(result => {
  console.log('Microphone permission:', result.state);
});
// Should show: "granted", "denied", or "prompt"
```

---

## Still Not Working?

1. **Restart Computer** - Sometimes helps with driver issues
2. **Try Different Browser** - Test in Chrome if using Edge, or vice versa
3. **Check Windows Privacy Settings:**
   - Settings > Privacy > Microphone
   - Ensure "Allow apps to access your microphone" is ON
   - Ensure "Allow desktop apps to access your microphone" is ON
4. **Update Audio Drivers** - Check Device Manager
5. **Test on Different Laptop** - Verify it's not a hardware issue

---

## Contact Support

If none of these solutions work, provide:

- Browser name and version
- Operating system
- Error message from browser console (F12)
- Screenshot of microphone settings
- Result of mic-test.html

---

## Prevention

To avoid this issue in future:

1. Always use Chrome or Edge
2. Access via localhost, not IP address
3. Grant microphone permission when prompted
4. Keep browser updated
5. Document setup steps for team members
