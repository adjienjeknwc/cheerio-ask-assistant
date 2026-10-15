import { Template } from '../types';

export const INITIAL_TEMPLATES: Template[] = [
  {
    id: 'tpl_diwali_2026',
    name: 'diwali_offer_2026',
    category: 'UTILITY',
    status: 'REJECTED',
    language: 'English (en)',
    text: 'Hi {{1}}, our Diwali sale is live! Get 20% off on all jewellery with code DIWALI20. Shop now: {{2}}',
    rejectionReason: 'Template content appears promotional (discounts/offers) rather than utility/transactional.',
    metaErrorCode: '132001 (Template Category Mismatch)',
    createdAt: 'Oct 14, 2026',
    updatedAt: 'Today, 08:45 AM',
    sampleVariables: {
      '1': 'Priya',
      '2': 'https://riyajewels.in/diwali-sale'
    }
  },
  {
    id: 'tpl_order_conf_v2',
    name: 'order_confirmation_v2',
    category: 'UTILITY',
    status: 'APPROVED',
    language: 'English (en)',
    text: 'Namaste {{1}}! Your order #{{2}} with Riya Jewels is confirmed. Total: ₹{{3}}. We will pack it with care and dispatch it soon.',
    createdAt: 'Oct 10, 2026',
    updatedAt: 'Oct 10, 2026',
    sampleVariables: {
      '1': 'Ananya',
      '2': 'RJ-8892',
      '3': '4,950'
    }
  },
  {
    id: 'tpl_shipping_live',
    name: 'shipping_update_tracking',
    category: 'UTILITY',
    status: 'APPROVED',
    language: 'English (en)',
    text: 'Hi {{1}}, your handcrafted jewellery parcel is out for delivery with Delhivery (AWB: {{2}}). Track live delivery: {{3}}',
    createdAt: 'Oct 11, 2026',
    updatedAt: 'Oct 12, 2026',
    sampleVariables: {
      '1': 'Rohit',
      '2': 'DEL-991029',
      '3': 'https://delhivery.com/track'
    }
  },
  {
    id: 'tpl_abandoned_cart',
    name: 'abandoned_cart_reminder',
    category: 'MARKETING',
    status: 'APPROVED',
    language: 'English (en)',
    text: 'Hi {{1}}, did you leave something sparkling in your cart? Complete your order today for complimentary Jaipur gift wrapping: {{2}}',
    createdAt: 'Oct 08, 2026',
    updatedAt: 'Oct 09, 2026',
    sampleVariables: {
      '1': 'Sunita',
      '2': 'https://riyajewels.in/cart'
    }
  },
  {
    id: 'tpl_festive_early_vip',
    name: 'festive_early_access_vip',
    category: 'MARKETING',
    status: 'SUBMITTED',
    language: 'English (en)',
    text: 'Exclusive VIP Access: Early Diwali collections are now open for Gold Tier customers! Explore heritage Kundan & Polki: {{1}}',
    createdAt: 'Today, 07:30 AM',
    updatedAt: 'Today, 07:30 AM',
    sampleVariables: {
      '1': 'https://riyajewels.in/vip'
    }
  },
  {
    id: 'tpl_welcome_first',
    name: 'welcome_discount_first',
    category: 'MARKETING',
    status: 'PENDING',
    language: 'English (en)',
    text: 'Welcome to the Riya Jewels family! Enjoy 10% off your first 925 sterling silver order with code FIRST10: {{1}}',
    createdAt: 'Yesterday, 04:20 PM',
    updatedAt: 'Yesterday, 04:20 PM',
    sampleVariables: {
      '1': 'https://riyajewels.in/welcome'
    }
  }
];

export const ACCOUNT_CONTEXT = {
  businessName: 'Riya Jewels',
  location: 'Jaipur, Rajasthan',
  wabaId: 'WABA-992104-IN',
  phone: '+91 98290 41299',
  phoneStatus: 'Connected & Quality High (Tier 2)',
  walletBalance: '₹2,450.00',
  currentPlan: 'Growth Plan',
  unreadAlerts: 1
};
