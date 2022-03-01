find /usr/share/nginx/html -type f -iname "*.js" -exec sed -i -e "s|\"REACT_APP_GDN_URL\"|\"$REACT_APP_GDN_URL\"|g; s|\"REACT_APP_GITHUB_URL\"|\"$REACT_APP_GITHUB_URL\"|g;" {} \;
nginx -g "daemon off;"
