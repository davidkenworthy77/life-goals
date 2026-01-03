# Deployment Guide - Life Goals Planning App

This guide explains how to launch your Life Goals app online so you can access it from anywhere.

## 🚀 Quickest Method: Vercel or Netlify (Recommended)
These platforms are perfectly suited for React/Vite apps and offer powerful free tiers.

### 1. Push to GitHub
Before you can deploy, your code needs to live in a GitHub repository.

1. **Create the Repo**: Go to [GitHub](https://github.com/new) and create a new repository (name it `life-goals`). Leave it as **Public** or **Private** (both work with Vercel). **Do not** initialize it with a README or License.
2. **Connect & Push**: Open your terminal in the project folder and run:
   ```bash
   # Initialize the local repository
   git init

   # Add all files to the staging area
   git add .

   # Create your first commit
   git commit -m "initial commit"

   # Rename your branch to 'main'
   git branch -M main

   # Link to your GitHub repository
   git remote add origin <your-github-repo-url>

   # Push your code
   git push -u origin main
   ```

### 💧 Ongoing Updates
Once your project is linked to GitHub, follow this simple 3-step cycle whenever you make changes:

1. **Stage Changes**:
   ```bash
   git add .
   ```
2. **Commit Changes**:
   ```bash
   git commit -m "describe what you changed (e.g., 'added new stat cards')"
   ```
3. **Push to GitHub**:
   ```bash
   git push
   ```

> [!NOTE]
> Platforms like Vercel and Netlify will **automatically redeploy** your site every time you run `git push`. You don't need to manually update anything on their websites!

### 2. Deploy to Vercel
1. Go to [Vercel](https://vercel.com/) and sign in with GitHub.
2. Click **Add New** > **Project**.
3. Import your repository.
4. Vercel will automatically detect **Vite**.
5. Click **Deploy**. Your app will be live in minutes.

### 3. Deploy to Netlify
1. Go to [Netlify](https://www.netlify.com/) and sign in with GitHub.
2. Click **Add new site** > **Import from existing project**.
3. Select your repository.
4. Ensure the build command is `npm run build` and the publish directory is `dist`.
5. Click **Deploy site**.

---

## 🛠 Manual Deployment (Any Static Host)
If you want to host it yourself or use another provider:

1. **Build the project**:
   ```bash
   npm run build
   ```
2. **Locate the output**:
   This creates a `dist` folder in your project root.
3. **Upload**:
   Upload the **contents** of the `dist` folder to your web server or static host (like Amazon S3, Google Cloud Storage, or Firebase Hosting).

## 🛡️ Data Persistence & Safety
One of the most important things to know is that your goals are **safe when you update your code**.

### How it Works
The app uses **Browser LocalStorage**. This is a small database inside your web browser (Chrome, Safari, etc.) that is tied to your website's address. 

- **Code Updates**: When you push new code or redeploy to Vercel/Netlify, the browser simply loads the new interface. It **does not** touch the data stored in the browser. 
- **Persistence**: Your goals will remain exactly as you left them, even after a deployment, as long as you use the same browser and domain.

### 🧪 Testing vs. Production
To help you manage your data, we've added a **Data Management** section at the bottom of the Dashboard:
- **Load Sample Data**: Use this during development to quickly fill the app with test goals.
- **Clear All Data**: Use this to wipe the slate clean and start your actual planning.
- **Auto-Loading**: If the app detects you have *zero* goals, it will automatically load the sample data the very first time you visit. Once you add your own goals, the samples will never overwrite your work.

> [!WARNING]
> Since data is stored in your browser, it is **not synced** across different devices. If you add a goal on your laptop, you won't see it on your phone unless you set up a database (like Supabase or Firebase) in the future.
