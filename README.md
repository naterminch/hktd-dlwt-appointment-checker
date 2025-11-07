# hktd-dlwt-appointment-checker

Automatically checks for available timeslots for appointments for Issuance of HK full driving license/provisional driving license without test

## Usage

```bash
# Run once
bun run start

# Run with auto-restart on file changes (development)
bun run dev
```

The application will check for available timeslots at your configured interval and log the results for each session. When available slots are found, it will display prominent notifications.

## Configuration

Edit `user-config.ts` and `.env` to customize your settings:

## Installation & Running

To install dependencies:
```bash
bun install
```

To run:
```bash
bun run start
```

This project was created using `bun init` in bun v1.2.20. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
