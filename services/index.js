const fastify = require('fastify')({ logger: true })
const listenMock = require('../mock-server')

/** standardized fetch */
const jsonFetch = async (url, options) => fetch(url, options).then(resp => resp.json())

fastify.get('/getUsers', async (_, reply) => {
  const users = await jsonFetch('http://event.com/getUsers')
  reply.send(users)
})

fastify.get('/getEvents', async (_, reply) => {
  const events = await jsonFetch('http://event.com/getEvents')
  reply.send(events)
})

fastify.get('/getEventsByUserId/:id', async (request, reply) => {
  const { id } = request.params
  const eventArray = []

  await jsonFetch(`http://event.com/getUserById/${id}`)
    .then(async user => {
      if (!user?.events?.length) return 0

      const fetchArr = user.events.map(ev => jsonFetch(`http://event.com/getEventById/${ev}`))

      await Promise
        .allSettled(fetchArr)
        .then(respArr => respArr.filter(resp => resp.status == 'fulfilled'))
        .then(filteredRespArr => filteredRespArr.map(resp => resp.value))
        .then(events => eventArray.push(...events))
    })
    .catch(e => console.error(e))

  reply.send(eventArray)
})

fastify.post('/addEvent', async (request, reply) => {
  try {
    const resp = await fetch('http://event.com/addEvent', {
      method: 'POST',
      body: JSON.stringify({
        id: new Date().getTime(),
        ...request.body
      })
    })
    const data = await resp.json()
    reply.send(data)
  } catch (err) {
    reply.error(err)
  }
})

fastify.listen({ port: 3000 }, (err) => {
  listenMock()

  if (err) {
    fastify.log.error(err)
    process.exit()
  }
})
