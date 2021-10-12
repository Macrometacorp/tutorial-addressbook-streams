# Global Address Book

### Live Demo: https://macrometacorp.github.io/tutorial-addressbook-streams/

Demo to show a Real-time adrress book!

## Setup

| **Federation**                                        | **Email**                              | **Passsword** |
| ----------------------------------------------------- | -------------------------------------- | ------------- |
| [Global Data Network](https://gdn.paas.macrometa.io/) | demo@macrometa.com | `xxxxxxxx`    |

## Overview

**Dashboard:**

![dashboard.png](dashboard.png)

### Macrometa Account setup

1. Create the following collections in your Macrometa account:

```
addresses(global)
```

2. On the development machine, run the following commands in a console:

```
1. git clone git@github.com:Macrometacorp/tutorial-addressbook-streams.git
2. cd tutorial-addressbook-streams
3. git fetch
4. npm install
5. npm run start
```

3. Once you have the app running, you will be presented with a page to log in with your Macrometa account. Add your Macrometa account email and password. Keep the `fabric` field value as `_system`.

4. The federation url has to be provided in Config.js file. The user will then be asked to select one of the following regions in the GUI.
```
const Config = {
    global: "gdn.paas.macrometa.io",
    Fremont: "gdn-us-west.paas.macrometa.io",
    London: "gdn-eu-west.paas.macrometa.io",
    Mumbai: "gdn-ap-west.paas.macrometa.io",
    Singapore: "gdn-ap-south.paas.macrometa.io",
    Tokyo: "gdn-ap-northeast.paas.macrometa.io",
    Sydney: "gdn-ap-sydney.paas.macrometa.io"
};
```

5. Deploy on GH Pages:

```
1. npm run deploy
```
