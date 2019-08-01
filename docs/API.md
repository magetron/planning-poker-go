# API

Specify all requests with Headers :

```
Content-Type : application/json
```

## Sprints

### Creating Sprints

* POST sprints/ 
* Name : "DEMO Sprint"

#### Sample Response

```
{
  "d": "5yojNtnjM",
  "s": 200
}
```

### Getting All Sprints

* GET sprints/

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

* GET sprints/{id}

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

* DELETE sprints/

#### Sample Response

```
None (Status code 200)
```

### Deleting a Specified Sprint

* DELETE sprints/{id}

#### Sample Response

```
None (Status code 200)

OR

None (Status code 404)
```

## Users

### Creating Users in a Sprint

* POST sprints/[sprintId]/users/
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

* GET sprints/[sprintId]/users/

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

* GET sprints/[sprintId]/users/{id}

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

### Delete All Users in a Specified Sprint

* DELETE sprints/[sprintId]/users/

#### Sample Response

```
None (Status code 200)
```

### Delete a Specified User in a Specified Sprint

* DELETE sprints/[sprintId]/users/{id}

#### Sample Response

```
None (Status code 200)

OR

None (Status code 404)
```

### Set User as Admin

* POST sprints/[sprintId]/users/[userId]/setadmin
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

* POST sprints/[sprintId]/users/[userId]/showvote
* VoteShown : true / false

#### Sample Response

```
None (Status code 200)

OR

None (Status code 401)

OR

None (Status code 404)
```
