/**
 * youtube-like-id: Generate YouTube-style short IDs from numbers.
 * Lightweight, fast, and reversible base62 encoder with optional obfuscation.
 *
 * Authors:
 *   Oleksii Samara <oleksii@wildsoft.io> (https://github.com/wow-apps)
 *   Kevin van Zonneveld <kevin@transloadit.com> (https://github.com/kvz)
 *
 * @example
 * ```ts
 * import { toAlphanumeric, toNumeric, Transform } from 'youtube-like-id';
 *
 * toAlphanumeric(12345);
 * // => 'dnh'
 *
 * toNumeric('dnh');
 * // => 12345
 *
 * // With secure key
 * toAlphanumeric(12345, { secureKey: 'secret' });
 * // => 'hqj'
 *
 * // Using encoder factory
 * const enc = create({ secureKey: 'secret', transform: Transform.UPPER });
 * enc.encode(12345);
 * // => 'HQJ'
 * ```
 */

export {
    toAlphanumeric,
    toNumeric,
    create,
    Encoder,
    Transform,
    ConverterError,
} from './converter';

export type {ConvertOptions} from './converter';

export const VERSION = '1.0.4';
