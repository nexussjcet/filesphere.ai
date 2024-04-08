// @ts-nocheck

import { readFile, readDir, isDir } from "@/app/fs-api";
import { auth } from "@/auth";
import { Textarea } from "@/components/ui/textarea";
import { google } from "googleapis";
import Link from "next/link";
import { notFound } from "next/navigation";

async function setupOAuth2Client() {
  const session = await auth();
  if (!session) return notFound();
  const oauth2Client = new google.auth.OAuth2({});
  oauth2Client.setCredentials({
    access_token: session.accessToken,
    refresh_token: session.refreshToken,
  });
  if (
    (await oauth2Client.getTokenInfo(session.accessToken)).expiry_date <
    Date.now() / 1000
  ) {
    const { credentials } = await oauth2Client.refreshAccessToken();
    const newAccessToken = credentials.access_token;
    session.accessToken = newAccessToken!;
  }
  return oauth2Client;
}


async function listGoogleContacts() {
  try {
    const oauth2Client = await setupOAuth2Client();
    if (!oauth2Client) return null;

    const people = google.people({ version: "v1", auth: oauth2Client });
    const contactsResponse = await people.people.connections.list({
      resourceName: "people/me",
      pageSize: 50,
      personFields: "names,emailAddresses",
    });
    const contacts = contactsResponse.data.connections;
    if (!contacts) {
      throw new Error("No contacts found");
    }
    return contacts;
  } catch (error) {
    console.error("Error listing contacts:", error);
  }
}



async function sendEmail(recipient: string, subject: string, body: string) {
  try {
    const oauth2Client = await setupOAuth2Client();
    const session = await auth();
    if (!oauth2Client) return;

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const rawEmail = makeRawEmail(
      session?.user.email ?? "",
      recipient,
      subject,
      body,
    );
    const encodedEmail = Buffer.from(rawEmail)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedEmail,
      },
    });

    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}


function makeRawEmail(
  sender: string,
  recipient: string,
  subject: string,
  body: string,
): string {
  const emailLines = [
    `From: ${sender}`,
    `To: ${recipient}`,
    "Content-Type: text/html; charset=utf-8",
    `Subject: ${subject}`,
    "",
    body,
  ];

  return emailLines.join("\r\n");
}

export default async function Page({ params }: { params: { id: string[] } }) {

  const Path = `/${params.id?.join('/')}/`
  const isDct = await isDir(Path)
  const read = await readDir(`/${Path}`, false)
  const data = !isDct && await readFile(Path.replace(/\/$/, ''))
  const users = await listGoogleContacts()

  const namesArray = users?.map((item: any) => {
    if (item.names && item.names.length > 0) {
      return item.names[0].displayName; // Extract displayName from the first names array item
    }
    return null; // Handle cases where names array is empty
  });

  return (
    <div className="border h-full pb-32
    grid grid-cols-4 gap-5 p-5
    ">

      {
        read.data?.files?.length > 0 ? <div className={`bg-primary/20 border overflow-scroll max-w-sm h-full rounded-md p-5 w-full space-y-3 ${data.success == true ? "hidden" : "block"}`}>
          {
            read.data?.files?.map((item, key) => {
              return (
                <div key={key} className="border-b border-foreground/20 py-2 border-600">
                  <Link href={`/dashboard/${read.data.path}${item}`}>{item}
                  </Link>
                </div>
              )
            })

          }
        </div>
          : <>
            {
              data.sucess == false || read.data?.files?.length < 0 && <div>
                Empty Folder...!
              </div>
            }
          </>
      }

      {
        data.success == true && <div className="col-span-3 flex flex-col justify-between container mx-auto">
          <div>
            {
              <p className="line-clamp-3">
                {data.data}
              </p>
            }
          </div>
          <Textarea rows={2} />
        </div>
      }
      {
        data.success == true && <div className="bg-primary/20 border overflow-scroll rounded-md p-5">
          <pre>
            {
              JSON.stringify(namesArray, null, 2)
            }
          </pre>
        </div>
      }


    </div>





  );
}
