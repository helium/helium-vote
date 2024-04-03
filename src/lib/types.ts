import { IdlAccounts } from "@coral-xyz/anchor";
import { Proposal } from "@helium/modular-governance-idls/lib/types/proposal";

export type ProposalState =
  | "active"
  | "cancelled"
  | "passed"
  | "failed"
  | "completed";
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

export interface IRealmProposal {
  publicKey: string;
  tags: string[];
  name: string;
  status: ProposalState;
  endTs: number;
  gist: string;
  github: string;
  summary: string;
  outcomes: { value: string; votes: number }[];
}

export type ProposalV0 = IdlAccounts<Proposal>["proposalV0"];
export type VoteChoice = ProposalV0["choices"][0];
export type VoteChoiceWithMeta = VoteChoice & {
  index: number;
  percent: number;
};
