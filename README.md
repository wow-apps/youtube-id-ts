# YouTubeID for TypeScript

Generate YouTube-style short IDs from numbers. Lightweight, fast, and reversible base62 encoder with optional obfuscation.

[![npm version](https://badge.fury.io/js/youtube-id.svg)](https://badge.fury.io/js/youtube-id)
[![Node.js 18+](https://img.shields.io/badge/node-18+-blue.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

## Other programming languages

- **PHP**: [kvz/youtube-id](https://github.com/kvz/youtube-id)
- **Python**: [wow-apps/youtube-id-py](https://github.com/wow-apps/youtube-id-py/)
- **TypeScript**: [wow-apps/youtube-id-ts](https://github.com/wow-apps/youtube-id-ts/)
- **Go**: [wow-apps/youtube-id-go](https://github.com/wow-apps/youtube-id-go/)

## Features

- **Lightweight** - Zero dependencies, pure TypeScript
- **Fast** - Simple base62 encoding/decoding
- **Reversible** - Encode and decode without data loss
- **Obfuscation** - Optional secure key to shuffle the dictionary
- **Type-safe** - Full TypeScript support with strict types
- **Universal** - Works in Node.js and browsers (ESM + CJS)

## Installation

```bash
npm install youtube-id
```

Or with yarn/pnpm:

```bash
yarn add youtube-id
pnpm add youtube-id
```

## Quick Start

```typescript
import { toAlphanumeric, toNumeric } from 'youtube-id';

// Encode a number to a short string
toAlphanumeric(12345);  // -> 'dnh'

// Decode back to number
toNumeric('dnh');  // -> 12345
```

## Usage

### Basic Encoding/Decoding

```typescript
import { toAlphanumeric, toNumeric } from 'youtube-id';

// Number to alphanumeric
toAlphanumeric(0);        // -> 'a'
toAlphanumeric(61);       // -> 'Z'
toAlphanumeric(62);       // -> 'ba'
toAlphanumeric(12345);    // -> 'dnh'
toAlphanumeric(999999);   // -> 'eGGf'

// Alphanumeric to number
toNumeric('dnh');         // -> 12345
```

### With Secure Key (Obfuscation)

Use a secure key to shuffle the dictionary, making IDs harder to predict:

```typescript
import { toAlphanumeric, toNumeric } from 'youtube-id';

// Without key
toAlphanumeric(12345);                          // -> 'dnh'

// With secure key (different output)
toAlphanumeric(12345, { secureKey: 'secret' }); // -> 'UDJ'

// Decode with the same key
toNumeric('UDJ', { secureKey: 'secret' });      // -> 12345
```

### Case Transformation

```typescript
import { toAlphanumeric, Transform } from 'youtube-id';

toAlphanumeric(12345, { transform: Transform.UPPER });  // -> 'DNH'
toAlphanumeric(12345, { transform: Transform.LOWER });  // -> 'dnh'
```

### Encoder Factory

For repeated operations with the same settings, use the `Encoder` class:

```typescript
import { create, Transform } from 'youtube-id';

// Create encoder with preset options
const enc = create({ secureKey: 'my-secret', transform: Transform.UPPER });

// Encode
enc.encode(12345);      // -> 'HQJ' (transformed for display)
enc.encodeRaw(12345);   // -> 'hqj' (raw for storage/decoding)

// Decode
enc.decode('hqj');      // -> 12345
```

## API Reference

### Functions

#### `toAlphanumeric(number, options?)`

Convert a number to a short alphanumeric string.

| Parameter           | Type        | Default  | Description               |
|---------------------|-------------|----------|---------------------------|
| `number`            | `number`    | required | The number to convert     |
| `options.padUp`     | `number`    | `0`      | Padding value             |
| `options.secureKey` | `string`    | -        | Key to shuffle dictionary |
| `options.transform` | `Transform` | `NONE`   | Case transformation       |

#### `toNumeric(alphanumeric, options?)`

Convert an alphanumeric string back to a number.

| Parameter           | Type     | Default  | Description                         |
|---------------------|----------|----------|-------------------------------------|
| `alphanumeric`      | `string` | required | The string to convert               |
| `options.padUp`     | `number` | `0`      | Padding value (must match encoding) |
| `options.secureKey` | `string` | -        | Key (must match encoding)           |

#### `create(options?)`

Create a reusable `Encoder` instance with preset options.

### Classes

#### `Encoder`

Reusable encoder with preset options.

- `encode(number)` - Convert number to alphanumeric (with transform)
- `encodeRaw(number)` - Convert number to alphanumeric (without transform)
- `decode(alphanumeric)` - Convert alphanumeric to number

#### `Transform`

Enum for case transformation:

- `Transform.NONE` - No transformation
- `Transform.UPPER` - Uppercase output
- `Transform.LOWER` - Lowercase output

### Types

```typescript
interface ConvertOptions {
  padUp?: number;
  secureKey?: string;
  transform?: Transform;
}
```

## Use Cases

- **URL shorteners** - Convert database IDs to short URLs
- **Public IDs** - Hide sequential database IDs from users
- **Share codes** - Generate readable codes for sharing
- **Invite links** - Create short invitation tokens

## Performance

The library uses base62 encoding (a-z, 0-9, A-Z) which provides:

| Number Range         | Output Length |
|----------------------|---------------|
| 0 - 61               | 1 character   |
| 62 - 3,843           | 2 characters  |
| 3,844 - 238,327      | 3 characters  |
| 238,328 - 14,776,335 | 4 characters  |

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).

```bash
# Clone and setup
git clone https://github.com/wow-apps/youtube-id-ts.git
cd youtube-id-ts
npm install

# Run tests
npm test

# Build
npm run build
```

## Credits

A TypeScript port of the YouTube-style ID generator originally created by [Kevin van Zonneveld](https://github.com/kvz) and contributors.

## License

[MIT](LICENSE) © Oleksii Samara, Kevin van Zonneveld
