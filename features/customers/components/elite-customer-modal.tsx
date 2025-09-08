"use client";

import SubmitBtn from "@/components/ui/submit-btn";
import useCustomers from "@/lib/hooks/useCustomers";
import { Check } from "@/public/svg";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { ClipLoader } from "react-spinners";

const EliteCustomerModal = ({
  elite,
  item,
  handleModalToggleClose,
  refetch,
  isNewTeam = true,
}: {
  elite: any;
  item: any;
  handleModalToggleClose: () => void;
  refetch: () => void;
  isNewTeam: boolean;
}) => {
  const [rewardPercent, setRewardPercent] = useState<string>();
  const [contractorEmail, setContractorEmail] = useState<string>();
  const [selectedContractors, setSelectedContractors] = useState<
    {
      name: string;
      email: string;
      _id: string;
    }[]
  >([]);

  const {
    toggleCustomerElite,
    isTogglingCustomerElite,
    contractorsList,
    isLoadingContractorsList,
    addContractorToTeam,
    isAddingContractorToTeam,
  } = useCustomers(elite?.id, contractorEmail);

  const contractors = contractorsList?.data?.data || [];

  // console.log(elite, item);
  const handleToggle = async () => {
    const isElite = item?.isElite;

    if (!rewardPercent && !isElite && isNewTeam) {
      toast.error("Kindly specify the customers earning percentage per job");
      return;
    }

    if ((!selectedContractors || selectedContractors?.length < 1) && !isElite) {
      toast.error("Kindly select at least one contractor for this team");
      return;
    }
    try {
      isNewTeam
        ? toast.loading(
            isElite
              ? "Demoting customer.. .. .. .."
              : "Promoting customer.. .. .. .."
          )
        : toast.loading("Adding contractors to team... ... ...");

      isNewTeam
        ? await toggleCustomerElite({
            payload: {
              rewardPercent: Number(rewardPercent) || 0,
              contractorEmails: selectedContractors.map((cnt) => cnt.email),
            },
            id: item?.id,
          })
        : await addContractorToTeam({
            id: item?._id,
            contractorEmails: selectedContractors.map((cnt) => cnt.email),
          });

      toast.remove();
      isNewTeam
        ? toast.success(
            isElite
              ? "Customer demoted successfully"
              : "Customer  promoted successfully"
          )
        : toast.success("Contractors added to team successfully");

      handleModalToggleClose();

      // closeModal("promote");
      setRewardPercent("");
      setContractorEmail("");
      setSelectedContractors([]);
      await refetch();
    } catch (error: any) {
      toast.remove();
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  };

  return (
    <div className="w-full max-w-[500px] py-8 max-h-[600px] z-50">
      {isNewTeam ? (
        <h1 className="font-semibold text-center">
          You are about to {item?.isElite ? "Demote" : "promote "}{" "}
          <span className={item?.isElite ? "text-red-600" : "text-green-600"}>
            {item?.name}
          </span>{" "}
          {item?.isElite ? "from " : " to "}
          the elite customer status
        </h1>
      ) : (
        <h1 className="font-semibold text-center">
          You are about to add more contractors to {"  "}
          <span className={item?.isElite ? "text-blue-600" : "text-green-600"}>
            {item?.name}
          </span>
          {"' "}
          team
        </h1>
      )}
      {item?.isElite && isNewTeam ? null : (
        <>
          {isNewTeam && (
            <input
              type="number"
              placeholder="Enter Percentage earnable by customer"
              value={rewardPercent}
              onChange={(e) => setRewardPercent(e.target.value)}
              className={`outline-none border py-2 px-4 rounded-md w-full`}
            />
          )}
          <input
            type="email"
            placeholder="Search and add contractors to the team"
            value={contractorEmail}
            onChange={(e) => setContractorEmail(e.target.value)}
            className={`outline-none border py-2 px-4 rounded-md w-full my-4`}
          />

          {selectedContractors?.length > 0 && (
            <div>
              <p>Selected contractors</p>
              <div className=" flex items-center gap-2 w-full  flex-wrap">
                {selectedContractors?.map((contractor) => (
                  <div
                    className="flex items-center gap-2 border  p-1 rounded-lg bg-black text-white"
                    key={contractor?._id}
                  >
                    <p className="text-xs">{contractor.name}</p>
                    <button
                      className="h-4 w-4 rounded-full bg-red-500"
                      onClick={() =>
                        setSelectedContractors((prev) =>
                          prev.filter((cnt) => cnt?._id !== contractor?._id)
                        )
                      }
                    >
                      <IoClose scale={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {
            <div
              className={`${
                contractorEmail && contractorEmail?.length >= 3
                  ? "h-72 overflow-y-auto z-50"
                  : ""
              } `}
            >
              {isLoadingContractorsList ? (
                <div className="flex items-center justify-center h-full w-full">
                  <ClipLoader size={28} color="#000000" />
                </div>
              ) : (
                <div className="mt-6">
                  {contractors?.length > 0 ? (
                    <div className="">
                      {contractors?.map((contractor: any) => (
                        <button
                          className="flex items-center gap-4 mb-4"
                          key={contractor?._id}
                          type="button"
                          onClick={() => {
                            setSelectedContractors((prev) => {
                              const exists = prev.some(
                                (cnt) => cnt?._id === contractor?._id
                              );
                              if (exists) {
                                // Remove contractor
                                return prev.filter(
                                  (cnt) => cnt?._id !== contractor?._id
                                );
                              } else {
                                // Add contractor
                                return [...prev, contractor];
                              }
                            });
                          }}
                        >
                          <span
                            className={`h-4 w-4 rounded-sm border flex items-center justify-center border-black ${
                              selectedContractors?.some(
                                (cnt) => cnt?._id === contractor?._id
                              )
                                ? " bg-black "
                                : ""
                            }`}
                          >
                            {selectedContractors?.some(
                              (cnt) => cnt?._id === contractor?._id
                            ) ? (
                              <Check />
                            ) : null}
                          </span>
                          <span className="text-sm">{contractor.name}</span>
                          <span className="text-sm">{contractor.email}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    contractorEmail &&
                    contractorEmail?.length >= 3 && (
                      <div className="flex items-center h-full justify-center">
                        <p className="text-gray-400">
                          No contrators found with that email or name
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          }
        </>
      )}

      <p className="py-2">
        Kindly press the proceed button to confirm this action
      </p>
      <SubmitBtn
        isSubmitting={isTogglingCustomerElite || isAddingContractorToTeam}
        onClick={() => handleToggle()}
      >
        Proceed
      </SubmitBtn>
    </div>
  );
};

export const RemoveModal = ({
  name,
  email,
  id,
  refetchCusTeam,
  closeModal,
}: {
  name: string;
  email: string;
  id: string;
  refetchCusTeam: () => void;
  closeModal: () => void;
}) => {
  const { removeContractorToTeam, isRemoveingContractorToTeam } =
    useCustomers();

  const handleRemoveContractorToTeam = async () => {
    // if (!email) {
    //   toast.error("Customer email is required");
    // }
    toast.loading("removing contractor from team.....");
    try {
      await removeContractorToTeam({
        id: id,
        contractorEmail: email,
      });

      toast.remove();
      toast.success("Contractor removed from team successfully");
      closeModal();
      await refetchCusTeam();
    } catch (error: any) {
      console.error(error);
      toast.remove();
      const errmsg = error?.response?.data?.message;

      toast.error(errmsg);
    }
  };
  return (
    <div className="max-w-[450px] flex flex-col gap-3">
      <h1 className="text-center font-semibold">
        You are about to remove <span className="text-red-600">{name}</span>{" "}
        from this team
      </h1>

      <p className="text-sm text-gray-500 text-center">
        Note: This action is not reversible. The contractor will be removed from
        this team but will still retain the elite contractor status if
        previously promoted.
      </p>

      <SubmitBtn
        isSubmitting={isRemoveingContractorToTeam}
        onClick={() => handleRemoveContractorToTeam()}
      >
        Proceed
      </SubmitBtn>
    </div>
  );
};

export default EliteCustomerModal;
