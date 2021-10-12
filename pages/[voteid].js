import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchVoteDetails } from "../data/votes";
import Page from "../components/Page";

const VoteDetailsPage = () => {
  const router = useRouter();
  const { voteid } = router.query;

  const [loading, setLoading] = useState(false);
  const [voteDetails, setVoteDetails] = useState({});

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const details = await fetchVoteDetails(voteid);
      setVoteDetails(details);
      setLoading(false);
    };
    getData();
  }, [voteid]);

  const { id, pollster, deadline, name, link, description, outcomes } =
    voteDetails;

  console.log(voteDetails);

  return (
    <Page>
      <div className="flex flex-col space-y-2">
        <div className="flex-col space-y-2">
          {loading ? (
            <>
              <p className="text-lg">Vote ID: {id}</p>
              <p className="text-lg">{"Loading..."}</p>
            </>
          ) : (
            <>
              <p className="text-lg">Vote ID: {id}</p>
              <p className="text-lg">Vote Name: {name}</p>
              <p className="text-lg">Pollster: {pollster}</p>
              <p className="text-lg">Deadline: {deadline}</p>
              <p className="text-lg">Description: {description}</p>
              <div className="">
                <p className="text-lg">Outcomes:</p>
                <div className="w-full flex flex-row space-x-2">
                  {outcomes?.map((o) => (
                    <div className="w-1/3 bg-gray-200 p-2">
                      <p className="text-black text-md">{o.value}</p>
                      <p className="text-gray-400 text-md break-all">
                        {o.address}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Page>
  );
};

export default VoteDetailsPage;
