# BarFinder

Make sure you have the latest versions of *Virtual Box* and *Vagrant* installed.
After installing *Vagrant* run: `vagrant plugin install vagrant-vbguest`.

To clone the repo:
`git clone https://github.com/NoaneDan/BarFinder.git`

To start the server:
`$ vagrant up`

To stop the server:
`$ vagrant halt`

To reload the server:
`$ vagrant ssh
 $ cd /vagrant/BarFinder
 $ make update`

To view server logs and other info:
`$ sudo -i pm2 monit`

The web page can be found on *10.10.10.10:3000/*.

## Documentation:
 - http://es6-features.org
 - https://expressjs.com
 - https://github.com/Unitech/pm2
 - http://jqfundamentals.com/chapter/jquery-basics
 - https://pugjs.org/api/getting-started.html
