# Global Address Book

### Live Demo: https://macrometacorp.github.io/tutorial-addressbook-streams/

Demo to show a Real-time address book!

## Setup

| **Federation**                                    | **Email**          | **Passsword** |
| ------------------------------------------------- | ------------------ | ------------- |
| [Global Data Network](https://play.macrometa.io/) | demo@macrometa.com | `xxxxxxxx`    |

## Overview

**Dashboard:**

![dashboard.png](dashboard.png)

### Macrometa Account setup

1. On the development machine, run the following commands in a console:

```
1. git clone git@github.com:Macrometacorp/tutorial-addressbook-streams.git
2. cd tutorial-addressbook-streams
3. git fetch
4. npm install
5. npm run start
```

2. Rename `.env.sample` to `.env` and update the `REACT_APP_GDN_URL` with `https://play.macrometa.io`

3. Once you have the app running, you will be presented with a page to log in with your Macrometa account. Add your Macrometa account email and password and the user will then be asked to select one region in the GUI.

4. Deploy on GH Pages:

```
npm run deploy
```

### Add Search to your address book app

1. Follow the steps in the [Search Getting Started Tutorial](https://macrometa.com/docs/search/getting-started).

2. Go to the `ButtonBar.js` component file and follow the instructions in the comments.

![CleanShot 2022-12-21 at 17 36 26](https://user-images.githubusercontent.com/1088136/209036364-0d6c4497-8200-4cea-aceb-136a99b13547.png)

