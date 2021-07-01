import { types } from './preparedTypes'
import { newLogger } from '@darkpay/dark-utils';
import { registry } from './registry';

const logger = newLogger('registerDarkdotTypes')

export const registerDarkdotTypes = (): void => {
  try {
    registry.register(types);
  } catch (err) {
    logger.error('Failed to register custom types of Darkdot blockchain:', err.stack);
  }
};

export default registerDarkdotTypes;
