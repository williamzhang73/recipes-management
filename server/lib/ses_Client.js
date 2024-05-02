import { SESClient } from '@aws-sdk/client-ses';
import { fromEnv } from '@aws-sdk/credential-providers';
const config = {
  region: 'us-west-1',
  credentials: fromEnv(),
};
const sesClient = new SESClient(config);
export { sesClient };
