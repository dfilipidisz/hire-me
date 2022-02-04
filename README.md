# Setup instructions and design decisions

Setup in project directory:

1. `nvm use 16.13.2` - Use Node.js 16.13.2 (anything on the v16.x line should be good as well)
2. `yarn install` - install dependencies
3. `yarn start` - Page will be available at `localhost:3000`

Design decisions:

- I've opted to not use an external state management library, to not over-complicate the state management. For the purposes of this task `useState` and `context` was enough.
- For the table that displays the list of children, I've used `react-window` to create a virtualized table, instead of dumping all line entries into the DOM.
- Network calls use `fetch` instead of `axios` or similar libraries. It has wide enough browser support, and if needed, for older browsers a polyfill can be loaded conditionally. There is also a wrapper for it, to handle app-specific requirements, like adding the access token to the request.
- To simulate pagination on the children list, the `getChildren` method loads the full list of children first, then returns a slice of the whole list based on page number on subsequent calls.
- The checkout and checkin of children is handled on the actual row associated with the child. This is done this way to allow for individual loading and error states for each row, as well as individual settings for the requests (like the `pickupTime` on the checkin call).
- State updates are propagated up from the table rows via context, to keep the local list of children updated, as well as displaying errors. Context was used here instead of prop drilling, so the row component can be mostly de-coupled from the table (of course `react-window` has some expectations about it's rows props, but thats communicated via an interface)

# Interested in working for Famly?

Give us a chance to see your beautiful code! 🤩

How to get started:

- Fork this repository
- Create a small application in React (or another agreed upon framework)
- Describe your design decisions and setup instructions in the README.md of the forked repository

## The assignment

You are tasked to build a simple application for a nursery to manage the attendance of children each day.

The application should be able to do 3 things:

1. List children with some form of pagination/lazy-loading/infinite-scroll
2. Checkin a child
3. Checkout a child

There are no other requirements than that—don't worry about design or anything like that.

If you have any questions feel free to reach out to ckl@famly.co (Christian) or ab@famly.co (Adam) ☺️

## API Specification

You will receive an access token in an email during the recruiment process.

### Fetch some children from

The API does not support any limit or offset, so the pagination/lazy-loading/infinite-scroll will have to be done client-side only.

```
GET https://app.famly.co/api/daycare/tablet/group
Arguments: {
	accessToken: <accessToken>,
	groupId: '86413ecf-01a1-44da-ba73-1aeda212a196',
	institutionId: 'dc4bd858-9e9c-4df7-9386-0d91e42280eb'
}
```

Example in cURL:

```bash
curl "https://app.famly.co/api/daycare/tablet/group?accessToken=<accessToken>&groupId=86413ecf-01a1-44da-ba73-1aeda212a196&institutionId=dc4bd858-9e9c-4df7-9386-0d91e42280eb"
```

### Checkin child

```
POST https://app.famly.co/api/v2/children/<childId>/checkins

Arguments: {
	accessToken: <accessToken>
	pickupTime: 16:00
}
```

Example in cURL:

```bash
curl \
  -d 'accessToken=<accessToken>&pickupTime=16:00' \
  https://app.famly.co/api/v2/children/fcd683d0-bc31-468c-948f-1ca70b91439d/checkins
```

### Checkout child

```
POST https://app.famly.co/api/v2/children/<childId>/checkout
Arguments: {
	accessToken: <accessToken>
}
```

Example in cURL:

```bash
curl \
  -d 'accessToken=<accessToken>' \
  https://app.famly.co/api/v2/children/fcd683d0-bc31-468c-948f-1ca70b91439d/checkout
```
