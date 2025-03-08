// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchPermissionsFromAPI } from "./lib/api/fetchPermissions";
import { navLinks as routes } from "@/lib/utils/utils";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // if (!token) {
  //   // If no token is found, redirect to the login page
  //   return NextResponse.redirect(new URL("/not-authorized", request.url));
  // }

  // Fetch user permissions using the token
  const userPermissions = await fetchPermissionsFromAPI(token);

  const route = routes.find((route) =>
    request.nextUrl.pathname.startsWith(route.route)
  );

  if (
    route &&
    route.readPermissions.length > 0 &&
    !route.readPermissions.some((permission) =>
      userPermissions?.data.includes(permission)
    )
  ) {
    // Redirect to a "not authorized" page if the user lacks permissions
    return NextResponse.redirect(new URL("/not-authorized", request.url));
  }

  // Allow the request to proceed if permissions are sufficient
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/overview",
    "/analytics",
    "/contractors",
    "/promotion",
    "/staff",
    "/customers",
    "/jobs",
    "/job_days",
    "/transactions",
    "/emergency",
    "/dispute",
    "/issues",
    "/App_version",
    "/gst",
    "/customise",
  ],
};
