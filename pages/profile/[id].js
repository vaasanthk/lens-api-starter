import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import { client, getProfileById, getPublicationsById } from "../../api";

export default function Profile() {
  const router = useRouter();
  const { id } = router.query;
  const [pubs, setPubs] = useState([]);
  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);
  const [profile, setProfile] = useState();
  async function fetchProfile() {
    try {
      const response = await client.query(getProfileById, { id }).toPromise();
      console.log("PROFILE:", response);
      setProfile(response.data.profile);

      const publications = await client
        .query(getPublicationsById, { id })
        .toPromise();
      console.log("PUBS!", publications);
      setPubs(publications.data.publications.items);
    } catch (error) {
      console.log("ERROR:", error);
    }
  }
  return (
    <Layout>
      <Head>
        <title>{profile ? profile.handle : "Lensbook"}</title>
      </Head>
      <div className="my-12">
        {profile && (
          <div className="flex flex-wrap md:flex-nowrap items-start w-full">
            <div className="w-full md:w-auto mb-4 md:mr-8">
              {profile.picture &&
              profile.picture.original &&
              profile.picture.original.url.includes("lens.infura-ipfs.io") ? (
                <div className="relative w-60 h-60 bg-emerald-900 rounded mx-auto">
                  <Image
                    src={profile.picture.original.url}
                    layout="fill"
                    objectFit="cover"
                    alt={profile.handle}
                    className="rounded"
                  />
                </div>
              ) : (
                <div className="bg-emerald-900 w-60 h-60 rounded mx-auto" />
              )}
            </div>
            <div className="grow-1 w-full">
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl sm:tracking-tight mb-1">
                  {profile.name}
                </h1>
                <h2 className="text-xl font-bold text-emerald-500 sm:text-2xl sm:tracking-tight mb-2">
                  {profile.handle}
                </h2>
                <div className="flex flex-wrap gap-x-2 text-gray-600 text-sm sm:text-base mb-4 justify-center md:justify-start">
                  <p>
                    <span className="text-gray-900 font-medium">
                      {profile.stats.totalFollowers}
                    </span>{" "}
                    Followers
                  </p>
                  <p>
                    <span className="text-gray-900 font-medium">
                      {profile.stats.totalFollowing}
                    </span>{" "}
                    Following
                  </p>
                </div>
                <p className="mb-4">{profile.bio}</p>
                {/* Add connect and follow buttons here */}
              </div>
              {/* Add publications here */}
              {pubs.length > 0 && (
                <div className="border-t-2 border-gray-100 my-8 py-8 flex flex-col space-y-8">
                  {pubs.map((p, index) => (
                    <div key={p.id}>
                      <p className="font-bold">{p.__typename}</p>
                      <p>{p.metadata.content}</p>
                      <p>{p.metadata.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
