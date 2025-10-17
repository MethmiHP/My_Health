const Hospital = require('../../models/hospitalModel');

describe('Hospital Model (schema validation)', () => {
  test('pre-save hook exists for auto-increment', () => {
    const pres = Hospital.schema.s.hooks._pres;
    const hasSaveHook = pres && pres.get('save') && pres.get('save').length > 0;
    expect(!!hasSaveHook).toBe(true);
  });

  test('validates basic fields without DB', async () => {
    const h = new Hospital({ name: 'Test Hosp', code: 'TH1' });
    await h.validate();
    expect(h.status).toBe('active');
  });
});


