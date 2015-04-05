

var ansibleCommand =  function(list, limit, tasks, startAtTasks) {
            list = list || 'hosts';
            tasks = tasks || 'all';
            limit = limit || 'all';
            startAtTask = '--start-at-task="' + startAtTasks + '"' || '';
            return "ansible-playbook -i ~/GameDelivery/Inventory.txt ~/GameDelivery/Delivery.yml -t " + tasks + " -l " + limit + " --list-" + list + " 2>/dev/null | grep '^$' -v | sed -e 's/[[:space:]]\+/ /g' | sed 's/^ //g'| grep 'play #' -v | grep -v 'playbook: ' ";
    };
module.exports = {
        Hosts: {
            Title: 'Hosts',
            Limit: 5,
                   StringLimit: 35,
            cmd: ansibleCommand('hosts', '','',''), 
        },
        Tasks: {
            Title: 'Tasks',
                   StringLimit: 35,
            Limit: 5,
            cmd: ansibleCommand('tasks', '','',''), 
        },

};
