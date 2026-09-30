import migration from '../ledgers/xml-runtime-generalization.json';
import {cases} from '../scripts/verify.ts';
const exact = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
/** Explicit historical comparison only. Never used by an execution binding. */
export function beforeXmlGeneralizationCase<T extends {scenarioId: string; steps: unknown[]}>(row: T): T {
  const s = migration.scenarios.find(r => r.id === row.scenarioId);
  const n = s?.after.findIndex(r => exact(r, row)) ?? -1;
  return n < 0 ? row : {...row, ...s!.before[n]} as T;
}
export function beforeXmlGeneralizationTags(id: string, tags: string[]): string[] {
  const s = migration.scenarios.find(r => r.id === id);
  if (!s) return tags;
  const after = ['@planned', id, ...s.afterProfiles].sort();
  return exact(tags, after) ? ['@planned', id, ...s.beforeProfiles].sort() : tags;
}
/** Reconstruct the old file only when the changed cases exactly match the reviewed
 * migration. Unknown predicate changes fail instead of being hidden by this helper. */
export function historicalXmlFeature(path: string, text: string): string {
  if (path !== migration.path) return text;
  for (const s of migration.scenarios) {
    if (!exact(cases(path, text).filter(r => r.scenarioId === s.id), s.after)) throw Error('Unreviewed XML generalization predicates: ' + s.id);
  }
  const sha = new Bun.CryptoHasher('sha256').update(text).digest('hex');
  if (sha !== migration.afterSha256) throw Error('Unreviewed XML feature bytes');
  return migration.beforeText;
}
/** Historical evidence snapshots still compare all consumer status/evidence and
 * every other row. Reviewed migrated rows must match their exact planned state;
 * their original predicates/credit are reconstructed solely for historical tests. */
export async function historicalWorkflowLedger() {
  const ledger = await Bun.file('ledgers/workflows.json').json();
  return {...ledger, workflows: ledger.workflows.map((row: any) => {
    const s = migration.scenarios.find(r => r.id === row.id);
    if (!s) return row;
    const expected = s.after[0]!.steps.filter(x => !/^XML values input|^the XML values input is parsed$|^changing a returned/.test(x.text)).map(x => x.text);
    if (!exact(row.expectedOutcomes, expected)) throw Error('Unreviewed XML ledger outcome change: ' + row.id);
    const old = migration.beforeLedgerRows.find(r => r.id === row.id)!;
    const current = migration.afterLedgerRows.find(r => r.id === row.id)!;
    if (!exact(row.consumers, current.consumers)) throw Error('Unreviewed current XML consumer evidence: ' + row.id);
    return {...row, expectedOutcomes: old.expectedOutcomes, consumers: old.consumers};
  })};
}
