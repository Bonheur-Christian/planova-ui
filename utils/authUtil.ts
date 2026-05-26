export const saveAccessToken = (token: string) => {
  if (typeof window === "undefined") return;

  localStorage.setItem("token", token);

  // console.log("called save token", token)

  document.cookie = `token=${token}; path=/; SameSite=Lax`;
};

export const getAccessToken = () => {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("token");
};

// export const saveUser = (user: any) => {
//   if (typeof window === "undefined") return;

//   localStorage.setItem("user", JSON.stringify(user));

//   document.cookie = `user=${encodeURIComponent(
//     JSON.stringify(user),
//   )}; path=/; SameSite=Lax`;
// };

export const saveUser = (user: any) => {
  if (typeof window === "undefined") return;

  if (!user || typeof user !== "object") {
    // console.warn("Blocked invalid user save:", user);
    localStorage.removeItem("user");
    return;
  }

  const safe = JSON.stringify(user);

  localStorage.setItem("user", safe);

  document.cookie = `user=${encodeURIComponent(safe)}; path=/; SameSite=Lax`;
};

// export const getUser = () => {
//   if (typeof window === "undefined") return null;

//   const user = localStorage.getItem("user");
//   console.log("Retrieved user from storage:", user);

//   return user ? JSON.parse(user) : null;
// };

export const getUser = () => {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("user");

  // console.log("Retrieved user from storage:", user);
  // console.log(localStorage);

  if (!user || user === "undefined" || user === "null") return null;

  try {
    return JSON.parse(user);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export const clearAuthStorage = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

  document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};
