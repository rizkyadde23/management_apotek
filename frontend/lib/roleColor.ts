export const roleColor = (
  role?: string
) => {
  switch (role) {
    case "ADMIN":
      return "bg-red-100 text-red-700";

    case "OWNER":
      return "bg-blue-100 text-blue-700";

    case "APOTEKER":
      return "bg-green-100 text-green-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};