# makefile to automatize simple operations

server:
	python -m SimpleHTTPServer

build:
	cat lib/*.js > build/webaudiox.js

deploy:
	# assume there is something to commit
	# use "git diff --exit-code HEAD" to know if there is something to commit
	# so two lines: one if no commit, one if something to commit 
	git commit -a -m "New deploy" && git push -f origin HEAD:gh-pages && git reset HEAD~

.PHONY: build