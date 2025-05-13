export interface GetAllAccountRequest {
  accountId: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  createdDate?: string;
  lastLoginDate?: string;
  isActive?: boolean;
  roleId: number;
  imagePath?: string;
}
export interface GetDetailsStaff {
  storeId: number;
  joinDate?: string;
  jobTitle: string;
  department: string;
  salary?: number;
  employmentType?: string;
}
export interface GetDetailsManager {
  managedDate?: string;
  yearsOfExperience?: number;
  managerCertifications?: string;
  officeContact?: string;
}
export interface GetAllAccountRespond {
  data: number;
  status: boolean;
  message: string;
}
