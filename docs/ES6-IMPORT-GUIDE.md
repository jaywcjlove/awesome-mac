ES6 Import Support Guide
===

The `awesome-mac` package now supports ES6 module imports for JSON data.

## Installation

```bash
npm install awesome-mac
```

## Usage

### ES6 Module Import (Node.js)

```javascript
// Import default English data
import data from 'awesome-mac' with { type: 'json' };

// Import Korean data
import koData from 'awesome-mac/ko' with { type: 'json' };

// Import Japanese data
import jaData from 'awesome-mac/ja' with { type: 'json' };

// Import Chinese data
import zhData from 'awesome-mac/zh' with { type: 'json' };

console.log('Mac app data:', data);
console.log('Total categories:', data.length);
```

### CommonJS Import (Traditional Node.js)

```javascript
// Import default English data
const data = require('awesome-mac');

// Import other language versions
const koData = require('awesome-mac/ko');
const jaData = require('awesome-mac/ja');
const zhData = require('awesome-mac/zh');
```

### TypeScript

To use with TypeScript, you can create type declarations:

```typescript
// types/awesome-mac.d.ts
declare module 'awesome-mac' {
  interface AppInfo {
    icons: Array<{type: string, url: string}>;
    title: string;
    url: string;
  }
  
  interface CategoryItem {
    type: string;
    value?: string;
    children?: any[];
    mark?: AppInfo;
  }
  
  const data: CategoryItem[];
  export default data;
}

declare module 'awesome-mac/ko' {
  import { CategoryItem } from 'awesome-mac';
  const data: CategoryItem[];
  export default data;
}

declare module 'awesome-mac/ja' {
  import { CategoryItem } from 'awesome-mac';
  const data: CategoryItem[];
  export default data;
}

declare module 'awesome-mac/zh' {
  import { CategoryItem } from 'awesome-mac';
  const data: CategoryItem[];
  export default data;
}
```

## Available Import Paths

- `awesome-mac` - Default English data
- `awesome-mac/ko` - Korean data
- `awesome-mac/ja` - Japanese data  
- `awesome-mac/zh` - Chinese data

## Data Structure

Each JSON file contains an array representing different app categories and app information. Each app entry includes:

- `title`: Application name
- `url`: Application official website link
- `icons`: Contains app type icon information (open source, free, App Store, etc.)

## Compatibility

- ✅ Node.js ES6 modules (requires `with { type: 'json' }`)
- ✅ Node.js CommonJS
- ✅ Modern bundlers (Webpack, Vite, etc.)
- ✅ TypeScript (requires type declarations)

## Notes

When importing JSON files in newer versions of Node.js, you need to use import assertions:

```javascript
import data from 'awesome-mac' with { type: 'json' };
```

This is a security feature requirement of Node.js.