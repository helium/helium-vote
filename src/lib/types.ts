import { IdlAccounts } from "@coral-xyz/anchor";
import { Proposal } from "@helium/modular-governance-idls/lib/types/proposal";

export type ProposalState = "active" | "cancelled" | "passed" | "failed";
export interface ILegacyProposal {
  id: string;
  deadline: number;
  link: string;
  name: string;
  tags: { [key: string]: string };
  authors: { nickname: string; link: string }[];
  description: string;
  deadlineTs: number;
  outcomes: { value: string; hntVoted: number; uniqueWallets: number }[];
  filters: string[];
}

export type ProposalV0 = IdlAccounts<Proposal>["proposalV0"];
export type VoteChoice = ProposalV0["choices"][0];
export type VoteChoiceWithMeta = VoteChoice & {
  index: number;
  percent: number;
};
