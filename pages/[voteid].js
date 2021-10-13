import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchCurrentHeight, fetchVoteDetails } from "../data/votes";
import Page from "../components/Page";
import ContentSection from "../components/ContentSection";
import classNames from "classnames";
import QRCode from "react-qr-code";
import { addMinutes, formatDistanceToNow } from "date-fns";

const VoteDetailField = ({ value, label, title = false }) => {
  return (
    <div className="flex flex-col">
      <p className="text-xs font-light text-gray-700 font-sans">{label}</p>
      {title ? (
        <h2 className="text-2xl font-bold font-sans">{value}</h2>
      ) : (
        <p className={classNames("text-lg font-sans", { "font-bold": title })}>
          {value}
        </p>
      )}
    </div>
  );
};

const VoteDetailsPage = () => {
  const router = useRouter();
  const { voteid } = router.query;

  const [loading, setLoading] = useState(false);
  const [voteDetails, setVoteDetails] = useState({});
  const [currentHeight, setHeight] = useState(null);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const height = await fetchCurrentHeight();
      const details = await fetchVoteDetails(voteid);
      setVoteDetails(details);
      setHeight(height);
      setLoading(false);
    };
    getData();
  }, [voteid]);

  const { id, pollster, deadline, name, link, description, outcomes } =
    voteDetails;

  // console.log(voteDetails);

  // console.log(currentHeight);
  if (loading) {
    return (
      <Page>
        <ContentSection>
          <div className="flex flex-col space-y-2">
            <div className="flex-col space-y-2">
              <VoteDetailField value={voteid} label="Vote ID" />
              <VoteDetailField value="Loading..." label="Loading..." />
            </div>
          </div>
        </ContentSection>
      </Page>
    );
  }

  const blocksRemaining = parseInt(deadline) - parseInt(currentHeight);
  const humanizedDeadline = formatDistanceToNow(
    new Date(addMinutes(new Date(), blocksRemaining))
  );

  return (
    <Page>
      <ContentSection>
        <div className="flex flex-col space-y-2">
          <div className="flex-col space-y-2">
            <VoteDetailField value={id} label="Vote ID" />
            <VoteDetailField value={name} title label="Vote Title" />
            <VoteDetailField value={description} label="Description" />
            <VoteDetailField value={pollster} label="Pollster" />
            <a
              href={link}
              rel="noopener noreferrer"
              target="_blank"
              className="text-lg text-blue-600 mt-5"
            >
              Link to more details
            </a>
          </div>
        </div>
      </ContentSection>

      <ContentSection>
        <div className="flex flex-row space-x-20 justify-start">
          <VoteDetailField
            value={`Block ${deadline?.toLocaleString()}`}
            label="Deadline"
          />
          <VoteDetailField
            value={`${blocksRemaining.toLocaleString()}`}
            label="Blocks Remaining Until Deadline"
          />
          <VoteDetailField
            value={humanizedDeadline}
            label="Estimated Time Until Deadline"
          />
        </div>
      </ContentSection>
      <ContentSection>
        <div className="flex flex-col space-y-2">
          <div className="flex-col space-y-2">
            <div className="">
              <p className="text-xs font-light text-gray-700 font-sans pb-2">
                Outcomes
              </p>

              <div className="w-full grid grid-cols-2 gap-5">
                {outcomes?.map((o) => (
                  <div className="w-full bg-gray-200 rounded-xl p-2 flex space-y-2 flex-col items-center justify-start">
                    <p className="text-black text-xl font-bold pt-4">
                      {o.value}
                    </p>
                    <QRCode value={o.address} size={175} />
                    {/* <p className="text-gray-400 text-md break-all">
                      {o.address}
                    </p> */}
                    <p className="text-gray-700 text-xs pt-5">
                      Or use the CLI:
                    </p>
                    <div className="bg-hv-gray-900 rounded-lg p-2 flex flex-col items-start justify-start">
                      <p className="text-blue-700 font-mono break-all">{`helium-wallet burn --0.0000004 --payee ${o.address} --commit`}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ContentSection>
    </Page>
  );
};

export default VoteDetailsPage;
