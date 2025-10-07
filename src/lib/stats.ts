export type BuildersBucket = { builders: number; accounts: number };

export function buildersDistribution(buildersCounts: number[]): BuildersBucket[] {
	const map = new Map<number, number>();
	for (const n of buildersCounts) map.set(n, (map.get(n) ?? 0) + 1);
	return [...map.entries()]
		.map(([builders, accounts]) => ({ builders, accounts }))
		.sort((a, b) => b.builders - a.builders || b.accounts - a.accounts);
}