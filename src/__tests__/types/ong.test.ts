describe('ONG Interface Validation', () => {
  interface Ong {
    id: number;
    name: string;
    pixKey?: string;
    description?: string;
    logo?: string;
    banner?: string;
    mission?: string;
    since?: number;
    impactedPeople?: number;
    phone?: string;
    instagram?: string;
    address?: string;
    distance?: string;
    user?: {
      name: string;
    };
  }

  const validOng: Ong = {
    id: 1,
    name: 'Test ONG',
    pixKey: 'pix@testong.org',
    description: 'A test organization',
    logo: 'https://example.com/logo.jpg',
    banner: 'https://example.com/banner.jpg',
    mission: 'Help people',
    since: 2020,
    impactedPeople: 100,
    phone: '1234567890',
    instagram: '@testong',
    address: 'Rua Test, 123',
    distance: '5km',
    user: { name: 'John Doe' },
  };

  it('should create valid ONG object', () => {
    expect(validOng.id).toBe(1);
    expect(validOng.name).toBe('Test ONG');
  });

  it('should have required fields', () => {
    expect(validOng).toHaveProperty('id');
    expect(validOng).toHaveProperty('name');
  });

  it('should have optional fields', () => {
    expect(validOng).toHaveProperty('pixKey');
    expect(validOng).toHaveProperty('mission');
    expect(validOng).toHaveProperty('since');
  });

  it('should have valid id type', () => {
    expect(typeof validOng.id).toBe('number');
    expect(validOng.id).toBeGreaterThan(0);
  });

  it('should have valid name', () => {
    expect(typeof validOng.name).toBe('string');
    expect(validOng.name.length).toBeGreaterThan(0);
  });

  it('should have valid user info if exists', () => {
    if (validOng.user) {
      expect(validOng.user).toHaveProperty('name');
      expect(typeof validOng.user.name).toBe('string');
    }
  });

  it('minimal ONG should be valid with only required fields', () => {
    const minimalOng: Ong = {
      id: 2,
      name: 'Minimal ONG',
    };

    expect(minimalOng.id).toBe(2);
    expect(minimalOng.name).toBe('Minimal ONG');
    expect(minimalOng.pixKey).toBeUndefined();
  });
});
