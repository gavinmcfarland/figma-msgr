// Todo: Needs updating to work in both UI and main

type Opts = {
  pluginId?: string;
  handlers?: {
    [key: string]: (data?: any) => any;
  };
};

export class Msgr {
  pluginId: string;
  constructor(opts?: Opts) {
    this.pluginId = opts?.pluginId ? opts.pluginId : "*";

    if (opts?.handlers) {
      this.listenAll(opts.handlers);
    }
  }

  emit(event: string, data?: object | string) {
    if (typeof parent !== "undefined") {
      parent.postMessage(
        {
          pluginMessage: {
            event,
            data,
          },
          pluginId: this.pluginId,
        },
        "*"
      );
    } else {
      figma.ui.postMessage({
        event,
        data,
      });
    }

    return new Promise((resolve, reject) => {
      if (typeof window !== "undefined") {
        window.addEventListener("message", (e) => {
          let msg = e.data.pluginMessage;

          if (msg.event === event) {
            resolve(msg.data);
          }
        });
      }
    });
  }

  private listenAll(handlers: Opts["handlers"]) {
    for (const event in handlers) {
      const eventFunction = handlers[event];
      if (typeof parent !== "undefined") {
        window.addEventListener("message", (e) => {
          let msg = e.data.pluginMessage;

          if (msg.event === event) {
            let data = eventFunction(msg.data);
            if (data) {
              parent.postMessage(
                {
                  pluginMessage: {
                    event,
                    data,
                  },
                  pluginId: this.pluginId,
                },
                "*"
              );
            }
          }
        });
      } else {
        figma.ui.on("message", async (msg) => {
          // Note the use of 'async'
          if (msg.event === event) {
            let data = eventFunction(msg.data);

            // Check if the returned value is a promise
            if (data && typeof data.then === "function") {
              data = await data; // Wait for the promise to resolve
            }

            if (data) {
              figma.ui.postMessage({
                event,
                data,
              });
            }
          }
        });
      }
    }
  }

  listen(event: string, callback: (data: any) => any | void) {
    // const event = callback.name;
    figma.ui.on("message", (msg) => {
      if (msg.event === event) {
        let data = callback(msg.data);

        if (data) {
          figma.ui.postMessage({
            event,
            data,
          });
        }
      }
    });
  }
}
