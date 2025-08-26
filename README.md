# OneTrust POC - Simplified Testing

This project demonstrates a simplified OneTrust implementation for React Native, focusing on core consent management functionality using OneTrust's default UI components.

## 🚀 Quick Start

### Prerequisites
- React Native project with OneTrust SDK installed
- OneTrust account with test domain and app ID

### Installation
```bash
npm install react-native-onetrust-cmp
# or
yarn add react-native-onetrust-cmp
```

### Configuration
Update `src/config/OneTrustConfig.ts` with your OneTrust credentials:
```typescript
export const OneTrustConfig = {
  domainId: 'https://cdn.cookielaw.org/consent/YOUR_DOMAIN_ID',
  appId: 'YOUR_APP_ID',
  region: 'EU', // or 'US', 'APAC'
  language: 'en',
  categories: {
    necessary: 'C0001',
    analytics: 'C0002',
    marketing: 'C0003',
    preferences: 'C0004',
  }
};
```

## 🧪 Testing OneTrust

### Basic Usage
```typescript
import OneTrustService from './src/services/OneTrustService';

const oneTrust = OneTrustService.getInstance();

// Initialize OneTrust
await oneTrust.initialize();

// Check consent status
const isRequired = await oneTrust.isConsentRequired();
const hasConsent = await oneTrust.hasConsent();

// Get consent preferences
const preferences = await oneTrust.getConsentPreferences();

// Show OneTrust's default consent banner
await oneTrust.showConsentBanner();

// Show OneTrust's default preferences screen
await oneTrust.showConsentPreferences();

// Update preferences
await oneTrust.updateConsentPreferences({
  necessary: true,
  analytics: true,
  marketing: false,
  preferences: true
});
```

## 📱 Core Features

- **SDK Initialization**: Simple OneTrust SDK setup
- **Consent Management**: Check, update, and reset consent preferences
- **Default UI Components**: Use OneTrust's built-in consent banner and preferences screen
- **Category Support**: Handle different cookie categories (necessary, analytics, marketing, preferences)

## 🔧 API Reference

### OneTrustService Methods

| Method | Description |
|--------|-------------|
| `initialize()` | Initialize OneTrust SDK |
| `isConsentRequired()` | Check if consent is required |
| `hasConsent()` | Check if user has provided consent |
| `getConsentPreferences()` | Get current consent preferences |
| `updateConsentPreferences()` | Update consent preferences |
| `showConsentBanner()` | Show OneTrust's default consent banner |
| `showConsentPreferences()` | Show OneTrust's default preferences screen |
| `resetConsent()` | Reset all consent preferences |
| `getConsentStatus()` | Get comprehensive consent status |

### Consent Preferences Interface
```typescript
interface ConsentPreferences {
  necessary: boolean;    // Always true
  analytics: boolean;    // Analytics cookies
  marketing: boolean;    // Marketing cookies
  preferences: boolean;  // Preference cookies
}
```

## 🎯 Testing Scenarios

1. **Basic Initialization**: Test SDK setup and configuration
2. **Consent Flow**: Test OneTrust's default banner display and user consent
3. **Preferences Management**: Test updating and retrieving consent preferences
4. **Reset Functionality**: Test consent reset and cleanup
5. **Error Handling**: Test behavior when OneTrust is unavailable

## 🎨 UI Components

This implementation uses OneTrust's default UI components:
- **Consent Banner**: `showConsentBanner()` displays OneTrust's standard consent banner
- **Preferences Screen**: `showConsentPreferences()` shows OneTrust's preferences management interface

No custom UI components are included, ensuring consistency with OneTrust's design and compliance standards.

## 🚨 Troubleshooting

### Common Issues
- **Module not found**: Ensure `react-native-onetrust-cmp` is properly installed
- **Initialization failed**: Check OneTrust credentials and network connectivity
- **Categories not found**: Verify category IDs in OneTrust configuration

### Debug Mode
Enable OneTrust logging:
```typescript
// Log levels: 0=Error, 1=Warning, 2=Info, 3=Debug
OTPublishersNativeSDK.enableOTSDKLog(3);
```

## 📚 Additional Resources

- [OneTrust Developer Documentation](https://developer.onetrust.com/)
- [React Native OneTrust CMP](https://github.com/OneTrust/OneTrust-CMP-React-Native)
- [Cookie Consent Best Practices](https://www.onetrust.com/blog/cookie-consent-best-practices/)

## 🤝 Contributing

This is a simplified implementation for testing purposes. For production use, refer to official OneTrust documentation and implement proper error handling and compliance features.
