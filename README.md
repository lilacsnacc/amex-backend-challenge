# EMS API
Welcome to the Event Management System (EMS) API. Use this API to get users, events, and events by user. You can also add events by passing an event name and user id. Feel free to to contact me at fullstack@nshabazz.com if you have any questions (or job offers :). Happy Coding!

## Installation
This project is written in Node.js

Simply clone the repo, then run this command from root to install dependencies:

```bash
npm i
```

Finally, run this command to start a local server::

```bash
npm run start
```

## Usage

This API currently supports 4 endpoints

### /getUsers
`GET` - Returns a JSON array of all Users, and in this format:

```json
[
  {
    userName: string,
    id: number,
    email: string,
    events: string[] // array of event ids? not sure what this is...
  },
  ...
]
```

### /getEvents
`GET` - Returns a JSON array of all Events, and in this format:

```json
[
  {
    id: number,
    name: string,
    userId: number,
    details: string
  },
  ...
]
```

### /getEventsByUserId/:id
`GET` - Returns all Events that are assigned the given User id. Returns in the same format as `/getEvents`.

### /addEvent
`POST` - Given a user id and event name, creates a new Event. Expects a stringified JSON body in this format:

```json
'{
  "name": "string",
  "userId": "number"
}'
```

and will return `{"success":true}` if successful.

## Changelog
...