import { versionControl } from "@/lib/api/app-version";
import toast from "react-hot-toast";

import {
  useSearchParams,
  usePathname,
  useRouter,
  useParams,
} from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "react-query";

function useAppVersion() {
  const searchParams = useSearchParams();
  const param = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const params = searchParams.get("sortList") || "All";
  const currentPage = searchParams.get("page") || 1;
  const perPage = searchParams.get("perPage") || 10;

  const [dataToRender, setDataToRender] = useState<any>();
  // console.log(pathname);

  const { mutateAsync: createNewVersion, isLoading: isCreating } = useMutation(
    versionControl.createVersion
  );

  const { mutateAsync: editVersion, isLoading: isEditing } = useMutation(
    versionControl.editVersion
  );

  const { mutateAsync: deleteVersion, isLoading: isDeleting } = useMutation(
    versionControl.deleteVersion
  );
  const {
    data: appData,
    isLoading,
    refetch,
    error,
  } = useQuery(
    ["app version", params, currentPage, perPage],
    () => versionControl.getVersions(Number(currentPage), Number(perPage)),
    {
      cacheTime: 30000,
      staleTime: 30000,
      refetchOnWindowFocus: true,
    }
  );

  // console.log(appData);

  const {
    data: singleVersion,
    isLoading: isLoadingSingleVersion,
    refetch: refetchSingle,
  } = useQuery(
    ["single app version", param?.id],
    () => versionControl.getVersionById(param?.id?.toString()),
    {
      cacheTime: 30000,
      staleTime: 30000,
      refetchOnWindowFocus: true,
    }
  );

  const totalVersions = appData?.data?.totalItems;

  useEffect(() => {
    if (params.toLowerCase() === "all" || params === "All") {
      setDataToRender(appData);
    } else {
      const data = appData?.data?.data?.filter(
        (appd: any) => appd.type.toLowerCase() === params.toLowerCase()
      );

      const mainData = {
        ...appData,
        data: {
          ...appData?.data,
          data,
        },
      };
      setDataToRender(mainData);
    }
  }, [params, appData]);

  const handleNavigation = (id: string) => {
    router.push(`${pathname}/${id}`);
  };

  async function handleCreateVersion(payload: any) {
    toast.loading("Creating Version...");
    try {
      const data = await createNewVersion(payload);
      toast.remove();
      toast.success(data?.message);
      refetch();
    } catch (error: any) {
      console.error(error);
      toast.remove();
      toast.error(error?.response?.message);
    }
  }

  async function handleEditVersion(payload: any) {
    toast.loading("Editing Version...");
    try {
      const data = await editVersion(payload);
      toast.remove();
      toast.success(data?.message);
      refetchSingle();
    } catch (error: any) {
      console.error(error);
      toast.remove();
      toast.error(error?.response?.data.message);
    }
  }

  async function handleDelete(id: any) {
    toast.loading("Deleting Version...");
    try {
      const data = await deleteVersion(id);
      toast.remove();
      toast.success(data?.message);
      router.push(`/App_version`);
      refetch();
    } catch (error: any) {
      console.error(error);
      toast.remove();
      toast.error(error?.response?.data.message);
    }
  }

  return {
    isLoading,
    refetch,
    totalVersions,
    dataToRender,
    handleNavigation,
    singleVersion,
    isLoadingSingleVersion,
    handleCreateVersion,
    isCreating,
    handleEditVersion,
    isEditing,
    handleDelete,
  };
}

export default useAppVersion;
