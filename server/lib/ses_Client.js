import { SESClient } from '@aws-sdk/client-ses';
import 'dotenv/config';
const config = {
  region: 'us-west-1',
};
const sesClient = new SESClient(config);
export { sesClient };
