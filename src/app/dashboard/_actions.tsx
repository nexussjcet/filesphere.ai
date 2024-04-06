"use server";

import { getServerAuthSession } from "@/server/auth";
import { google } from "googleapis";
import { notFound } from "next/navigation";

async function setupOAuth2Client() {
  const session = await getServerAuthSession();
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
    session.accessToken = newAccessToken as string;
  }
  return oauth2Client;
}

async function listGoogleDriveFiles() {
  try {
    const oauth2Client = await setupOAuth2Client();
    if (!oauth2Client) return null;
    const drive = google.drive({ version: "v3", auth: oauth2Client });
    const driveResponse = await drive.files.list({
      fields: "files(id, name, mimeType)",
      q: "mimeType='text/plain' or mimeType='application/pdf' or mimeType='application/vnd.google-apps.document' or mimeType='text/markdown'",
    });
    const files = driveResponse.data.files;
    if (!files) {
      throw new Error("No files found");
    }
    return files;
  } catch (error) {
    console.error("Error listing or searching files:", error);
  }
}

async function listGoogleContacts() {
  try {
    const oauth2Client = await setupOAuth2Client();
    if (!oauth2Client) return null;

    const people = google.people({ version: "v1", auth: oauth2Client });
    const contactsResponse = await people.people.connections.list({
      resourceName: "people/me",
      pageSize: 50,
      // fields: "",
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
    const session = await getServerAuthSession();
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

async function getGoogleDriveFile(fileId: string) {
  try {
    const oauth2Client = await setupOAuth2Client();
    if (!oauth2Client) return null;

    const drive = google.drive({ version: "v3", auth: oauth2Client });
    const fileResponse = await drive.files.get({
      fileId: fileId,
      fields: "id, name, mimeType",
    });
    const { name, mimeType, id } = fileResponse.data;
    return {
      id,
      name,
      mimeType,
    };
  } catch (error) {
    console.error("Error getting file:", error);
    return null;
  }
}

export {
  listGoogleDriveFiles,
  listGoogleContacts,
  sendEmail,
  getGoogleDriveFile,
};
