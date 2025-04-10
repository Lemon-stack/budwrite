export type UserType = "free" | "pro" | "enterprise";

export interface UserLimits {
  maxPages: number;
  maxCharsPerPage: number;
}

export const USER_LIMITS: Record<UserType, UserLimits> = {
  free: {
    maxPages: 4,
    maxCharsPerPage: 500,
  },
  pro: {
    maxPages: 10,
    maxCharsPerPage: 1000,
  },
  enterprise: {
    maxPages: 20,
    maxCharsPerPage: 2000,
  },
};
