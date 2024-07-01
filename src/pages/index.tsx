import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface Event {
  id: string;
  summary: string;
  start: {
    dateTime: string;
  };
}

export default function Home() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (session) {
      fetch('/api/calendar_events')
        .then((response) => response.json())
        .then((data) => {
          if (data.events) {
            console.log(data.events);
            setEvents(data.events);
          } else {
            console.error("No events found in the response");
          }
        })
        .catch((error) => {
          console.error("Failed to fetch events:", error);
        });
    }
    // if (session) {
    //   fetch('/api/calendar_list')
    //     .then((response) => response.json())
    //     .then((data) => {
    //       if (data.calendars) {
    //         console.log(data.calendars);
    //         setEvents(data.calendars);
    //       } else {
    //         console.error("No calendars found in the response");
    //       }
    //     })
    //     .catch((error) => {
    //       console.error("Failed to fetch calendars:", error);
    //     });
    // }
  }, [session]);

  console.log(session)

  return (
    <div>
      {!session ? (
        <>
          <h1>Not signed in</h1>
          <button onClick={() => signIn('google')}>Sign in with Google</button>
        </>
      ) : (
        <>
          <h1>Signed in as {session.user?.email}</h1>
          <button onClick={() => signOut()}>Sign out</button>
          <h2>Events</h2>
          <ul>
            {events.length > 0 ? (
              events.map((event) => (
                <li key={event.id}>
                  {event.summary} - {new Date(event.start.dateTime).toLocaleString()}
                </li>
              ))
            ) : (
              <li>No events found</li>
            )}
          </ul>
        </>
      )}
    </div>
  );
}
