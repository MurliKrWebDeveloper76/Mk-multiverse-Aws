
export enum UserRole {
  ADMIN = 'Administrator',
  DEVELOPER = 'Developer',
  VIEWER = 'Viewer'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface ServerMetrics {
  id: string;
  name: string;
  load: number;
  status: 'online' | 'warning' | 'critical';
  region: string;
  uptime: string;
}

export interface SecurityAlert {
  id: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  source: string;
}
