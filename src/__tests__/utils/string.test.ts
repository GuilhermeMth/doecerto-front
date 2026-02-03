describe('String Utilities', () => {
  const truncateString = (str: string, maxLength: number): string => {
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
  };

  const capitalizeString = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  describe('truncateString', () => {
    it('should truncate long strings', () => {
      expect(truncateString('Hello World', 5)).toBe('Hello...');
    });

    it('should not truncate short strings', () => {
      expect(truncateString('Hi', 5)).toBe('Hi');
    });

    it('should handle exact length', () => {
      expect(truncateString('Hello', 5)).toBe('Hello');
    });

    it('should return empty string for empty input', () => {
      expect(truncateString('', 5)).toBe('');
    });
  });

  describe('capitalizeString', () => {
    it('should capitalize first letter', () => {
      expect(capitalizeString('hello')).toBe('Hello');
    });

    it('should lowercase rest of string', () => {
      expect(capitalizeString('HELLO')).toBe('Hello');
    });

    it('should handle single character', () => {
      expect(capitalizeString('a')).toBe('A');
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
    });

    it('should reject email without domain', () => {
      expect(isValidEmail('test@')).toBe(false);
    });

    it('should reject email without @', () => {
      expect(isValidEmail('testexample.com')).toBe(false);
    });

    it('should reject email with spaces', () => {
      expect(isValidEmail('test @example.com')).toBe(false);
    });
  });
});
