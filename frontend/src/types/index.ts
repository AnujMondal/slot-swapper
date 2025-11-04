// API Types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: 'BUSY' | 'SWAPPABLE' | 'SWAP_PENDING';
  userId: string;
  createdAt: string;
  updatedAt: string;
  owner?: User;
}

export interface SwapRequest {
  id: string;
  requesterId: string;
  receiverId: string;
  requesterSlotId: string;
  receiverSlotId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  message?: string;
  createdAt: string;
  updatedAt: string;
  requester?: User;
  receiver?: User;
  requesterSlot?: Event;
  receiverSlot?: Event;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  error?: string;
}

export interface SwapRequestsResponse {
  incoming: SwapRequest[];
  outgoing: SwapRequest[];
}
