# CirclePeople
very simple Twitch -> osu! request bot written in JS

> This project was inspired by https://github.com/Fanyatsu/osu-requests-bot

# How to use
I recommend to use docker idk

## Cloning
1. `git clone https://github.com/aeongdesu/CirclePurple`
2. `cd CirclePurple`
3. Install dependencies using pnpm, yarn, or npm
4. Copy `settings.js.example` to `settings.js` and edit it
5. `pnpm start`

## Docker
```sh
docker run \
    -v ./config.json:/app/config.json \
    ghcr.io/aeongdesu/circlepurple:latest
```

# Thanks to
[@zeee2](https://github.com/zeee2) - helped twitch module

Pull Request welcome!