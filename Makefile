IMAGE_NAME=ccr.ccs.tencentyun.com/bbtns1/bbt-admin-console
TAG_VERSION=$(shell git describe --abbrev=0 --tags)

ifeq ($(TAG_VERSION), )
	TAG_VERSION=0.0.1
endif

build: dist

dist:
	npm run build

image: dist
	docker build -f Dockerfile -t $(IMAGE_NAME):$(TAG_VERSION)-$(shell git rev-parse --short HEAD) .

clean:
	rm -rf dist

all: clean image

.PHONY: all build clean image