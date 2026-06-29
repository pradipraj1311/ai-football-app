import { registerRootComponent } from 'expo';
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';
import App from './App';

// Set up the background message handler for Firebase Cloud Messaging.
// This must be called outside of the component lifecycle, at the app's entry point.
try {
  const messagingInstance = getMessaging();
  setBackgroundMessageHandler(messagingInstance, async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
} catch (e) {
  console.warn('Firebase messaging not available, skipping background handler setup:', e?.message);
}

// Register the root component. This must be the last line to ensure the
// app boots correctly.
registerRootComponent(App);