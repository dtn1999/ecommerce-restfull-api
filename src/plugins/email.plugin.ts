/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import Hapi from '@hapi/hapi';
import sendgrid from '@sendgrid/mail';

declare module '@hapi/hapi' {
    interface ServerApplicationState {
        sendEmailToken(email:string, firstName:string, token:string):Promise<void>
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
async function sendEmailToken(email:string, firstName:string, emailToken:string):Promise<void> {
  const msg = {
    to: email,
    from: 'danylsngongang@hotmail.com',
    subject: 'Login token for the ECommerce Platform',
    text: `The Login token for the ECommerce Platform is: ${emailToken}`,
    html: `
    <!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">

    <title></title>

    <style type="text/css">
        a {
            color: #0000ee;
            text-decoration: underline;
        }
        
        @media only screen and (min-width: 660px) {
            .u-row {
                width: 640px !important;
            }
            .u-row .u-col {
                vertical-align: top;
            }
            .u-row .u-col-50 {
                width: 320px !important;
            }
            .u-row .u-col-100 {
                width: 640px !important;
            }
        }
        
        @media (max-width: 660px) {
            .u-row-container {
                max-width: 100% !important;
                padding-left: 0px !important;
                padding-right: 0px !important;
            }
            .u-row .u-col {
                min-width: 320px !important;
                max-width: 100% !important;
                display: block !important;
            }
            .u-row {
                width: calc(100% - 40px) !important;
            }
            .u-col {
                width: 100% !important;
            }
            .u-col>div {
                margin: 0 auto;
            }
        }
        
        body {
            margin: 0;
            padding: 0;
        }
        
        table,
        tr,
        td {
            vertical-align: top;
            border-collapse: collapse;
        }
        
        p {
            margin: 0;
        }
        
        .ie-container table,
        .mso-container table {
            table-layout: fixed;
        }
        
        * {
            line-height: inherit;
        }
        
        a[x-apple-data-detectors='true'] {
            color: inherit !important;
            text-decoration: none !important;
        }
    </style>



</head>

<body class="clean-body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #e7e7e7">

    <table style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #e7e7e7;width:100%" cellpadding="0" cellspacing="0">
        <tbody>
            <tr style="vertical-align: top">
                <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">


                    <div class="u-row-container" style="padding: 0px;background-color: transparent">
                        <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 640px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                            <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">

                                <div class="u-col u-col-50" style="max-width: 320px;min-width: 320px;display: table-cell;vertical-align: top;">
                                    <div style="width: 100% !important;">
                                        <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">

                                        </div>
                                    </div>
                                </div>
                                <div class="u-col u-col-50" style="max-width: 320px;min-width: 320px;display: table-cell;vertical-align: top;">
                                    <div style="width: 100% !important;">
                                        <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    <div class="u-row-container" style="padding: 0px;background-color: transparent">
                        <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 640px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #f7dbbe;">
                            <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">

                                <div class="u-col u-col-100" style="max-width: 320px;min-width: 640px;display: table-cell;vertical-align: top;">
                                    <div style="width: 100% !important;">
                                        <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">

                                            <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td style="overflow-wrap:break-word;word-break:break-word;padding:30px 10px 20px;font-family:arial,helvetica,sans-serif;" align="left">

                                                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                                <tr>
                                                                    <td style="padding-right: 0px;padding-left: 0px;" align="center">

                                                                        <img align="center" border="0" src="https://img.bayengage.com/assets/1602556050089-banner (4).png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 421px;"
                                                                            width="421" />

                                                                    </td>
                                                                </tr>
                                                            </table>

                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    <div class="u-row-container" style="padding: 0px;background-color: transparent">
                        <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 640px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #f7dbbe;">
                            <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">

                                <div class="u-col u-col-100" style="max-width: 320px;min-width: 640px;display: table-cell;vertical-align: top;">
                                    <div style="width: 100% !important;">
                                        <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">

                                            <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

                                                            <div style="color: #000000; line-height: 150%; text-align: left; word-wrap: break-word;">
                                                                <p style="font-size: 14px; line-height: 150%; text-align: center;"><span style="color: #444444; font-size: 14px; line-height: 21px;"><strong><span style="font-size: 38px; line-height: 57px;">WELCOME</span></strong>
                                                                    </span>
                                                                </p>
                                                                <p style="font-size: 14px; line-height: 150%; text-align: center;"><strong><span style="font-size: 38px; line-height: 57px;"><span style="color: #ec8c30; font-size: 38px; line-height: 57px;">${firstName}</span></span></strong></p>
                                                            </div>

                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 15px;font-family:arial,helvetica,sans-serif;" align="left">

                                                            <div style="color: #000000; line-height: 150%; text-align: left; word-wrap: break-word;">
<<<<<<< HEAD
                                                                <p style="font-size: 14px; line-height: 150%; text-align: center;"><span style="font-size: 16px; line-height: 24px; color: #444444;">Thanks for signing up for our updates.&nbsp; First we want to check your identity. Use the following token to complete your authentication</span></p>
=======
                                                                <p style="font-size: 14px; line-height: 150%; text-align: center;"><span style="font-size: 16px; line-height: 24px; color: #444444;">Thanks for signing up for our updates.&nbsp; First want to check your identity click on the button below to complete your authentication</span></p>
>>>>>>> caaf07c58dd9e3645c2a8f62d339fc43140676a3
                                                            </div>

                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 30px;font-family:arial,helvetica,sans-serif;" align="left">

                                                            <div align="center">
<<<<<<< HEAD
                                                                <div style="box-sizing: border-box;display: inline-block;font-family:arial,helvetica,sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #ec8c30; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;">
                                                                    <span style="display:block;padding:10px 20px;line-height:120%;">${emailToken}</span>
                                                                </div>
=======
                                                                <a href="http://192.168.178.138:3000" target="_blank" style="box-sizing: border-box;display: inline-block;font-family:arial,helvetica,sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #ec8c30; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;">
                                                                    <span style="display:block;padding:10px 20px;line-height:120%;">Complete Authentication</span>
                                                                </a>
>>>>>>> caaf07c58dd9e3645c2a8f62d339fc43140676a3
                                                            </div>

                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    <div class="u-row-container" style="padding: 0px;background-color: transparent">
                        <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 640px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                            <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">

                                <div class="u-col u-col-100" style="max-width: 320px;min-width: 640px;display: table-cell;vertical-align: top;">
                                    <div style="width: 100% !important;">
                                        <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">

                                            <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td style="overflow-wrap:break-word;word-break:break-word;padding:20px 10px 30px;font-family:arial,helvetica,sans-serif;" align="left">

                                                            <div align="center">
                                                                <div style="display: table; max-width:125px;">


                                                                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 10px">
                                                                        <tbody>
                                                                            <tr style="vertical-align: top">
                                                                                <td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                                                                    <a href="https://facebook.com/" title="Facebook" target="_blank">
                                                                                        <img src="https://cdn.tools.unlayer.com/social/icons/circle/facebook.png" alt="Facebook" title="Facebook" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                                                                    </a>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>

                                                                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 10px">
                                                                        <tbody>
                                                                            <tr style="vertical-align: top">
                                                                                <td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                                                                    <a href="https://twitter.com/" title="Twitter" target="_blank">
                                                                                        <img src="https://cdn.tools.unlayer.com/social/icons/circle/twitter.png" alt="Twitter" title="Twitter" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                                                                    </a>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>

                                                                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 0px">
                                                                        <tbody>
                                                                            <tr style="vertical-align: top">
                                                                                <td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                                                                    <a href="https://instagram.com/" title="Instagram" target="_blank">
                                                                                        <img src="https://cdn.tools.unlayer.com/social/icons/circle/instagram.png" alt="Instagram" title="Instagram" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                                                                    </a>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>


                                                                </div>
                                                            </div>

                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>
    `,
  };
  await sendgrid.send(msg);
}

async function debugSendEmailToken(email:string,
  firstName:string, emailToken:string):Promise<void> {
  console.log(`email token for ${email} : ${emailToken}`);
}
