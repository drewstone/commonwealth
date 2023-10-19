import { QueryTypes } from 'sequelize';
import { sequelize } from '../../database';
import { ServerChainsController } from '../server_chains_controller';

/**
 * Options for the getRelatedCommunities function.
 *
 * @typedef {Object} GetRelatedCommunitiesOptions
 * @property {string} base - The base variable for filtering (e.g., ChainNodes.name).
 * @property {string} [searchName] - The optional search term for fuzzy searching chain names (Chains.name).
 */
export type GetRelatedCommunitiesOptions = { base: string, searchName?: string };

export type GetRelatedCommunitiesResult = {
  id: string;
  community: string;
  icon_url: string;
  thread_count: number;
  address_count: number;
}[];

export async function __getRelatedCommunities(
  this: ServerChainsController,
  { base, searchName }: GetRelatedCommunitiesOptions
): Promise<GetRelatedCommunitiesResult> {
  const replacements = searchName ? { base, searchName: `%${searchName}%` } : { base };
  const filterString = searchName ? 'AND c.name ILIKE :searchName' : ''

  // Although this subquery is not necessary as is currently, We should keep it because in the future if we want to
  // paginate, then we will need to paginate through the subquery.
  return await sequelize.query(
    `
    SELECT 
        popular_chains.id as id, 
        popular_chains.name as community, 
        popular_chains.icon_url, 
        popular_chains.thread_count, 
        COUNT(a) as address_count 
    FROM 
        (SELECT c.id, c.icon_url, c.name, COUNT(t) as thread_count 
        FROM "ChainNodes" as cn 
        JOIN "Chains" as c on c.chain_node_id = cn.id ${filterString} 
        LEFT JOIN "Threads" as t on t.chain = c.id 
        WHERE cn.name = :base 
        GROUP BY c.id) as popular_chains 
    LEFT JOIN "Addresses" as a on a.chain = popular_chains.id 
    GROUP BY popular_chains.id, popular_chains.icon_url, popular_chains.name, popular_chains.thread_count 
    ORDER BY address_count DESC;
    `,
    {
      logging: console.log,
      type: QueryTypes.SELECT,
      replacements
    }
  );
}