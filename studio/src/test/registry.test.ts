import { describe, expect, it } from 'vitest';
import { DEMOS, assertRegistryIntegrity, byId } from '../core/registry';

describe('demo registry', () => {
  it('ships at least seven stages', () => {
    expect(DEMOS.length).toBeGreaterThanOrEqual(7);
  });

  it('is contiguous and unique', () => {
    expect(() => assertRegistryIntegrity(DEMOS)).not.toThrow();
  });

  it('rejects duplicate ids', () => {
    const broken = [...DEMOS, { ...DEMOS[0]!, index: 99 }];
    expect(() => assertRegistryIntegrity(broken)).toThrow(/duplicate demo id/);
  });

  it('rejects a gap in numbering', () => {
    const broken = DEMOS.map((d, i) => (i === 2 ? { ...d, index: 50 } : d));
    expect(() => assertRegistryIntegrity(broken)).toThrow(/contiguous/);
  });

  it('rejects a stage with no documented reduced path', () => {
    const broken = [{ ...DEMOS[0]!, reducedBehaviour: 'none' }];
    expect(() => assertRegistryIntegrity(broken)).toThrow(/reduced path/);
  });

  it('looks stages up by id', () => {
    expect(byId('cut')?.index).toBe(1);
    expect(byId('missing')).toBeUndefined();
  });
});
