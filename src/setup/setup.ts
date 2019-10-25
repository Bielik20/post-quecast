import { LIB_ID } from '../models/constants';
import { Host } from '../models/host';
import { Coordinator } from './coordinator';

export function setupPostQuecast(host: Host = window): void {
  if (!!(host as any)[LIB_ID]) {
    throw Error(`You can only setup Post Quecast once on given host.`);
  }

  const coordinator = new Coordinator(host);

  coordinator.init();
  (host as any)[LIB_ID] = coordinator;
}
