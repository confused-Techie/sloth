# Recommended GitHub Action

As Sloth doesn't want to do much of anything, there isn't a premade GitHub Action that can be used.

Instead it's recommended to use GitHub's Actions themselves, with the following `./github/workflows/deploy.yml` file:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ "main" ]
  workflow_dispatch:

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pages: write
      id-token: write

    steps:
    - name: Checkout
      uses: actions/checkout@v3

    - name: Install NodeJS
      uses: actions/setup-node@v3
      with:
        node-version: 16

    - name: Install Dependencies
      run: npm install

    - name: Build Site
      run: npm run build

    - name: Setup Pages
      uses: actions/configure-pages@v3

    - name: Upload Artifact
      uses: actions/upload-pages-artifact@v1
      with:
        path: "./dist"

    - name: Deploy to GitHub pages
      id: deployment
      uses: actions/deploy-pages@v2

```

Where keep in mind the step `Upload Artifact` the `path` should be where ever your `buildDirectory` is.
