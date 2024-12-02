export interface CompanyInfo {
  name: string;
  phone: string;
  address: string;
}

export interface WebsiteInfo {
  domain: string;
  blogUrl: string;
}

export interface ProjectData {
  targetKeyword: string;
  companyInfo: CompanyInfo;
  websiteInfo: WebsiteInfo;
  locations: string[];
}

export interface ProjectState {
  isQuestionModalOpen: boolean;
  currentStep: number;
  projectData: ProjectData;
}