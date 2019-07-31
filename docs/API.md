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

### Getting A Specified Sprint

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

### Deleting All Sprints (Flush)

* DELETE sprints/

#### Sample Response

None (Status code 200)

### Deleting A Specified Sprint

* DELETE sprints/{id}

#### Sample Response

None (Status code 200)

## Users
