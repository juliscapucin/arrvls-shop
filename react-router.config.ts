import type {Config} from '@react-router/dev/config';
import {hydrogenPreset} from '@shopify/hydrogen';

export default {
  presets: [hydrogenPreset()],
} satisfies Config;
