##Git global setup

```
git config --global user.name "chenming1"
git config --global user.email "chenming1@cffex.com.cn"
```

##Create a new repository

```
git clone http://192.168.130.72/cffexitweb/wukong-craft.git
cd wukong-craft
touch README.md
git add README.md
git commit -m "add README"
git push -u origin master
```

##Existing folder or Git repository

```
cd existing_folder
git init
git remote add origin http://192.168.130.72/cffexitweb/wukong-craft.git
git add .
git commit
git push -u origin master
```