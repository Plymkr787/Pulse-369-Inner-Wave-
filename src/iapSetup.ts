import * as InAppPurchases from 'expo-in-app-purchases';

export async function initIAP() {
  try {
    await InAppPurchases.connectAsync();
    const items = await InAppPurchases.getProductsAsync([
      'weekly_subscription',
      'monthly_subscription',
      'yearly_subscription',
    ]);
    console.log('Available products:', items);
  } catch (e) {
    console.error('IAP initialization error:', e);
  }
}
