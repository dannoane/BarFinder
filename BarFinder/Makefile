dependencies:
	sudo npm install -g express
	sudo npm install -g express-generator
	sudo npm install -g pm2

production_update:
	sudo npm install

run: dependencies production_update
	sudo pm2 start bin/www

update: production_update
	sudo -i pm2 reload www
