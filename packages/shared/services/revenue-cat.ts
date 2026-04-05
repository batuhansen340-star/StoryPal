import Purchases, {
  type CustomerInfo,
  type PurchasesPackage,
} from 'react-native-purchases';
import { Platform } from 'react-native';

const API_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? '';
const API_KEY_ANDROID = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? '';
const ENTITLEMENT_ID = 'test';

let isConfigured = false;

export async function configureRevenueCat(userId?: string) {
  if (isConfigured) return;

  const apiKey = Platform.OS === 'ios' ? API_KEY_IOS : API_KEY_ANDROID;
  if (!apiKey) return;

  Purchases.configure({
    apiKey,
    appUserID: userId ?? undefined,
  });
  isConfigured = true;
}

export async function checkSubscriptionStatus(): Promise<{
  isPremium: boolean;
  plan: string | null;
  expirationDate: string | null;
}> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return parseCustomerInfo(customerInfo);
  } catch {
    return { isPremium: false, plan: null, expirationDate: null };
  }
}

export async function getOfferings(): Promise<PurchasesPackage[]> {
  try {
    const offerings = await Purchases.getOfferings();
    if (!offerings.current) return [];
    return offerings.current.availablePackages;
  } catch {
    return [];
  }
}

export async function purchasePackage(pkg: PurchasesPackage): Promise<{
  isPremium: boolean;
  plan: string | null;
}> {
  const { customerInfo } = await Purchases.purchasePackage(pkg);
  const status = parseCustomerInfo(customerInfo);
  return { isPremium: status.isPremium, plan: status.plan };
}

export async function restorePurchases(): Promise<{
  isPremium: boolean;
  plan: string | null;
}> {
  const customerInfo = await Purchases.restorePurchases();
  const status = parseCustomerInfo(customerInfo);
  return { isPremium: status.isPremium, plan: status.plan };
}

function parseCustomerInfo(info: CustomerInfo) {
  const entitlement = info.entitlements.active[ENTITLEMENT_ID];
  const isPremium = !!entitlement;
  const plan = entitlement?.productIdentifier ?? null;
  const expirationDate = entitlement?.expirationDate ?? null;
  return { isPremium, plan, expirationDate };
}
