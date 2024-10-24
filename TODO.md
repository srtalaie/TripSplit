Find a way to return a deep copy of object after filetering for remove_friend because when it runs on the frontend after dispatching removeFriend it only returns the shallow copy. This is because on the backend for the remove_friend controller it uses array.filter and it only returns the shallow copy of the friend array.

- Possible fix https://dev.to/samanthaming/how-to-deep-clone-an-array-in-javascript-3cig
