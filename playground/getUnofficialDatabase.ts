const dotenv = require('dotenv')
const path = require('path')

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

type CollectionInstance = any

async function getUnofficialDatabaseImpl(opts: {
  spaceId?: string
  sourceId?: string
  collectionViewId?: string
  notionTokenV2?: string
  notionActiveUser?: string
  notionApiWeb?: string
}): Promise<CollectionInstance> {
  const { spaceId, sourceId, collectionViewId, notionTokenV2, notionActiveUser, notionApiWeb } =
    opts
  if (!spaceId) throw new Error('spaceId is not defined')
  if (!sourceId) throw new Error('sourceId is not defined')
  if (!collectionViewId) throw new Error('collectionViewId is not defined')
  if (!notionTokenV2) throw new Error('notionTokenV2 is not defined')
  if (!notionActiveUser) throw new Error('notionActiveUser is not defined')
  if (!notionApiWeb) throw new Error('notionApiWeb is not defined')

  const headers: any = {
    'Content-Type': 'application/json',
    cookie: `token_v2=${notionTokenV2}`,
    'x-notion-active-user-header': notionActiveUser
  }

  const body = {
    collectionView: {
      id: collectionViewId,
      spaceId
    },
    source: {
      type: 'collection',
      id: sourceId,
      spaceId
    },
    loader: {
      filter: {
        operator: 'and',
        filters: []
      },
      type: 'reducer',
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
      },
      sort: []
    }
  }

  // /* ###Thi */ console.log(`👉👉👉 body: `, JSON.stringify(body))
  // /* ###Thi */ console.log(`👉👉👉 headers: `, headers)

  const url = `${notionApiWeb}/queryCollection`

  return await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  }).then(res => res.json())
}

;(async () => {
  try {
    const result = await getUnofficialDatabaseImpl({
      spaceId: process.env.SPACE_ID,
      sourceId: process.env.SOURCE_ID,
      collectionViewId: process.env.COLLECTION_VIEW_ID,
      notionTokenV2: process.env.NOTION_TOKEN_V2,
      notionActiveUser: process.env.NOTION_ACTIVE_USER,
      notionApiWeb: process.env.NOTION_API_WEB
    })
    console.log('Result:', result?.recordMap?.block)
    // /* ###Thi */ console.log(`👉👉👉 result type: `, result?.result?.type)
  } catch (error) {
    console.error(error)
  }
})()
