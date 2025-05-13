export interface CreateAccountRequest {
  fullName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  createdDate?: string;
  lastLoginDate?: string;
  isActive?: boolean;
  roleId: number;
  imgFile?: File;
}

export interface CreateAccountRespond {
  data: number;
  status: boolean;
  message: string;
}
