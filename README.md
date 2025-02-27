# Media Share

Our upcoming file sharing platform. A fork of [pingvin-share](https://github.com/stonith404/pingvin-share) 💜.

<br/>

### <img  src="docs/static/img/pingvinshare.svg" width="25"/> Support the original project!

[![](https://dcbadge.limes.pink/api/server/wHRQ9nFRcK)](https://discord.gg/wHRQ9nFRcK)
[![](https://img.shields.io/badge/Crowdin-2E3340.svg?style=for-the-badge&logo=Crowdin&logoColor=white)](https://crowdin.com/project/pingvin-share)
[![](https://img.shields.io/badge/sponsor-30363D?style=for-the-badge&logo=GitHub-Sponsors&logoColor=#white)](https://github.com/sponsors/stonith404)

<br/>


## ✨ Features

- Share files using a link
- Unlimited file size (restricted only by disk space)
- Set an expiration date for shares
- Secure shares with visitor limits and passwords
- Reverse shares

## ⌨️ Setup

> [!NOTE]
> Media Share is not really intended for personal use or self-hosted instances.
> This repository contains a modified version of an upstream project, which is merely altered to better fit into our overall design and feature-scope.
> We reccommend using the upstream project [pingvin-share](https://github.com/stonith404/pingvin-share).

### Installation with Docker

1. Clone the repository via `git clone https://github.com/hekryd/media-share`
2. In the project directory, run `docker compose up -d`

The website is now listening on `http://localhost:3000`, have fun!
