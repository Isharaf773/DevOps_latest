# Jenkins Plugins Installation Guide - Complete Search Options

## Quick Navigation to Plugin Manager

1. Open `http://localhost:8080`
2. Login (Password: `762313bdb21f406d8c664afae8731be6`)
3. Click **Manage Jenkins** (top-left menu)
4. Click **Manage Plugins**
5. Click **Available plugins** tab

---

## Plugin Search Options

Use these **exact search terms** in the search box to find each plugin:

### Plugin 1: Pipeline
**Search Term:** `Pipeline`
**Full Name:** Pipeline
**By:** CloudBees, Inc.
**Description:** Build simple-to-complex pipelines as code, using the Groovy DSL

**What it does:** Enables declarative pipeline support (your Jenkinsfile uses this)

---

### Plugin 2: Git
**Search Term:** `Git`
**Full Name:** Git
**By:** CloudBees, Inc.
**Description:** Perform git scm operation

**What it does:** Allows Jenkins to clone your GitHub repository

---

### Plugin 3: Docker
**Search Term:** `Docker`
**Full Name:** Docker
**By:** CloudBees, Inc.
**Description:** Docker plugin for Jenkins

**What it does:** Build and push Docker images from Jenkins

**Note:** You might see multiple Docker plugins - choose the one by CloudBees

---

### Plugin 4: Docker Pipeline
**Search Term:** `Docker Pipeline`
**Full Name:** Docker Pipeline
**By:** CloudBees, Inc.
**Description:** Docker Pipeline plugin for Jenkins

**What it does:** Execute Docker commands within pipeline stages

---

### Plugin 5: GitHub Integration
**Search Term:** `GitHub`
**Full Name:** GitHub Integration
**By:** CloudBees, Inc.
**Description:** GitHub integration plugin for Jenkins

**What it does:** Trigger builds on GitHub push events (webhook support)

**Note:** Different from "GitHub" plugin - look for "GitHub Integration"

---

### Plugin 6: Credentials Binding
**Search Term:** `Credentials Binding`
**Full Name:** Credentials Binding
**By:** CloudBees, Inc.
**Description:** Allows credentials to be bound to environment variables or files

**What it does:** Makes your credentials available to pipeline stages

---

### Plugin 7: Blue Ocean (Recommended)
**Search Term:** `Blue Ocean`
**Full Name:** Blue Ocean
**By:** CloudBees, Inc.
**Description:** A beautiful Web UI for continuous delivery

**What it does:** Modern visual UI for pipeline execution and monitoring

**Note:** Optional but highly recommended for better visualization

---

## Step-by-Step Installation Process

### Method 1: Individual Search (Recommended)

**For each plugin follow these steps:**

1. Open Plugin Manager → Available plugins tab
2. In the **Search plugins** box at the top, type the search term
3. The matching plugin will appear below
4. ✅ Check the CHECKBOX next to the plugin name
5. The checkbox will turn blue/highlighted
6. Repeat for all plugins

**Visual Flow:**
```
Search Box [type plugin name here]
    ↓
    Results appear below
    ☐ Plugin Name 1
    ☐ Plugin Name 2
    ↓
Check the box → ☑ Plugin Name
```

---

### Method 2: Multiple Checkboxes at Once

**After installing one plugin:**

1. Search for the next plugin
2. Check its box
3. Repeat without clicking Install yet

**You can select multiple plugins at once before clicking Install**

---

### Method 3: Install Button

After checking plugin checkboxes:

**Option A: Restart Jenkins after install**
- Click **Install and restart** button
- Jenkins will restart automatically
- Wait 2-3 minutes for restart

**Option B: Install without restart (Faster)**
- Click **Install without restart** button
- Plugins install in background
- Might need manual restart later

**Recommended:** Use **Install without restart** for faster workflow

---

## All Search Terms Quick Reference

Copy these exact terms:

```
Pipeline
Git
Docker
Docker Pipeline
GitHub
Credentials Binding
Blue Ocean
```

---

## Visual Guide: Where to Search

Jenkins Plugin Manager Layout:

```
┌─────────────────────────────────────────────────────────┐
│ Jenkins > Manage Plugins                                │
├─────────────────────────────────────────────────────────┤
│ [Updates] [Available plugins] [Installed plugins]        │
├─────────────────────────────────────────────────────────┤
│ 🔍 Search plugins: [_____________________]              │
│                                                          │
│ ☐ Plugin Name 1          | Full Name | By | Description│
│ ☐ Plugin Name 2          | Full Name | By | Description│
│ ☐ Plugin Name 3          | Full Name | By | Description│
│                                                          │
│                                                          │
│ [Install without restart] [Install and restart]         │
└─────────────────────────────────────────────────────────┘
```

---

## Alternative: Copy-Paste Search Terms

If you want to search multiple terms quickly:

1. **First plugin:** Type `Pipeline` → Check → Search next
2. **Second plugin:** Clear search, type `Git` → Check → Search next
3. **Third plugin:** Clear search, type `Docker` → Check → Search next
4. Continue for all plugins...

---

## What Each Plugin Provides for Your Pipeline

| Plugin | Used For | Your Jenkinsfile Uses |
|--------|----------|-----|
| **Pipeline** | Groovy pipeline syntax | YES - Core feature |
| **Git** | GitHub checkout step | YES - `checkout scm` |
| **Docker** | Docker image operations | YES - Docker login/build |
| **Docker Pipeline** | Docker agent/commands | YES - Docker commands |
| **GitHub Integration** | GitHub webhooks | YES - `githubPush()` trigger |
| **Credentials Binding** | Credential injection | YES - `credentials()` |
| **Blue Ocean** | Visual pipeline UI | NO - Optional UI enhancement |

---

## Installation Checklist

Use this checklist while installing:

- [ ] Searched for "Pipeline" and checked
- [ ] Searched for "Git" and checked
- [ ] Searched for "Docker" and checked
- [ ] Searched for "Docker Pipeline" and checked
- [ ] Searched for "GitHub" and checked
- [ ] Searched for "Credentials Binding" and checked
- [ ] Searched for "Blue Ocean" and checked
- [ ] Clicked "Install without restart"
- [ ] Waited for installation to complete

---

## After Installation

### Step 1: Restart Jenkins (Recommended)

```bash
wsl bash -c "sudo systemctl restart jenkins"
```

Wait 30-60 seconds for Jenkins to restart.

### Step 2: Verify Installation

1. Go to `http://localhost:8080`
2. Click **Manage Jenkins** → **Manage Plugins**
3. Click **Installed plugins** tab
4. Search for each plugin name to confirm they're listed

### Step 3: Ready for Pipeline

Once all plugins are installed, you can:
- Create a new Pipeline job
- Connect to your GitHub repository
- Run your Jenkinsfile! 🎉

---

## Troubleshooting Plugin Installation

**Problem:** Search box doesn't show any results
- **Solution:** Wait a moment, search box is loading plugin list
- **Solution:** Try a shorter search term

**Problem:** Plugin doesn't appear even with correct search term
- **Solution:** Check internet connection (plugins load from repository)
- **Solution:** Click "Check now" button at the top of plugin page

**Problem:** Installation stuck or slow
- **Solution:** Click **Install without restart** (faster)
- **Solution:** Check if Jenkins has internet access

**Problem:** "Plugin requires Jenkins version X.X or higher"
- **Solution:** Your Jenkins version is too old, but this is unlikely
- **Solution:** Restart Jenkins and try again

---

## Jenkins Admin Password (If Needed Again)

```bash
wsl bash -c "sudo cat /var/lib/jenkins/secrets/initialAdminPassword"
```

Password: `762313bdb21f406d8c664afae8731be6`

---

## Next Steps After Plugins Installed

1. ✅ All plugins installed and Jenkins restarted
2. ✅ Add all credentials (Docker Hub, GitHub, MongoDB, JWT, Stripe)
3. ✅ Create a new **Pipeline** job
4. ✅ Configure it to use your GitHub repository
5. ✅ Point to **Jenkinsfile** in repository
6. ✅ Run your first build!

---

**Ready to install plugins now?** 🚀
