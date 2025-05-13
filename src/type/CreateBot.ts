export interface CreateBotRequest {
  key?: string;
  baseUrl?: string;
  context?: string;
  isDefault: boolean;
}
export interface GetBotRequest {
  chatBotId: number;
  key?: string;
  baseUrl?: string;
  context?: string;
  isDefault: boolean;
}
export interface ActiveBot {
  isDefault: boolean;
}
export interface GetBotRespond {
  data: number;
  status: boolean;
  message: string;
}
