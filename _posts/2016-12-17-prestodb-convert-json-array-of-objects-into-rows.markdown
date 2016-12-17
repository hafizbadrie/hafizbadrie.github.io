---
layout: post
title: "PrestoDB: Convert JSON Array Of Objects into Rows"
date: 2016-12-17 11:00:00 +0700
category: prestodb
---
In your PrestoDB, suppose you have a table named `events` and it contains a column which you use to store a json string, let's call it `properties`.
One day, you store a json which one of the attributes is actually an array of object.
You do this because you think you could query the value of each element so that it will ease your analysis.
However, that json data is a string, how can you do that?

Let's have an example of JSON data that we'd like to query:

```JSON
{
  "event": "click_event",
  "properties": {
    "section": "top_nav",
    "items": [{
        "item_id": 12345,
        "position": 1
      }, {
        "item_id": 67890,
        "position": 2
      }, {
        "item_id": 54321,
        "position": 3
      }
    ]
  }
}
```

Later, you want to execute a query that will produce data like this:

| event       | section | item_id | position |
|-------------|---------|---------|----------|
| click_event | top_nav | 12345   | 1        |
| click_event | top_nav | 67890   | 2        |
| click_event | top_nav | 54321   | 3        |

To make your dream come true, you'll need to use a query keyword, called [UNNEST](https://prestodb.io/docs/current/sql/select.html){:target="_blank"}.
But, before we get there, I'm going to build the SQL step by step, so that you can fully understand how we can get the result.

### 1. Convert array of objects into array of map

```SQL
SELECT
  json_extract_scalar(properties, '$.event') AS event,
  json_extract_scalar(properties, '$.section') AS section,
  CAST(json_extract(properties, '$.items') AS ARRAY<MAP<VARCHAR, VARCHAR>>) AS items
FROM
  events
```

Above query will produce this data:

| event       | section |                                        items                                            |
|-------------|---------|-----------------------------------------------------------------------------------------|
| click_event | top_nav | [{item_id=12345, position=1}, {item_id=67890, position=2}, {item_id=54321, position=3}] |

With that query, you used `json_extract_scalar` function that will parse the json string and it will return as `varchar`.
The other one is `json_extract`. It also parse the json string and it will return as `json`. For more information, you can visit [this page](https://prestodb.io/docs/current/functions/json.html){:target="_blank"}

### 2. Break the array into rows

In this part, you're going to use `UNNEST` function to break down the array object into records or rows.

```SQL
SELECT
  event,
  section,
  item
FROM
(
  SELECT
    json_extract_scalar(properties, '$.event') AS event,
    json_extract_scalar(properties, '$.section') AS section,
    CAST(json_extract(properties, '$.items') AS ARRAY<MAP<VARCHAR, VARCHAR>>) AS items
  FROM
    events
)
CROSS JOIN UNNEST(items) AS items(item)
```

The result of that query is:

| event       | section |             item            |
|-------------|---------|-----------------------------|
| click_event | top_nav | {item_id=12345, position=1} |
| click_event | top_nav | {item_id=67890, position=2} |
| click_event | top_nav | {item_id=54321, position=3} |

As stated in the documentation, `UNNEST` will expand the array object into a relation.

### 3. Get the end result

This is the end part, where you'll get each value of the map (item_id and position) so that will give you the same result as you expected.

```SQL
SELECT
  event,
  section,
  item['item_id'] AS item_id,
  item['position'] AS position
FROM
(
  SELECT
    json_extract_scalar(properties, '$.event') AS event,
    json_extract_scalar(properties, '$.section') AS section,
    CAST(json_extract(properties, '$.items') AS ARRAY<MAP<VARCHAR, VARCHAR>>) AS items
  FROM
    events
)
CROSS JOIN UNNEST(items) AS items(item)

```

That query will produce this data:

| event       | section | item_id | position |
|-------------|---------|---------|----------|
| click_event | top_nav | 12345   | 1        |
| click_event | top_nav | 67890   | 2        |
| click_event | top_nav | 54321   | 3        |

With this, you can store more information in your json string which later you can use for your analysis.
