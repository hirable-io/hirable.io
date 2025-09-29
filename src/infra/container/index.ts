import { configureInfra } from './infra';
import { configureApplication } from './application';

export function configureContainer() {
  return configureInfra().extend(configureApplication);
}

export const container = configureContainer();

export default configureContainer;
