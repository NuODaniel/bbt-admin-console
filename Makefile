IMAGE_NAME=ccr.ccs.tencentyun.com/bbtns1/bbt-admin-console
TAG_VERSION=$(shell git describe --abbrev=0 --tags)

ifeq ($(TAG_VERSION), )
	TAG_VERSION=0.0.1
endif

build: dist

dist:
	npm run build

image: dist
	mkdir docker_build_tmp 
	cp Dockerfile ./docker_build_tmp/
	cp -r nginx ./docker_build_tmp/
	cp -r dist ./docker_build_tmp/
	docker build -f Dockerfile -t $(IMAGE_NAME):$(TAG_VERSION)-$(shell git rev-parse --short HEAD) docker_build_tmp
	rm -rf docker_build_tmp

clean:
	rm -rf dist

all: clean image

.PHONY: all build clean image