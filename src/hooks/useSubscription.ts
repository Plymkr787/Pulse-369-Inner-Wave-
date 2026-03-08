import { useState, useCallback } from 'react';
import { useAppStore } from '@store/appStore';
import { SubscriptionTier } from '@types';
import { SUBSCRIPTION_TIERS } from '@constants';
import * as InAppPurchases from 'expo-in-app-purchases';

const PREMIUM_PRODUCT_ID = 'pulse369_premium_monthly';

export const useSubscription = () => {
  const store = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkSubscriptionStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      
      await InAppPurchases.connectAsync();
      const { responseCode, results } = await InAppPurchases.getPurchaseHistoryAsync();
      
      if (responseCode === InAppPurchases.IAPResponseCode.OK && results) {
        const premiumPurchase = results.find(
          purchase => purchase.productId === PREMIUM_PRODUCT_ID && !purchase.acknowledged
        );
        
        if (premiumPurchase) {
          store.setSubscriptionTier('premium');
          const expiresDate = new Date();
          expiresDate.setMonth(expiresDate.getMonth() + 1);
          
          await InAppPurchases.finishTransactionAsync(premiumPurchase, true);
        }
      }
      
      await InAppPurchases.disconnectAsync();
    } catch (err) {
      console.error('Subscription check error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const purchasePremium = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      await InAppPurchases.connectAsync();
      
      const { responseCode, results } = await InAppPurchases.getProductsAsync([PREMIUM_PRODUCT_ID]);
      
      if (responseCode !== InAppPurchases.IAPResponseCode.OK || !results?.length) {
        setError('Premium subscription not available at this time.');
        return false;
      }

      const { responseCode: purchaseCode, results: purchaseResults } = 
        await InAppPurchases.purchaseItemAsync(PREMIUM_PRODUCT_ID);

      if (purchaseCode === InAppPurchases.IAPResponseCode.OK && purchaseResults) {
        const purchase = purchaseResults[0];
        
        if (purchase.productId === PREMIUM_PRODUCT_ID) {
          store.setSubscriptionTier('premium');
          const expiresDate = new Date();
          expiresDate.setMonth(expiresDate.getMonth() + 1);
          
          await InAppPurchases.finishTransactionAsync(purchase, true);
          
          return true;
        }
      }

      return false;
    } catch (err: any) {
      if (err.message?.includes('cancelled')) {
        setError('Purchase was cancelled.');
      } else {
        setError('Purchase failed. Please try again.');
      }
      return false;
    } finally {
      setIsLoading(false);
      await InAppPurchases.disconnectAsync();
    }
  }, []);

  const restorePurchases = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      await InAppPurchases.connectAsync();
      const { responseCode, results } = await InAppPurchases.getPurchaseHistoryAsync();

      if (responseCode === InAppPurchases.IAPResponseCode.OK && results) {
        const premiumPurchase = results.find(p => p.productId === PREMIUM_PRODUCT_ID);
        
        if (premiumPurchase) {
          store.setSubscriptionTier('premium');
          return true;
        }
      }

      setError('No previous purchases found.');
      return false;
    } catch (err) {
      setError('Failed to restore purchases.');
      return false;
    } finally {
      setIsLoading(false);
      await InAppPurchases.disconnectAsync();
    }
  }, []);

  const isPremium = store.subscriptionTier === 'premium';
  const canUsePremiumFeature = store.canUsePremiumFeature();

  return {
    subscriptionTier: store.subscriptionTier,
    isPremium,
    canUsePremiumFeature,
    isLoading,
    error,
    subscriptionConfig: SUBSCRIPTION_TIERS[store.subscriptionTier],
    checkSubscriptionStatus,
    purchasePremium,
    restorePurchases
  };
};

export default useSubscription;
