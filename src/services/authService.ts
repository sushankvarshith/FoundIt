import { CURRENT_USER } from '../data/mockData';
import { UserProfile } from '../types';

const STORAGE_KEY = 'foundit_current_user';
const USERS_REGISTRY_KEY = 'foundit_users_registry';
const AUTH_STATUS_KEY = 'foundit_session_status';

interface StoredAccount {
  user: UserProfile;
  passwordHash: string;
}

// Initial registered accounts - includes all seed post uploaders so every user can be moderated/deleted
const DEFAULT_ACCOUNTS: StoredAccount[] = [
  {
    user: {
      ...CURRENT_USER,
      id: 'usr_admin',
      role: 'admin',
      name: 'System Administrator',
      username: 'admin_foundit',
      email: 'admin@gmail.com',
      phone: '+91 99999 00000',
      bio: 'FoundIt System Administrator with full moderation privileges across Nellore community.',
      location: 'Central Command, Nellore',
      city: 'Nellore',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    },
    passwordHash: 'admin1234',
  },
  {
    user: {
      ...CURRENT_USER,
      id: 'usr_sushank',
      role: 'user',
      name: 'Sushank Varshith',
      username: 'sushank_v',
      email: 'sushankvarshith16@gmail.com',
      phone: '+91 94401 23456',
      bio: 'Tech enthusiast & Nellore community helper, Andhra Pradesh. Always ready to help reunite lost devices.',
      location: 'Magunta Layout, Nellore',
      city: 'Nellore',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    },
    passwordHash: 'password123',
  },
  {
    user: {
      ...CURRENT_USER,
      id: 'usr_2',
      role: 'user',
      name: 'Dr. Priya Varma',
      username: 'priya_doc',
      email: 'priya.varma@nellore.org',
      phone: '+91 98480 11223',
      bio: 'Medical professional & volunteer in Nellore. Helping reunite lost personal essentials.',
      location: 'Gandhi Nagar, Nellore',
      city: 'Nellore',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    },
    passwordHash: 'password123',
  },
  {
    user: {
      ...CURRENT_USER,
      id: 'usr_3',
      role: 'user',
      name: 'Karthik Reddy',
      username: 'karthik_r',
      email: 'karthik.reddy@gmail.com',
      phone: '+91 98111 55667',
      bio: 'Audiophile & tech worker in Nellore. Active contributor on Trunk Road.',
      location: 'Trunk Road, Nellore',
      city: 'Nellore',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    },
    passwordHash: 'password123',
  },
  {
    user: {
      ...CURRENT_USER,
      id: 'usr_4',
      role: 'user',
      name: 'Sneha Kapur',
      username: 'sneha_k',
      email: 'sneha.kapur@gmail.com',
      phone: '+91 94411 98765',
      bio: 'Animal lover & dog parent in Magunta Layout, Nellore.',
      location: 'Magunta Layout, Nellore',
      city: 'Nellore',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    },
    passwordHash: 'password123',
  },
  {
    user: {
      ...CURRENT_USER,
      id: 'usr_5',
      role: 'user',
      name: 'Vikram Chawla',
      username: 'vikram_c',
      email: 'vikram.chawla@gmail.com',
      phone: '+91 97000 12345',
      bio: 'Motorcycle enthusiast & daily Nellore RTC commuter.',
      location: 'RTC Bus Stand, Nellore',
      city: 'Nellore',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    },
    passwordHash: 'password123',
  },
  {
    user: {
      ...CURRENT_USER,
      id: 'usr_me',
      role: 'user',
      name: 'Arjun Rao',
      username: 'arjun_foundit',
      email: 'arjun.rao@gmail.com',
      phone: '+91 98765 43210',
      bio: 'Student at Vikrama Simhapuri University, Dargamitta.',
      location: 'Dargamitta, Nellore',
      city: 'Nellore',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    },
    passwordHash: 'password123',
  },
  {
    user: {
      ...CURRENT_USER,
      id: 'usr_7',
      role: 'user',
      name: 'Ananya Deshmukh',
      username: 'ananya_d',
      email: 'ananya.deshmukh@gmail.com',
      phone: '+91 99887 76655',
      bio: 'Retail supervisor at MGB Felicity Mall.',
      location: 'Dargamitta, Nellore',
      city: 'Nellore',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    },
    passwordHash: 'password123',
  },
  {
    user: {
      ...CURRENT_USER,
      id: 'usr_8',
      role: 'user',
      name: 'Harish Varma',
      username: 'harish_v',
      email: 'harish.varma@gmail.com',
      phone: '+91 91234 56789',
      bio: 'Frequent train commuter from Nellore Railway Station.',
      location: 'Railway Station, Nellore',
      city: 'Nellore',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    },
    passwordHash: 'password123',
  },
  {
    user: {
      ...CURRENT_USER,
      id: 'usr_priya',
      role: 'user',
      name: 'Priya Sharma',
      username: 'priya_returns',
      email: 'priya.sharma@nellore.org',
      phone: '+91 98480 11223',
      bio: 'Active community volunteer in Nellore, Andhra Pradesh.',
      location: 'VRC Centre, Nellore',
      city: 'Nellore',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    },
    passwordHash: 'password123',
  },
  {
    user: {
      ...CURRENT_USER,
      id: 'usr_rohan',
      role: 'user',
      name: 'Rohan Sharma',
      username: 'rohans_99',
      email: 'rohan@example.com',
      phone: '+91 98111 22233',
      bio: 'Software engineer and tech enthusiast in Nellore.',
      location: 'VRC Centre, Nellore',
      city: 'Nellore',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    },
    passwordHash: 'password123',
  },
];

function getDeletedUserBlocklist(): Set<string> {
  try {
    const raw = localStorage.getItem('foundit_deleted_user_ids');
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return new Set(arr);
    }
  } catch {
    // ignore
  }
  return new Set();
}

function getStoredRegistry(): StoredAccount[] {
  const blocklist = getDeletedUserBlocklist();

  try {
    const raw = localStorage.getItem(USERS_REGISTRY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Filter out any accounts that were deleted
        const active = parsed.filter(
          (acc: StoredAccount) =>
            acc.user?.id &&
            !blocklist.has(acc.user.id) &&
            !blocklist.has(acc.user.username) &&
            !blocklist.has(acc.user.email?.toLowerCase())
        );

        // Merge any new default accounts that are not in registry and not in blocklist
        for (const def of DEFAULT_ACCOUNTS) {
          const exists = active.some(
            (a: StoredAccount) =>
              a.user?.id === def.user.id ||
              a.user?.username === def.user.username ||
              a.user?.email?.toLowerCase() === def.user.email?.toLowerCase()
          );
          const isDeleted =
            blocklist.has(def.user.id) ||
            blocklist.has(def.user.username) ||
            blocklist.has(def.user.email.toLowerCase());
          if (!exists && !isDeleted) {
            active.push(def);
          }
        }

        saveRegistry(active);
        return active;
      }
    }
  } catch {
    // fallback
  }

  const initialClean = DEFAULT_ACCOUNTS.filter(
    (acc) =>
      !blocklist.has(acc.user.id) &&
      !blocklist.has(acc.user.username) &&
      !blocklist.has(acc.user.email.toLowerCase())
  );
  try {
    localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(initialClean));
  } catch {
    // ignore
  }
  return initialClean;
}

function saveRegistry(accounts: StoredAccount[]) {
  try {
    localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(accounts));
  } catch {
    // ignore
  }
}

export const authService = {
  getStoredRegistry,

  /**
   * Check if user is actively authenticated in the current session.
   * Returns false on first opening the website so user must log in.
   */
  isAuthenticated(): boolean {
    try {
      const status = sessionStorage.getItem(AUTH_STATUS_KEY);
      return status === 'authenticated';
    } catch {
      return false;
    }
  },

  getCurrentUser(): UserProfile {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    const registry = getStoredRegistry();
    return registry[1]?.user || CURRENT_USER;
  },

  updateCurrentUser(updates: Partial<UserProfile>): UserProfile {
    const current = this.getCurrentUser();
    const updated: UserProfile = {
      ...current,
      ...updates,
      settings: {
        ...current.settings,
        ...(updates.settings || {}),
        notifications: {
          ...current.settings?.notifications,
          ...(updates.settings?.notifications || {}),
        },
      },
      stats: {
        ...current.stats,
        ...(updates.stats || {}),
      },
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }

    // Update in registry
    const registry = getStoredRegistry();
    const idx = registry.findIndex(
      (acc) => acc.user.id === updated.id || acc.user.email.toLowerCase() === updated.email.toLowerCase()
    );
    if (idx >= 0) {
      registry[idx].user = updated;
    } else {
      registry.push({ user: updated, passwordHash: 'password123' });
    }
    saveRegistry(registry);

    return updated;
  },

  login(
    email: string,
    password?: string
  ): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cleanEmail = email.trim().toLowerCase();
        const cleanPass = (password || '').trim();

        if (!cleanEmail) {
          resolve({ success: false, error: 'Please enter a valid email or username.' });
          return;
        }

        // 1. Direct check for Admin credentials: admin@gmail.com / admin1234
        if (cleanEmail === 'admin@gmail.com') {
          if (cleanPass === 'admin1234') {
            const adminUser: UserProfile = {
              ...CURRENT_USER,
              id: 'usr_admin',
              role: 'admin',
              name: 'System Administrator',
              username: 'admin_foundit',
              email: 'admin@gmail.com',
              phone: '+91 99999 00000',
              bio: 'FoundIt System Administrator with full moderation privileges across Nellore community.',
              location: 'Central Command, Nellore',
              city: 'Nellore',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
            };
            try {
              sessionStorage.setItem(AUTH_STATUS_KEY, 'authenticated');
              localStorage.setItem(STORAGE_KEY, JSON.stringify(adminUser));
            } catch {
              // ignore
            }
            resolve({ success: true, user: adminUser });
            return;
          } else {
            resolve({ success: false, error: 'Invalid admin password. Default admin password is admin1234' });
            return;
          }
        }

        const registry = getStoredRegistry();
        const account = registry.find(
          (acc) =>
            acc.user.email.toLowerCase() === cleanEmail ||
            acc.user.username.toLowerCase() === cleanEmail
        );

        if (!account) {
          resolve({
            success: false,
            error: 'No account found with this email. Please check your credentials or create a new account.',
          });
          return;
        }

        if (cleanPass && account.passwordHash && account.passwordHash !== cleanPass) {
          resolve({
            success: false,
            error: 'Incorrect password. Please verify your password.',
          });
          return;
        }

        try {
          sessionStorage.setItem(AUTH_STATUS_KEY, 'authenticated');
          localStorage.setItem(STORAGE_KEY, JSON.stringify(account.user));
        } catch {
          // ignore
        }

        resolve({ success: true, user: account.user });
      }, 350);
    });
  },

  signup(data: {
    name: string;
    username: string;
    email: string;
    password: string;
    phone?: string;
    location?: string;
    bio?: string;
    avatar?: string;
  }): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cleanEmail = data.email.trim().toLowerCase();
        const cleanUsername =
          data.username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '') ||
          `user_${Date.now().toString().slice(-4)}`;

        const registry = getStoredRegistry();
        const exists = registry.some(
          (acc) =>
            acc.user.email.toLowerCase() === cleanEmail ||
            acc.user.username.toLowerCase() === cleanUsername
        );

        if (exists) {
          resolve({
            success: false,
            error: 'An account with this email or username already exists. Please sign in.',
          });
          return;
        }

        const newUser: UserProfile = {
          ...CURRENT_USER,
          id: `usr_${Date.now()}`,
          role: 'user',
          name: data.name.trim(),
          username: cleanUsername,
          email: cleanEmail,
          phone: data.phone?.trim() || '+91 90000 00000',
          location: data.location?.trim() || 'Nellore, Andhra Pradesh',
          city: 'Nellore',
          bio: data.bio?.trim() || 'Proud member of FoundIt community.',
          avatar:
            data.avatar ||
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
          reputationScore: 80,
          isCommunityHelper: false,
          stats: {
            lostReports: 0,
            foundReports: 0,
            successfulReturns: 0,
            helpfulActions: 0,
          },
        };

        registry.push({
          user: newUser,
          passwordHash: data.password || 'password123',
        });
        saveRegistry(registry);

        try {
          sessionStorage.setItem(AUTH_STATUS_KEY, 'authenticated');
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
        } catch {
          // ignore
        }

        resolve({ success: true, user: newUser });
      }, 400);
    });
  },

  logout(): void {
    try {
      sessionStorage.removeItem(AUTH_STATUS_KEY);
      localStorage.removeItem(AUTH_STATUS_KEY);
    } catch {
      // ignore
    }
  },

  /**
   * Admin & Community Capabilities
   */
  getAllUsers(): UserProfile[] {
    const registry = getStoredRegistry();
    return registry.map((r) => r.user);
  },

  getUserById(userId: string): UserProfile | undefined {
    return this.getAllUsers().find((u) => u.id === userId);
  },

  searchUsers(query: string, excludeUserId?: string): UserProfile[] {
    const q = query.trim().toLowerCase();
    const all = this.getAllUsers();
    return all.filter((u) => {
      if (excludeUserId && u.id === excludeUserId) return false;
      if (!q) return true;
      return (
        (u.username && u.username.toLowerCase().includes(q)) ||
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q))
      );
    });
  },

  deleteUser(userId: string): boolean {
    const registry = getStoredRegistry();
    const targetAccount = registry.find((r) => r.user.id === userId);

    // Add user identifiers to blocklist
    try {
      const blocklist = getDeletedUserBlocklist();
      blocklist.add(userId);
      if (targetAccount?.user) {
        if (targetAccount.user.username) blocklist.add(targetAccount.user.username);
        if (targetAccount.user.email) blocklist.add(targetAccount.user.email.toLowerCase());
        if (targetAccount.user.name) blocklist.add(targetAccount.user.name);
      }
      localStorage.setItem('foundit_deleted_user_ids', JSON.stringify([...blocklist]));
    } catch {
      // ignore
    }

    const updated = registry.filter((r) => r.user.id !== userId);
    saveRegistry(updated);
    return updated.length < registry.length;
  },
};
