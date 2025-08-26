import { OneTrustConfig } from './OneTrustConfig';
import OTPublishersNativeSDK from 'react-native-onetrust-cmp';

export interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export interface ConsentStatus {
  hasConsent: boolean;
  consentPreferences: ConsentPreferences;
}

class OneTrustService {
  private static instance: OneTrustService;
  private isInitialized: boolean = false;

  private constructor() { }

  public static getInstance(): OneTrustService {
    if (!OneTrustService.instance) {
      OneTrustService.instance = new OneTrustService();
    }
    return OneTrustService.instance;
  }

  /**
   * Initialize OneTrust SDK
   */
  public async initialize(): Promise<void> {
    try {
      if (this.isInitialized) {
        return;
      }

      if (!OTPublishersNativeSDK) {
        throw new Error('OneTrust native module is not available');
      }

      const params = {
        countryCode: OneTrustConfig.region,
        regionCode: OneTrustConfig.region
      };

      console.log('Initializing OneTrust SDK...');
      
      await OTPublishersNativeSDK.startSDK(
        OneTrustConfig.domainId,
        OneTrustConfig.appId,
        OneTrustConfig.language,
        params,
        true
      );

      // Enable logging
      if (typeof OTPublishersNativeSDK.enableOTSDKLog === 'function') {
        OTPublishersNativeSDK.enableOTSDKLog(3);
      }

      this.isInitialized = true;
      console.log('OneTrust SDK initialized successfully');
    } catch (error) {
      console.error('OneTrust SDK initialization failed:', error);
      throw error;
    }
  }

  /**
   * Check if consent is required
   */
  public async isConsentRequired(): Promise<boolean> {
    try {
      if (!OTPublishersNativeSDK) {
        return true;
      }
      return await OTPublishersNativeSDK.shouldShowBanner();
    } catch (error) {
      console.error('Error checking if consent is required:', error);
      return true;
    }
  }

  /**
   * Check if user has provided consent
   */
  public async hasConsent(): Promise<boolean> {
    try {
      if (!OTPublishersNativeSDK) {
        return false;
      }
      return !(await OTPublishersNativeSDK.shouldShowBanner());
    } catch (error) {
      console.error('Error checking consent status:', error);
      return false;
    }
  }

  /**
   * Get current consent preferences
   */
  public async getConsentPreferences(): Promise<ConsentPreferences> {
    try {
      if (!OTPublishersNativeSDK) {
        return this.getDefaultPreferences();
      }

      const analytics = await OTPublishersNativeSDK.getConsentStatusForCategory(OneTrustConfig.categories.analytics);
      const marketing = await OTPublishersNativeSDK.getConsentStatusForCategory(OneTrustConfig.categories.marketing);
      const preferences = await OTPublishersNativeSDK.getConsentStatusForCategory(OneTrustConfig.categories.preferences);

      return {
        necessary: true, // Necessary cookies are always enabled
        analytics: analytics === 1,
        marketing: marketing === 1,
        preferences: preferences === 1
      };
    } catch (error) {
      console.error('Error getting consent preferences:', error);
      return this.getDefaultPreferences();
    }
  }

  /**
   * Show consent banner
   */
  public async showConsentBanner(): Promise<void> {
    try {
      if (!OTPublishersNativeSDK) {
        console.log('OneTrust SDK not available');
        return;
      }
      await OTPublishersNativeSDK.showBannerUI({});
    } catch (error) {
      console.error('Error showing consent banner:', error);
    }
  }

  /**
   * Show consent preferences screen
   */
  public async showConsentPreferences(): Promise<void> {
    try {
      if (!OTPublishersNativeSDK) {
        console.log('OneTrust SDK not available');
        return;
      }
      await OTPublishersNativeSDK.showPreferenceCenterUI({});
    } catch (error) {
      console.error('Error showing consent preferences:', error);
    }
  }

  /**
   * Update consent preferences
   */
  public async updateConsentPreferences(preferences: ConsentPreferences): Promise<void> {
    try {
      if (!OTPublishersNativeSDK) {
        console.log('OneTrust SDK not available');
        return;
      }

      // Update consent for each category
      await OTPublishersNativeSDK.updatePurposeConsent(OneTrustConfig.categories.analytics, preferences.analytics);
      await OTPublishersNativeSDK.updatePurposeConsent(OneTrustConfig.categories.marketing, preferences.marketing);
      await OTPublishersNativeSDK.updatePurposeConsent(OneTrustConfig.categories.preferences, preferences.preferences);

      // Save consent
      const interactionType = this.determineInteractionType(preferences);
      await OTPublishersNativeSDK.saveConsent(interactionType);
      
      console.log('Consent preferences updated successfully');
    } catch (error) {
      console.error('Error updating consent preferences:', error);
      throw error;
    }
  }

  /**
   * Get comprehensive consent status
   */
  public async getConsentStatus(): Promise<ConsentStatus> {
    try {
      const preferences = await this.getConsentPreferences();
      const hasConsent = await this.hasConsent();

      return {
        hasConsent,
        consentPreferences: preferences
      };
    } catch (error) {
      console.error('Error getting consent status:', error);
      return {
        hasConsent: false,
        consentPreferences: this.getDefaultPreferences()
      };
    }
  }

  /**
   * Reset consent preferences
   */
  public async resetConsent(): Promise<void> {
    try {
      if (!OTPublishersNativeSDK) {
        console.log('OneTrust SDK not available');
        return;
      }

      await OTPublishersNativeSDK.resetUpdatedConsent();
      await OTPublishersNativeSDK.clearOTSDKData();
      console.log('Consent preferences reset successfully');
    } catch (error) {
      console.error('Error resetting consent:', error);
      throw error;
    }
  }

  /**
   * Get consent status for a specific category
   */
  public async getConsentStatusForCategory(categoryId: string): Promise<number> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      return await OTPublishersNativeSDK.getConsentStatusForCategory(categoryId);
    } catch (error) {
      console.error(`Error getting consent status for category ${categoryId}:`, error);
      return -1;
    }
  }

  /**
   * Get default consent preferences
   */
  private getDefaultPreferences(): ConsentPreferences {
    return {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
  }

  /**
   * Determine the appropriate consent interaction type
   */
  private determineInteractionType(preferences: ConsentPreferences): number {
    const hasAnalytics = preferences.analytics;
    const hasMarketing = preferences.marketing;
    const hasPreferences = preferences.preferences;

    if (hasAnalytics && hasMarketing && hasPreferences) {
      return 5; // preferenceCenterAllowAll
    } else if (!hasAnalytics && !hasMarketing && !hasPreferences) {
      return 6; // preferenceCenterRejectAll
    } else {
      return 7; // preferenceCenterConfirm
    }
  }
}

export default OneTrustService;
