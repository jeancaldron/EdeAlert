# Getting Started

## 1. Installation
### 1.1 Install the dependencies

```bash
npm install
```

### 1.2 Follows Google Calendar API quickstart
[Google Calendar API quickstart](https://developers.google.com/calendar/api/quickstart/nodejs)
### 1.3 Create `token.json` with Google Workspace Credentials
See `credentials.json.example` file for example

### 1.4 Create `.env` file based on `.env.template` file, 

### 1.5 Set `CALENDAR_ID` environment variablo on `.env` with "primary" or a Google Calendar ID

## 2. Setting up Launchd Service(Mac Only)
### 2.1 Create `com.schedule-edealert.daemon.plist` file based on `com.schedule-edealert.daemon.plist.example` file

### 2.2 Update `{WorkingDirectory}` key on the new `com.schedule-edealert.daemon.plist` file

### 2.3 Load Launchd service(Runs weekly on tuesdays at 7:30 PM)

```bash
launchctl load com.schedule-edealert.daemon.plist
```

#### For stoping the launchd service

```bash
launchctl unload com.schedule-edealert.daemon.plist
```


