# DevAndar---Galp

DevAndar---Galp is a web application developed for the Galp Hackathon. Our group took on the challenge of building this project using several new technologies—such as Docker Compose, Next.js, and Chakra UI—for the very first time, all within one week.

The main goal of DevAndar---Galp is to encourage physical activity by allowing users to submit kilometers or steps walked, track their progress, and highlight collective achievements such as meals donated. While the frontend successfully delivers the core message and vision we wanted to share, some features—like the profile page—are not fully integrated with the backend due to time constraints.

## Notes on Project Status

- This was our first experience with all the technologies in this stack.
- The frontend is fully functional and demonstrates the concept and message of the project.
- Some backend integrations (like user profiles) are incomplete.
- We built everything in one week for the hackathon.

## Future Plans

Looking forward, we hope to expand DevAndar---Galp with:
- Group logins for teams and organizations
- Authentication and integration with fitness apps
- Social features, such as connecting with friends or forming a social hub

## Features

- User authentication and registration (including Google login)
- Submission of walking activities: distance in kilometers or steps
- Dynamic leaderboards for individuals and districts
- Progress tracking (e.g., meals donated based on distances submitted)
- Responsive frontend built with Next.js and Chakra UI
- Profile page with detailed statistics and rankings (frontend implemented)
- Support for uploading evidence for long distances or high step counts
- Runs on an intra-network via Docker Compose (multi-container architecture)

## Getting Started

This project uses [Next.js](https://nextjs.org) for its frontend and is designed to run on an internal network using Docker Compose.

### Prerequisites

- Docker and Docker Compose installed on your machine
- (Optional) Node.js (for local non-container development)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rmota-ma/DevAndar---Galp.git
   cd DevAndar---Galp
   ```

2. All requirements for backend and frontend are installed automatically inside the containers using the provided requirements files.

### Running with Docker Compose

To start the project (all containers):

```bash
docker compose up --build
```

To stop and remove all containers and volumes:

```bash
docker compose down -v
```

### Access

Once running, you can access the frontend via [http://localhost:3000](http://localhost:3000) in your browser.

---

Feel free to contribute or reach out for questions!
