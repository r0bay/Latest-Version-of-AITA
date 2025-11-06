# Render: Project Settings vs Service Settings

## Important Distinction

**Project Settings** (what you're seeing):
- Manages the project container
- Only shows: Project Name, Delete Project
- Does NOT have repository connection options

**Service Settings** (what you need):
- Manages the actual web service
- Has: Repository connection, Build settings, Environment variables
- This is where you can disconnect/reconnect the repository

## How to Get to Service Settings

1. **Go back to the project overview:**
   - Click "← Dashboard" or "My project" in the sidebar
   - Or click "Overview" in the sidebar

2. **Find your web service:**
   - You should see a list of services in the project
   - Look for your web service (probably named something like "random-aita" or "web")
   - It should show as a "Web Service" type

3. **Click on the service name:**
   - This opens the SERVICE dashboard (not project)

4. **Go to Service Settings:**
   - In the SERVICE page, click "Settings" in the sidebar
   - This is different from Project Settings!

5. **Now you should see:**
   - Repository section (with disconnect option)
   - Build & Deploy settings
   - Environment variables
   - All the service-specific settings

## Visual Guide

```
Render Dashboard
└── My Project (Project level - what you're on now)
    └── Web Service (Service level - what you need)
        └── Settings (Service Settings - has repository options)
```

## Quick Steps

1. Click "Overview" or go back to project dashboard
2. Click on your **Web Service** (not the project)
3. Click **"Settings"** in the service sidebar
4. Look for **"Repository"** section
5. You should see disconnect/reconnect options there

