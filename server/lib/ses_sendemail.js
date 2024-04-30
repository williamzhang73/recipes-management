// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/*
ABOUT THIS NODE.JS EXAMPLE: This example works with the AWS SDK for JavaScript version 3 (v3),
which is available at https://github.com/aws/aws-sdk-js-v3. This example is in the 'AWS SDK for JavaScript v3 Developer Guide' at
https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/s3-example-creating-buckets.html.

Purpose:
ses_sendemail.js demonstrates how to send an email using Amazon SES.

Running the code:
node ses_sendemail.js

*/
// snippet-start:[ses.JavaScript.email.sendEmailV3]
import { SendEmailCommand } from '@aws-sdk/client-ses';
import { sesClient } from './ses_Client.js';

const createSendEmailCommand = (toAddress, fromAddress) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        toAddress,
        /* more To-email addresses */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: '<p>html body section.</p>',
        },
        Text: {
          Charset: 'UTF-8',
          Data: 'text section.',
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'subject section',
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const run = async () => {
  console.log('run() is called.');
  const sendEmailCommand = createSendEmailCommand(
    'willzhang73@gmail.com',
    'willzhang73@gmail.com'
  );

  try {
    const dataSent = await sesClient.send(sendEmailCommand);
    return dataSent;
  } catch (e) {
    console.error('Failed to send email.', e);
    return e;
  }
};
run();
// snippet-end:[ses.JavaScript.email.sendEmailV3]
export { run };
