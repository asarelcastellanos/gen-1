import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req }) as Session & { accessToken: string };

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { accessToken } = session;
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  try {
    const calendarList = await calendar.calendarList.list();

    res.status(200).json({ calendars: calendarList.data.items });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export default handler;