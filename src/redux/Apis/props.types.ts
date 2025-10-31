export interface UsersPropsType {
  page: number;
  limit: number;
}

export interface StudyPropsType {
  page: number;
  limit: number;
}

export interface MaterialsPropsType {
  page: number;
  limit: number;
  category?: string;
}

export interface SupportPropsType {
  page: number;
  limit: number;
}

export interface CommunityPropsType {
  page: number;
  limit: number;
  sort?: string;
}

export interface OverviewPropsType {
  year?: number;
}

export interface NotificationPropsType {
  id: string;
}
