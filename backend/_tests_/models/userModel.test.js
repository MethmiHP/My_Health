const User = require('../../models/userModel');

describe('User Model (schema validation)', () => {
  test('validates and exposes fullName virtual without DB', async () => {
    const u = new User({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'hashed',
      role: 'doctor',
    });
    await u.validate();
    expect(u.fullName).toBe('John Doe');
  });

  test('email required and lowercased', async () => {
    const u = new User({ firstName: 'A', lastName: 'B', email: 'UPPER@EXAMPLE.COM', password: 'x', role: 'patient' });
    await u.validate();
    expect(u.email).toBe('upper@example.com');
  });
});


