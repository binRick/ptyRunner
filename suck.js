curl -s https://github.com/dgibbs64/linuxgsm/tree/master/| grep js-directory-link| grep href | tr -s ' '| cut -d ' ' -f5| cut -d'/' -f6| cut -d'"' -f1| egrep -v 'LICENSE|README|functions|appmanifest'
