import { getValidImage } from '@/services/ongs.service';

describe('ONG Service', () => {
  describe('getValidImage', () => {
    const BANNER_PLACEHOLDER = "https://placehold.co/1200x400/F3F4F6/9CA3AF?text=DoeCerto";
    const LOGO_PLACEHOLDER = "https://placehold.co/400x400/E5E7EB/9CA3AF?text=ONG";

    it('should return banner placeholder when url is empty', () => {
      expect(getValidImage('', true)).toBe(BANNER_PLACEHOLDER);
    });

    it('should return logo placeholder when url is empty', () => {
      expect(getValidImage('', false)).toBe(LOGO_PLACEHOLDER);
    });

    it('should return placeholder for null url', () => {
      expect(getValidImage(undefined, true)).toBe(BANNER_PLACEHOLDER);
    });

    it('should return placeholder for "null" string', () => {
      expect(getValidImage('null', false)).toBe(LOGO_PLACEHOLDER);
    });

    it('should construct absolute path for relative URLs', () => {
      const url = '/uploads/logo.jpg';
      const result = getValidImage(url, false);
      expect(result).toContain(url);
    });

    it('should return absolute URL as-is', () => {
      const url = 'https://example.com/image.jpg';
      expect(getValidImage(url, false)).toBe(url);
    });
  });
});
