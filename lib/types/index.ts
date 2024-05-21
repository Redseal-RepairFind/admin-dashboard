export interface ILoginData {
  email: string;
  password: string;
}

export interface ISignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface IVerifyEmailData {
  email: string;
  otp: string;
}

export interface IForgotPasswordData {
  email: string;
}

export interface IResetPasswordData {
  email: string;
  password: string;
  otp: string;
}

export interface IJobHistory {
  job: IJob;
  contractor?: {
    firstName: string;
    lastName: string;
    profileImage: string;
    email: string;
    [key: string]: unknown;
  };
  customer?: {
    fullName: string;
    phoneNumber: string;
    profileImg: string;
    email: string;
  };
}

export interface ICustomer {
  _id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  profileImg: string;
  __v: number;
  [key: string]: unknown;
}

export interface IRating {
  avgRating: number;
}

export interface ICustomerData {
  customer: ICustomer;
  jobHistory: IJobHistory[];
  rating: IRating | null;
}

export interface ISubAdmin {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  superAdmin: boolean;
  validation: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  [key: string]: unknown;
}

export interface ICustomers {
  customers: ICustomerData[];
}

export interface ISubAdmins {
  admins: ISubAdmin[];
}

export interface IContractorPostData {
  page: number;
  limit: number;
}

export interface IContractorsDetails {
  availability: string;
  contractorProfile: {
    _id: string;
    email: string;
    firstName: string;
    dateOfBirth: string;
    lastName: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    location: string;
    status: string;
    profileImage: string;
    documentVerification: boolean;
    [key: string]: unknown;
  };
  document: {
    skill: string;
    phoneNumber: string;
    businessName: string;
    tradeTicket: string;
    postalCode: string;
    city: string;
    website: string;
    yearExpirence: string;
    [key: string]: unknown;
  };
  jobHistory: IJobHistory[];
  rating: IRating | null;
}

export interface IContractors {
  artisans: IContractorsDetails[];
}

export interface ISkill {
  name: string;
  _id: string;
  [key: string]: unknown;
}

export interface ISkills {
  skills: ISkill[];
}

export interface IQuestion {
  question: string;
  options: string[];
  answer: string[];
  _id?: string;
}

export interface IEditQuestion {
  question: string;
  options: string[];
  answer: string[];
  questionId?: string;
}

export interface IGetJobsData {
  page: number;
  limit: number;
}

export interface IQuate {
  amount: number;
  material: string;
  qty: number;
  rate: number;
  _id: string;
}

export interface IJob {
  inspection: {
    status: boolean;
    confirmPayment: boolean;
  };
  totalAmountCustomerToPaid: string;
  totalQuatation: string;
  gst: string;
  jobTitle: string;
  postalCode: string;
  _id: string;
  address: string;
  status: string;
  quate: IQuate[];
  description: string;
  createdAt: string;
  totalAmountContractorWithdraw: string;
  time: string;
  [key: string]: unknown;
}
export interface IJobs {
  job: IJob;
  contractor: {
    _id: string;
    firstName: string;
    lastName: string;
    profileImage: string;
    email: string;
    status: string;
    [key: string]: unknown;
  };
  customer: {
    fullName: string;
    email: string;
    phoneNumber: string;
    profileImg: string;
    [key: string]: unknown;
  };
}

export interface IJobsList {
  jobs: IJobs[];
}

export interface IAdminData {
  firstName: string;
  lastName: string;
  image: string;
  isSuperAdmin: boolean;
}

export interface IChangeContractorStatusData {
  contractorId: string;
  status: string;
}

export interface IProfileData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  profileImg: null | string | File;
}

export interface ITransactionsDetail {
  contractor: {
    _id: string;
    firstName: string;
    lastName: string;
    profileImage: string;
    email: string;
    status: string;
    [key: string]: unknown;
  };

  contractorDocument: {
    phoneNumber: string;
    skill: string;
  };
  customer: {
    fullName: string;
    phoneNumber: string;
    profileImg: string;
    email: string;
  };
  transaction: {
    _id: string;
    type: string;
    amount: number;
    initiator: string;
    from: string;
    to: string;
    fromId: string;
    invoiceId: string;
    toId: string;
    description: string;
    status: string;
    createdAt: string;
  };
  to: string;
  from: {
    _id: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    createdAt: string;
    location: string;
    profileImg: string;
  };
  job: IJob;
}

export interface ITransactionsDetails {
  transactionDetail: ITransactionsDetail[];
}

export interface INotifications {
  _id: string;
  message: string;
  title: string;
  createdAt: string;
}

export interface IGetRevenueAnalysisParams {
  year: number;
  month: number;
}
