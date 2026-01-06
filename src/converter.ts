/**
 * Generate YouTube-style short IDs from numbers.
 * Lightweight, fast, and reversible base62 encoder with optional obfuscation.
 *
 * Authors:
 *   Oleksii Samara <oleksii@wildsoft.io> (https://github.com/wow-apps)
 *   Kevin van Zonneveld <kevin@transloadit.com> (https://github.com/kvz)
 */

import {sha256, sha512} from './hash';

/**
 * Raised when conversion fails.
 */
export class ConverterError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ConverterError';
    }
}

/**
 * Transformation options for alphanumeric output.
 */
export enum Transform {
    NONE = 0,
    UPPER = 1,
    LOWER = 2,
}

// Base dictionary: a-z + 0-9 + A-Z (62 characters)
const DICTIONARY = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DICT_LEN = DICTIONARY.length;

/**
 * Options for conversion functions.
 */
export interface ConvertOptions {
    /** Padding value for the conversion. */
    padUp?: number;
    /** Optional key to shuffle the dictionary for obfuscation. */
    secureKey?: string;
    /** Case transformation (NONE, UPPER, LOWER). */
    transform?: Transform;
}

/**
 * Convert a number to a short alphanumeric string.
 *
 * @param number - The number to convert.
 * @param options - Optional conversion settings.
 * @returns The alphanumeric string.
 *
 * @example
 * ```ts
 * toAlphanumeric(12345)
 * // => 'dnh'
 *
 * toAlphanumeric(12345, { transform: Transform.UPPER })
 * // => 'DNH'
 * ```
 */
export function toAlphanumeric(
    number: number,
    options: ConvertOptions = {}
): string {
    const {padUp = 0, secureKey, transform = Transform.NONE} = options;
    const dictionary = secureKey ? secureDictionary(secureKey) : DICTIONARY;
    const result = numToAlpha(number, dictionary, padUp);
    return applyTransform(result, transform);
}

/**
 * Convert an alphanumeric string back to a number.
 *
 * @param alphanumeric - The alphanumeric string to convert.
 * @param options - Optional conversion settings.
 * @returns The numeric value.
 *
 * @example
 * ```ts
 * toNumeric('dnh')
 * // => 12345
 * ```
 */
export function toNumeric(
    alphanumeric: string,
    options: Omit<ConvertOptions, 'transform'> = {}
): number {
    const {padUp = 0, secureKey} = options;
    const dictionary = secureKey ? secureDictionary(secureKey) : DICTIONARY;
    return alphaToNum(alphanumeric, dictionary, padUp);
}

/**
 * Reusable encoder with preset options.
 *
 * @example
 * ```ts
 * const enc = new Encoder({ secureKey: 'secret', transform: Transform.UPPER });
 * enc.encode(12345);
 * // => 'HQJ'
 * enc.decode('hqj');
 * // => 12345
 * ```
 */
export class Encoder {
    private readonly padUp: number;
    private readonly transform: Transform;
    private readonly dictionary: string;

    constructor(options: ConvertOptions = {}) {
        this.padUp = options.padUp ?? 0;
        this.transform = options.transform ?? Transform.NONE;
        this.dictionary = options.secureKey
            ? secureDictionary(options.secureKey)
            : DICTIONARY;
    }

    /**
     * Convert a number to an alphanumeric string.
     * Returns the transformed result (if transform was set).
     * For the raw (non-transformed) result, use encodeRaw().
     */
    encode(number: number): string {
        const result = numToAlpha(number, this.dictionary, this.padUp);
        return applyTransform(result, this.transform);
    }

    /**
     * Convert a number to an alphanumeric string without transform.
     */
    encodeRaw(number: number): string {
        return numToAlpha(number, this.dictionary, this.padUp);
    }

    /**
     * Convert an alphanumeric string back to a number.
     * Expects the raw (non-transformed) value from encodeRaw().
     */
    decode(alphanumeric: string): number {
        return alphaToNum(alphanumeric, this.dictionary, this.padUp);
    }
}

/**
 * Create a reusable encoder with preset options.
 *
 * @param options - Encoder configuration.
 * @returns An Encoder instance.
 *
 * @example
 * ```ts
 * const enc = create({ secureKey: 'my-secret', transform: Transform.UPPER });
 * enc.encode(12345);
 * // => 'HQJ'
 * ```
 */
export function create(options: ConvertOptions = {}): Encoder {
    return new Encoder(options);
}

// --- Private functions ---

/**
 * Shuffle the dictionary based on a secure key.
 * This makes it harder to calculate the corresponding numeric ID
 * without knowing the key.
 */
function secureDictionary(secureKey: string): string {
    const sha256Hash = sha256(secureKey);
    const secureHash =
        sha256Hash.length < DICT_LEN ? sha512(secureKey) : sha256Hash;

    // Pair hash characters with dictionary characters and sort
    const pairs: [string, string][] = [];
    for (let i = 0; i < DICT_LEN; i++) {
        pairs.push([secureHash[i]!, DICTIONARY[i]!]);
    }

    // Sort by hash character in reverse order
    pairs.sort((a, b) => (b[0] > a[0] ? 1 : b[0] < a[0] ? -1 : 0));

    return pairs.map(([, char]) => char).join('');
}

/**
 * Convert number to alphanumeric string.
 */
function numToAlpha(number: number, dictionary: string, padUp: number): string {
    if (padUp > 1) {
        number += Math.pow(DICT_LEN, padUp - 1);
    }

    if (number === 0) {
        return dictionary[0]!;
    }

    const output: string[] = [];
    let t = Math.floor(Math.log(number) / Math.log(DICT_LEN));

    while (t >= 0) {
        const bcp = Math.pow(DICT_LEN, t);
        const index = Math.floor(number / bcp) % DICT_LEN;
        output.push(dictionary[index]!);
        number -= index * bcp;
        t -= 1;
    }

    return output.join('');
}

/**
 * Convert alphanumeric string to number.
 */
function alphaToNum(
    alphanumeric: string,
    dictionary: string,
    padUp: number
): number {
    let result = 0;

    const chars = alphanumeric.split('').reverse();
    for (let i = 0; i < chars.length; i++) {
        const char = chars[i]!;
        const index = dictionary.indexOf(char);
        result += index * Math.pow(DICT_LEN, i);
    }

    if (padUp > 1) {
        result -= Math.pow(DICT_LEN, padUp - 1);
    }

    return result;
}

/**
 * Apply case transformation.
 */
function applyTransform(value: string, transform: Transform): string {
    switch (transform) {
        case Transform.NONE:
            return value;
        case Transform.UPPER:
            return value.toUpperCase();
        case Transform.LOWER:
            return value.toLowerCase();
        default:
            throw new ConverterError(`Invalid transform type: ${transform}`);
    }
}
