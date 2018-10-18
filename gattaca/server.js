var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)


// Redis
// var redis = require("redis"),
//     rclient = redis.createClient();

const asyncRedis = require("async-redis");
const rclient = asyncRedis.createClient();

// Cassandra
const cassandra = require('cassandra-driver');
const cclient = new cassandra.Client({contactPoints: ['127.0.0.1'], keyspace: 'spirit'});

rclient.on("error", function (err) {
    console.log("Error " + err);
});

const headers = (req, res, next) => {
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200'); //4000
  // res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Content-Type', 'application/json');
  // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');
  next();
}

app.use(headers);
app.use(express.json());



server.listen(3000)

app.post('/v1.0/gift', function(req, res) {
  if (!req.body) {
    return res.status(400).send({ error: 'Unsupported body.' })
  }
  if (!req.body.to || !req.body.from || !req.body.giftId || !req.body.roomKey) {
    return res.status(400).send({ error: 'Unsupported body.' })
  }

  io.in(req.body.roomKey).emit('gift', req.body)
  res.send(req.body)
})


app.get('/rooms', function(req, res) {
  var roomList = Object.keys(rooms).map(function(key) {
    return rooms[key]
  })
  res.send(roomList)
})

// var rooms = {
//   'PhilG312048': 'PhilG312048'
// }

io.on('connection', function(socket) {
  console.log(socket);

  // DEPRECATED?
  socket.on('create_room', function(room) {
    if (!room.key) {
      return
    }
    console.log('create room:', room)
    // var roomKey = room.key
    // rooms[roomKey] = room
    // socket.roomKey = roomKey
    // socket.join(roomKey)


    // setInterval(() => {
    //   let foo = Math.random();
    //   console.log(foo);
    //   io.in(roomKey).emit('comment', {
    //     msg: foo
    //   });
    // }, 2000)
  })

  socket.on('close_room', function(roomKey) {
    console.log('close room:', roomKey)
    delete rooms[roomKey]
  })

  socket.on('disconnect', function() {
    if (!socket.channelAlias) return

    // Decrement count and update db if elapsed
    const decr = async () => {
      const count = await rclient.decr(socket.channelAlias)
      updateDbIfElapsed(socket.channelAlias, count)
      console.log('disconnect:', socket.id)
    }

    decr()
    // const count = rclient.decr(socket.foo)
    // console.log('disconnect:', socket.roomKey)
    // updateDbIfElapsed(socket.roomKey, count)
    // if (socket.roomKey) {
    //   delete rooms[socket.roomKey]
    // }
  })

  socket.on('leave_room', (channelAlias) => {
    socket.disconnect()
  })

  socket.on('join_room', async function(roomKey) {
    if (!roomKey) {
      console.log('No room given.')

      // socket.emit('notification', 'Channel has turned off chat.')
      return
    }

    const query = `
      SELECT start_time
      FROM stream
      WHERE channel_id = ? AND is_live = ?LIMIT 1
    `
    let channel
    try {
      channel = await cclient.execute(query, [roomKey, true])
      channel = channel.rows[0]
    } catch (error) {
      console.error(error)
    }

    if (!channel) {
      // TODO: check db if room key exists


      console.log('room not found')
      socket.emit('notification', 'Channel has turned off chat.')
      return
    }

    console.log('join room:', roomKey)


    // Join room
    socket.join(roomKey)
    socket.emit('notification', 'Welcome to the room.')


    // Persist room in socket object
    socket.channelAlias = roomKey

    // Counts and things
    let count
    const incr = async () => {
      count = await rclient.incr(roomKey)
      updateDbIfElapsed(roomKey, count)
    }

    // Increment counter and get timestamp for next operation
    incr()
  })

  /**
   *
   * @param {*} roomKey
   * @param {*} count
   */
  const updateDbIfElapsed = async (roomKey, count) => {
    let res1, time

    const updateDb = async () => {
      query = `
        SELECT start_time
        FROM stream
        WHERE channel_id = ? LIMIT 1
        `
      try { res1 = await cclient.execute(query, [ roomKey ]) } catch (err) {
        console.log(err)
      }

      if (res1.rows[0] && res1.rows[0].start_time) {
        let queries = [{
          query: `
            UPDATE stream
            SET live_view_count = ?
            WHERE channel_id = ?
            AND start_time = ?
            `,
          params: [ count, roomKey, res1.rows[0].start_time ]
        }]
        try { await cclient.batch(queries, { prepare: true }) } catch (err) {
          console.log(err)
          // Log error...
        }
      }

      console.log('updated db')
    }

    const calculate = async () => {
      time = await rclient.get(`${roomKey}:time`)

      // If no time in redis, set time key
      if (!time) {
        rclient.set(`${roomKey}:time`, + new Date())
        return;
      }

      // Calculate elapsed time to see if need to write to cassandra
      const now = + new Date();
      const elapsed = parseInt(time) + 5 // if 5 seconds has gone by

      if (now >= elapsed) {
        updateDb();
      }

    }

    calculate()
  }

  socket.on('upvote', function(roomKey) {
    console.log('upvote:', roomKey)
    io.to(roomKey).emit('upvote')
  })

  // socket.on('gift', function(data) {
  //   // // validate data
  //   // if (!data) return
  //   // if (!data.giftId || !data.from || !data.to) return

  //   // // get token balance

  //   // // if < ask or no balance return

  //   // // update balance to diff

  //   // send gift
  //   console.log('gift:', data)
  //   io.to(data.roomKey).emit('gift', data)
  // })

  socket.on('comment', function(data) {
    // TODO: heavy validation
    // ... don't skimp


    // if (rooms[data.roomKey]) {
      console.log('comment:', data)
      io.in(data.roomKey).emit('comment', data);
    // } else {
    //   console.log('room not found')
    //   socket.emit('notification', 'Chat unavailable.')
    // }

    // io.to(data.roomKey).emit('comment', data)
  })

})

console.log('listening on port 3000...')
