/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import { NewAppScreen } from '@react-native/new-app-screen';
import { 
  StatusBar, 
  StyleSheet, 
  useColorScheme, 
  View, 
  TouchableOpacity, 
  Text,
  SafeAreaView,
  Alert
} from 'react-native';
import { OneTrustService, ConsentPreferences, OneTrustConfig } from './src/utils/onetrust';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [consentPreferences, setConsentPreferences] = useState<ConsentPreferences | null>(null);

  useEffect(() => {
    initializeOneTrust();
  }, []);

  const initializeOneTrust = async () => {
    try {
      await OneTrustService.getInstance().initialize();
      await loadConsentPreferences();
    } catch (error) {
      console.error('OneTrust initialization failed:', error);
      await loadConsentPreferences();
    }
  };

  const loadConsentPreferences = async () => {
    try {
      const oneTrustService = OneTrustService.getInstance();
      const status = await oneTrustService.getConsentStatus();
      setConsentPreferences(status.consentPreferences);
    } catch (error) {
      setConsentPreferences(null);
    }
  };

  const handleShowConsentBanner = async () => {
    try {
      const oneTrustService = OneTrustService.getInstance();
      await oneTrustService.showConsentBanner();
    } catch (error) {
      Alert.alert('Error', 'Failed to show consent banner.');
    }
  };

  const handleShowConsentPreferences = async () => {
    try {
      const oneTrustService = OneTrustService.getInstance();
      await oneTrustService.showConsentPreferences();
    } catch (error) {
      Alert.alert('Error', 'Failed to show consent preferences.');
    }
  };

  const handleResetConsent = async () => {
    Alert.alert(
      'Reset Consent',
      'Are you sure you want to reset all consent preferences? This will require you to provide consent again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              const oneTrustService = OneTrustService.getInstance();
              await oneTrustService.resetConsent();
              
              // Reload consent status
              const status = await oneTrustService.getConsentStatus();
              setConsentPreferences(status.consentPreferences);
              
              Alert.alert('Success', 'Consent preferences have been reset.');
            } catch (error) {
              Alert.alert('Error', 'Failed to reset consent preferences.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>OneTrust Consent Demo</Text>
        <Text style={styles.headerSubtitle}>Using OneTrust Default UI</Text>
      </View>

      <View style={styles.content}>
        
        <View style={styles.consentSection}>
          <Text style={styles.sectionTitle}>OneTrust Consent Management</Text>
          
          <View style={styles.consentStatus}>
            <Text style={styles.statusTitle}>Current Consent Status</Text>
            {consentPreferences ? (
              <>
                <View style={styles.statusItem}>
                  <Text style={styles.statusLabel}>Necessary Cookies:</Text>
                  <Text style={[styles.statusValue, { color: consentPreferences.necessary ? '#34C759' : '#FF3B30' }]}>
                    {consentPreferences.necessary ? '✅ Allowed' : '❌ Denied'}
                  </Text>
                </View>
                <View style={styles.statusItem}>
                  <Text style={styles.statusLabel}>Analytics Cookies:</Text>
                  <Text style={[styles.statusValue, { color: consentPreferences.analytics ? '#34C759' : '#FF3B30' }]}>
                    {consentPreferences.analytics ? '✅ Allowed' : '❌ Denied'}
                  </Text>
                </View>
                <View style={styles.statusItem}>
                  <Text style={styles.statusLabel}>Marketing Cookies:</Text>
                  <Text style={[styles.statusValue, { color: consentPreferences.marketing ? '#34C759' : '#FF3B30' }]}>
                    {consentPreferences.marketing ? '✅ Allowed' : '❌ Denied'}
                  </Text>
                </View>
                <View style={styles.statusItem}>
                  <Text style={styles.statusLabel}>Preference Cookies:</Text>
                  <Text style={[styles.statusValue, { color: consentPreferences.preferences ? '#34C759' : '#FF3B30' }]}>
                    {consentPreferences.preferences ? '✅ Allowed' : '❌ Denied'}
                  </Text>
                </View>
              </>
            ) : (
              <Text style={styles.statusValue}>Loading consent status...</Text>
            )}
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleShowConsentBanner}
            >
              <Text style={styles.buttonText}>Show Consent Banner</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleShowConsentPreferences}
            >
              <Text style={styles.buttonText}>Show Preferences</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.dangerButton]}
              onPress={handleResetConsent}
            >
              <Text style={styles.buttonText}>Reset Consent</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>OneTrust Configuration</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Domain ID:</Text>
            <Text style={styles.infoValue}>{OneTrustConfig.domainId}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>App ID:</Text>
            <Text style={styles.infoValue}>{OneTrustConfig.appId}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Region:</Text>
            <Text style={styles.infoValue}>{OneTrustConfig.region}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Language:</Text>
            <Text style={styles.infoValue}>{OneTrustConfig.language}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  consentSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 15,
    textAlign: 'center',
  },
  consentStatus: {
    marginBottom: 20,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 10,
    textAlign: 'center',
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  statusLabel: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  infoValue: {
    fontSize: 12,
    color: '#333333',
    flex: 2,
    textAlign: 'right',
    fontFamily: 'monospace',
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#34C759',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;
