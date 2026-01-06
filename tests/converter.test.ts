/**
 * Tests for youtube-like-id converter module.
 */

import { describe, it, expect } from 'vitest';
import {
  toAlphanumeric,
  toNumeric,
  create,
  Encoder,
  Transform,
  ConverterError,
  VERSION,
} from '../src';

describe('toAlphanumeric', () => {
  it('basic conversion', () => {
    expect(toAlphanumeric(12345)).toBe('dnh');
  });

  it('zero', () => {
    expect(toAlphanumeric(0)).toBe('a');
  });

  it('one', () => {
    expect(toAlphanumeric(1)).toBe('b');
  });

  it('single digit boundary', () => {
    expect(toAlphanumeric(61)).toBe('Z');
    expect(toAlphanumeric(62)).toBe('ba');
  });

  it('large number', () => {
    const result = toAlphanumeric(999999999);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('with secure key', () => {
    const result = toAlphanumeric(12345, { secureKey: 'my-secret' });
    expect(result).not.toBe(toAlphanumeric(12345));
    expect(typeof result).toBe('string');
  });

  it('different secure keys produce different results', () => {
    const result1 = toAlphanumeric(12345, { secureKey: 'key1' });
    const result2 = toAlphanumeric(12345, { secureKey: 'key2' });
    expect(result1).not.toBe(result2);
  });

  it('transform upper', () => {
    const result = toAlphanumeric(12345, { transform: Transform.UPPER });
    expect(result).toBe('DNH');
    expect(result).toBe(result.toUpperCase());
  });

  it('transform lower', () => {
    const result = toAlphanumeric(12345, { transform: Transform.LOWER });
    expect(result).toBe('dnh');
    expect(result).toBe(result.toLowerCase());
  });

  it('transform none', () => {
    const result = toAlphanumeric(12345, { transform: Transform.NONE });
    expect(result).toBe('dnh');
  });

  it('with pad up', () => {
    const resultNoPad = toAlphanumeric(1);
    const resultWithPad = toAlphanumeric(1, { padUp: 3 });
    expect(resultNoPad).not.toBe(resultWithPad);
  });

  it('combined options', () => {
    const result = toAlphanumeric(12345, {
      secureKey: 'secret',
      transform: Transform.UPPER,
    });
    expect(typeof result).toBe('string');
    expect(result).toBe(result.toUpperCase());
  });
});

describe('toNumeric', () => {
  it('basic conversion', () => {
    expect(toNumeric('dnh')).toBe(12345);
  });

  it('zero value', () => {
    expect(toNumeric('a')).toBe(0);
  });

  it('one value', () => {
    expect(toNumeric('b')).toBe(1);
  });

  it('boundary values', () => {
    expect(toNumeric('Z')).toBe(61);
    expect(toNumeric('ba')).toBe(62);
  });

  it('with secure key', () => {
    const encoded = toAlphanumeric(12345, { secureKey: 'my-secret' });
    const decoded = toNumeric(encoded, { secureKey: 'my-secret' });
    expect(decoded).toBe(12345);
  });

  it('wrong secure key produces wrong result', () => {
    const encoded = toAlphanumeric(12345, { secureKey: 'correct-key' });
    const decoded = toNumeric(encoded, { secureKey: 'wrong-key' });
    expect(decoded).not.toBe(12345);
  });

  it('with pad up', () => {
    const encoded = toAlphanumeric(100, { padUp: 3 });
    const decoded = toNumeric(encoded, { padUp: 3 });
    expect(decoded).toBe(100);
  });

  it('roundtrip', () => {
    for (const num of [0, 1, 10, 100, 1000, 12345, 999999]) {
      const encoded = toAlphanumeric(num);
      const decoded = toNumeric(encoded);
      expect(decoded).toBe(num);
    }
  });

  it('roundtrip with secure key', () => {
    for (const num of [0, 1, 100, 12345, 999999]) {
      const encoded = toAlphanumeric(num, { secureKey: 'test-key' });
      const decoded = toNumeric(encoded, { secureKey: 'test-key' });
      expect(decoded).toBe(num);
    }
  });
});

describe('Transform enum', () => {
  it('enum values exist', () => {
    expect(Transform.NONE).toBeDefined();
    expect(Transform.UPPER).toBeDefined();
    expect(Transform.LOWER).toBeDefined();
  });

  it('enum values are unique', () => {
    const values = [Transform.NONE, Transform.UPPER, Transform.LOWER];
    expect(new Set(values).size).toBe(values.length);
  });
});

describe('Encoder', () => {
  it('basic encode', () => {
    const enc = new Encoder();
    expect(enc.encode(12345)).toBe('dnh');
  });

  it('basic decode', () => {
    const enc = new Encoder();
    expect(enc.decode('dnh')).toBe(12345);
  });

  it('encode raw', () => {
    const enc = new Encoder({ transform: Transform.UPPER });
    const raw = enc.encodeRaw(12345);
    const display = enc.encode(12345);
    expect(raw).toBe('dnh');
    expect(display).toBe('DNH');
  });

  it('with secure key', () => {
    const enc = new Encoder({ secureKey: 'secret' });
    const encoded = enc.encode(12345);
    const decoded = enc.decode(encoded);
    expect(decoded).toBe(12345);
  });

  it('with transform', () => {
    const enc = new Encoder({ transform: Transform.UPPER });
    const result = enc.encode(12345);
    expect(result).toBe(result.toUpperCase());
  });

  it('with pad up', () => {
    const enc = new Encoder({ padUp: 3 });
    const encoded = enc.encode(100);
    const decoded = enc.decode(encoded);
    expect(decoded).toBe(100);
  });

  it('roundtrip', () => {
    const enc = new Encoder({ secureKey: 'test', padUp: 2 });
    for (const num of [0, 1, 100, 12345]) {
      const raw = enc.encodeRaw(num);
      const decoded = enc.decode(raw);
      expect(decoded).toBe(num);
    }
  });

  it('multiple encoders independence', () => {
    const enc1 = new Encoder({ secureKey: 'key1' });
    const enc2 = new Encoder({ secureKey: 'key2' });
    expect(enc1.encode(12345)).not.toBe(enc2.encode(12345));
  });
});

describe('create factory', () => {
  it('returns encoder', () => {
    const enc = create();
    expect(enc).toBeInstanceOf(Encoder);
  });

  it('with options', () => {
    const enc = create({
      secureKey: 'secret',
      transform: Transform.UPPER,
      padUp: 2,
    });
    const result = enc.encode(12345);
    expect(typeof result).toBe('string');
    expect(result).toBe(result.toUpperCase());
  });

  it('equivalent to Encoder', () => {
    const enc1 = create({ secureKey: 'test' });
    const enc2 = new Encoder({ secureKey: 'test' });
    expect(enc1.encode(12345)).toBe(enc2.encode(12345));
  });
});

describe('ConverterError', () => {
  it('is an Error', () => {
    const error = new ConverterError('test');
    expect(error).toBeInstanceOf(Error);
  });

  it('can be thrown and caught', () => {
    expect(() => {
      throw new ConverterError('test error');
    }).toThrow(ConverterError);
  });

  it('has correct message', () => {
    const error = new ConverterError('custom message');
    expect(error.message).toBe('custom message');
  });

  it('has correct name', () => {
    const error = new ConverterError('test');
    expect(error.name).toBe('ConverterError');
  });
});

describe('module exports', () => {
  it('VERSION is defined', () => {
    expect(VERSION).toBeDefined();
    expect(typeof VERSION).toBe('string');
  });

  it('all exports accessible', () => {
    expect(toAlphanumeric).toBeDefined();
    expect(toNumeric).toBeDefined();
    expect(Transform).toBeDefined();
    expect(Encoder).toBeDefined();
    expect(create).toBeDefined();
    expect(ConverterError).toBeDefined();
  });
});

describe('edge cases', () => {
  it('very large number', () => {
    const largeNum = 10 ** 15;
    const encoded = toAlphanumeric(largeNum);
    const decoded = toNumeric(encoded);
    expect(decoded).toBe(largeNum);
  });

  it('empty secure key treated as no key', () => {
    const resultNone = toAlphanumeric(12345);
    const resultEmpty = toAlphanumeric(12345, { secureKey: '' });
    // Empty string is falsy, so should be same as no key
    expect(resultNone).toBe(resultEmpty);
  });

  it('special characters in secure key', () => {
    const encoded = toAlphanumeric(12345, { secureKey: '!@#$%^&*()' });
    const decoded = toNumeric(encoded, { secureKey: '!@#$%^&*()' });
    expect(decoded).toBe(12345);
  });

  it('unicode secure key', () => {
    const encoded = toAlphanumeric(12345, { secureKey: 'ключ' });
    const decoded = toNumeric(encoded, { secureKey: 'ключ' });
    expect(decoded).toBe(12345);
  });

  it('long secure key', () => {
    const longKey = 'a'.repeat(1000);
    const encoded = toAlphanumeric(12345, { secureKey: longKey });
    const decoded = toNumeric(encoded, { secureKey: longKey });
    expect(decoded).toBe(12345);
  });

  it('consecutive numbers produce different outputs', () => {
    const results = Array.from({ length: 100 }, (_, i) => toAlphanumeric(i));
    expect(new Set(results).size).toBe(results.length);
  });

  it('pad up zero', () => {
    const result = toAlphanumeric(12345, { padUp: 0 });
    expect(result).toBe('dnh');
  });

  it('pad up one (same as zero)', () => {
    const result0 = toAlphanumeric(12345, { padUp: 0 });
    const result1 = toAlphanumeric(12345, { padUp: 1 });
    expect(result0).toBe(result1);
  });

  it('dictionary characters only', () => {
    const validChars = new Set(
      'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    );

    for (const num of [0, 1, 62, 100, 12345, 999999]) {
      const result = toAlphanumeric(num);
      for (const char of result) {
        expect(validChars.has(char)).toBe(true);
      }
    }
  });
});
