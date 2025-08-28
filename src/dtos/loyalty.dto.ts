export interface LoyaltyTransactionDTO {
  _id: string;
  type: 'earn' | 'redeem' | 'expire' | 'adjustment';
  points: number;
  description: string;
  orderId?: string;
  expiresAt?: Date;
  createdAt: Date;
}

export interface RedeemPointsDTO {
  points: number;
  orderId?: string;
  description?: string;
}

export interface LoyaltyStatsDTO {
  totalPoints: number;
  totalEarned: number;
  totalRedeemed: number;
  expiringPoints: number;
  expiringDate?: Date;
  tierStatus?: string;
  nextTierPoints?: number;
}

export interface LoyaltyHistoryFilterDTO {
  type?: 'earn' | 'redeem' | 'expire' | 'adjustment';
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}
