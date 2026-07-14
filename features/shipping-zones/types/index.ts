export type ShippingZone = {
  id: string;
  country: string;
  governorate: string;
  city: string | null;
  fee: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
