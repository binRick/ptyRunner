var postCommand = ' cd /root/ptyRunner && ./RunApp.js SteamServer.js Details | ansi-html  | sed \'s/; max-width:80em/;text-align:left; max-width:80em/g\' | ssh wp1.game.delivery "wp --path=/var/www/game.delivery/htdocs --allow-root   post create  --post_type=post --post_title=\"Arma3 ServerDetails\" --post_status=\"published\" --post_date=\"`date +\'%Y-%m-%d %H:%M:%S\'`\" --post_author=\"steamBot\" -" ';
