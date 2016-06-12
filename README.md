njs-stats
=========
Gather NodeJS project statistics over time using git history.

Stats collected (per file) include:
* LOC data (comments, source, empty, etc)
* Count of requires
* Count of exported functions/objects
* Count of jasmine expects (not xit'd or xdescribe'd) 

##Using njs-stats
```bash
$ njs-stats --help
```

###With gitlog history
You can pass the `--gitlog` (`-g`) option which will walk backwards through your
git history up to 12 months and collect the same stats from the last commit made each month.

##Developing
Mostly taken from [here](https://developer.atlassian.com/blog/2015/11/scripting-with-node/#packaging-shell-commands).
###Install dependencies
```bash
$ npm install
```
###Install module globally
```bash
$ npm install -g
```
###Link module
```bash
$ npm link
```