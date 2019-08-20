# API

Specify all requests with Headers :

```
Content-Type : application/json
```

## Sprints

### Creating Sprints

* POST sprints
* Name : "DEMO Sprint"

#### Sample Response

```
{
  "d": "5yojNtnjM",
  "s": 200
}
```

### Getting All Sprints

* GET sprints

#### Sample Response

```
{
  "d": {
    "5yojNtnjM": {
      "Id": "5yojNtnjM",
      "Name": "DEMO Sprint",
      "CreationTime": "2019-07-31T11:57:20.338407+01:00"
    },
    "MMA3Ntcjp": {
      "Id": "MMA3Ntcjp",
      "Name": "DEMO Sprint 1",
      "CreationTime": "2019-07-31T12:03:43.39378+01:00"
    }
  },
  "s": 200
}
```

### Getting a Specified Sprint

* GET v2/sprints/{id}

#### Sample Response

```
{
  "d": {
    "Id": "5yojNtnjM",
    "Name": "DEMO Sprint",
    "CreationTime": "2019-07-31T11:57:20.338407+01:00"
  },
  "s": 200
}
```

OR

```
None (Status code 404)
```

### Deleting All Sprints (Flush)

* DELETE sprints

#### Sample Response

```
None (Status code 200)
```

### Deleting a Specified Sprint

* DELETE v2/sprints/{id}

#### Sample Response

```
None (Status code 200)

OR

None (Status code 404)
```

## Users

### Creating Users in a Sprint

* POST v2/sprints/[sprintId]/users
* Name : "New User"

#### Sample Response

```
{
  "d": {
    "Id": "207e0a80-ac41-4823-bb43-c235fa655e21",
    "Name": "New User",
    "Vote": -1,
    "Admin": true
  },
  "s": 200
}
```

### Getting Users in a Sprint

* GET v2/sprints/[sprintId]/users

#### Sample Response

```
{
  "d": {
    "Users": {
      "207e0a80-ac41-4823-bb43-c235fa655e21": {
        "Id": "207e0a80-ac41-4823-bb43-c235fa655e21",
        "Name": "New User",
        "Vote": -1,
        "Admin": true
      },
      "faaaad5a-7d79-4fa2-bbba-949a96891abf": {
        "Id": "faaaad5a-7d79-4fa2-bbba-949a96891abf",
        "Name": "New User 1",
        "Vote": -1,
        "Admin": false
      }
    },
    "SprintId": "_m9tqacjp",
    "VotesShown": false,
    "AdminId": "207e0a80-ac41-4823-bb43-c235fa655e21"
  },
  "s": 200
}
```

### Getting a Specified User in a Sprint

* GET v2/sprints/[sprintId]/users/{id}

#### Sample Response

```
{
  "d": {
    "Id": "207e0a80-ac41-4823-bb43-c235fa655e21",
    "Name": "New User",
    "Vote": -1,
    "Admin": true
  },
  "s": 200
}

OR

None (Status code 404)
```

### Voting

* PUT sprints/[sprintId]/users/{id}
* Vote : 8

#### Sample Response

```
None (Status code 200)

OR

None (Status code 404)
```

### Deleting All Users in a Specified Sprint

* DELETE v2/sprints/[sprintId]/users

#### Sample Response

```
None (Status code 200)
```

### Deleting a Specified User in a Specified Sprint

* DELETE v2/sprints/[sprintId]/users/{id}

#### Sample Response

```
None (Status code 200)

OR

None (Status code 404)
```

### Setting User as Admin

* POST v2/sprints/[sprintId]/users/[userId]/setadmin
* Successor : [userId]

#### Sample Response

```
None (Status code 200)

OR 

None (Status code 401)

OR

None (Status code 404)
```

### Show Vote in the current Sprint

* POST v2/sprints/[sprintId]/users/[userId]/showvote
* VoteShown : true / false

#### Sample Response

```
None (Status code 200)

OR

None (Status code 401)

OR

None (Status code 404)
```


## Rounds

### Creating Rounds in a Sprint

* GET v2/sprints/[sprintId]/rounds
* Name : "Task 1"

#### Sample Response

```
{
  "d": {
    "Id": 1,
    "Name": "Task 1",
    "Med": 0,
    "Avg": 0,
    "Final": 0,
    "Archived": false,
    "CreationTime": 1564664527
  },
  "s": 200
}
```

### Getting All Rounds in a Sprint

* GET v2/sprints/[sprintId]/rounds

#### Sample Response

```
{
  "d": {
    "Rounds": [
      {
        "Id": 1,
        "Name": "Task 1",
        "Med": 0,
        "Avg": 0,
        "Final": 0,
        "Archived": false,
        "CreationTime": 1564664527
      },
      {
        "Id": 2,
        "Name": "Task 2",
        "Med": 0,
        "Avg": 0,
        "Final": 0,
        "Archived": false,
        "CreationTime": 1564664555
      }
    ],
    "SprintId": "E4yNEcn0p"
  },
  "s": 200
}
```

### Getting a Specified Round in a Sprint

* GET v2/sprints/[sprintId]/rounds/{id}

#### Sample Response

```
{
  "d": {
    "Id": 1,
    "Name": "Task 1",
    "Med": 0,
    "Avg": 0,
    "Final": 0,
    "Archived": false,
    "CreationTime": 1564664734
  },
  "s": 200
}

OR

None (Status code 404)
```

### Deleting All Rounds in a Sprint

* DELETE v2/sprints/[sprintId]/rounds/{id}

#### Sample Response

```
None (Status code 200)
```

### Archiving a Specified Round in a Sprint

* PUT sprints/[sprintId]/rounds/{id}

```
{
    "Average" : 0.5,
    "Median" : 8,
    "Final" : 5
}
```

#### Sample Response

```
None (Status code 200)

OR

None (Status code 404)
```

## Websocket

* ws://{server_address}/v2/info/[sprintId]/users/[userId]
* Send `update` to request a broadcast
* Will automatically push when users drop connection

```
[
   {
      "Users":{
         "6558248d-2b64-4ca4-b926-ea52b520e6ca":{
            "Id":"6558248d-2b64-4ca4-b926-ea52b520e6ca",
            "Name":"User 2",
            "Vote":-1,
            "Admin":false
         },
         "758598f8-2439-4e3f-95e6-9396a274c573":{
            "Id":"758598f8-2439-4e3f-95e6-9396a274c573",
            "Name":"User 1",
            "Vote":-1,
            "Admin":true
         }
      },
      "SprintId":"YrgNwGZ0M",
      "VotesShown":false,
      "AdminId":"758598f8-2439-4e3f-95e6-9396a274c573"
   }
]
```


