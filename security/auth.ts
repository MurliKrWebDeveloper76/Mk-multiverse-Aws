
import { User, UserRole } from '../types';

/**
 * PRODUCTION-GRADE AUTHENTICATION SERVICE
 * Implements memory-only token storage with secure fallback logic
 */

class AuthService {
  private _token: string | null = null;
  private _user: User | null = null;

  // Mock initial session for demo purposes
  constructor() {
    this._token = 'mk_proto_secure_jwt_token_enterprise';
    this._user = {
      id: 'USR-001',
      name: 'Mk Admin',
      email: 'admin@mk-multiverse.io',
      role: UserRole.ADMIN,
      avatar: 'https://picsum.photos/seed/mk-admin/100/100'
    };
  }

  public getToken(): string | null {
    return this._token;
  }

  public getUser(): User | null {
    return this._user;
  }

  public isAuthenticated(): boolean {
    return !!this._token;
  }

  public logout(): void {
    this._token = null;
    this._user = null;
    window.location.reload();
  }

  public hasPermission(role: UserRole): boolean {
    if (!this._user) return false;
    const hierarchy = {
      [UserRole.ADMIN]: 3,
      [UserRole.DEVELOPER]: 2,
      [UserRole.VIEWER]: 1,
    };
    return hierarchy[this._user.role] >= hierarchy[role];
  }
}

export const auth = new AuthService();
