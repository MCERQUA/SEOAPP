@echo off
git init
git remote remove origin
git remote add origin https://github.com/MCERQUA/SEOAPP.git
git branch -M main
git add .
git commit -m "Initial commit: SEOAPP setup"
git push -u origin main --force
pause