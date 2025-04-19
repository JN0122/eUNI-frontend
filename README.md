# Project overview
eUNI is a web application designed to help students manage their academic schedules. It provides a responsive platform where users can customize their schedules based on selected student groups. 

App supports both Polish and English languages, making it accessible to international students. The system also allows exporting schedules to popular calendar apps like Google Calendar and Microsoft Outlook, improving organization and task management.

## Technology Stack
The app was developed using:
- **Library**: ReactJS
- **UI Library**: Ant Design
- **Authentication**: JWT (JSON Web Tokens) and Refresh Tokens
- **Build tool**: Vite
- **Containerization**: Docker

### Libraries
Below is a list of the key libraries used in the creation of the frontend application:
- _**ESLint**_ - for identify potential errors, prevent issues, and ensure code consistency
- _**Prettier**_ - automatic code formatter
- _**React Router**_ - allows the definition of URL paths and their associated components, enabling the creation of modern Single Page Applications (SPA).
- **_Axios_** - HTTP client for making API requests
- **_i18n_** - internationalization library for easily managing translations and adapting the interface to multiple languages
- **_bcryptjs-react_** - implementation of the bcrypt algorithm, used for hashing passwords
- **_react-responsive_** - used to create responsive components that adjust their behavior and appearance based on screen size

## File structure
The file structure of the application can be broken down into the following elements:
- `locales/` - i18n translation files
- `public/` - static assets (e.g., icons)
- `.env` - environment variables
- `src/`
  - `api/` - API integration logic
  - `assets/` - images and media
  - `components/` - reusable UI components
  - `enums/` - constants like weekdays, roles, etc.
  - `helpers/` - utility functions
  - `hooks/` - custom React hooks
  - `lib/` - configs (Axios, i18n setup)
  - `pages/` - main page components
  - `routes/` - route guards and definitions

## Security

### Passwords
Passwords are hashed on the frontend using `bcryptjs` before being sent to the backend. The hashing salt is stored securely in the `.env` file.

# Application
## User Roles
- **Admin** – manages users, academic year organization, and fields of study
- **Student** – views personalized schedules based on their field of study and assigned groups,

Admins can grant **_representative_** permissions to specific students, allowing them to manage schedules on behalf of their group.

## Student
### Schedule
This is the main page students see after logging in. The schedule is generated dynamically based on the student’s profile, including selected field of study and group.
- Automatically loads the current week from the backend. 
- Users can navigate between weeks using the arrows above the schedule table.

![Student schedule.png](docs/images/Student%20schedule.png)

### Menu
Located in the top right corner, the user avatar opens a dropdown menu with quick access to:
- Profile
- Logout

![User dropdown.png](docs/images/User%20dropdown.png)

### Profile
This page allows users to manage their account and academic information:

- Basic Info – View/change first name, last name, and email. 
- Study Information – Displays the selected field of study and groups. 
  - A button next to group selection copies a link to a shared calendar (compatible with apps like Google Calendar). 
  - A checkbox lets users view historical fields of study from previous semesters. 
- Language – The app auto-detects browser language and sets it as default, if supported.

![Student profile.png](docs/images/Profie%20basic%20information.png)

#### Change Password
A form is available at the bottom of the profile page for password changes.

![Profile change password.png](docs/images/Profile%20change%20password.png)

### Edit Activities (For Representatives)
Students with representative status (granted by admins) gain access to the Edit Activities page.
- Allows full control over the schedule for the selected field of study.
- Any changes instantly update the shared calendar file.

![Representative edit activities.png](docs/images/Representative%20activities.png)
#### Creating New Class
When adding a class, a dedicated form is displayed. It differs from the main table by using backend logic to calculate class dates based on repeatability and day of the week.

![Representative create class.png](docs/images/Representative%20create%20class.png)

#### Editing Existing Classes
Users can update class details and modify specific session dates. The calendar only allows date selection within the current semester, excluding holidays.

![Representative edit class.png](docs/images/Representative%20edit%20class.png)

## Administrator
### Users
Admins can view all registered users in the system. For each user, a list of currently managed semesters (if representative) is shown under Representative Fields of Study.

![Admin users.png](docs/images/Admin%20users.png)

### Academic year organization
This section displays all academic year structures.

![Admin academic year organization.png](docs/images/Admin%20academic%20year%20organization.png)

When creating a new entry, the system auto-generates the next semester and year.

![Admin create year orgazniation.png](docs/images/Admin%20create%20year%20orgazniation.png)

### Fields of study
#### Current fields of study
Admins can assign semesters, study cycles, and study types to existing academic organizations.

![Admin current fields of study.png](docs/images/Admin%20current%20fields%20of%20study.png)

#### Available fields of study
Admins can add new fields of study from this section.

![Admin available field of studies.png](docs/images/Admin%20available%20field%20of%20studies.png)

# Installation
## Prerequisites
Before installation, ensure you have:
- Docker Compose 
- NodeJS (used to generate the bcrypt salt)

## Clone Repository
```bash
git clone https://github.com/JN0122/eUNI-frontend.git
cd eUNI-frontend
```

## Install Dependencies
```bash
npm install
```

## Environment Variables
### Generate salt
```bash
node -e "require('bcryptjs').genSalt(10).then(console.log);"
```
### Configure `.env`
Create a `.env` file based on `.env.example`. Provide the backend URL and the generated bcrypt salt.

## Run Application
```bash
docker-compose up -d
```

### Development mode
To turn on dev mode please add `NODE_ENV=development` to `.env` file. 

Dev mode allows to seed the database with example data:
- Root and student user (`root@euni.com` and `adam@euni.com`)
- Field of study with two groups and classes

To seed database visit `<YOUR_EUNI_URL>/setup/set-root-password` or click the link under login form. 

_**NOTE: Ensure the seeded academic organization includes today’s date.**_

## Demo version
A live demo of the app is hosted at: [euni.jakubniewelt.pl](https://euni.jakubniewelt.pl)

_**NOTE: Deployment handled via [Coolify](https://www.coolify.io/) with GitHub Actions integration for automated CI/CD.**_
