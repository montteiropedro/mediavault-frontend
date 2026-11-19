# MediaVault Frontend

The MediaVault frontend is a responsive web application for browsing and playing a self-hosted movie and TV show library. It is built with React and TypeScript and communicates with the [MediaVault backend](https://github.com/montteiropedro/mediavault-backend).

## Features

- Sign in to a MediaVault account.
- Browse movies and TV shows from the library.
- Filter the library by title.
- Start a library scan and follow its background job progress.
- Stream movies and episodes with HLS playback.
- Select available audio and subtitle tracks.
- Resume playback using saved progress.
- Install the app as a Progressive Web App (PWA) on supported browsers.
- Use a responsive layout with mobile playback controls.

## Screenshots (🛠️ Work in progress...)

Screenshots or a short demo video can help visitors see the application before cloning it. Add captures here when they are available, for example under `docs/images/`.

<!-- Add screenshots using: ![MediaVault library](docs/images/library.png) -->

## Tech stack

| Area                              | Technology                    |
| --------------------------------- | ----------------------------- |
| Language                          | TypeScript                    |
| UI Library                        | React 19                      |
| Build tool and development server | Vite 8                        |
| Routing                           | React Router 7                |
| HTTP client                       | Axios                         |
| HLS playback                      | hls.js                        |
| Styling                           | Tailwind CSS 4                |
| Icons                             | Lucide React                  |
| Containerized development         | Docker Compose and Node.js 20 |

## Requirements

- Docker (Docker Engine and the Docker Compose plugin), or Node.js 20 and npm.
- GNU Make, if you want to use the shortcuts in the Makefile.
- A running MediaVault backend. The frontend uses its API for authentication, library data, playback, and scan progress.

For the complete application, follow the setup instructions in the [backend README](https://github.com/montteiropedro/mediavault-backend). Both Compose projects use the external Docker network named `mediavault`.

## Getting started

### Run locally

1. Clone this repository and enter its directory.
2. Create the local environment file:

   ```sh
   cp .env.example .env
   ```

3. The frontend Compose file joins the same external `mediavault` network as the backend. Create that network once if it does not already exist:

   ```sh
   make network
   ```

4. Then configure `.env` as described below and start the frontend:

   ```sh
   make up-build
   ```

The app is available at `http://localhost:5173` by default. The Compose service bind-mounts the project directory, so install dependencies with `npm install` before starting the container if `node_modules` is not present in the project directory.

Stop the service with `make down`.

## Make commands

Run `make` or `make help` to list the available Docker Compose shortcuts:

| Command              | Description                                                         |
| -------------------- | ------------------------------------------------------------------- |
| `make network`       | Create the shared `mediavault` Docker network if it does not exist. |
| `make up`            | Start the frontend in the background using the existing image.      |
| `make up-build`      | Build the frontend image and start the frontend in the background.  |
| `make build`         | Build the frontend image without starting the container.            |
| `make down`          | Stop and remove the frontend container.                             |
| `make logs`          | Follow frontend logs.                                               |
| `make logs-frontend` | Follow frontend logs.                                               |
| `make ps`            | Show service status.                                                |

These shortcuts wrap Docker Compose commands. You can also run the corresponding `docker compose` commands directly.

## Environment variables

`.env.example` documents the frontend development settings.

| Variable            | Default                 | Purpose                                                                                                        |
| ------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------- |
| `PORT`              | `5173`                  | Port used by the Vite development server and exposed by Docker Compose.                                        |
| `ALLOWED_HOSTS`     | —                       | Optional comma-separated hostnames allowed by Vite when accessing the dev server through a non-local hostname. |
| `VITE_API_PORT`     | `3000`                  | Used by the example API URL to set the backend port.                                                           |
| `VITE_API_BASE_URL` | `http://localhost:3000` | Base URL for API requests. Set this to the backend URL reachable by the user's browser.                        |

Vite exposes variables prefixed with `VITE_` to frontend code. `VITE_API_BASE_URL` is included in the bundle at build time.

**IMPORTANT: Do not put secrets in `VITE_` variables**.

## Available scripts

| Command           | Description                                                     |
| ----------------- | --------------------------------------------------------------- |
| `npm run dev`     | Start the Vite development server.                              |
| `npm run build`   | Run TypeScript project checks and build the app for production. |
| `npm run preview` | Preview the production build locally.                           |
| `npm run lint`    | Run ESLint.                                                     |

## Project structure

- `src/pages/` — login, library, search placeholder, and video player pages.
- `src/components/` — reusable UI, media cards, show details, and player controls.
- `src/contexts/` — authentication, library scan progress, and search state.
- `src/hooks/` — player, platform (desktop, mobile, ...), and background job behavior.
- `src/services/` — API client and library requests.
- `src/config/` — frontend configuration.
- `public/` — PWA manifest, service worker, icons, and favicon.
