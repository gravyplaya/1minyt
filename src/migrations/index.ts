import * as migration_20250617_223939 from './20250617_223939';
import * as migration_20250617_224402 from './20250617_224402';

export const migrations = [
  {
    up: migration_20250617_223939.up,
    down: migration_20250617_223939.down,
    name: '20250617_223939',
  },
  {
    up: migration_20250617_224402.up,
    down: migration_20250617_224402.down,
    name: '20250617_224402'
  },
];
