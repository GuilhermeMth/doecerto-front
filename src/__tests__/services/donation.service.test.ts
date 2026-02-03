describe('DonationPayload Validation', () => {
  interface DonationPayload {
    ongId: number;
    donationType: string;
    materialDescription: string;
    materialQuantity: number;
  }

  const validPayload: DonationPayload = {
    ongId: 1,
    donationType: 'material',
    materialDescription: 'Alimentos não perecíveis',
    materialQuantity: 5,
  };

  it('should create valid donation payload', () => {
    expect(validPayload).toEqual({
      ongId: 1,
      donationType: 'material',
      materialDescription: 'Alimentos não perecíveis',
      materialQuantity: 5,
    });
  });

  it('should have required fields', () => {
    expect(validPayload).toHaveProperty('ongId');
    expect(validPayload).toHaveProperty('donationType');
    expect(validPayload).toHaveProperty('materialDescription');
    expect(validPayload).toHaveProperty('materialQuantity');
  });

  it('should have correct data types', () => {
    expect(typeof validPayload.ongId).toBe('number');
    expect(typeof validPayload.donationType).toBe('string');
    expect(typeof validPayload.materialDescription).toBe('string');
    expect(typeof validPayload.materialQuantity).toBe('number');
  });

  it('should have positive quantity', () => {
    expect(validPayload.materialQuantity).toBeGreaterThan(0);
  });

  it('should have positive ongId', () => {
    expect(validPayload.ongId).toBeGreaterThan(0);
  });
});
