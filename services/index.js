const fastify = require('fastify')({ logger: true });
const listenMock = require('../mock-server');

/** standardized fetch */
const jsonFetch = async (url, options) => fetch(url, options).then(resp => resp.json());

fastify.get('/getUsers', async (_, reply) => {
  const users = await jsonFetch('http://event.com/getUsers');
  reply.send(users);
});

fastify.get('/getEvents', async (_, reply) => {
  const events = await jsonFetch('http://event.com/getEvents');
  reply.send(events);
});

fastify.get('/getEventsByUserId/:id', async (request, reply) => {
  const { id } = request.params;
  const eventArray = [];

  await jsonFetch(`http://event.com/getUserById/${id}`)
    .then(async user => {
      if (!user?.events?.length) return 0;

      const fetchArr = user.events.map(ev => jsonFetch(`http://event.com/getEventById/${ev}`));

      await Promise
        .allSettled(fetchArr)
        .then(respArr => respArr.filter(resp => resp.status == 'fulfilled'))
        .then(filteredRespArr => filteredRespArr.map(resp => resp.value))
        .then(events => {
          eventArray.push(...events);
          reply.send(eventArray);
        });
    })
    .catch(err => {
      console.error(err);
      reply.send(err);
    });
});

fastify.post('/addEvent', async (request, reply) => {
  const maxTries = 3;

  let resp = {};

  for (let i = 0; (i < maxTries) && !resp.success; i++) {
    resp = await jsonFetch('http://event.com/addEvent', {
      method: 'POST',
      body: JSON.stringify({
        id: new Date().getTime(),
        ...request.body
      })
    });

    if (!resp.success) await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
  }

  if (!resp.success)
    resp.message = `Retried ${maxTries} times unsuccessfully - please try again in 30 seconds. ${resp.message}`;

  reply.send(resp);
});

fastify.listen({ port: 3000 }, (err) => {
  listenMock();

  if (err) {
    fastify.log.error(err);
    process.exit();
  }
});
