
export interface Message {
  id: string;
  sender: 'business' | 'organization' | 'system'; // Who sent the message
  text: string;
  timestamp: Date | string;
}

export interface Donation {
  id: string;
  itemName: string;
  description?: string;
  quantity: number; // Total available quantity
  unit: string; // e.g., 'kg', 'latas', 'unidades', 'bolsas'
  pricePerUnit?: number; // Price per unit in MXN$ if not free
  expirationDate: Date | string; // Can be Date object or ISO string
  pickupLocation: string;
  pickupInstructions?: string; // New field for pickup details
  photoUrl?: string; // URL of the uploaded photo
  postedBy: string; // ID or name of the business/user who posted
  status: 'available' | 'claimed' | 'delivered' | 'expired';
  claimedBy?: string; // ID or name of the organization that claimed it
  postedAt: Date | string;
  claimedAt?: Date | string;
  deliveredAt?: Date | string;
  validationCode?: string; // Code for validation
  qualityRating?: number; // Rating from 1-5
  isFree: boolean; // If the donation requires a symbolic payment
  messages?: Message[]; // New field for mock messages
  'data-ai-hint'?: string; // AI hint for image generation
}
