export const SUPER_ADMIN_EMAIL = "aluminiumhouse08@gmail.com";

export function isAdmin(session: any) {
  return session?.user?.email === SUPER_ADMIN_EMAIL;
}
