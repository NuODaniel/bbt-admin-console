from nginx:1.19.10

COPY dist /usr/share/nginx/html/bbt
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/admin.conf /etc/nginx/conf.d/admin.conf