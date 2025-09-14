'use client'
import React from "react";
import Header from "../layout/header/header";
import PageBody from "../shared/page-body/page-body";
import PageHeading from "../shared/page-body/page-heading";
import ProfileForm from "./components/profileForm";

const Profile = () => {
  return (
    <>
      <Header />
      {/* Page Body - Use for side padding on the top and sides */}
      <PageBody>
        <div className="flex justify-between mb-6 items-center">
          <PageHeading page_title="Account settings" />
          {/* <DownloadButton text="Download JOB LIST" /> */}
        </div>
        {/* <JobsTable /> */}
        <ProfileForm />
      </PageBody>
    </>
  );
};

export default Profile;
