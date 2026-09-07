import { CURRENT_USER } from '../data/mockData';
import { UserProfile } from '../types';
import { apiClient } from './apiClient';

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

  /**
   * Synchronize local user registry with the Java backend / MySQL database
   */
  async syncUsersWithBackend(): Promise<StoredAccount[]> {
    try {
      const remoteUsers = await apiClient.get<any[]>('/auth/users');
      if (remoteUsers && Array.isArray(remoteUsers) && remoteUsers.length > 0) {
        const registry = getStoredRegistry();
        const blocklist = getDeletedUserBlocklist();
        let changed = false;

        for (const ru of remoteUsers) {
          if (!ru || !ru.id || blocklist.has(ru.id) || blocklist.has(ru.username)) continue;
          const exists = registry.some(
            (a) => a.user.id === ru.id || a.user.email?.toLowerCase() === ru.email?.toLowerCase()
          );
          if (!exists) {
            const mappedUser: UserProfile = {
              ...CURRENT_USER,
              id: ru.id,
              name: ru.name || 'Community Member',
              username: ru.username || ru.id,
              email: ru.email || `${ru.username || ru.id}@foundit.community`,
              phone: ru.phone || '+91 90000 00000',
              location: ru.location || 'Nellore, Andhra Pradesh',
              city: ru.city || 'Nellore',
              bio: ru.bio || 'Active FoundIt community helper.',
              avatar: ru.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
              role: ru.role || 'user',
              reputationScore: ru.reputationScore || 85,
              isCommunityHelper: Boolean(ru.isCommunityHelper),
              stats: ru.stats || {
                lostReports: ru.lostReports || 0,
                foundReports: ru.foundReports || 0,
                successfulReturns: ru.successfulReturns || 0,
                helpfulActions: ru.helpfulActions || 0,
              },
            };
            registry.push({ user: mappedUser, passwordHash: 'password123' });
            changed = true;
          }
        }

        if (changed) {
          saveRegistry(registry);
        }
        return registry;
      }
    } catch {
      // offline fallback
    }
    return getStoredRegistry();
  },

  async login(
    email: string,
    password?: string
  ): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanEmail) {
      return { success: false, error: 'Please enter a valid email or username.' };
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
        return { success: true, user: adminUser };
      } else {
        return { success: false, error: 'Invalid admin password. Default admin password is admin1234' };
      }
    }

    // 2. Attempt remote login against Java REST backend / MySQL
    try {
      const remoteUser = await apiClient.post<any>('/auth/login', {
        username: cleanEmail,
        password: cleanPass,
      });

      if (remoteUser && remoteUser.id) {
        const mappedUser: UserProfile = {
          ...CURRENT_USER,
          id: remoteUser.id,
          name: remoteUser.name || 'Community Member',
          username: remoteUser.username || remoteUser.id,
          email: remoteUser.email || cleanEmail,
          phone: remoteUser.phone || '+91 90000 00000',
          location: remoteUser.location || 'Nellore, Andhra Pradesh',
          city: remoteUser.city || 'Nellore',
          bio: remoteUser.bio || 'Proud member of FoundIt community.',
          avatar: remoteUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
          role: remoteUser.role || 'user',
          reputationScore: remoteUser.reputationScore || 85,
          isCommunityHelper: Boolean(remoteUser.isCommunityHelper),
          stats: remoteUser.stats || {
            lostReports: 0,
            foundReports: 0,
            successfulReturns: 0,
            helpfulActions: 0,
          },
        };

        // Cache in local registry
        const registry = getStoredRegistry();
        const existingIdx = registry.findIndex(
          (a) => a.user.id === mappedUser.id || a.user.email.toLowerCase() === mappedUser.email.toLowerCase()
        );
        if (existingIdx >= 0) {
          registry[existingIdx].user = mappedUser;
          if (cleanPass) registry[existingIdx].passwordHash = cleanPass;
        } else {
          registry.push({ user: mappedUser, passwordHash: cleanPass || 'password123' });
        }
        saveRegistry(registry);

        try {
          sessionStorage.setItem(AUTH_STATUS_KEY, 'authenticated');
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedUser));
        } catch {
          // ignore
        }

        return { success: true, user: mappedUser };
      }
    } catch {
      // Backend unavailable, fallback to local registry
    }

    // 3. Fallback to Local Storage Registry
    const registry = getStoredRegistry();
    const account = registry.find(
      (acc) =>
        acc.user.email.toLowerCase() === cleanEmail ||
        acc.user.username.toLowerCase() === cleanEmail
    );

    if (!account) {
      return {
        success: false,
        error: 'No account found with this email. Please check your credentials or create a new account.',
      };
    }

    if (cleanPass && account.passwordHash && account.passwordHash !== cleanPass) {
      return {
        success: false,
        error: 'Incorrect password. Please verify your password.',
      };
    }

    try {
      sessionStorage.setItem(AUTH_STATUS_KEY, 'authenticated');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(account.user));
    } catch {
      // ignore
    }

    return { success: true, user: account.user };
  },

  async signup(data: {
    name: string;
    username: string;
    email: string;
    password: string;
    phone?: string;
    location?: string;
    bio?: string;
    avatar?: string;
  }): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
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
      return {
        success: false,
        error: 'An account with this email or username already exists. Please sign in.',
      };
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

    // Sync new user to Java Backend & MySQL in background
    apiClient
      .post('/auth/register', {
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        password: data.password || 'password123',
        phone: newUser.phone,
        location: newUser.location,
        city: newUser.city,
        bio: newUser.bio,
        avatar: newUser.avatar,
      })
      .catch(() => {
        // Offline fallback already stored locally
      });

    return { success: true, user: newUser };
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
