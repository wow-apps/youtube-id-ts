/**
 * Tests for hash module - pure JS SHA implementations.
 */

import { describe, it, expect } from 'vitest';
import { sha256, sha512, sha256Pure, sha512Pure } from '../src/hash';

describe('sha256', () => {
  it('hashes empty string', () => {
    const expected = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    expect(sha256('')).toBe(expected);
  });

  it('hashes "hello"', () => {
    const expected = '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824';
    expect(sha256('hello')).toBe(expected);
  });

  it('hashes "Hello World"', () => {
    const expected = 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e';
    expect(sha256('Hello World')).toBe(expected);
  });

  it('hashes unicode string', () => {
    // Just verify it produces a valid 64-char hex string
    const result = sha256('ключ');
    expect(result).toMatch(/^[a-f0-9]{64}$/);
  });

  it('hashes long string', () => {
    const longString = 'a'.repeat(1000);
    const result = sha256(longString);
    expect(result).toMatch(/^[a-f0-9]{64}$/);
  });
});

describe('sha512', () => {
  it('hashes empty string', () => {
    const expected = 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e';
    expect(sha512('')).toBe(expected);
  });

  it('hashes "hello"', () => {
    const expected = '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043';
    expect(sha512('hello')).toBe(expected);
  });

  it('hashes "Hello World"', () => {
    const expected = '2c74fd17edafd80e8447b0d46741ee243b7eb74dd2149a0ab1b9246fb30382f27e853d8585719e0e67cbda0daa8f51671064615d645ae27acb15bfb1447f459b';
    expect(sha512('Hello World')).toBe(expected);
  });

  it('hashes unicode string', () => {
    const result = sha512('ключ');
    expect(result).toMatch(/^[a-f0-9]{128}$/);
  });

  it('hashes long string', () => {
    const longString = 'a'.repeat(1000);
    const result = sha512(longString);
    expect(result).toMatch(/^[a-f0-9]{128}$/);
  });
});

describe('sha256Pure', () => {
  it('produces same result as sha256 for empty string', () => {
    expect(sha256Pure('')).toBe(sha256(''));
  });

  it('produces same result as sha256 for "hello"', () => {
    expect(sha256Pure('hello')).toBe(sha256('hello'));
  });

  it('produces same result as sha256 for "Hello World"', () => {
    expect(sha256Pure('Hello World')).toBe(sha256('Hello World'));
  });

  it('produces same result as sha256 for unicode', () => {
    expect(sha256Pure('ключ')).toBe(sha256('ключ'));
  });

  it('produces same result as sha256 for long string', () => {
    const longString = 'a'.repeat(1000);
    expect(sha256Pure(longString)).toBe(sha256(longString));
  });

  it('handles multi-block input', () => {
    // Input longer than 64 bytes to test multi-block processing
    const input = 'The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.';
    expect(sha256Pure(input)).toBe(sha256(input));
  });

  it('handles exact block size input', () => {
    // 55 bytes is the max that fits in one block with padding
    const input = 'a'.repeat(55);
    expect(sha256Pure(input)).toBe(sha256(input));
  });

  it('handles input requiring extra padding block', () => {
    // 56+ bytes requires an extra block for padding
    const input = 'a'.repeat(56);
    expect(sha256Pure(input)).toBe(sha256(input));
  });
});

describe('sha512Pure', () => {
  it('produces same result as sha512 for empty string', () => {
    expect(sha512Pure('')).toBe(sha512(''));
  });

  it('produces same result as sha512 for "hello"', () => {
    expect(sha512Pure('hello')).toBe(sha512('hello'));
  });

  it('produces same result as sha512 for "Hello World"', () => {
    expect(sha512Pure('Hello World')).toBe(sha512('Hello World'));
  });

  it('produces same result as sha512 for unicode', () => {
    expect(sha512Pure('ключ')).toBe(sha512('ключ'));
  });

  it('produces same result as sha512 for long string', () => {
    const longString = 'a'.repeat(1000);
    expect(sha512Pure(longString)).toBe(sha512(longString));
  });

  it('handles multi-block input', () => {
    // Input longer than 128 bytes to test multi-block processing
    const input = 'The quick brown fox jumps over the lazy dog. '.repeat(5);
    expect(sha512Pure(input)).toBe(sha512(input));
  });

  it('handles exact block size input', () => {
    // 111 bytes is the max that fits in one block with padding for SHA-512
    const input = 'a'.repeat(111);
    expect(sha512Pure(input)).toBe(sha512(input));
  });

  it('handles input requiring extra padding block', () => {
    // 112+ bytes requires an extra block for padding
    const input = 'a'.repeat(112);
    expect(sha512Pure(input)).toBe(sha512(input));
  });
});
