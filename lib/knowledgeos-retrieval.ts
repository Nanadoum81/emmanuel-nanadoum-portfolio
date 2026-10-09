export const REFUSAL = "I can't verify that from the current knowledge base.";

export type Chunk = { id: string; source: string; section: string; text: string };

// This public demo has a fixed, synthetic corpus, not access to customer documents.
const topics: Record<string, RegExp> = {
  "hb-pto": /\b(vacation|paid time off|pto)\b/i,
  "hb-remote": /\b(remote|remotely|work from home|in.office|collaboration days)\b/i,
  "sec-access": /\b(mfa|multi.factor|shared? (?:user |admin )?accounts?|share (?:user |admin )?accounts?|authentication)\b/i,
  "sec-incident": /\b(phishing|credential exposure|lost devices?|unauthorized access|security incident|incident report)\b/i,
  "sales-qual": /\b(qualif\w*|qualified opportunity)\b/i,
  "sales-handoff": /\b(handoff|kickoff)\b/i,
  "impl-uat": /\b(uat|acceptance test\w*|critical failures?|minor issues?)\b/i,
  "impl-launch": /\b(production launch|launch|rollback|go.live)\b/i,
};

const unsupported = /\b(parental|maternity|paternity|bereavement|salary|salaries|compensation|insurance|holiday|holidays|sick|retirement|401k)\b/i;

export function supportedChunks(question: string, corpus: Chunk[]): Chunk[] {
  // Similarity alone cannot establish whether an absent policy exists.
  if (unsupported.test(question)) return [];
  return corpus.filter(chunk => topics[chunk.id]?.test(question));
}

export function hasValidCitations(answer: string, sourceCount: number): boolean {
  const citations = [...answer.matchAll(/\[S(\d+)\]/g)];
  return citations.length > 0 && citations.every(match => Number(match[1]) >= 1 && Number(match[1]) <= sourceCount);
}
