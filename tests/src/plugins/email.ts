/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import Hapi from '@hapi/hapi';
import sendgrid from '@sendgrid/mail';

declare module '@hapi/hapi' {
    interface ServerApplicationState {
        sendEmailToken(email:string, token:string):Promise<void>
    }
}

const emailPlugin:Hapi.Plugin<undefined> = {
  name: 'app/email',
  register: async (server:Hapi.Server) => {
    if (!process.env.SENDGRIP_API_KEY) {
      console.warn("the SENDGRIP_API_KEY must be set otherweise the api won't be able to send emails", 'Using debug mode which log the email token instead');
      server.app.sendEmailToken = debugSendEmailToken;
    } else {
      sendgrid.setApiKey(process.env.SENDGRIP_API_KEY);
      server.app.sendEmailToken = sendEmailToken;
    }
  },
};

export default emailPlugin;
async function sendEmailToken(email:string, emailToken:string):Promise<void> {
  const msg = {
    to: email,
    from: 'danylsngongang@hotmail.com',
    subject: 'Login token for the T-Zoom API',
    text: `The Login token for the T-Zoom Text Api is: ${emailToken}`,
    html: `
    <div>
      <h1 style="text-align:center;">Wellcome to TXT-Zoom</h1>
      <p> To Complete your login you first need to authenticate with the following link <h2 style="color:blue;">${emailToken}</h2></p>
    </div>
    `,
  };
  await sendgrid.send(msg);
}

async function debugSendEmailToken(email:string, emailToken:string):Promise<void> {
  console.log(`email token for ${email} : ${emailToken}`);
}
