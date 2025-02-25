export async function fetchPermissionsFromAPI(token: any) {
  // Replace this with your actual API call to fetch permissions
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/admin/my-permissions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch permissions");
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(error.message);
    // throw new Error(error.message);
  }
}
