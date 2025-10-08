// How to use?
// npx tsx playground/testQueryCollection.ts

import 'dotenv/config'

async function testQueryCollection() {
  const response = await fetch('https://thi-cs.notion.site/api/v3/queryCollection', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      source: {
        type: 'collection',
        id: 'ef463b5d-16d6-4bbe-9948-0fb3c162e0cd',
        spaceId: '70a67195-bc38-429a-9695-1ad1b42ccec8'
      },
      collectionView: {
        id: '93139080-0ffb-4543-9849-de84a3c01a15',
        spaceId: '70a67195-bc38-429a-9695-1ad1b42ccec8'
      },
      loader: {
        reducers: {
          collection_group_results: {
            type: 'results',
            limit: 9999
          },
          'table:uncategorized:title:count': {
            type: 'aggregation',
            aggregation: {
              property: 'title',
              aggregator: 'count'
            }
          }
        }
      }
    })
  })

  const data = await response.json()
  console.log(JSON.stringify(data, null, 2))
}

testQueryCollection().catch(console.error)
