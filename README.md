# Msgr

Messenger is a simple message handler for Figma.

> [!NOTE]
> This hasn't been packaged yet and is mainly a learning experience for me.

### Create an instance of Msgr

In both the UI and main code you'll need to create an instance of Msgr.

```ts
const msgr = new Msgr();
```

### Defining handlers

Define your event handlers.

```ts
const msgr = new Msgr({ handlers });

const handlers = {
  greet(value: any) {
    console.log(value);
  },
};
```

### Emitting a message

Calling emit invokes the event handler for the matching event name in either UI or main context.

```ts
msgr.emit("greet", "Hello world!");
```

### Awaiting a response

After emitting a message you can await a response from the other context.

```ts
let res = await msgr.emit("greet");
```
