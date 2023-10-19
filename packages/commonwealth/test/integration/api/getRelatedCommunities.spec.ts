import { assert } from 'chai';
import { ServerChainsController } from '../../../server/controllers/server_chains_controller';
import { resetDatabase } from '../../util/resetDatabase';
import models from 'server/database';

describe('GetRelatedCommunities Tests', () => {
  before(async () => {
    await resetDatabase();
  });

  it('Correctly returns nothing if base does not match chainNode', async () => {
    const controller = new ServerChainsController(models, null, null);
    const response = await controller.getRelatedCommunities({ chainNodeId: -1 })

    assert.equal(response.length, 0);
  });

  it('Correctly returns results if base matchs some chainNode.name', async () => {
    const controller = new ServerChainsController(models, null, null);
    const response = await controller.getRelatedCommunities({ chainNodeId: 2 })

    assert.equal(response.length, 3);

    const ethereumCommunity = response.find(r => r.community === 'Ethereum');
    assert.equal(ethereumCommunity.address_count, 1);
    assert.equal(ethereumCommunity.thread_count, 0);
    assert.equal(ethereumCommunity.icon_url, '/static/img/protocols/eth.png');

    const sushiCommunity = response.find(r => r.community === 'Sushi');
    assert.equal(sushiCommunity.address_count, 0);
    assert.equal(sushiCommunity.thread_count, 0);
    assert.equal(sushiCommunity.icon_url, '/static/img/protocols/eth.png');

    const yearnFinanceCommunity = response.find(r => r.community === 'yearn.finance');
    assert.equal(yearnFinanceCommunity.address_count, 0);
    assert.equal(yearnFinanceCommunity.thread_count, 0);
    assert.equal(yearnFinanceCommunity.icon_url, '/static/img/protocols/eth.png');
  });

  it('Correctly returns results if base matches some chainNode.name and filters based on query name', async () => {
    const controller = new ServerChainsController(models, null, null);
    const response = await controller.getRelatedCommunities({ chainNodeId: 2, communitySearchName: 'eth' })

    assert.equal(response.length, 1);

    const ethereumCommunity = response.find(r => r.community === 'Ethereum');
    assert.equal(ethereumCommunity.address_count, 1);
    assert.equal(ethereumCommunity.thread_count, 0);
    assert.equal(ethereumCommunity.icon_url, '/static/img/protocols/eth.png');
  });
});