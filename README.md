# EMS API
Welcome to the Event Management System (EMS) API. Use this API to get users, events, and events by user. You can also add events by passing an event name and user id. Feel free to to contact me at fullstack@nshabazz.com if you have any questions (or job offers :D). Happy Coding!

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
    events: string[]
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

4:30 - initialized repo
5:00 - fleshed out README file
5:30 - refactored `/getEventsByUserId/:id` endpoint to use `Promise.allSettled()`
6:15 - standardized `GET` fetch function and reordered code for better DX
6:30 - added retry code and cleanup to the `addEvent` endpoint
6:45 - some code cleanup to be more palatable to most developers (semicolons :P), plus a correction to error code.

## Given More Time...
Since the backend is a mocked server, there is some weirdness and best practices cannot be put to use. For example, instead of returning an empty array, calling for an id that is out of bounds used to actually cause an error requiring a server restart. I'd also like to add some catches, but without proper server structure, it's difficult to test those.

Speaking of testing, given more time I would also add tests for each endpoint. Each of them must respond to properly to perfect input, of course, but they should also error to invalid input. That brings us back to type-checking and sanitization (part of why I prefer ts).