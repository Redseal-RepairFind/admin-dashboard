function filterObjectsByIds(objects: any, ids: string[]) {
  return objects?.filter((object: any) => ids.includes(object._id));
}

export async function getAllPermissions(token: any, user: any) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/admin/teams`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch permissions");
    }
    const data = await response.json();

    const { teams } = user;

    const userPermissions = filterObjectsByIds(data?.data, teams).map(
      (perm: any) => perm.permissions
    );

    const allNames = userPermissions.flatMap((subArray: any) =>
      subArray.map((item: any) => item.name)
    );

    return allNames;
  } catch (error: any) {
    console.error(error.message);
    // throw new Error(error.message);
  }
}

export async function fetchPermissionsFromAPI(token: any, user: any) {
  // Replace this with your actual API call to fetch permissions

  // const teams = sessionStorage.getItem("repairfind_session_user");
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
    const permissions = await getAllPermissions(token, user);
    return [...new Set([...data?.data, ...permissions])];
  } catch (error: any) {
    console.error(error.message);
    // throw new Error(error.message);
  }
}
