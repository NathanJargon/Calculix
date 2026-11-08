import mobileAds, {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

/**
 * AdMob Configuration
 * Uses Google TestIds during development (__DEV__) to prevent invalid traffic strikes.
 * In production release, uses the real unit ID provided by user.
 */
const PRODUCTION_INTERSTITIAL_ID = 'ca-app-pub-2584584826310566/5435737964';

export const AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : PRODUCTION_INTERSTITIAL_ID;

let interstitial: InterstitialAd | null = null;
let isLoaded = false;
let calculationCount = 0;
const CALCULATION_THRESHOLD = 3; // Show ad every 3 calculations to avoid user fatigue

/**
 * Initialize Mobile Ads SDK and pre-load the first interstitial
 */
export const initAdService = async (): Promise<void> => {
  try {
    await mobileAds().initialize();
    loadNextInterstitial();
  } catch (err) {
    console.warn('[AdService] Failed to initialize mobile ads:', err);
  }
};

/**
 * Pre-load the next interstitial ad
 */
const loadNextInterstitial = () => {
  try {
    isLoaded = false;
    interstitial = InterstitialAd.createForAdRequest(AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });

    interstitial.addAdEventListener(AdEventType.LOADED, () => {
      isLoaded = true;
    });

    interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      isLoaded = false;
      // Pre-load the next ad in the background
      loadNextInterstitial();
    });

    interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
      console.warn('[AdService] Interstitial failed to load:', error);
      isLoaded = false;
    });

    interstitial.load();
  } catch (err) {
    console.warn('[AdService] Error setting up interstitial:', err);
  }
};

/**
 * Records a calculation event and displays an interstitial ad if the threshold is met
 */
export const onCalculationCompleted = (): void => {
  calculationCount += 1;

  if (calculationCount >= CALCULATION_THRESHOLD) {
    if (isLoaded && interstitial) {
      try {
        interstitial.show();
        calculationCount = 0; // Reset counter after showing
      } catch (err) {
        console.warn('[AdService] Failed to display interstitial:', err);
      }
    }
  }
};

