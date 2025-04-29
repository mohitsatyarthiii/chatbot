// pages/api/graph.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import neo4j from 'neo4j-driver';

const driver = neo4j.driver(
  'bolt://65.2.28.184:7687',
  neo4j.auth.basic('neo4j', 'Neo4j@123')
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (n)-[r]->(m)
      RETURN n, r, m
    `);

    const nodesMap: any = {};
    const links: any[] = [];

    result.records.forEach((record) => {
      const n = record.get('n');
      const m = record.get('m');
      const r = record.get('r');

      nodesMap[n.identity.toInt()] = {
        id: n.identity.toInt(),
        name: n.properties.name,
        label: n.labels[0],
      };

      nodesMap[m.identity.toInt()] = {
        id: m.identity.toInt(),
        name: m.properties.name,
        label: m.labels[0],
      };

      links.push({
        source: n.identity.toInt(),
        target: m.identity.toInt(),
        type: r.type,
      });
    });

    const nodes = Object.values(nodesMap);

    res.status(200).json({ nodes, links });
  } catch (error) {
    console.error('Neo4j Query Error:', error);
    res.status(500).json({ error: 'Failed to fetch data from Neo4j' });
  } finally {
    await session.close();
  }
}
