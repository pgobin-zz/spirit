const express = require('express')
const router = express.Router()
const eclient = require('./config').eclient

const query = async (req, res) => {
  let res1

  if (!req.body) {
    res.status(400).send({ error: 'Unsupported request body.' }); return;
  }
  if (!req.body.q) {
    res.status(400).send({ error: 'No query provided.' }); return;
  }

  // Validate string
  // Cannot be space, other characters...
  // ..
  const tagQuery = {
    match_phrase_prefix: {
      name: {
        query: req.body.q,
        // fuzziness: 'auto',
        "analyzer": "search_synonyms",
        // zero_terms_query: 'all' // i think this is for showing results if all terms removed because they're 'stops', like 'the, of..'.
      },
    }
  }
  const tagSuggest = {
    suggest1: {
      text: req.body.q,
      term: { field: 'name' }
    },
    completion: {
      prefix: req.body.q,
      completion: {
        field: 'name.complete'
      }
    }
  }

  const videoQuery = {
    match: {
      tags: {
        query: req.body.q,
        fuzziness: 'auto',
        "analyzer": "search_synonyms",
        zero_terms_query: 'all' // i think this is for showing results if all terms removed because they're 'stops', like 'the, of..'.
      }
    }
  }
  const videoSuggest = {
    suggest1: {
      text: req.body.q,
      term: { field: 'tags' }
    }
  }

  try {
    res1 = await eclient.msearch({
      body: [
        // Search tags
        // { index: 'tag' },
        { index: 'tag' },
        { query: tagQuery, suggest: tagSuggest },

        // Search videos
        { index: 'video' },
        { query: videoQuery, suggest: videoSuggest }
      ]
    })

    // TODO: handle error more robustly?
    let tags = res1.responses[0].hits.hits
    let videos = res1.responses[1].hits.hits

    console.log(tags)
    console.log(videos)
    res.send({ tags: tags, videos: videos })
  } catch (err) {
    console.trace(err.message)
    res.status(500).send({ error: 'Error performing search.' })
  }
}

router.post('/', query)

module.exports = router;
